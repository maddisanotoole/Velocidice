import { MATCH_LENGTH_OPTIONS, TARGET_SCORE_OPTIONS } from "../appConstants.js";
import type { GameMode, MatchLength, PlayerId } from "../types";

export type GameEvent = {
  version: 1;
  eventId: string;
  gameId: string;
  matchId: string;
  kind: "game_started" | "game_completed" | "match_completed";
  mode: GameMode;
  targetScore: number;
  matchLength: MatchLength;
  winner: PlayerId | null;
  playerScore: number;
  opponentScore: number;
  turnCount: number;
  playerWins: number;
  opponentWins: number;
};

const keys = ["version", "eventId", "gameId", "matchId", "kind", "mode", "targetScore", "matchLength", "winner", "playerScore", "opponentScore", "turnCount", "playerWins", "opponentWins"];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const integer = (value: unknown, max: number) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= max;

// Reject unknown properties rather than accepting free text or identifying metadata.
export function isGameEvent(value: unknown): value is GameEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const event = value as GameEvent;
  if (Object.keys(event).length !== keys.length || Object.keys(event).some(key => !keys.includes(key))) return false;
  if (event.version !== 1 || ![event.eventId, event.gameId, event.matchId].every(id => typeof id === "string" && uuid.test(id))) return false;
  if (!["game_started", "game_completed", "match_completed"].includes(event.kind) || !["computer", "local"].includes(event.mode)) return false;
  if (!TARGET_SCORE_OPTIONS.some(score => score === event.targetScore) || !MATCH_LENGTH_OPTIONS.some(length => length === event.matchLength)) return false;
  if (![event.playerScore, event.opponentScore].every(score => integer(score, 10_000_000) && score % 50 === 0) || !integer(event.turnCount, 100_000)) return false;
  const requiredWins = Math.floor(event.matchLength / 2) + 1;
  if (![event.playerWins, event.opponentWins].every(wins => integer(wins, requiredWins))) return false;
  if (event.playerWins + event.opponentWins > requiredWins * 2 - 1) return false;
  if (event.kind === "game_started") {
    return event.winner === null && event.playerScore === 0 && event.opponentScore === 0 && event.turnCount === 0 && Math.max(event.playerWins, event.opponentWins) < requiredWins;
  }
  if (!["player", "player2"].includes(event.winner ?? "") || event.turnCount < 1) return false;
  const winningScore = event.winner === "player" ? event.playerScore : event.opponentScore;
  const losingScore = event.winner === "player" ? event.opponentScore : event.playerScore;
  const wins = event.winner === "player" ? event.playerWins : event.opponentWins;
  const losses = event.winner === "player" ? event.opponentWins : event.playerWins;
  return winningScore >= event.targetScore && losingScore < event.targetScore && wins >= 1 && losses < requiredWins && (event.kind !== "match_completed" || wins === requiredWins);
}
