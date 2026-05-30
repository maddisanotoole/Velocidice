import { useEffect } from "react";
import Button from "./GameButton";

type RulesModalProps = {
  onClose: () => void;
};

const miniPipPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: [
    "top-left",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-right",
  ],
} as const;

const miniPipClasses = {
  "top-left": "left-1.5 top-1.5",
  "top-right": "right-1.5 top-1.5",
  "middle-left": "left-1.5 top-1/2 -translate-y-1/2",
  "middle-right": "right-1.5 top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-1.5 left-1.5",
  "bottom-right": "bottom-1.5 right-1.5",
} as const;

const scoringRules = [
  { label: "Single 1", dice: [1], value: "100 points" },
  { label: "Single 5", dice: [5], value: "50 points" },
  { label: "Three pairs", dice: [1, 1, 2, 2, 3, 3], value: "750 points" },
  { label: "Five-die straight", dice: [1, 2, 3, 4, 5], value: "1,000 points" },
  {
    label: "Six-die straight",
    dice: [1, 2, 3, 4, 5, 6],
    value: "1,500 points",
  },
  { label: "Three 1s", dice: [1, 1, 1], value: "1,000 points" },
  { label: "Three of a kind", dice: [2, 2, 2], value: "Face value x 100" },
  {
    label: "Four of a kind",
    dice: [2, 2, 2, 2],
    value: "Three-of-a-kind score x 2",
  },
  {
    label: "Five of a kind",
    dice: [2, 2, 2, 2, 2],
    value: "Three-of-a-kind score x 3",
  },
  {
    label: "Six of a kind",
    dice: [2, 2, 2, 2, 2, 2],
    value: "Three-of-a-kind score x 4",
  },
];

const turnSteps = [
  "Roll the dice.",
  "Select dice that score points.",
  "Hold and reroll to build your round score, or bank to save your points.",
  "If you roll no scoring dice, you Farkle and lose your unbanked round score.",
];

const validSelectionExamples = [
  { dice: [1], result: "Valid: scores 100" },
  { dice: [5], result: "Valid: scores 50" },
  { dice: [1, 5], result: "Valid: both dice score" },
  { dice: [1, 2], result: "Invalid: the 2 does not score" },
  { dice: [2, 2, 2], result: "Valid: three 2s score 200" },
];

function MiniDie({ value }: { value: number }) {
  return (
    <span
      aria-label={`${value}`}
      className="relative inline-block h-6 w-6 shrink-0 rounded-md bg-white shadow"
    >
      {miniPipPositions[value as keyof typeof miniPipPositions].map(
        (position) => (
          <span
            className={`absolute h-1 w-1 rounded-full bg-zinc-950 ${miniPipClasses[position]}`}
            key={position}
          />
        ),
      )}
    </span>
  );
}

function MiniDiceGroup({ values }: { values: number[] }) {
  return (
    <span className="flex flex-wrap gap-1" aria-label={values.join(", ")}>
      {values.map((value, index) => (
        <MiniDie key={`${value}_${index}`} value={value} />
      ))}
    </span>
  );
}

export function RulesModal({ onClose }: RulesModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-zinc-800 p-4 text-white shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Rules</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Select only dice that contribute to the score.
            </p>
          </div>

          <Button onClick={onClose} color="red">
            Close
          </Button>
        </div>

        <div className="space-y-5 text-sm text-zinc-300">
          <section>
            <h3 className="mb-2 text-lg font-black text-white">Goal</h3>
            <p>
              Build points by selecting scoring dice, then bank before a Farkle
              wipes out your round score. First player to the target score wins.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-black text-white">How To Play</h3>
            <ol className="list-decimal space-y-1 pl-5">
              {turnSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-black text-white">Score Areas</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Total is banked and safe.</li>
              <li>Round is unbanked and at risk.</li>
              <li>Selected is the value of the dice currently selected.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-black text-white">
              Selecting Dice
            </h3>
            <p>
              Every selected die must contribute to the score. If one selected
              die does not score, you need to deselect it before holding or
              banking.
            </p>
            <p className="mt-2 text-amber-300">
              A selected die with a ! badge is selected, but is not adding
              points. Select another die to make it scoring, or unselect it.
            </p>
            <div className="mt-3 divide-y divide-zinc-700 overflow-hidden rounded-lg border border-zinc-700">
              {validSelectionExamples.map(({ dice, result }) => (
                <div
                  className="grid gap-1 px-4 py-2 sm:grid-cols-[1fr_auto] sm:gap-4"
                  key={`${dice.join("_")}_${result}`}
                >
                  <MiniDiceGroup values={dice} />
                  <span className="text-zinc-300 sm:text-right">{result}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-black text-white">Farkle</h3>
            <p>
              A Farkle happens when the active dice have no possible scoring
              dice. Your round score becomes 0, and the only available action is
              to end the turn.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-black text-white">Hot Dice</h3>
            <p>
              If all dice are held because they all scored, all six dice are
              rolled again and your round score stays active.
            </p>
          </section>
        </div>

        <h3 className="mb-3 mt-6 text-lg font-black text-white">
          Scoring Rules
        </h3>
        <div className="divide-y divide-zinc-700 overflow-hidden rounded-lg border border-zinc-700">
          {scoringRules.map(({ dice, label, value }) => (
            <div
              className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"
              key={label}
            >
              <span className="flex flex-col gap-1 font-bold text-zinc-100 sm:flex-row sm:items-center sm:gap-3">
                <MiniDiceGroup values={dice} />
                <span>{label}</span>
              </span>
              <span className="text-zinc-300 sm:text-right">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
