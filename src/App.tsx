import { useEffect, useRef, useState } from "react";
import Button from "./components/GameButton";
import { type GameMode, type PlayerId, type PlayerScores } from "./types";
import { ScoreBoard } from "./components/ScoreBoard";
import { scoreDice } from "./game/scoring";
import { PlayerBoard } from "./components/PlayerBoard";
import { RulesModal } from "./components/RulesModal";
import { SettingsModal } from "./components/SettingsModal";
import { SettingsButton } from "./components/SettingsButton";
import { DiceTray } from "./components/DiceTray";
import { FeedbackToast } from "./components/FeedbackToast";
import { HoldToEndGameButton } from "./components/HoldToEndGameButton";
import { StartMenu } from "./components/StartMenu";
import { RulesButton } from "./components/RulesButton";
import { Row } from "./components/Row";
import {
  createRollingTurn,
  didFarkle,
  getActiveDice,
  getSelectedDice,
  holdSelectedAndRollActive,
  rollNewDice,
  toggleDieSelection,
  type TurnState,
} from "./game/turn";
import {
  isSoundMuted,
  playSound,
  primeSounds,
  setSoundMuted,
} from "./game/sound";
import { useComputerTurn } from "./hooks/useComputerTurn";
import { diceValuesText } from "./game/diceText";
import {
  ACTION_MESSAGE_DELAY_MS,
  DEFAULT_TARGET_SCORE,
  SCORE_DELTA_DELAY_MS,
  TURN_SWITCH_DELAY_MS,
} from "./appConstants";

