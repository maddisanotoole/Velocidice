interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  color?: "green" | "blue" | "red" | "yellow";
}

const colorClasses = {
  green: "bg-green-500 hover:bg-green-600 active:bg-green-700",
  blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
  red: "bg-red-500 hover:bg-red-600 active:bg-red-700",
  yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
} as const;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = "green",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
        colorClasses[color]
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
