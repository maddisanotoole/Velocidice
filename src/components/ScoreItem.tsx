import { TextSize, type TextSizeType } from "../types";

type ScoreItemProps = {
  label: string;
  value: number | string;
  delta?: number;
  textSize?: TextSizeType;
  active?: boolean;
};

const textSizeClasses = {
  [TextSize.SMALL]: {
    label: "text-xs",
    value: "text-lg sm:text-xl",
  },
  [TextSize.NORMAL]: {
    label: "text-sm",
    value: "text-2xl sm:text-3xl",
  },
} as const;

export function ScoreItem({
  label,
  value,
  delta = 0,
  textSize = TextSize.NORMAL,
  active = false,
}: ScoreItemProps) {
  const sizeClasses = textSizeClasses[textSize];

  return (
    <div
      className={`grid grid-rows-[1.25rem_auto_1.25rem] place-items-center rounded-lg px-2 py-1 transition-colors sm:px-3 sm:py-2 ${
        active ? "bg-yellow-400" : ""
      }`}
    >
      <span
        className={`flex min-h-5 items-center ${sizeClasses.label} uppercase tracking-wide ${
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

      <span
        className={`flex min-h-5 items-center text-sm font-black ${
          delta > 0
            ? active
              ? "text-green-950"
              : "text-green-400"
            : "text-transparent"
        }`}
      >
        +{delta}
      </span>
    </div>
  );
}
