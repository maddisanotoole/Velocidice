import type { GameMode, MatchLength, PlayerId, PlayerScores } from "../types";
import type { GameEvent } from "./events";

type Config = { mode: GameMode; targetScore: number; matchLength: MatchLength };
type Dependencies = { enabled: () => boolean; send: (event: GameEvent) => void; id: () => string };

export function createGameTracker({ enabled, send, id }: Dependencies) {
  let match: { id: string; config: Config; excluded: boolean; turns: number; wins: PlayerScores } | undefined;
  let game: { id: string; completed: boolean; turns: number } | undefined;

  function emit(kind: GameEvent["kind"], winner: PlayerId | null = null, scores: PlayerScores = { player: 0, player2: 0 }) {
    if (!match || !game || match.excluded || !enabled()) return;
    try {
      send({ version: 1, eventId: id(), gameId: game.id, matchId: match.id, kind,
        ...match.config, winner, playerScore: scores.player, opponentScore: scores.player2,
        turnCount: kind === "match_completed" ? match.turns : game.turns,
        playerWins: match.wins.player, opponentWins: match.wins.player2 });
    } catch { /* Analytics must never interrupt play. */ }
  }

  return {
    start(config: Config, newMatch: boolean, excluded = false) {
      // No IDs or events are created for local/preview/test games.
      if (!enabled()) { match = undefined; game = undefined; return; }
      try {
        if (newMatch || !match) match = { id: id(), config: { ...config }, excluded, turns: 0, wins: { player: 0, player2: 0 } };
        if (excluded) match.excluded = true;
        game = { id: id(), completed: false, turns: 0 };
        emit("game_started");
      } catch { match = undefined; game = undefined; }
    },
    turnEnded() {
      if (!game || !match || game.completed) return;
      game.turns += 1;
      match.turns += 1;
    },
    complete(winner: PlayerId, scores: PlayerScores, wins: PlayerScores, matchWinner: PlayerId | null) {
      if (!game || !match || game.completed) return;
      game.completed = true; // Synchronous guard, outside React state updaters/effects.
      match.wins = { ...wins };
      emit("game_completed", winner, scores);
      if (matchWinner) emit("match_completed", matchWinner, scores);
    },
    exclude() { if (match) match.excluded = true; },
    stop() { match = undefined; game = undefined; },
  };
}
