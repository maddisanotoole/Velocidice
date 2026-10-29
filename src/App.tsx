import { useState } from "react";
import { GameSummaryModal } from "./components/modals/GameSummaryModal";
import { GameScreen } from "./components/screens/GameScreen";
import { SettingsButton } from "./components/buttons/SettingsButton";
import { MuteButton } from "./components/buttons/MuteButton";
import { SettingsModal } from "./components/modals/SettingsModal";
import { StatisticsModal } from "./components/modals/StatisticsModal";
import { StartMenu } from "./components/screens/StartMenu";
import { useGameState } from "./hooks/useGameState";
import { useGameViewState } from "./hooks/useGameViewState";
import { theme } from "./theme/classes";
import { loadTheme, saveTheme, type ThemeId } from "./theme/preferences";
import { ThemePicker } from "./components/modals/ThemePicker";
import { getThemeStyle } from "./theme/styles";
import { TutorialGame } from "./components/screens/TutorialGame";

function isLocalDebugMode() {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function App() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [themeId, setThemeId] = useState(loadTheme);
  const [themeSaveFailed, setThemeSaveFailed] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  function changeTheme(id: ThemeId) {
    setThemeId(id);
    setThemeSaveFailed(!saveTheme(id));
  }
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [isGameSummaryDismissed, setIsGameSummaryDismissed] = useState(false);
  const game = useGameState();
  const gameView = useGameViewState(game);
  const localDebugMode = isLocalDebugMode();
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

  if (isTutorialOpen) {
    return (
      <div className={theme.app.shell} data-theme={themeId} style={getThemeStyle(themeId)}>
        <TutorialGame onExit={() => {
          setIsTutorialOpen(false);
          requestAnimationFrame(() => document.getElementById("menu-tutorial-button")?.focus());
        }} onStartGame={() => { setIsTutorialOpen(false); game.startGame(); }} />
      </div>
    );
  }

  return (
    <div className={theme.app.shell} data-theme={themeId} style={getThemeStyle(themeId)}>
      {!game.hasStartedGame && (
        <StartMenu
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenTheme={() => setIsThemePickerOpen(true)}
          gameMode={game.gameMode}
          matchLength={game.matchLength}
          onGameModeChange={game.setGameMode}
          onMatchLengthChange={game.setMatchLength}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStatistics={() => setIsStatisticsOpen(true)}
          onStart={game.startGame}
          onTargetScoreChange={game.setTargetScore}
          targetScore={game.targetScore}
          themeSaveFailed={themeSaveFailed}
        />
      )}
      <SettingsButton onClick={openSettings} />
      <MuteButton isMuted={game.isMuted} onMuteChange={game.handleMuteChange} placement="top-left" />
      {isThemePickerOpen && <ThemePicker themeId={themeId} onApply={changeTheme} onClose={() => {
        setIsThemePickerOpen(false);
        requestAnimationFrame(() => document.getElementById("menu-theme-button")?.focus());
      }} />}
      {themeSaveFailed && game.hasStartedGame && !isSettingsOpen && <p role="status" className="w-full max-w-lg rounded-lg bg-[var(--surface)] p-3 text-sm">Theme changed for this visit. Your browser could not save the preference.</p>}
      {isSettingsOpen && (
        <SettingsModal
          themeId={themeId}
          onThemeChange={changeTheme}
          themeSaveFailed={themeSaveFailed}
          isLocalDebugMode={localDebugMode}
          isMuted={game.isMuted}
          isReturnToMenuHoldRequired={isReturnToMenuHoldRequired}
          onBackToMenu={backToMenu}
          onClose={() => setIsSettingsOpen(false)}
          onMuteChange={game.handleMuteChange}
          onRollPresetTextChange={game.setDebugRollsText}
          rollPresetText={game.debugRollPresetText}
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
