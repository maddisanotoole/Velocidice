import settingsIcon from "../../assets/images/settings.svg";
import { cx, theme } from "../../theme/classes";

type SettingsButtonProps = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      aria-label="Open settings"
      className={cx(
        theme.iconButton.base,
        theme.iconButton.raised,
        theme.iconButton.size,
        theme.iconButton.fixedTopRight,
      )}
      onClick={onClick}
      title="Settings"
      type="button"
    >
      <img alt="" className="h-5 w-5 sm:h-6 sm:w-6" src={settingsIcon} />
    </button>
  );
}
