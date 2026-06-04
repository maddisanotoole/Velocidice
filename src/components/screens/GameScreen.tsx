import Button from "../buttons/GameButton";
import { DebugRollPanel } from "../modals/DebugRollPanel";
import { DiceTray } from "../dice/DiceTray";
import { FeedbackToast } from "../modals/FeedbackToast";
import { HoldToMenuButton } from "../buttons/HoldToMenuButton";
import { MatchBoard } from "../boards/MatchBoard";
import { NewGameButton } from "../buttons/NewGameButton";
import { PlayerBoard } from "../boards/PlayerBoard";
import { Row } from "../Row";
import { RulesButton } from "../buttons/RulesButton";
import { RulesModal } from "../modals/RulesModal";
import { ScoreBoard } from "../boards/ScoreBoard";
import type { useGameState } from "../../hooks/useGameState";
import type { useGameViewState } from "../../hooks/useGameViewState";

type GameState = ReturnType<typeof useGameState>;
type GameViewState = ReturnType<typeof useGameViewState>;

type GameScreenProps = {
  game: GameState;
  gameView: GameViewState;
  isLocalDebugMode: boolean;
  isReturnToMenuHoldRequired: boolean;
  isRulesOpen: boolean;
  onBackToMenu: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
  onRulesClose: () => void;
};

export function GameScreen({
  game,
  gameView,
  isLocalDebugMode,
  isReturnToMenuHoldRequired,
  isRulesOpen,
  onBackToMenu,
  onOpenRules,
  onResetGame,
  onRulesClose,
}: GameScreenProps) {
  return (
    <>
      {game.matchLength > 1 && (
        <MatchBoard
          matchLength={game.matchLength}
          matchScore={game.matchScore}
          playerLabels={gameView.playerLabels}
        />
      )}
      <PlayerBoard
        targetScore={game.targetScore}
        currentPlayer={game.currentPlayer}
        playerScores={game.playerScore}
        playerLabels={gameView.playerLabels}
      />
      <ScoreBoard
        currentPlayer={game.currentPlayer}
        playerScores={game.playerScore}
        roundScore={game.roundScore}
        roundScoreDelta={game.roundScoreDelta}
        selectedScore={game.selectedScore}
        totalScoreDelta={game.totalScoreDelta}
      />

      <p
        className={`rounded-xl border-2 px-4 py-1.5 text-base font-black uppercase tracking-wide shadow-lg sm:px-5 sm:py-2 sm:text-lg ${gameView.turnBannerClasses}`}
      >
        {gameView.turnLabel}
      </p>
      <DiceTray
        currentPlayer={game.currentPlayer}
        dice={game.dice}
        invalidSelectedDieIds={game.invalidSelectedDieIds}
        isTurnChanging={game.isTurnChanging}
        onSelectDie={game.selectDie}
        rerollCount={game.hasStartedGame ? game.rerollCount : -1}
      />
      <FeedbackToast
        message={gameView.feedbackMessage}
        variant={gameView.feedbackMessageVariant}
      />
      <Row>
        <Button
          onClick={game.holdDice}
          disabled={gameView.actionButtonsDisabled}
          title={gameView.actionDisabledReason}
          color="blue"
        >
          Hold & Reroll
        </Button>
        <Button
          onClick={game.endTurn}
          disabled={gameView.actionButtonsDisabled}
          title={gameView.actionDisabledReason}
          color="yellow"
        >
          Bank & End Turn
        </Button>
      </Row>
      <Row>
        <RulesButton onClick={onOpenRules} size="small" />
        {isRulesOpen && <RulesModal onClose={onRulesClose} />}
        <HoldToMenuButton
          isHoldRequired={isReturnToMenuHoldRequired}
          onReturnToMenu={onBackToMenu}
          size="small"
        />
        {game.winner && (
          <NewGameButton
            label={game.matchWinner ? "New Game" : "Next Game"}
            onClick={onResetGame}
            size="small"
          />
        )}
      </Row>
      {isLocalDebugMode && (
        <DebugRollPanel
          onRollPresetTextChange={game.setDebugRollsText}
          rollPresetText={game.debugRollPresetText}
        />
      )}
    </>
  );
}
