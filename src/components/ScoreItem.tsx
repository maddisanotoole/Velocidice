import { TextSize, type TextSizeType } from "../types";

type ScoreItemProps = {
  label: string;
  value: number | string;
  textSize?: TextSizeType;
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
}: ScoreItemProps) {
  const sizeClasses = textSizeClasses[textSize];

  return (
    <div className="flex flex-col items-center">
      <span
        className={`${sizeClasses.label} uppercase text-zinc-400 tracking-wide`}
      >
        {label}
      </span>

      <span className={`${sizeClasses.value} font-black text-white capitalize`}>
        {value}
      </span>
    </div>
  );
}
