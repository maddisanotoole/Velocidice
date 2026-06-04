import Button from "../buttons/GameButton";
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
  isReturnToMenuHoldRequired,
  isRulesOpen,
  onBackToMenu,
  onOpenRules,
  onResetGame,
  onRulesClose,
}: GameScreenProps) {
  return (
    <main className="flex min-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col items-center sm:min-h-[calc(100dvh-4rem)] sm:max-w-lg">
      <div className="h-12 w-full shrink-0 sm:h-14" />

      <section className="flex w-full flex-1 flex-col items-center justify-center gap-3 sm:gap-5">
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
        <div className="pt-4 sm:pt-6">
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
        </div>
      </section>

      <nav className="w-full shrink-0 pb-[env(safe-area-inset-bottom)] pt-3 sm:pt-5">
        <div className="flex items-center justify-between gap-3">
          <RulesButton onClick={onOpenRules} size="small" />
          <div className="flex flex-wrap justify-end gap-3 sm:gap-4">
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
          </div>
        </div>
        {isRulesOpen && <RulesModal onClose={onRulesClose} />}
      </nav>
    </main>
  );
}
