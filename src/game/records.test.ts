import { describe, expect, it } from "vitest";
import { DEFAULT_RECORDS, getRecordsWithVsComputerResult } from "./records";

describe("getRecordsWithVsComputerResult", () => {
  it("adds a win when the player beats the computer", () => {
    expect(getRecordsWithVsComputerResult(DEFAULT_RECORDS, "player", 3, 2150)).toEqual({
      vsComputer: {
        wins: 1,
        losses: 0,
        highestPlayerScore: 2150,
        matchesWonByLength: {
          1: 0,
          3: 1,
          10: 0,
        },
      },
    });
  });

  it("adds a loss when the computer wins", () => {
    expect(getRecordsWithVsComputerResult(DEFAULT_RECORDS, "player2", 10, 1800)).toEqual({
      vsComputer: {
        wins: 0,
        losses: 1,
        highestPlayerScore: 1800,
        matchesWonByLength: {
          1: 0,
          3: 0,
          10: 0,
        },
      },
    });
  });

  it("keeps the highest player score", () => {
    const records = getRecordsWithVsComputerResult(
      DEFAULT_RECORDS,
      "player",
      1,
      2500,
    );

    expect(getRecordsWithVsComputerResult(records, "player2", 1, 2000)).toMatchObject({
      vsComputer: {
        highestPlayerScore: 2500,
      },
    });
  });
});
