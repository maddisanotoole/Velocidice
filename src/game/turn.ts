import { DieStatus, type Die } from "../types";
import { initializeDice, rollDie } from "./dice";
import { scoreDice } from "./scoring";

export const WINNING_SCORE = 5000;

export type TurnStatus = "rolling" | "farkled";

export type TurnState = {
  dice: Die[];
  status: TurnStatus;
};

export function didFarkle(dice: Die[]): boolean {
  const activeDice = getActiveDice(dice);

  return (
    activeDice.length > 0 &&
    scoreDice(activeDice.map((die) => die.value)).score === 0
  );
}

export function getActiveDice(dice: Die[]): Die[] {
  return dice.filter((die) => die.status === DieStatus.ACTIVE);
}

export function pointsToWin(playerScore: number): number {
  return WINNING_SCORE - playerScore;
}

export function getSelectedDice(dice: Die[]): Die[] {
  return dice.filter((die) => die.status === DieStatus.SELECTED);
}

export function rollNewDice(): TurnState {
  const dice = initializeDice();

  return {
    dice,
    status: didFarkle(dice) ? "farkled" : "rolling",
  };
}

export function createRollingTurn(): TurnState {
  return {
    dice: initializeDice(),
    status: "rolling",
  };
}

export function holdSelectedAndRollActive(dice: Die[]): Die[] {
  return dice.map((die) => {
    if (die.status === DieStatus.SELECTED) {
      return { ...die, status: DieStatus.HELD };
    }

    if (die.status === DieStatus.ACTIVE) {
      return { ...die, value: rollDie() };
    }

    return die;
  });
}

export function toggleDieSelection(dice: Die[], id: number): Die[] {
  return dice.map((die) =>
    die.id === id
      ? {
          ...die,
          status:
            die.status === DieStatus.HELD
              ? die.status
              : die.status === DieStatus.SELECTED
                ? DieStatus.ACTIVE
                : DieStatus.SELECTED,
        }
      : die,
  );
}
