-- Run once in the connected Neon database's SQL editor before enabling collection.
CREATE TABLE IF NOT EXISTS game_events (
  event_id uuid PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now(),
  game_id uuid NOT NULL,
  match_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('game_started', 'game_completed', 'match_completed')),
  mode text NOT NULL CHECK (mode IN ('computer', 'local')),
  target_score integer NOT NULL CHECK (target_score IN (2000, 5000, 8000, 10000)),
  match_length integer NOT NULL CHECK (match_length IN (1, 3, 10)),
  winner text CHECK (winner IN ('player', 'player2')),
  player_score integer NOT NULL CHECK (player_score BETWEEN 0 AND 10000000),
  opponent_score integer NOT NULL CHECK (opponent_score BETWEEN 0 AND 10000000),
  turn_count integer NOT NULL CHECK (turn_count BETWEEN 0 AND 100000),
  player_wins integer NOT NULL CHECK (player_wins BETWEEN 0 AND 6),
  opponent_wins integer NOT NULL CHECK (opponent_wins BETWEEN 0 AND 6),
  UNIQUE (game_id, kind)
);
CREATE UNIQUE INDEX IF NOT EXISTS game_events_match_completion ON game_events (match_id)
  WHERE kind = 'match_completed';
CREATE INDEX IF NOT EXISTS game_events_received ON game_events (received_at);

-- Anonymous aggregate game results; local two-player games are kept separate.
CREATE OR REPLACE VIEW game_result_totals AS
SELECT mode, target_score, match_length,
  count(*) AS completed_games,
  count(*) FILTER (WHERE winner = 'player') AS player1_wins,
  count(*) FILTER (WHERE winner = 'player2') AS player2_wins,
  round(avg(turn_count), 1) AS average_turns
FROM game_events WHERE kind = 'game_completed'
GROUP BY mode, target_score, match_length;

CREATE OR REPLACE VIEW match_result_totals AS
SELECT mode, target_score, match_length,
  count(*) AS completed_matches,
  count(*) FILTER (WHERE winner = 'player') AS player1_wins,
  count(*) FILTER (WHERE winner = 'player2') AS player2_wins
FROM game_events WHERE kind = 'match_completed'
GROUP BY mode, target_score, match_length;
