import { useEffect } from "react";
import { GITHUB_REPOSITORY_URL, TARGET_SCORE_OPTIONS } from "../appConstants";
import soundOffIcon from "../assets/sound_off.svg";
import soundOnIcon from "../assets/sound_on.svg";
import Button from "./GameButton";

type SettingsModalProps = {
  isMuted: boolean;
  onApplyTargetScore: () => void;
  onClose: () => void;
  onMuteChange: (isMuted: boolean) => void;
  onPendingTargetScoreChange: (targetScore: number) => void;
  pendingTargetScore: number;
  currentTargetScore: number;
};

function getClosestTargetScore(value: number): number {
  return TARGET_SCORE_OPTIONS.reduce((closest, option) =>
    Math.abs(option - value) < Math.abs(closest - value) ? option : closest,
  );
}

export function SettingsModal({
  isMuted,
  onApplyTargetScore,
  onClose,
  onMuteChange,
  onPendingTargetScoreChange,
  pendingTargetScore,
  currentTargetScore,
}: SettingsModalProps) {
  const targetScoreChanged = pendingTargetScore !== currentTargetScore;

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
        className="w-full max-w-md rounded-xl bg-zinc-800 p-4 text-white shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Settings</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Adjust game preferences.
            </p>
          </div>

          <Button onClick={onClose} color="red">
            Close
          </Button>
        </div>

        <div className="space-y-6">
          <section className="flex items-center justify-between gap-4 rounded-lg border border-zinc-700 px-4 py-3">
            <span>
              <span className="block font-bold">Mute Sound</span>
              <span className="block text-sm text-zinc-400">
                Turn off game sound effects.
              </span>
            </span>
            <button
              aria-label={isMuted ? "Turn sound on" : "Mute sound"}
              className="rounded-full bg-zinc-950 p-3 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
              onClick={() => onMuteChange(!isMuted)}
              title={isMuted ? "Turn sound on" : "Mute sound"}
              type="button"
            >
              <img
                alt=""
                className="h-6 w-6"
                src={isMuted ? soundOffIcon : soundOnIcon}
              />
            </button>
          </section>

          <section className="rounded-lg border border-zinc-700 px-4 py-3">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">Target Score</h3>
                <p className="text-sm text-zinc-400">
                  Slider snaps to supported scores only.
                </p>
              </div>
              <span className="text-lg font-black text-white">
                {pendingTargetScore}
              </span>
            </div>

            <input
              className="w-full accent-blue-500"
              list="target-score-options"
              max={TARGET_SCORE_OPTIONS[TARGET_SCORE_OPTIONS.length - 1]}
              min={TARGET_SCORE_OPTIONS[0]}
              onChange={(event) =>
                onPendingTargetScoreChange(
                  getClosestTargetScore(Number(event.target.value)),
                )
              }
              step={1}
              type="range"
              value={pendingTargetScore}
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

            {targetScoreChanged && (
              <div className="mt-4 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-100">
                <p className="mb-3 font-bold">
                  Changing target score starts a new game and clears progress.
                </p>
                <div className="flex justify-center">
                  <Button onClick={onApplyTargetScore} color="yellow">
                    Apply & Start New Game
                  </Button>
                </div>
              </div>
            )}
          </section>

          <a
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 font-bold text-white transition-colors hover:bg-zinc-700"
            href={GITHUB_REPOSITORY_URL}
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
