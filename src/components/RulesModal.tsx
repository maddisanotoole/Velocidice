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

        <div className="mt-6 space-y-2 text-sm text-zinc-300">
          <p>After a Farkle, all unbanked round points are lost.</p>
          <p>
            If all dice are held, roll all six dice again and keep the round
            score.
          </p>
        </div>
      </section>
    </div>
  );
}
