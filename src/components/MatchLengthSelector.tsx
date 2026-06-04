import { MATCH_LENGTH_OPTIONS } from "../appConstants";
import { playSound } from "../game/sound";
import { cx, theme } from "../theme/classes";
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
  function changeMatchLength(nextMatchLength: MatchLength) {
    if (nextMatchLength !== matchLength) {
      playSound("select");
    }

    onMatchLengthChange(nextMatchLength);
  }

  return (
    <section className={theme.panel.section}>
      <h2 className="font-bold">Match Length</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {MATCH_LENGTH_OPTIONS.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => changeMatchLength(option)}
            className={cx(
              theme.option.base,
              "px-2 py-3 text-xs sm:text-sm",
              matchLength === option
                ? theme.option.selected
                : theme.option.unselected,
            )}
          >
            {matchLengthLabels[option]}
          </button>
        ))}
      </div>
    </section>
  );
}
