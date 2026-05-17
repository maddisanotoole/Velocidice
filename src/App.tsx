import { useState } from "react";
import { rollDie } from "./game/dice";

function App() {
  const [dice, setDice] = useState([1, 1, 1, 1, 1, 1]);

  function rollDice() {
    const newDice = Array.from({ length: 6 }, () => rollDie());

    setDice(newDice);
  }
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8">
      <body>
        <div className="flex gap-4">
          {dice.map((value, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-white text-black rounded-xl flex items-center justify-center text-2xl font-bold"
            >
              {value}
            </div>
          ))}
        </div>
        <button
          onClick={rollDice}
          className="bg-green-500 px-6 py-3 rounded-xl font-bold"
        >
          Roll Dice
        </button>
      </body>
    </div>
  );
}

export default App;
