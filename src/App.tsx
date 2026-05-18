import { useState } from "react";
import { initializeDice, rollDie } from "./game/dice";
import Button from "./components/button";
import { DieStatus, type Die } from "./types";
import { DieFace } from "./components/dice";

function App() {
  const [dice, setDice] = useState<Die[]>(initializeDice());

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
      <div className="flex gap-4">
        {dice.map((die) => (
          <DieFace onClick={() => selectDie(die.id)} die={die}></DieFace>
        ))}
      </div>

      <Button onClick={holdDice} color="blue">
        Hold
      </Button>
      <Button onClick={rollDice} color="green">
        Roll Dice
      </Button>
      <Button onClick={resetGame} color="yellow">
        Reset
      </Button>
    </div>
  );
}

export default App;
