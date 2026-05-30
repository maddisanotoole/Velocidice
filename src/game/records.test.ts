import { describe, expect, it } from "vitest";
import { DEFAULT_RECORDS, getRecordsWithVsComputerResult } from "./records";

describe("getRecordsWithVsComputerResult", () => {
  it("adds a win when the player beats the computer", () => {
    expect(getRecordsWithVsComputerResult(DEFAULT_RECORDS, "player")).toEqual({
      vsComputer: {
        wins: 1,
        losses: 0,
      },
    });
  });

  it("adds a loss when the computer wins", () => {
    expect(getRecordsWithVsComputerResult(DEFAULT_RECORDS, "player2")).toEqual({
      vsComputer: {
        wins: 0,
        losses: 1,
      },
    });
  });
});
