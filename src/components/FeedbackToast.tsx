type FeedbackToastProps = {
  message?: string;
  variant?: "default" | "danger" | "success";
};

const variantClasses = {
  default: "text-white",
  danger: "text-red-400",
  success: "text-green-400",
} as const;

export function FeedbackToast({
  message,
  variant = "default",
}: FeedbackToastProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`pointer-events-none fixed left-1/2 top-16 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-zinc-950/90 px-4 py-2 text-center text-xl font-black uppercase tracking-wide shadow-2xl sm:top-24 sm:px-5 sm:py-3 sm:text-2xl ${variantClasses[variant]}`}
    >
      {message}
    </p>
  );
}
