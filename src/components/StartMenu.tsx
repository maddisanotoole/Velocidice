import Button from "./GameButton";
import { MuteButton } from "./MuteButton";
import { RulesButton } from "./RulesButton";
import { TargetScoreSlider } from "./TargetScoreSlider";

type StartMenuProps = {
  isMuted: boolean;
  onMuteChange: (isMuted: boolean) => void;
  onOpenRules: () => void;
  onStart: () => void;
  onTargetScoreChange: (targetScore: number) => void;
  targetScore: number;
};

export function StartMenu({
  isMuted,
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
            Bank points, dodge Farkles, and race the computer to the target
            score.
          </p>
        </div>
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
          <MuteButton isMuted={isMuted} onMuteChange={onMuteChange} />
        </div>
      </section>
    </div>
  );
}
