import Button from "../buttons/GameButton";
import { DiceTray } from "../dice/DiceTray";
import { DiceArea } from "../dice/DiceArea";
import { TurnStatus } from "../TurnStatus";
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
    <main className="vd-game-screen flex h-full min-h-0 w-full max-w-md flex-col items-center sm:max-w-lg">
      <div className="vd-game-topbar w-full shrink-0" aria-hidden="true" />

      <section className="vd-game-middle flex min-h-0 w-full flex-1 overflow-y-auto">
        <div className="vd-game-content">
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
        <DiceArea key={`${game.currentPlayer}_${game.rerollCount}`} hasFarkled={game.hasStartedGame && game.hasFarkled}>
          <DiceTray
          currentPlayer={game.currentPlayer}
          dice={game.dice}
          invalidSelectedDieIds={game.invalidSelectedDieIds}
          isTurnChanging={game.isTurnChanging}
          onSelectDie={game.selectDie}
          rerollCount={game.hasStartedGame ? game.rerollCount : -1}
          />
        </DiceArea>
        <div className="vd-game-actions w-full" role="group" aria-label="Turn actions" aria-describedby="turn-action-guidance">
          <Row>
          <Button
            onClick={game.holdDice}
            disabled={gameView.actionButtonsDisabled}
            title={gameView.actionDisabledReason}
            color="blue"
            themeRole="reroll_button"
          >
            Hold & Reroll
          </Button>
          <Button
            onClick={game.endTurn}
            disabled={gameView.actionButtonsDisabled}
            title={gameView.actionDisabledReason}
            color="yellow"
          >
            {gameView.bankActionLabel}
          </Button>
          </Row>
          <TurnStatus
            message={game.hasFarkled ? undefined : gameView.feedbackMessage}
            guidance={game.hasFarkled ? "The next turn starts automatically." : gameView.actionDisabledReason ?? "Bank to save your points, or reroll to risk them for more."}
            variant={gameView.feedbackMessageVariant}
          />
        </div>
        </div>
      </section>

      <nav className="vd-game-footer w-full shrink-0">
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
