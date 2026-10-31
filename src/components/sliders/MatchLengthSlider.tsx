import { MATCH_LENGTH_OPTIONS } from "../../appConstants";
import { playSound } from "../../game/sound";
import { cx, theme } from "../../theme/classes";
import type { MatchLength } from "../../types";
import { MATCH_FORMAT_LABELS } from "../../game/match";

type MatchLengthSliderProps = {
  matchLength: MatchLength;
  onMatchLengthChange: (matchLength: MatchLength) => void;
};

export function MatchLengthSlider({
  matchLength,
  onMatchLengthChange,
}: MatchLengthSliderProps) {
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
            aria-pressed={matchLength === option}
            onClick={() => changeMatchLength(option)}
            className={cx(
              theme.option.base,
              "px-2 py-3 text-xs sm:text-sm",
              matchLength === option
                ? theme.option.selected
                : theme.option.unselected,
            )}
          >
            {MATCH_FORMAT_LABELS[option]}
          </button>
        ))}
      </div>
    </section>
  );
}
