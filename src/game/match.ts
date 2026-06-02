import type { MatchLength, PlayerId, PlayerScores } from "../types";

export function getRequiredMatchWins(matchLength: MatchLength): number {
  return Math.floor(matchLength / 2) + 1;
}

export function getNextMatchScore(
  matchScore: PlayerScores,
  winner: PlayerId,
): PlayerScores {
  return {
    ...matchScore,
    [winner]: matchScore[winner] + 1,
  };
}

export function getMatchWinner(
  matchScore: PlayerScores,
  matchLength: MatchLength,
): PlayerId | null {
  const requiredWins = getRequiredMatchWins(matchLength);

  if (matchScore.player >= requiredWins) {
    return "player";
  }

  if (matchScore.player2 >= requiredWins) {
    return "player2";
  }

  return null;
}
