import type { PlayerId } from "../types";

export function getNextPlayer(currentPlayer: PlayerId): PlayerId {
  return currentPlayer === "player" ? "player2" : "player";
}

export function shouldAutoSwitchAfterFarkle({
  hasFarkled,
  hasStartedGame,
  isTurnChanging,
  winner,
}: {
  hasFarkled: boolean;
  hasStartedGame: boolean;
  isTurnChanging: boolean;
  winner: PlayerId | null;
}): boolean {
  return hasStartedGame && hasFarkled && !winner && !isTurnChanging;
}
