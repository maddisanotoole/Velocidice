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

  const selectedDice = dice.filter((die) => die.status === DieStatus.SELECTED);
  const selectedScore = scoreDice(selectedDice.map((die) => die.value));
  function holdDice() {
    setDice((prev) =>
      prev.map((die) =>
        die.status === DieStatus.SELECTED
          ? { ...die, status: DieStatus.HELD }
          : die,
      ),
    );
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

  function rollDice() {
    const newDice: Die[] = dice.map((d) => {
      if (d.status == DieStatus.ACTIVE) {
        d.value = rollDie();
      }
      return d;
    });

    setDice(newDice);
  }

  function resetGame() {
    setDice(initializeDice());
  }
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <ScoreBoard
        totalScore={totalScore}
        roundScore={roundScore}
        selectedScore={selectedScore}
      />{" "}
      <div className="flex gap-4">
        {dice.map((die) => (
          <DieFace onClick={() => selectDie(die.id)} die={die}></DieFace>
        ))}
      </div>
      <div className="flex gap-4">
        <Button onClick={holdDice} disabled={selectedScore === 0} color="blue">
          Hold
        </Button>
        <Button onClick={rollDice} disabled={selectedScore === 0} color="green">
          Roll Dice
        </Button>
      </div>
      <Button onClick={resetGame} color="yellow">
        Reset
      </Button>
    </div>
  );
}

export default App;
