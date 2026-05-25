interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  onPointerCancel?: () => void;
  onPointerDown?: () => void;
  onPointerLeave?: () => void;
  onPointerUp?: () => void;
  title?: string;
  color?: "green" | "blue" | "red" | "yellow";
}

const colorClasses = {
  green: "bg-green-500 hover:bg-green-600 active:bg-green-700",
  blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
  red: "bg-red-500 hover:bg-red-600 active:bg-red-700",
  yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
} as const;

const disabledClasses =
  "disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300 disabled:opacity-60 disabled:hover:bg-zinc-600 disabled:active:bg-zinc-600";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  title,
  color = "green",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      className={`px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
        colorClasses[color]
      } ${disabledClasses}`}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
