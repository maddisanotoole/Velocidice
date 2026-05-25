import { TARGET_SCORE_OPTIONS } from "../appConstants";

type TargetScoreSliderProps = {
  onTargetScoreChange: (targetScore: number) => void;
  targetScore: number;
};

function getClosestTargetScore(value: number): number {
  return TARGET_SCORE_OPTIONS.reduce((closest, option) =>
    Math.abs(option - value) < Math.abs(closest - value) ? option : closest,
  );
}

export function TargetScoreSlider({
  onTargetScoreChange,
  targetScore,
}: TargetScoreSliderProps) {
  return (
    <>
      <input
        className="w-full accent-blue-500"
        list="target-score-options"
        max={TARGET_SCORE_OPTIONS[TARGET_SCORE_OPTIONS.length - 1]}
        min={TARGET_SCORE_OPTIONS[0]}
        onChange={(event) =>
          onTargetScoreChange(getClosestTargetScore(Number(event.target.value)))
        }
        step={1}
        type="range"
        value={targetScore}
      />
      <datalist id="target-score-options">
        {TARGET_SCORE_OPTIONS.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <div className="mt-2 flex justify-between text-xs font-bold text-zinc-400">
        {TARGET_SCORE_OPTIONS.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    </>
  );
}
