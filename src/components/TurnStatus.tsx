import { cx, theme } from "../theme/classes";
import type { FeedbackVariant } from "../types";

export function TurnStatus({ message, guidance, variant = "default" }: {
  message?: string;
  guidance: string;
  variant?: FeedbackVariant;
}) {
  return (
    <p
      id="turn-action-guidance"
      role="status"
      aria-atomic="true"
      className="mt-3 min-h-20 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-center text-sm text-[var(--ink)]"
    >
      {message && <span className={cx("mb-1 block font-bold", theme.feedback[variant])}>{message}</span>}
      <span>{guidance}</span>
    </p>
  );
}
