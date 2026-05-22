import { TextSize, type TextSizeType } from "../types";

type ScoreItemProps = {
  label: string;
  value: number | string;
  textSize?: TextSizeType;
  active?: boolean;
};

const textSizeClasses = {
  [TextSize.SMALL]: {
    label: "text-xs",
    value: "text-xl",
  },
  [TextSize.NORMAL]: {
    label: "text-sm",
    value: "text-3xl",
  },
} as const;

export function ScoreItem({
  label,
  value,
  textSize = TextSize.NORMAL,
  active = false,
}: ScoreItemProps) {
  const sizeClasses = textSizeClasses[textSize];

  return (
    <div
      className={`flex flex-col items-center rounded-lg px-3 py-2 transition-colors ${
        active ? "bg-yellow-400" : ""
      }`}
    >
      <span
        className={`${sizeClasses.label} uppercase tracking-wide ${
          active ? "text-zinc-950" : "text-zinc-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`${sizeClasses.value} font-black capitalize ${
          active ? "text-zinc-950" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
