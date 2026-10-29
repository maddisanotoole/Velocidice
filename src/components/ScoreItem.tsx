import { TextSize, type TextSizeType } from "../types";

type ScoreItemProps = {
  label: string;
  value: number | string;
  delta?: number;
  textSize?: TextSizeType;
  active?: boolean;
  compact?: boolean;
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
  compact = false,
}: ScoreItemProps) {
  const sizeClasses = textSizeClasses[textSize];

  return (
    <div
      className={`grid ${compact ? "grid-rows-2 px-2 py-0.5" : "grid-rows-[1.25rem_auto_1.25rem] px-2 py-1 sm:px-3 sm:py-2"} place-items-center rounded-lg transition-colors ${
        active ? "bg-[var(--highlight)]" : ""
      }`}
    >
      <span
        className={`flex min-h-5 items-center ${sizeClasses.label} uppercase tracking-wide ${
          active ? "text-[var(--highlight-ink)]" : "text-[var(--muted)]"
        }`}
      >
        {label}
      </span>

      <span
        className={`${compact ? "text-base leading-tight" : sizeClasses.value} font-black capitalize ${
          active ? "text-[var(--highlight-ink)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </span>

      {!compact && <span
        className={`flex min-h-5 items-center text-sm font-black ${
          delta > 0
            ? active
              ? "text-[var(--highlight-ink)]"
              : "text-[var(--points)]"
            : "text-transparent"
        }`}
      >
        +{delta}
      </span>}
    </div>
  );
}
