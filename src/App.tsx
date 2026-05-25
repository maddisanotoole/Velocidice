import { useEffect, useRef, useState } from "react";
import Button from "./components/GameButton";
import { type PlayerId, type PlayerScores } from "./types";
import { ScoreBoard } from "./components/ScoreBoard";
import { scoreDice } from "./game/scoring";
import { PlayerBoard } from "./components/PlayerBoard";
import { RulesModal } from "./components/RulesModal";
import { SettingsModal } from "./components/SettingsModal";
import { SettingsButton } from "./components/SettingsButton";
import { DiceTray } from "./components/DiceTray";
import { FeedbackToast } from "./components/FeedbackToast";
import { HoldToEndGameButton } from "./components/HoldToEndGameButton";
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
import { isSoundMuted, playSound, setSoundMuted } from "./game/sound";
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

  const [playerScore, setPlayerScore] = useState<PlayerScores>({
    player: 0,
    computer: 0,
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
  const isComputerTurn = currentPlayer === "computer";
  const turnLabel = currentPlayer === "player" ? "Your Turn" : "Computer Turn";
  const turnBannerClasses =
    currentPlayer === "player"
      ? "border-blue-300 bg-blue-500 text-white"
      : "border-purple-300 bg-purple-500 text-white";
  const feedbackMessage = winner
    ? `${winner} wins!`
    : hasFarkled
      ? "Farkle!"
      : actionMessage;
  const feedbackMessageVariant = winner
    ? winner === "computer"
      ? "danger"
      : "success"
    : hasFarkled
      ? "danger"
      : "default";
  const actionDisabledReason = winner
    ? `${winner} won the game. Reset to play again.`
    : hasFarkled
      ? "You farkled. End your turn."
      : selectedDice.length === 0
        ? "Select scoring dice first."
        : !selectedDiceAreValid
          ? "Every selected die must contribute to the score."
          : undefined;

  function switchTurn() {
    setCurrentPlayer((prev) => (prev === "player" ? "computer" : "player"));
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

      if (isComputerTurn) {
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

    if (isComputerTurn) {
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
    if (winner || isTurnChanging || hasFarkled || isComputerTurn) {
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
        willWin ? (currentPlayer === "computer" ? "lose" : "win") : "bank",
      );

      if (isComputerTurn) {
        console.info("[Computer] Banked turn", {
          roundScore,
          selectedScore,
          bankedScore,
          newTotal: playerScore.computer + bankedScore,
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

  function resetGame() {
    const message = winner ? "New Game" : "Game Reset";

    setPlayerScore({
      player: 0,
      computer: 0,
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

  useEffect(() => {
    const previousPlayer = previousPlayerRef.current;
    previousPlayerRef.current = currentPlayer;

    if (!isComputerTurn || previousPlayer === "computer" || winner) return;

    console.info("[Computer] Turn started", {
      computerScore: playerScore.computer,
      playerScore: playerScore.player,
      targetScore,
      roll: diceValuesText(dice),
    });
  }, [currentPlayer, dice, isComputerTurn, playerScore, targetScore, winner]);

  useComputerTurn({
    currentPlayer,
    dice,
    endTurn,
    hasFarkled,
    holdDice,
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
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      {isSettingsOpen && (
        <SettingsModal
          isMuted={isMuted}
          onClose={() => setIsSettingsOpen(false)}
          onMuteChange={handleMuteChange}
          onTargetScoreChange={setTargetScore}
          targetScore={targetScore}
        />
      )}
      <PlayerBoard
        targetScore={targetScore}
        currentPlayer={currentPlayer}
        playerScores={playerScore}
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
        className={`rounded-xl border-2 px-5 py-2 text-lg font-black uppercase tracking-wide shadow-lg ${turnBannerClasses}`}
      >
        {turnLabel}
      </p>

      <DiceTray
        currentPlayer={currentPlayer}
        dice={dice}
        isTurnChanging={isTurnChanging}
        onSelectDie={selectDie}
        rerollCount={rerollCount}
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
            isComputerTurn ||
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
            isComputerTurn ||
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
        <Button onClick={() => setIsRulesOpen(true)} color="blue">
          Rules
        </Button>
        {isRulesOpen && <RulesModal onClose={() => setIsRulesOpen(false)} />}
        <HoldToEndGameButton onReset={resetGame} winner={winner} />
      </Row>
    </div>
  );
}

export default App;
