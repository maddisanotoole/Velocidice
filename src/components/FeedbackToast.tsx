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
      className={`pointer-events-none fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-xl bg-zinc-950/90 px-5 py-3 text-2xl font-black uppercase tracking-wide shadow-2xl ${variantClasses[variant]}`}
    >
      {message}
    </p>
  );
}
