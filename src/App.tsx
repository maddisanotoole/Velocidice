import { useEffect, useState } from "react";
import Button from "./components/GameButton";
import { DieStatus, type PlayerId, type PlayerScores } from "./types";
import { DieFace } from "./components/DiceFace";
import { ScoreBoard } from "./components/ScoreBoard";
import { scoreDice } from "./game/scoring";
import { PlayerBoard } from "./components/PlayerBoard";
import { RulesModal } from "./components/RulesModal";
import { Row } from "./components/Row";
import {
  WINNING_SCORE,
  createRollingTurn,
  didFarkle,
  getActiveDice,
  getSelectedDice,
  holdSelectedAndRollActive,
  rollNewDice,
  toggleDieSelection,
  type TurnState,
} from "./game/turn";
import { chooseComputerDice, COMPUTER_BANK_THRESHOLD } from "./game/computer";

const COMPUTER_TURN_DELAY_MS = 1400;
const ACTION_MESSAGE_DELAY_MS = 1200;
const SCORE_DELTA_DELAY_MS = 1200;
const TURN_SWITCH_DELAY_MS = 1200;

function App() {
  const [turn, setTurn] = useState<TurnState>(rollNewDice);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("player");
  const [winner, setWinner] = useState<PlayerId | null>(null);

  const [playerScore, setPlayerScore] = useState<PlayerScores>({
    player: 0,
    computer: 0,
  });

  const [roundScore, setRoundScore] = useState(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [roundScoreDelta, setRoundScoreDelta] = useState(0);
  const [totalScoreDelta, setTotalScoreDelta] = useState(0);
  const [isTurnChanging, setIsTurnChanging] = useState(false);

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
  const actionDisabledReason = winner
    ? `${winner} won the game. Reset to play again.`
    : hasFarkled
      ? "You farkled. End your turn."
      : selectedDice.length === 0
        ? "Select scoring dice first."
        : !selectedDiceAreValid
          ? "Every selected die must contribute to the score."
          : undefined;

  useEffect(() => {
    if (!isComputerTurn || hasFarkled || winner || isTurnChanging) return;

    const timeout = setTimeout(() => {
      if (hasFarkled) {
        endTurn();
        return;
      }

      if (selectedDice.length === 0) {
        const selection = chooseComputerDice(dice);
        const selectedIds = new Set(selection.map((die) => die.id));

        if (selectedIds.size === 0) {
          endTurn();
          return;
        }

        setTurn((prev) => ({
          ...prev,
          dice: prev.dice.map((die) =>
            selectedIds.has(die.id)
              ? { ...die, status: DieStatus.SELECTED }
              : die,
          ),
        }));
        return;
      }

      if (roundScore + selectedScore >= COMPUTER_BANK_THRESHOLD) {
        endTurn();
        return;
      }

      holdDice();
    }, COMPUTER_TURN_DELAY_MS);

    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    if (!hasFarkled || winner || isTurnChanging) return;

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

  function switchTurn() {
    setCurrentPlayer((prev) => (prev === "player" ? "computer" : "player"));
    setRoundScore(0);
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

      setActionMessage("Held");
      setRoundScoreDelta(selectedScore);
      setRoundScore((prev) => prev + selectedScore);
      setTurn(nextRoll);
      return;
    }

    const nextStatus = didFarkle(nextDice) ? "farkled" : "rolling";

    setTurn({
      dice: nextDice,
      status: nextStatus,
    });

    if (nextStatus === "rolling") {
      setActionMessage("Held");
      setRoundScoreDelta(selectedScore);
    }

    setRoundScore((prev) =>
      nextStatus === "farkled" ? 0 : prev + selectedScore,
    );
  }
  function selectDie(id: number) {
    if (winner || isTurnChanging || hasFarkled || isComputerTurn) {
      return;
    }

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

    if (!hasFarkled) {
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

    if (playerScore[currentPlayer] + bankedScore >= WINNING_SCORE) {
      setWinner(currentPlayer);
      setRoundScore(0);
      setTurn(createRollingTurn());
      return;
    }

    setIsTurnChanging(true);
  }

  function resetGame() {
    setPlayerScore({
      player: 0,
      computer: 0,
    });
    setCurrentPlayer("player");
    setWinner(null);
    setTurn(rollNewDice());
    setRoundScore(0);
    setActionMessage("");
    setRoundScoreDelta(0);
    setTotalScoreDelta(0);
    setIsTurnChanging(false);
  }
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <a
        aria-label="View VelociDice on GitHub"
        className="fixed right-4 top-4 z-40 rounded-full bg-zinc-800 p-3 text-white shadow-lg transition-colors hover:bg-zinc-700 active:bg-zinc-600"
        href="https://github.com/maddisanotoole/Velocidice"
        rel="noreferrer"
        target="_blank"
        title="View on GitHub"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      </a>
      <PlayerBoard
        targetScore={WINNING_SCORE}
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

      <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4">
        {dice.map((die) => (
          <DieFace
            key={`die_${die.id}`}
            onClick={() => selectDie(die.id)}
            die={die}
          ></DieFace>
        ))}
      </div>
      {hasFarkled && (
        <p className="text-4xl font-black uppercase tracking-wide text-red-400">
          Farkle!
        </p>
      )}
      {winner && (
        <p className="text-4xl font-black uppercase tracking-wide text-green-400">
          {winner} wins!
        </p>
      )}
      {actionMessage && (
        <p className="pointer-events-none fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-xl bg-zinc-950/90 px-5 py-3 text-2xl font-black uppercase tracking-wide text-white shadow-2xl">
          {actionMessage}
        </p>
      )}
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
        <Button onClick={resetGame} color={winner ? "green" : "red"}>
          {winner ? "New Game " : "End Game"}
        </Button>
      </Row>
    </div>
  );
}

export default App;