function App() {
  const [turn, setTurn] = useState<TurnState>(rollNewDice);
  const previousPlayerRef = useRef<PlayerId | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("player");
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE);
  const [isMuted, setIsMuted] = useState(isSoundMuted);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("computer");

  const [playerScore, setPlayerScore] = useState<PlayerScores>({
    player: 0,
    player2: 0,
  });

  const [roundScore, setRoundScore] = useState(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [roundScoreDelta, setRoundScoreDelta] = useState(0);
  const [totalScoreDelta, setTotalScoreDelta] = useState(0);
  const [isTurnChanging, setIsTurnChanging] = useState(false);
  const [rerollCount, setRerollCount] = useState(0);

  const dice = turn.dice;
  const selectedDice = getSelectedDice(dice);
  const selectedScoreResult = scoreDice(selectedDice.map((die) => die.value));
  const selectedScore = selectedScoreResult.score;
  const selectedDiceAreValid = selectedScoreResult.allDiceScore;
  const hasFarkled = turn.status === "farkled";
  const isComputerControlledTurn =
    gameMode === "computer" && currentPlayer === "player2";
  const playerLabels: Record<PlayerId, string> =
    gameMode === "local"
      ? { player: "Player 1", player2: "Player 2" }
      : { player: "You", player2: "Computer" };
  const turnLabel =
    gameMode === "computer" && currentPlayer === "player"
      ? "Your Turn"
      : `${playerLabels[currentPlayer]} Turn`;
  const turnBannerClasses =
    currentPlayer === "player"
      ? "border-blue-300 bg-blue-500 text-white"
      : "border-purple-300 bg-purple-500 text-white";
  const feedbackMessage = winner
    ? `${playerLabels[winner]} wins!`
    : hasFarkled
      ? "Farkle!"
      : actionMessage;
  const feedbackMessageVariant = winner
    ? winner === "player2" && gameMode === "computer"
      ? "danger"
      : "success"
    : hasFarkled
      ? "danger"
      : "default";
  const actionDisabledReason = winner
    ? `${playerLabels[winner]} won the game. Reset to play again.`
    : hasFarkled
      ? "You farkled. End your turn."
      : selectedDice.length === 0
        ? "Select scoring dice first."
        : !selectedDiceAreValid
          ? "Every selected die must contribute to the score."
          : undefined;

  function switchTurn() {
    setCurrentPlayer((prev) => (prev === "player" ? "player2" : "player"));
    setRoundScore(0);
    setRerollCount(0);
    playSound("roll");
    setTurn(rollNewDice());
  }

  function holdDice() {
    if (winner || isTurnChanging || hasFarkled || !selectedDiceAreValid) {
      return;
    }

    const nextDice = holdSelectedAndRollActive(dice);
    const nextActiveDice = getActiveDice(nextDice);

    // rerolls if all die have been held
    if (nextActiveDice.length === 0) {
      const nextRoll = rollNewDice();

      if (isComputerControlledTurn) {
        console.info("[Computer] Held dice and rolled hot dice", {
          heldScore: selectedScore,
          nextRoll: diceValuesText(nextRoll.dice),
          nextStatus: nextRoll.status,
        });
      }

      setActionMessage("Held");
      playSound("roll");
      setRoundScoreDelta(selectedScore);
      setRerollCount((prev) => prev + 1);
      setRoundScore((prev) => prev + selectedScore);
      setTurn(nextRoll);
      return;
    }

    const nextStatus = didFarkle(nextDice) ? "farkled" : "rolling";

    if (isComputerControlledTurn) {
      console.info("[Computer] Held dice and rerolled", {
        heldScore: selectedScore,
        nextActiveDice: diceValuesText(getActiveDice(nextDice)),
        nextStatus,
      });
    }

    setTurn({
      dice: nextDice,
      status: nextStatus,
    });

    playSound("roll");
    if (nextStatus === "rolling") {
      setActionMessage("Held");
      setRoundScoreDelta(selectedScore);
      setRerollCount((prev) => prev + 1);
    }

    setRoundScore((prev) =>
      nextStatus === "farkled" ? 0 : prev + selectedScore,
    );
  }
  function selectDie(id: number) {
    if (winner || isTurnChanging || hasFarkled || isComputerControlledTurn) {
      return;
    }

    playSound("select");
    setTurn((prev) => ({
      ...prev,
      dice: toggleDieSelection(prev.dice, id),
    }));
  }

  function endTurn() {
    if (winner || isTurnChanging || (!hasFarkled && !selectedDiceAreValid)) {
      return;
    }

    const bankedScore = hasFarkled ? 0 : roundScore + selectedScore;
    const willWin = playerScore[currentPlayer] + bankedScore >= targetScore;

    if (!hasFarkled) {
      playSound(
        willWin && isComputerControlledTurn ? "lose" : willWin ? "win" : "bank",
      );

      if (isComputerControlledTurn) {
        console.info("[Computer] Banked turn", {
          roundScore,
          selectedScore,
          bankedScore,
          newTotal: playerScore.player2 + bankedScore,
        });
      }

      setActionMessage("Banked");
      setTotalScoreDelta(bankedScore);
      setPlayerScore((prev) => {
        const nextScore = prev[currentPlayer] + bankedScore;

        return {
          ...prev,
          [currentPlayer]: nextScore,
        };
      });
    }

    if (willWin) {
      setWinner(currentPlayer);
      setRoundScore(0);
      setTurn(createRollingTurn());
      return;
    }

    setIsTurnChanging(true);
  }

  function resetGame(message = winner ? "New Game" : "Game Reset") {
    setPlayerScore({
      player: 0,
      player2: 0,
    });
    setCurrentPlayer("player");
    setWinner(null);
    playSound("roll");
    setTurn(rollNewDice());
    setRoundScore(0);
    setActionMessage(message);
    setRoundScoreDelta(0);
    setTotalScoreDelta(0);
    setIsTurnChanging(false);
    setRerollCount(0);
  }

  function handleMuteChange(nextIsMuted: boolean) {
    setIsMuted(nextIsMuted);
    setSoundMuted(nextIsMuted);
  }

  function startGame() {
    primeSounds();
    setHasStartedGame(true);
    playSound("roll");
  }

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function backToMenu() {
    setIsSettingsOpen(false);
    setHasStartedGame(false);
    resetGame("Back to Menu");
  }

  useEffect(() => {
    const previousPlayer = previousPlayerRef.current;
    previousPlayerRef.current = currentPlayer;

    if (
      !isComputerControlledTurn ||
      previousPlayer === "player2" ||
      winner
    ) {
      return;
    }

    console.info("[Computer] Turn started", {
      computerScore: playerScore.player2,
      playerScore: playerScore.player,
      targetScore,
      roll: diceValuesText(dice),
    });
  }, [
    currentPlayer,
    dice,
    isComputerControlledTurn,
    playerScore,
    targetScore,
    winner,
  ]);

  useComputerTurn({
    currentPlayer,
    dice,
    endTurn,
    hasFarkled,
    holdDice,
    isEnabled: gameMode === "computer",
    isTurnChanging,
    playerScore,
    rerollCount,
    roundScore,
    selectedDice,
    selectedScore,
    setTurn,
    targetScore,
    winner,
  });

  useEffect(() => {
    if (!hasFarkled || winner || isTurnChanging) return;

    playSound("farkle");
    const timeout = setTimeout(() => {
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
    }, TURN_SWITCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [hasFarkled, winner, isTurnChanging]);

  useEffect(() => {
    if (!isTurnChanging) return;

    const timeout = setTimeout(() => {
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
      setIsTurnChanging(false);
    }, TURN_SWITCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isTurnChanging]);

  useEffect(() => {
    if (!actionMessage) return;

    const timeout = setTimeout(() => {
      setActionMessage("");
    }, ACTION_MESSAGE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [actionMessage]);

  useEffect(() => {
    if (roundScoreDelta === 0 && totalScoreDelta === 0) return;

    const timeout = setTimeout(() => {
      setRoundScoreDelta(0);
      setTotalScoreDelta(0);
    }, SCORE_DELTA_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [roundScoreDelta, totalScoreDelta]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-start gap-4 bg-zinc-900 px-3 py-16 text-white sm:justify-center sm:gap-8 sm:px-4 sm:py-8">
      {!hasStartedGame && (
        <StartMenu
          gameMode={gameMode}
          isMuted={isMuted}
          onGameModeChange={setGameMode}
          onMuteChange={handleMuteChange}
          onOpenRules={() => setIsRulesOpen(true)}
          onStart={startGame}
          onTargetScoreChange={setTargetScore}
          targetScore={targetScore}
        />
      )}
      <SettingsButton onClick={openSettings} />
      {isSettingsOpen && (
        <SettingsModal
          isMuted={isMuted}
          onBackToMenu={backToMenu}
          onClose={() => setIsSettingsOpen(false)}
          onMuteChange={handleMuteChange}
        />
      )}
      <PlayerBoard
        targetScore={targetScore}
        currentPlayer={currentPlayer}
        playerScores={playerScore}
        playerLabels={playerLabels}
      />
      <ScoreBoard
        currentPlayer={currentPlayer}
        playerScores={playerScore}
        roundScore={roundScore}
        roundScoreDelta={roundScoreDelta}
        selectedScore={selectedScore}
        totalScoreDelta={totalScoreDelta}
      />

      <p
        className={`rounded-xl border-2 px-4 py-1.5 text-base font-black uppercase tracking-wide shadow-lg sm:px-5 sm:py-2 sm:text-lg ${turnBannerClasses}`}
      >
        {turnLabel}
      </p>

      <DiceTray
        currentPlayer={currentPlayer}
        dice={dice}
        isTurnChanging={isTurnChanging}
        onSelectDie={selectDie}
        rerollCount={hasStartedGame ? rerollCount : -1}
      />
      <FeedbackToast
        message={feedbackMessage}
        variant={feedbackMessageVariant}
      />
      <Row>
        <Button
          onClick={holdDice}
          disabled={
            Boolean(winner) ||
            isTurnChanging ||
            isComputerControlledTurn ||
            hasFarkled ||
            !selectedDiceAreValid
          }
          title={actionDisabledReason}
          color="blue"
        >
          Hold & Reroll
        </Button>
        <Button
          onClick={endTurn}
          disabled={
            Boolean(winner) ||
            isTurnChanging ||
            isComputerControlledTurn ||
            hasFarkled ||
            !selectedDiceAreValid
          }
          title={actionDisabledReason}
          color="yellow"
        >
          Bank & End Turn
        </Button>
      </Row>
      <Row>
        <RulesButton onClick={() => setIsRulesOpen(true)} />
        {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}
        <HoldToEndGameButton onReset={resetGame} winner={winner} />
      </Row>
    </div>
  );
}

export default App;
