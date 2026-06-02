import { describe, expect, it } from "vitest";
import { getNextPlayer, shouldAutoSwitchAfterFarkle } from "./turnFlow";

describe("turn flow", () => {
  it("switches from player to player2", () => {
    expect(getNextPlayer("player")).toBe("player2");
  });

  it("switches from player2 to player", () => {
    expect(getNextPlayer("player2")).toBe("player");
  });

  it("auto-switches when the first started roll is a Farkle", () => {
    expect(
      shouldAutoSwitchAfterFarkle({
        hasFarkled: true,
        hasStartedGame: true,
        isTurnChanging: false,
        winner: null,
      }),
    ).toBe(true);
  });

  it("does not auto-switch for an unstarted Farkle-shaped setup roll", () => {
    expect(
      shouldAutoSwitchAfterFarkle({
        hasFarkled: true,
        hasStartedGame: false,
        isTurnChanging: false,
        winner: null,
      }),
    ).toBe(false);
  });
});
