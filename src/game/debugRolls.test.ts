import { describe, expect, it } from "vitest";
import { debugRollsText, parseDebugRolls, takeDebugRoll } from "./debugRolls";

describe("debug rolls", () => {
  it("parses comma, space, and newline separated roll presets", () => {
    expect(parseDebugRolls("1 2 3 4 5 6\n6, 6, 6")).toEqual([
      [1, 2, 3, 4, 5, 6],
      [6, 6, 6],
    ]);
  });

  it("ignores invalid die values", () => {
    expect(parseDebugRolls("1 0 7 nope 5")).toEqual([[1, 5]]);
  });

  it("takes only the values needed for the next roll", () => {
    expect(takeDebugRoll([[1, 2, 3, 4, 5, 6]], 3)).toEqual({
      nextRolls: [],
      values: [1, 2, 3],
    });
  });

  it("formats rolls for display", () => {
    expect(
      debugRollsText([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).toBe("1 2 3\n4 5 6");
  });
});
