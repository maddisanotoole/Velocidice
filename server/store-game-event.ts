import { neon } from "@neondatabase/serverless";
import type { GameEvent } from "../src/analytics/events.js";

export async function storeGameEvent(event: GameEvent) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Analytics database is not configured");
  const sql = neon(databaseUrl);
  await sql`INSERT INTO game_events (
    event_id, game_id, match_id, kind, mode, target_score, match_length,
    winner, player_score, opponent_score, turn_count, player_wins, opponent_wins
  ) VALUES (
    ${event.eventId}, ${event.gameId}, ${event.matchId}, ${event.kind}, ${event.mode}, ${event.targetScore}, ${event.matchLength},
    ${event.winner}, ${event.playerScore}, ${event.opponentScore}, ${event.turnCount}, ${event.playerWins}, ${event.opponentWins}
  ) ON CONFLICT DO NOTHING`;
}
