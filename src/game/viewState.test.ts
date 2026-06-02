import { describe, expect, it } from "vitest";
import {
  getActionDisabledReason,
  getFeedbackMessage,
  getFeedbackMessageVariant,
  getIsComputerControlledTurn,
  getPlayerLabels,
  getTurnLabel,
  INVALID_SELECTION_MESSAGE,
} from "./viewState";

describe("view state helpers", () => {
  it("uses natural labels for computer mode", () => {
    const labels = getPlayerLabels("computer");

    expect(getTurnLabel("computer", "player", labels)).toBe("Your Turn");
    expect(getFeedbackMessage({
      actionMessage: "",
      gameMode: "computer",
      hasFarkled: false,
      matchWinner: null,
      playerLabels: labels,
      winner: "player",
    })).toBe("You win!");
  });

  it("uses numbered labels for local mode", () => {
    const labels = getPlayerLabels("local");

    expect(getTurnLabel("local", "player2", labels)).toBe("Player 2 Turn");
    expect(getFeedbackMessage({
      actionMessage: "",
      gameMode: "local",
      hasFarkled: false,
      matchWinner: null,
      playerLabels: labels,
      winner: "player",
    })).toBe("Player 1 wins!");
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

    expect(getFeedbackMessage({
      actionMessage: "",
      gameMode: "computer",
      hasFarkled: false,
      matchWinner: "player",
      playerLabels: labels,
      winner: "player",
    })).toBe("You win the match!");
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
