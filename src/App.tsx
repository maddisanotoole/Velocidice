import { useState } from "react";
import { initializeDice, rollDie } from "./game/dice";
import Button from "./components/GameButton";
import { DieStatus, type PlayerId, type Die, type PlayerScores } from "./types";
import { DieFace } from "./components/DiceFace";
import { ScoreBoard } from "./components/ScoreBoard";
import { scoreDice } from "./game/scoring";
import { PlayerBoard } from "./components/PlayerBoard";

const WINNING_SCORE = 5000;

type TurnStatus = "rolling" | "farkled";

type TurnState = {
  dice: Die[];
  status: TurnStatus;
};

function didFarkle(dice: Die[]): boolean {
  const activeDice = dice.filter((die) => die.status === DieStatus.ACTIVE);

  return (
    activeDice.length > 0 &&
    scoreDice(activeDice.map((die) => die.value)).score === 0
  );
}

function rollNewDice(): TurnState {
  const dice = initializeDice();

  return {
    dice,
    status: didFarkle(dice) ? "farkled" : "rolling",
  };
}

function App() {
  const [turn, setTurn] = useState<TurnState>(rollNewDice);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("human");
  const [winner, setWinner] = useState<PlayerId | null>(null);

  const [playerScore, setPlayerScore] = useState<PlayerScores>({
    human: 0,
    computer: 0,
  });

  const [roundScore, setRoundScore] = useState(0);

  const dice = turn.dice;
  const selectedDice = dice.filter((die) => die.status === DieStatus.SELECTED);
  const selectedScoreResult = scoreDice(selectedDice.map((die) => die.value));
  const selectedScore = selectedScoreResult.score;
  const selectedDiceAreValid = selectedScoreResult.allDiceScore;
  const hasFarkled = turn.status === "farkled";
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
    setCurrentPlayer((prev) => (prev === "human" ? "computer" : "human"));
    setRoundScore(0);
    setTurn(rollNewDice());
  }

  function holdDice() {
    if (winner || hasFarkled || !selectedDiceAreValid) {
      return;
    }

    const nextDice = dice.map((die) => {
      if (die.status === DieStatus.SELECTED) {
        return { ...die, status: DieStatus.HELD };
      }

      if (die.status === DieStatus.ACTIVE) {
        return { ...die, value: rollDie() };
      }

      return die;
    });
    const nextActiveDice = nextDice.filter(
      (die) => die.status === DieStatus.ACTIVE,
    );

    // rerolls if all die have been held
    if (nextActiveDice.length === 0) {
      const nextRoll = rollNewDice();

      setRoundScore((prev) => prev + selectedScore);
      setTurn(nextRoll);
      return;
    }

    const nextStatus = didFarkle(nextDice) ? "farkled" : "rolling";

    setTurn({
      dice: nextDice,
      status: nextStatus,
    });
    setRoundScore((prev) =>
      nextStatus === "farkled" ? 0 : prev + selectedScore,
    );
  }
  function selectDie(id: number) {
    if (winner || hasFarkled) {
      return;
    }

    setTurn((prev) => ({
      ...prev,
      dice: prev.dice.map((die) =>
        die.id === id
          ? {
              ...die,
              status:
                die.status === DieStatus.HELD
                  ? die.status
                  : die.status === DieStatus.SELECTED
                    ? DieStatus.ACTIVE
                    : DieStatus.SELECTED,
            }
          : die,
      ),
    }));
  }

  function endTurn() {
    if (winner || (!hasFarkled && !selectedDiceAreValid)) {
      return;
    }

    const bankedScore = hasFarkled ? 0 : roundScore + selectedScore;

    if (!hasFarkled) {
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
      setTurn({
        dice: initializeDice(),
        status: "rolling",
      });
      return;
    }

    switchTurn();
  }

  function resetGame() {
    setPlayerScore({
      human: 0,
      computer: 0,
    });
    setCurrentPlayer("human");
    setWinner(null);
    setTurn(rollNewDice());
    setRoundScore(0);
  }
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <PlayerBoard currentPlayer={currentPlayer} playerScores={playerScore} />
      <ScoreBoard
        currentPlayer={currentPlayer}
        playerScores={playerScore}
        roundScore={roundScore}
        selectedScore={selectedScore}
      />

      <div className="flex gap-4">
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
      <div className="flex gap-4">
        <Button
          onClick={holdDice}
          disabled={Boolean(winner) || hasFarkled || !selectedDiceAreValid}
          title={actionDisabledReason}
          color="blue"
        >
          Hold & Reroll
        </Button>
        <Button
          onClick={endTurn}
          disabled={Boolean(winner) || (!hasFarkled && !selectedDiceAreValid)}
          title={actionDisabledReason}
          color="yellow"
        >
          End Turn
        </Button>
      </div>
      <Button onClick={resetGame} color="red">
        End Game
      </Button>
    </div>
  );
}

export default App;
