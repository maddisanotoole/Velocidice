import { describe, expect, it } from "vitest";
import {
  getMatchWinner,
  getNextMatchScore,
  getRequiredMatchWins,
} from "./match";

describe("match helpers", () => {
  it("requires a majority of games to win the match", () => {
    expect(getRequiredMatchWins(1)).toBe(1);
    expect(getRequiredMatchWins(3)).toBe(2);
    expect(getRequiredMatchWins(10)).toBe(6);
  });

  it("increments the winning player's match score", () => {
    expect(getNextMatchScore({ player: 1, player2: 0 }, "player2")).toEqual({
      player: 1,
      player2: 1,
    });
  });

  it("detects the match winner once they reach the required wins", () => {
    expect(getMatchWinner({ player: 2, player2: 1 }, 3)).toBe("player");
    expect(getMatchWinner({ player: 5, player2: 4 }, 10)).toBe(null);
    expect(getMatchWinner({ player: 5, player2: 6 }, 10)).toBe("player2");
  });
});
