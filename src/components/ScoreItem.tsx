import type { ScoreItemProps } from "../types";

export function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm uppercase text-zinc-400 tracking-wide">
        {label}
      </span>

      <span className="text-3xl font-black text-white">{value}</span>
    </div>
  );
}
