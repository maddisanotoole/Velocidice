import {
  cx,
  theme,
  type ThemeButtonColor,
  type ThemeButtonSize,
} from "../../theme/classes";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  onPointerCancel?: () => void;
  onPointerDown?: () => void;
  onPointerLeave?: () => void;
  onPointerUp?: () => void;
  size?: ThemeButtonSize;
  title?: string;
  color?: ThemeButtonColor;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick,
  disabled = false,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  size = "normal",
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
      className={cx(
        theme.button.base,
        theme.button.size[size],
        theme.button.color[color],
        theme.button.disabled,
        className,
      )}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
