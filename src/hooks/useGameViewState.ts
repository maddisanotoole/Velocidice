import {
  getActionButtonsDisabled,
  getActionDisabledReason,
  getFeedbackMessage,
  getFeedbackMessageVariant,
  getPlayerLabels,
  getTurnBannerClasses,
  getTurnLabel,
} from "../game/viewState";
import type { useGameState } from "./useGameState";

type GameState = ReturnType<typeof useGameState>;

export function useGameViewState(game: GameState) {
  const playerLabels = getPlayerLabels(game.gameMode);

  return {
    actionButtonsDisabled: getActionButtonsDisabled({
      hasFarkled: game.hasFarkled,
      isComputerControlledTurn: game.isComputerControlledTurn,
      isTurnChanging: game.isTurnChanging,
      selectedDiceAreValid: game.selectedDiceAreValid,
      winner: game.winner,
    }),
    actionDisabledReason: getActionDisabledReason({
      hasFarkled: game.hasFarkled,
      isComputerControlledTurn: game.isComputerControlledTurn,
      isTurnChanging: game.isTurnChanging,
      matchWinner: game.matchWinner,
      playerLabels,
      selectedDiceAreValid: game.selectedDiceAreValid,
      selectedDiceCount: game.selectedDice.length,
      winner: game.winner,
    }),
    feedbackMessage: getFeedbackMessage({
      actionMessage: game.actionMessage,
      gameMode: game.gameMode,
      hasFarkled: game.hasFarkled,
      matchWinner: game.matchWinner,
      playerLabels,
      winner: game.winner,
    }),
    feedbackMessageVariant: getFeedbackMessageVariant(
      game.winner,
      game.matchWinner,
      game.gameMode,
      game.hasFarkled,
    ),
    playerLabels,
    turnBannerClasses: getTurnBannerClasses(game.currentPlayer),
    turnLabel: getTurnLabel(game.gameMode, game.currentPlayer, playerLabels),
  };
}
