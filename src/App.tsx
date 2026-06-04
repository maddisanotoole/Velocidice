import { useState } from "react";
import Button from "./components/buttons/GameButton";
import { DebugRollPanel } from "./components/modals/DebugRollPanel";
import { DiceTray } from "./components/dice/DiceTray";
import { FeedbackToast } from "./components/modals/FeedbackToast";
import { HoldToMenuButton } from "./components/buttons/HoldToMenuButton";
import { MatchBoard } from "./components/boards/MatchBoard";
import { GameSummaryModal } from "./components/modals/GameSummaryModal";
import { NewGameButton } from "./components/buttons/NewGameButton";
import { PlayerBoard } from "./components/boards/PlayerBoard";
import { Row } from "./components/Row";
import { RulesButton } from "./components/buttons/RulesButton";
import { RulesModal } from "./components/modals/RulesModal";
import { ScoreBoard } from "./components/boards/ScoreBoard";
import { SettingsButton } from "./components/buttons/SettingsButton";
import { SettingsModal } from "./components/modals/SettingsModal";
import { StatisticsModal } from "./components/modals/StatisticsModal";
import { StartMenu } from "./components/StartMenu";
import { useGameState } from "./hooks/useGameState";
import { useGameViewState } from "./hooks/useGameViewState";
import { theme } from "./theme/classes";

function isLocalDebugMode() {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function App() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [isGameSummaryDismissed, setIsGameSummaryDismissed] = useState(false);
  const game = useGameState();
  const gameView = useGameViewState(game);
  const isReturnToMenuHoldRequired = game.hasStartedGame && !game.winner;
  const shouldShowGameSummary = Boolean(game.winner) && !isGameSummaryDismissed;

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function backToMenu() {
    setIsSettingsOpen(false);
    setIsGameSummaryDismissed(false);
    game.backToMenu();
  }

  function resetGame() {
    setIsGameSummaryDismissed(false);
    game.resetGame();
  }

  return (
    <div className={theme.app.shell}>
      {!game.hasStartedGame && (
        <StartMenu
          gameMode={game.gameMode}
          isMuted={game.isMuted}
          matchLength={game.matchLength}
          onGameModeChange={game.setGameMode}
          onMatchLengthChange={game.setMatchLength}
          onMuteChange={game.handleMuteChange}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStatistics={() => setIsStatisticsOpen(true)}
          onStart={game.startGame}
          onTargetScoreChange={game.setTargetScore}
          targetScore={game.targetScore}
        />
      )}
      <SettingsButton onClick={openSettings} />
      {isSettingsOpen && (
        <SettingsModal
          isMuted={game.isMuted}
          isReturnToMenuHoldRequired={isReturnToMenuHoldRequired}
          onBackToMenu={backToMenu}
          onClose={() => setIsSettingsOpen(false)}
          onMuteChange={game.handleMuteChange}
        />
      )}
      {isStatisticsOpen && (
        <StatisticsModal
          onClose={() => setIsStatisticsOpen(false)}
          records={game.records}
        />
      )}
      {shouldShowGameSummary && game.winner && (
        <GameSummaryModal
          actionLabel={game.matchWinner ? "New Game" : "Next Game"}
          matchLength={game.matchLength}
          matchScore={game.matchScore}
          matchWinner={game.matchWinner}
          onClose={() => setIsGameSummaryDismissed(true)}
          onNewGame={resetGame}
          playerLabels={gameView.playerLabels}
          playerScore={game.playerScore}
          targetScore={game.targetScore}
          winner={game.winner}
        />
      )}
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
        <RulesButton onClick={() => setIsRulesOpen(true)} size="small" />
        {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}
        <HoldToMenuButton
          isHoldRequired={isReturnToMenuHoldRequired}
          onReturnToMenu={backToMenu}
          size="small"
        />
        {game.winner && (
          <NewGameButton
            label={game.matchWinner ? "New Game" : "Next Game"}
            onClick={resetGame}
            size="small"
          />
        )}
      </Row>
      {isLocalDebugMode() && (
        <DebugRollPanel
          onRollPresetTextChange={game.setDebugRollsText}
          rollPresetText={game.debugRollPresetText}
        />
      )}
    </div>
  );
}

export default App;
