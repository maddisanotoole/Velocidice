import { useState } from "react";
import { initializeDice, rollDie } from "./game/dice";
import Button from "./components/GameButton";
import { DieStatus, type Die } from "./types";
import { DieFace } from "./components/DiceFace";
import { ScoreBoard } from "./components/ScoreBoard";
import { scoreDice } from "./game/scoring";

function App() {
  const [dice, setDice] = useState<Die[]>(initializeDice());
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [farkleMessage, setFarkleMessage] = useState("");

  const selectedDice = dice.filter((die) => die.status === DieStatus.SELECTED);
  const activeDice = dice.filter((die) => die.status === DieStatus.ACTIVE);
  const selectedScoreResult = scoreDice(selectedDice.map((die) => die.value));
  const possibleScoreResult = scoreDice(activeDice.map((die) => die.value));
  const selectedScore = selectedScoreResult.score;
  const selectedDiceAreValid = selectedScoreResult.allDiceScore;
  const possibleScore = possibleScoreResult.score;
  const isFarkle =
    activeDice.length > 0 && selectedDice.length === 0 && possibleScore === 0;
  const actionDisabledReason = isFarkle
    ? "You farkled. Start a new turn."
    : selectedDice.length === 0
      ? "Select scoring dice first."
      : !selectedDiceAreValid
        ? "Every selected die must contribute to the score."
        : undefined;

  function holdDice() {
    setFarkleMessage("");
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
    const nextPossibleScore = scoreDice(
      nextActiveDice.map((die) => die.value),
    ).score;

    if (nextActiveDice.length > 0 && nextPossibleScore === 0) {
      setFarkleMessage("Farkle!");
      setRoundScore(0);
      setDice(initializeDice());
      return;
    }

    setDice(nextDice);
    setRoundScore((prev) => prev + selectedScore);
  }
  function selectDie(id: number) {
    setDice((prev) =>
      prev.map((die) =>
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
    );
  }

  function endTurn() {
    setTotalScore(roundScore);
    setRoundScore(0);
    setFarkleMessage("");
    // setDice(initializeDice());
  }

  function resetGame() {
    setDice(initializeDice());
    setRoundScore(0);
    setFarkleMessage("");
  }
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <ScoreBoard
        totalScore={totalScore}
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
      {farkleMessage && (
        <p className="text-4xl font-black uppercase tracking-wide text-red-400">
          {farkleMessage}
        </p>
      )}
      <div className="flex gap-4">
        <Button
          onClick={holdDice}
          disabled={!selectedDiceAreValid || isFarkle}
          title={actionDisabledReason}
          color="blue"
        >
          Hold & Reroll
        </Button>
        <Button
          onClick={endTurn}
          disabled={!selectedDiceAreValid || isFarkle}
          title={actionDisabledReason}
          color="yellow"
        >
          End Turn
        </Button>
      </div>
      <Button onClick={resetGame} color="red">
        Reset
      </Button>
    </div>
  );
}

export default App;
