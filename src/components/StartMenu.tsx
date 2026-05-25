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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-xl bg-zinc-800 p-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-wide">
            VelociDice
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-zinc-400">
            Bank points, dodge Farkles, and race the computer to the target
            score.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={onStart} color="green">
            Start Game
          </Button>
        </div>
        <section className="mt-6 rounded-lg border border-zinc-700 px-4 py-3">
          <div className="mb-3 flex items-center justify-between gap-4">
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

        <div className="mt-6 flex items-center justify-center gap-4">
          <RulesButton onClick={onOpenRules} />
          <MuteButton isMuted={isMuted} onMuteChange={onMuteChange} />
        </div>
      </section>
    </div>
  );
}
