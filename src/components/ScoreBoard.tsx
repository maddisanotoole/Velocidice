type ScoreBoardProps = {
  totalScore: number;
  roundScore: number;
  selectedScore: number;
};

type ScoreItemProps = {
  label: string;
  value: number;
};

function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm uppercase text-zinc-400 tracking-wide">
        {label}
      </span>

      <span className="text-3xl font-black text-white">{value}</span>
    </div>
  );
}

export function ScoreBoard({
  totalScore,
  roundScore,
  selectedScore,
}: ScoreBoardProps) {
  return (
    <div
      className="
        flex
        gap-8
        bg-zinc-800
        rounded-2xl
        px-8
        py-6
        shadow-xl
      "
    >
      <ScoreItem label="Total" value={totalScore} />

      <ScoreItem label="Round" value={roundScore} />

      <ScoreItem label="Selected" value={selectedScore} />
    </div>
  );
}
