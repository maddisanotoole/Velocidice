import type {
  FeedbackVariant,
  GameMode,
  PlayerId,
  PlayerLabels,
} from "../types";

export const INVALID_SELECTION_MESSAGE =
  "Every selected die must contribute to the score.";

export function getBankActionLabel({
  roundScore, selectedScore, totalScore, targetScore, disabled,
}: {
  roundScore: number;
  selectedScore: number;
  totalScore: number;
  targetScore: number;
  disabled: boolean;
}): string {
  if (disabled) return "Bank & End Turn";
  const amount = roundScore + selectedScore;
  return totalScore + amount >= targetScore
    ? `Bank ${amount.toLocaleString()} & Win`
    : `Bank ${amount.toLocaleString()} points`;
}

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
    ? "border-[var(--line)] bg-[var(--your_turn)] text-[var(--your_turn-ink)]"
    : "border-[var(--line)] bg-[var(--opponent_turn)] text-[var(--opponent_turn-ink)]";
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
  hasFarkled,
  matchWinner,
  winner,
}: {
  actionMessage: string;
  gameMode: GameMode;
  hasFarkled: boolean;
  matchWinner: PlayerId | null;
  playerLabels: PlayerLabels;
  winner: PlayerId | null;
}): string {
  // The result board presents the outcome; do not duplicate it in a toast.
  if (winner || matchWinner) {
    return "";
  }

  return hasFarkled ? "Farkle!" : actionMessage;
}

export function getFeedbackMessageVariant(
  winner: PlayerId | null,
  matchWinner: PlayerId | null,
  gameMode: GameMode,
  hasFarkled: boolean,
  hasInvalidSelection = false,
): FeedbackVariant {
  const resultWinner = matchWinner ?? winner;

  if (resultWinner) {
    return resultWinner === "player2" && gameMode === "computer"
      ? "danger"
      : "success";
  }

  return hasFarkled ? "danger" : hasInvalidSelection ? "warning" : "default";
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
    return "Farkle! No points banked. Changing turns automatically.";
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
