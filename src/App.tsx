import { useState } from "react";
import Button from "./components/GameButton";
import { DebugRollPanel } from "./components/DebugRollPanel";
import { DiceTray } from "./components/DiceTray";
import { FeedbackToast } from "./components/FeedbackToast";
import { HoldToMenuButton } from "./components/HoldToMenuButton";
import { MatchBoard } from "./components/MatchBoard";
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
  const game = useGameState();
  const gameView = useGameViewState(game);
  const isReturnToMenuHoldRequired = game.hasStartedGame && !game.winner;

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function backToMenu() {
    setIsSettingsOpen(false);
    game.backToMenu();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-start gap-4 bg-zinc-900 px-3 py-16 text-white sm:justify-center sm:gap-8 sm:px-4 sm:py-8">
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
      {game.matchLength > 1 && (
        <MatchBoard
          matchScore={game.matchScore}
          playerLabels={gameView.playerLabels}
          requiredWins={game.requiredMatchWins}
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
            onClick={game.resetGame}
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
