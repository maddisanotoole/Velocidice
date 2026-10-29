import { describe, expect, it } from "vitest";
import {
  getActionDisabledReason,
  getBankActionLabel,
  getFeedbackMessage,
  getFeedbackMessageVariant,
  getIsComputerControlledTurn,
  getPlayerLabels,
  getTurnLabel,
  getWinnerMessage,
  INVALID_SELECTION_MESSAGE,
} from "./viewState";

describe("view state helpers", () => {
  it("shows the full bankable amount and recognises a winning bank", () => {
    const state = { roundScore: 300, selectedScore: 150, totalScore: 1000, targetScore: 2000, disabled: false };
    expect(getBankActionLabel(state)).toBe("Bank 450 points");
    expect(getBankActionLabel({ ...state, totalScore: 1550 })).toBe("Bank 450 & Win");
    expect(getBankActionLabel({ ...state, totalScore: 1900 })).toBe("Bank 450 & Win");
    expect(getBankActionLabel({ ...state, roundScore: 0 })).toBe("Bank 150 points");
    // Invalid selections, computer turns and completed games cannot offer a bank.
    expect(getBankActionLabel({ ...state, disabled: true })).toBe("Bank & End Turn");
  });

  it("gives visible guidance for empty selections and automatic Farkle transitions", () => {
    const state = {
      hasFarkled: false, isComputerControlledTurn: false, isTurnChanging: false,
      matchWinner: null, playerLabels: getPlayerLabels("local"),
      selectedDiceAreValid: false, selectedDiceCount: 0, winner: null,
    };
    expect(getActionDisabledReason(state)).toBe("Select scoring dice first.");
    expect(getActionDisabledReason({ ...state, hasFarkled: true })).toBe(
      "Farkle! No points banked. Changing turns automatically.",
    );
    expect(getActionDisabledReason({ ...state, selectedDiceAreValid: true, selectedDiceCount: 1 })).toBeUndefined();
    expect(getActionDisabledReason({ ...state, isTurnChanging: true })).toBe("Changing turns.");
  });

  it("uses warning colours for invalid selections without overriding a Farkle or winner", () => {
    expect(getFeedbackMessageVariant(null, null, "computer", false, true)).toBe("warning");
    expect(getFeedbackMessageVariant(null, null, "computer", true, true)).toBe("danger");
    expect(getFeedbackMessageVariant("player", null, "computer", false, true)).toBe("success");
  });
  it("uses natural labels for computer mode", () => {
    const labels = getPlayerLabels("computer");

    expect(getTurnLabel("computer", "player", labels)).toBe("Your Turn");
    expect(getWinnerMessage("player", null, "computer", labels)).toBe("You win!");
  });

  it("uses numbered labels for local mode", () => {
    const labels = getPlayerLabels("local");

    expect(getTurnLabel("local", "player2", labels)).toBe("Player 2 Turn");
    expect(getWinnerMessage("player", null, "local", labels)).toBe("Player 1 wins!");
  });

  it("marks computer wins as danger feedback", () => {
    expect(getFeedbackMessageVariant("player2", null, "computer", false)).toBe(
      "danger",
    );
    expect(getFeedbackMessageVariant("player2", null, "local", false)).toBe(
      "success",
    );
  });

  it("uses match winner messages when a match is complete", () => {
    const labels = getPlayerLabels("computer");

    expect(getWinnerMessage("player", "player", "computer", labels)).toBe("You win the match!");
  });

  it("leaves completed game and match outcomes to the result board", () => {
    for (const gameMode of ["computer", "local"] as const) {
      for (const winner of ["player", "player2"] as const) {
        const state = {
          actionMessage: "Banked 500 points!", gameMode, hasFarkled: false,
          matchWinner: null, playerLabels: getPlayerLabels(gameMode), winner,
        };
        expect(getFeedbackMessage(state)).toBe("");
        expect(getFeedbackMessage({ ...state, matchWinner: winner })).toBe("");
        expect(getFeedbackMessage({ ...state, winner: null, matchWinner: winner })).toBe("");
      }
    }
  });

  it("preserves feedback during an ongoing game", () => {
    const state = {
      actionMessage: "", gameMode: "computer" as const, hasFarkled: false,
      matchWinner: null, playerLabels: getPlayerLabels("computer"), winner: null,
    };
    for (const actionMessage of ["Banked 500 points!", "Hot dice!", INVALID_SELECTION_MESSAGE]) {
      expect(getFeedbackMessage({ ...state, actionMessage })).toBe(actionMessage);
    }
    expect(getFeedbackMessage({ ...state, hasFarkled: true })).toBe("Farkle!");
  });

  it("explains blocked actions in priority order", () => {
    expect(
      getActionDisabledReason({
        hasFarkled: false,
        isComputerControlledTurn: true,
        isTurnChanging: false,
        matchWinner: null,
        playerLabels: getPlayerLabels("computer"),
        selectedDiceAreValid: false,
        selectedDiceCount: 0,
        winner: null,
      }),
    ).toBe("Computer is taking its turn.");

    expect(
      getActionDisabledReason({
        hasFarkled: false,
        isComputerControlledTurn: false,
        isTurnChanging: false,
        matchWinner: null,
        playerLabels: getPlayerLabels("computer"),
        selectedDiceAreValid: false,
        selectedDiceCount: 2,
        winner: null,
      }),
    ).toBe(INVALID_SELECTION_MESSAGE);
  });

  it("detects computer-controlled turns", () => {
    expect(getIsComputerControlledTurn("computer", "player2")).toBe(true);
    expect(getIsComputerControlledTurn("local", "player2")).toBe(false);
  });
});
