import { MATCH_LENGTH_OPTIONS } from "../appConstants";
import type { MatchLength } from "../types";

type MatchLengthSelectorProps = {
  matchLength: MatchLength;
  onMatchLengthChange: (matchLength: MatchLength) => void;
};

const matchLengthLabels: Record<MatchLength, string> = {
  1: "Single",
  3: "Best of 3",
  10: "Best of 10",
};

export function MatchLengthSelector({
  matchLength,
  onMatchLengthChange,
}: MatchLengthSelectorProps) {
  return (
    <section className="mt-5 rounded-lg border border-zinc-700 px-3 py-3 sm:mt-6 sm:px-4">
      <h2 className="font-bold">Match Length</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {MATCH_LENGTH_OPTIONS.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onMatchLengthChange(option)}
            className={`rounded-lg border px-2 py-3 text-xs font-black uppercase transition-colors sm:text-sm ${
              matchLength === option
                ? "border-purple-300 bg-purple-500 text-white"
                : "border-zinc-600 bg-zinc-900 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {matchLengthLabels[option]}
          </button>
        ))}
      </div>
    </section>
  );
}
