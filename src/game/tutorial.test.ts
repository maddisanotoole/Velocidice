import { afterEach, describe, expect, it, vi } from "vitest";
import { createTutorial, getTutorialSelection, tutorialReducer, type TutorialState } from "./tutorial";
import { didFarkle } from "./turn";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function select(state: TutorialState, ...ids: number[]) {
  return ids.reduce((next, id) => tutorialReducer(next, { type: "select", id }), state);
}

function bankedPractice() {
  let state = select(createTutorial(), 0, 1);
  expect(getTutorialSelection(state).score).toBe(150);
  state = tutorialReducer(state, { type: "reroll" });
  expect(state.roundScore).toBe(150);
  expect(state.dice.slice(2).map(die => die.value)).toEqual([2, 2, 2, 5]);
  state = select(state, 2, 3, 4, 5);
  expect(getTutorialSelection(state).score).toBe(250);
  return tutorialReducer(state, { type: "bank" });
}

describe("guided practice", () => {
  it("banks 400, then loses only the next turn's 100 to a Farkle without randomness or storage", () => {
    vi.spyOn(Math, "random").mockImplementation(() => { throw new Error("Tutorial must not roll randomly"); });
    vi.stubGlobal("window", { get localStorage() { throw new Error("Tutorial must not access records"); } });
    let state = bankedPractice();
    expect(state).toMatchObject({ step: "banked", roundScore: 0, totalScore: 400 });
    expect(tutorialReducer(state, { type: "reroll" })).toBe(state);
    state = tutorialReducer(state, { type: "continue" });
    state = select(state, 0);
    expect(getTutorialSelection(state).score).toBe(100);
    state = tutorialReducer(state, { type: "reroll" });
    expect(state).toMatchObject({ step: "farkle", roundScore: 0, totalScore: 400 });
    expect(didFarkle(state.dice)).toBe(true);
    expect(tutorialReducer(state, { type: "select", id: 1 })).toBe(state);
    state = tutorialReducer(state, { type: "continue" });
    expect(state.step).toBe("complete");
    expect(tutorialReducer(state, { type: "bank" })).toBe(state);
  });

  it("allows selection mistakes and deselection without advancing the lesson", () => {
    let state = createTutorial();
    expect(tutorialReducer(state, { type: "reroll" })).toBe(state);
    expect(tutorialReducer(state, { type: "continue" })).toBe(state);
    state = select(state, 0, 1, 2);
    expect(getTutorialSelection(state).allDiceScore).toBe(false);
    expect(tutorialReducer(state, { type: "reroll" })).toBe(state);
    state = select(state, 2);
    expect(getTutorialSelection(state).allDiceScore).toBe(true);
    expect(tutorialReducer(state, { type: "bank" })).toBe(state);
    state = tutorialReducer(state, { type: "reroll" });
    expect(select(state, 0).dice).toEqual(state.dice); // Held dice cannot be changed.
    expect(tutorialReducer(state, { type: "bank" })).toBe(state);
    expect(tutorialReducer(state, { type: "reroll" })).toBe(state);
  });

  it("restarts with fresh practice state after banking or completion", () => {
    const state = bankedPractice();
    expect(tutorialReducer(state, { type: "restart" })).toEqual(createTutorial());
    expect(tutorialReducer({ ...state, step: "complete" }, { type: "restart" })).toEqual(createTutorial());
  });
});
