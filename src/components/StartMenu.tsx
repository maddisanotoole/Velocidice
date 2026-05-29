import Button from "./GameButton";
import { GITHUB_REPOSITORY_URL } from "../appConstants";
import { MuteButton } from "./MuteButton";
import { RulesButton } from "./RulesButton";
import { TargetScoreSlider } from "./TargetScoreSlider";
import type { GameMode } from "../types";

type StartMenuProps = {
  gameMode: GameMode;
  isMuted: boolean;
  onGameModeChange: (gameMode: GameMode) => void;
  onMuteChange: (isMuted: boolean) => void;
  onOpenRules: () => void;
  onStart: () => void;
  onTargetScoreChange: (targetScore: number) => void;
  targetScore: number;
};

export function StartMenu({
  gameMode,
  isMuted,
  onGameModeChange,
  onMuteChange,
  onOpenRules,
  onStart,
  onTargetScoreChange,
  targetScore,
}: StartMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950 px-3 py-4 text-white sm:px-4">
      <section className="w-full max-w-md rounded-xl bg-zinc-800 p-4 shadow-2xl sm:p-6">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-wide sm:text-4xl">
            VelociDice
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-zinc-400">
            Bank points, dodge Farkles, and race your opponent to the target
            score.
          </p>
        </div>
        <section className="mt-5 rounded-lg border border-zinc-700 px-3 py-3 sm:mt-6 sm:px-4">
          <h2 className="font-bold">Game Mode</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onGameModeChange("computer")}
              className={`rounded-lg border px-3 py-3 text-sm font-black uppercase transition-colors ${
                gameMode === "computer"
                  ? "border-purple-300 bg-purple-500 text-white"
                  : "border-zinc-600 bg-zinc-900 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Computer
            </button>
            <button
              type="button"
              onClick={() => onGameModeChange("local")}
              className={`rounded-lg border px-3 py-3 text-sm font-black uppercase transition-colors ${
                gameMode === "local"
                  ? "border-purple-300 bg-purple-500 text-white"
                  : "border-zinc-600 bg-zinc-900 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Local 2-Player
            </button>
          </div>
        </section>
        <div className="mt-5 flex justify-center sm:mt-6">
          <Button onClick={onStart} color="green">
            Start Game
          </Button>
        </div>
        <section className="mt-5 rounded-lg border border-zinc-700 px-3 py-3 sm:mt-6 sm:px-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Target Score</h2>
              <p className="text-sm text-zinc-400">
                Choose the score needed to win.
              </p>
            </div>
            <span className="text-lg font-black text-white">{targetScore}</span>
          </div>
          <TargetScoreSlider
            onTargetScoreChange={onTargetScoreChange}
            targetScore={targetScore}
          />
        </section>

        <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4">
          <RulesButton onClick={onOpenRules} />
          <a
            aria-label="Open GitHub repository"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href={GITHUB_REPOSITORY_URL}
            rel="noreferrer"
            target="_blank"
            title="GitHub"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <MuteButton isMuted={isMuted} onMuteChange={onMuteChange} />
        </div>
      </section>
    </div>
  );
}
