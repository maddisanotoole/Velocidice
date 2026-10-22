import {
  cx,
  theme,
  type ThemeButtonColor,
  type ThemeButtonSize,
} from "../../theme/classes";
import type { CSSProperties } from "react";
import type { ThemeRole } from "../../theme/palettes";

const defaultRoles: Record<ThemeButtonColor, ThemeRole> = {
  green: "confirm_button", blue: "rules_button", red: "confirm_button",
  yellow: "bank_button", purple: "stats_button",
};

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
  themeRole?: ThemeRole;
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
  themeRole = defaultRoles[color],
}) => {
  return (
    <button
      type="button"
      data-color={color}
      data-theme-role={themeRole}
      style={{ "--button-bg": `var(--${themeRole})`, "--button-ink": `var(--${themeRole}-ink)` } as CSSProperties}
      onClick={onClick}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      className={cx(
        "vd-button", theme.button.base,
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
