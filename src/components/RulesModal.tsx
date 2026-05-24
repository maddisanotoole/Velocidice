import { useEffect } from "react";
import Button from "./GameButton";

type RulesModalProps = {
  onClose: () => void;
};

const scoringRules = [
  ["Single 1", "100 points"],
  ["Single 5", "50 points"],
  ["Three pairs", "750 points"],
  ["Five-die straight", "1,000 points"],
  ["Six-die straight", "1,500 points"],
  ["Three 1s", "1,000 points"],
  ["Three of a kind", "Face value x 100"],
  ["Four of a kind", "Three-of-a-kind score x 2"],
  ["Five of a kind", "Three-of-a-kind score x 3"],
  ["Six of a kind", "Three-of-a-kind score x 4"],
];

const turnSteps = [
  "Roll the dice.",
  "Select dice that score points.",
  "Hold and reroll to build your round score, or bank to save your points.",
  "If you roll no scoring dice, you Farkle and lose your unbanked round score.",
];

const validSelectionExamples = [
  ["1", "Valid: scores 100"],
  ["5", "Valid: scores 50"],
  ["1-5", "Valid: both dice score"],
  ["1-2", "Invalid: the 2 does not score"],
  ["2-2-2", "Valid: three 2s score 200"],
];

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
            <h3 className="mb-2 text-lg font-black text-white">
              Score Areas
            </h3>
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
            <div className="mt-3 divide-y divide-zinc-700 overflow-hidden rounded-lg border border-zinc-700">
              {validSelectionExamples.map(([dice, result]) => (
                <div
                  className="grid gap-1 px-4 py-2 sm:grid-cols-[1fr_auto] sm:gap-4"
                  key={dice}
                >
                  <span className="font-bold text-zinc-100">{dice}</span>
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
          {scoringRules.map(([label, value]) => (
            <div
              className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:gap-4"
              key={label}
            >
              <span className="font-bold text-zinc-100">{label}</span>
              <span className="text-zinc-300 sm:text-right">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
