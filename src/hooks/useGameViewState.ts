import {
  getActionButtonsDisabled,
  getActionDisabledReason,
  getBankActionLabel,
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
  const actionButtonsDisabled = getActionButtonsDisabled({
    hasFarkled: game.hasFarkled,
    isComputerControlledTurn: game.isComputerControlledTurn,
    isTurnChanging: game.isTurnChanging,
    selectedDiceAreValid: game.selectedDiceAreValid,
    winner: game.winner,
  });

  return {
    actionButtonsDisabled,
    bankActionLabel: getBankActionLabel({
      roundScore: game.roundScore,
      selectedScore: game.selectedScore,
      totalScore: game.playerScore[game.currentPlayer],
      targetScore: game.targetScore,
      disabled: actionButtonsDisabled,
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
      game.selectedDice.length > 0 && !game.selectedDiceAreValid,
    ),
    playerLabels,
    turnBannerClasses: getTurnBannerClasses(game.currentPlayer),
    turnLabel: getTurnLabel(game.gameMode, game.currentPlayer, playerLabels),
  };
}
