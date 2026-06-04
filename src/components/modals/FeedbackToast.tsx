import { cx, theme } from "../../theme/classes";
import type { FeedbackVariant } from "../../types";

type FeedbackToastProps = {
  message?: string;
  variant?: FeedbackVariant;
};

export function FeedbackToast({
  message,
  variant = "default",
}: FeedbackToastProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cx(
        "pointer-events-none fixed left-1/2 top-16 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-zinc-950/90 px-4 py-2 text-center text-xl font-black uppercase tracking-wide shadow-2xl sm:top-24 sm:px-5 sm:py-3 sm:text-2xl",
        theme.feedback[variant],
      )}
    >
      {message}
    </p>
  );
}
