import type { Die } from "../types";
import { scoreDice } from "./scoring";
import { getSelectedDice, holdSelectedAndRollActive, rollNewDice, toggleDieSelection } from "./turn";

export type TutorialStep = "select" | "bank" | "banked" | "risk" | "farkle" | "complete";
export type TutorialState = {
  step: TutorialStep;
  dice: Die[];
  roundScore: number;
  totalScore: number;
  rolls: number;
};
export type TutorialAction = { type: "select"; id: number } | { type: "reroll" | "bank" | "continue" | "restart" };

export const TUTORIAL_STEPS: Record<TutorialStep, { number: number; title: string; instruction: string }> = {
  select: { number: 1, title: "Pick the scoring dice", instruction: "Select the 1 and the 5. A single 1 scores 100 and a single 5 scores 50. Then choose Hold & Reroll." },
  bank: { number: 2, title: "Bank your points", instruction: "Your 150 round points are still at risk. Select the three 2s and the 5 for another 250, then bank all 400 points." },
  banked: { number: 3, title: "400 points are safe", instruction: "Banking ends your turn and adds the points to your total. Those 400 points cannot be lost to a Farkle. In a normal game, your opponent goes next. Continue to try another practice turn." },
  risk: { number: 4, title: "Try another roll", instruction: "Select the 1 for 100 points, then choose Hold & Reroll. We have set up this next roll to show what a Farkle does." },
  farkle: { number: 5, title: "Farkle!", instruction: "None of the remaining dice score. Your 100 unbanked points are lost, but your banked total stays at 400. In a normal game, play automatically passes to the next player." },
  complete: { number: 6, title: "Ready to play", instruction: "Select scoring dice, then bank to keep your points or reroll to risk them for more. If all six dice score, rerolling gives you six fresh dice: hot dice! Your normal game settings and records are unchanged." },
};

export function createTutorial(): TutorialState {
  return { step: "select", dice: rollNewDice([1, 5, 2, 2, 3, 6]).dice, roundScore: 0, totalScore: 0, rolls: 0 };
}

export function getTutorialSelection(state: TutorialState) {
  return scoreDice(getSelectedDice(state.dice));
}

// Fixed rolls and explicit transitions keep practice independent of AI, timers and records.
export function tutorialReducer(state: TutorialState, action: TutorialAction): TutorialState {
  if (action.type === "restart") return createTutorial();
  const interactive = ["select", "bank", "risk"].includes(state.step);
  if (action.type === "select") {
    return interactive ? { ...state, dice: toggleDieSelection(state.dice, action.id) } : state;
  }
  const selection = getTutorialSelection(state);
  if (action.type === "reroll" && selection.allDiceScore) {
    if (state.step === "select" && selection.score === 150) {
      return { ...state, step: "bank", dice: holdSelectedAndRollActive(state.dice, [2, 2, 2, 5]), roundScore: 150, rolls: state.rolls + 1 };
    }
    if (state.step === "risk" && selection.score === 100) {
      return { ...state, step: "farkle", dice: holdSelectedAndRollActive(state.dice, [2, 2, 3, 4, 6]), roundScore: 0, rolls: state.rolls + 1 };
    }
  }
  if (action.type === "bank" && state.step === "bank" && selection.allDiceScore && selection.score === 250) {
    return { ...state, step: "banked", totalScore: state.roundScore + selection.score, roundScore: 0 };
  }
  if (action.type === "continue") {
    if (state.step === "banked") {
      return { ...state, step: "risk", dice: rollNewDice([1, 2, 3, 4, 6, 2]).dice, rolls: state.rolls + 1 };
    }
    if (state.step === "farkle") return { ...state, step: "complete" };
  }
  return state;
}
