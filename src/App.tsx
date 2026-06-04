import { useState } from "react";
import { GameSummaryModal } from "./components/modals/GameSummaryModal";
import { GameScreen } from "./components/screens/GameScreen";
import { SettingsButton } from "./components/buttons/SettingsButton";
import { SettingsModal } from "./components/modals/SettingsModal";
import { StatisticsModal } from "./components/modals/StatisticsModal";
import { StartMenu } from "./components/screens/StartMenu";
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
      <GameScreen
        game={game}
        gameView={gameView}
        isLocalDebugMode={isLocalDebugMode()}
        isReturnToMenuHoldRequired={isReturnToMenuHoldRequired}
        isRulesOpen={isRulesOpen}
        onBackToMenu={backToMenu}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={resetGame}
        onRulesClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}

export default App;
