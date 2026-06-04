import { useState } from "react";
import Button from "./components/GameButton";
import { DebugRollPanel } from "./components/DebugRollPanel";
import { DiceTray } from "./components/DiceTray";
import { FeedbackToast } from "./components/FeedbackToast";
import { HoldToMenuButton } from "./components/HoldToMenuButton";
import { MatchBoard } from "./components/MatchBoard";
import { MatchSummaryModal } from "./components/MatchSummaryModal";
import { NewGameButton } from "./components/NewGameButton";
import { PlayerBoard } from "./components/PlayerBoard";
import { Row } from "./components/Row";
import { RulesButton } from "./components/RulesButton";
import { RulesModal } from "./components/RulesModal";
import { ScoreBoard } from "./components/ScoreBoard";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsModal } from "./components/SettingsModal";
import { StatisticsModal } from "./components/StatisticsModal";
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
  const [isMatchSummaryDismissed, setIsMatchSummaryDismissed] = useState(false);
  const game = useGameState();
  const gameView = useGameViewState(game);
  const isReturnToMenuHoldRequired = game.hasStartedGame && !game.winner;
  const shouldShowMatchSummary =
    Boolean(game.matchWinner) &&
    game.matchLength > 1 &&
    !isMatchSummaryDismissed;

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function backToMenu() {
    setIsSettingsOpen(false);
    setIsMatchSummaryDismissed(false);
    game.backToMenu();
  }

  function resetGame() {
    setIsMatchSummaryDismissed(false);
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
      {shouldShowMatchSummary && game.matchWinner && (
        <MatchSummaryModal
          matchLength={game.matchLength}
          matchScore={game.matchScore}
          onClose={() => setIsMatchSummaryDismissed(true)}
          onNewGame={resetGame}
          playerLabels={gameView.playerLabels}
          playerScore={game.playerScore}
          targetScore={game.targetScore}
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
