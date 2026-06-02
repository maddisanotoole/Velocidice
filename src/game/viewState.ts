import type {
  FeedbackVariant,
  GameMode,
  PlayerId,
  PlayerLabels,
} from "../types";

export const INVALID_SELECTION_MESSAGE =
  "Every selected die must contribute to the score.";

export function getIsComputerControlledTurn(
  gameMode: GameMode,
  currentPlayer: PlayerId,
): boolean {
  return gameMode === "computer" && currentPlayer === "player2";
}

export function getPlayerLabels(gameMode: GameMode): PlayerLabels {
  return gameMode === "local"
    ? { player: "Player 1", player2: "Player 2" }
    : { player: "You", player2: "Computer" };
}

export function getTurnLabel(
  gameMode: GameMode,
  currentPlayer: PlayerId,
  playerLabels: PlayerLabels,
): string {
  return gameMode === "computer" && currentPlayer === "player"
    ? "Your Turn"
    : `${playerLabels[currentPlayer]} Turn`;
}

export function getTurnBannerClasses(currentPlayer: PlayerId): string {
  return currentPlayer === "player"
    ? "border-blue-300 bg-blue-500 text-white"
    : "border-purple-300 bg-purple-500 text-white";
}

export function getWinnerMessage(
  winner: PlayerId | null,
  matchWinner: PlayerId | null,
  gameMode: GameMode,
  playerLabels: PlayerLabels,
): string {
  if (matchWinner) {
    return matchWinner === "player" && gameMode === "computer"
      ? "You win the match!"
      : `${playerLabels[matchWinner]} wins the match!`;
  }

  if (!winner) {
    return "";
  }

  return winner === "player" && gameMode === "computer"
    ? "You win!"
    : `${playerLabels[winner]} wins!`;
}

export function getFeedbackMessage({
  actionMessage,
  gameMode,
  hasFarkled,
  matchWinner,
  playerLabels,
  winner,
}: {
  actionMessage: string;
  gameMode: GameMode;
  hasFarkled: boolean;
  matchWinner: PlayerId | null;
  playerLabels: PlayerLabels;
  winner: PlayerId | null;
}): string {
  if (winner) {
    return getWinnerMessage(winner, matchWinner, gameMode, playerLabels);
  }

  return hasFarkled ? "Farkle!" : actionMessage;
}

export function getFeedbackMessageVariant(
  winner: PlayerId | null,
  matchWinner: PlayerId | null,
  gameMode: GameMode,
  hasFarkled: boolean,
): FeedbackVariant {
  const resultWinner = matchWinner ?? winner;

  if (resultWinner) {
    return resultWinner === "player2" && gameMode === "computer"
      ? "danger"
      : "success";
  }

  return hasFarkled ? "danger" : "default";
}

export function getActionDisabledReason({
  hasFarkled,
  isComputerControlledTurn,
  isTurnChanging,
  matchWinner,
  playerLabels,
  selectedDiceAreValid,
  selectedDiceCount,
  winner,
}: {
  hasFarkled: boolean;
  isComputerControlledTurn: boolean;
  isTurnChanging: boolean;
  matchWinner: PlayerId | null;
  playerLabels: PlayerLabels;
  selectedDiceAreValid: boolean;
  selectedDiceCount: number;
  winner: PlayerId | null;
}): string | undefined {
  if (matchWinner) {
    return `${playerLabels[matchWinner]} won the match. Reset to play again.`;
  }

  if (winner) {
    return `${playerLabels[winner]} won the game. Reset to play again.`;
  }

  if (isComputerControlledTurn) {
    return "Computer is taking its turn.";
  }

  if (isTurnChanging) {
    return "Changing turns.";
  }

  if (hasFarkled) {
    return "You farkled. End your turn.";
  }

  if (selectedDiceCount === 0) {
    return "Select scoring dice first.";
  }

  return selectedDiceAreValid ? undefined : INVALID_SELECTION_MESSAGE;
}

export function getActionButtonsDisabled({
  hasFarkled,
  isComputerControlledTurn,
  isTurnChanging,
  selectedDiceAreValid,
  winner,
}: {
  hasFarkled: boolean;
  isComputerControlledTurn: boolean;
  isTurnChanging: boolean;
  selectedDiceAreValid: boolean;
  winner: PlayerId | null;
}): boolean {
  return (
    Boolean(winner) ||
    isTurnChanging ||
    isComputerControlledTurn ||
    hasFarkled ||
    !selectedDiceAreValid
  );
}
