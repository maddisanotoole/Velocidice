import soundOffIcon from "../../assets/images/sound_off.svg";
import soundOnIcon from "../../assets/images/sound_on.svg";
import { cx, theme } from "../../theme/classes";

type MuteButtonProps = {
  isMuted: boolean;
  onMuteChange: (isMuted: boolean) => void;
  placement?: "inline" | "top-left";
};

export function MuteButton({ isMuted, onMuteChange, placement = "inline" }: MuteButtonProps) {
  return (
    <button
      aria-label={isMuted ? "Turn sound on" : "Mute sound"}
      className={cx(
        theme.iconButton.base,
        placement === "top-left" ? theme.iconButton.raised : theme.iconButton.dark,
        theme.iconButton.size,
        placement === "top-left" && theme.iconButton.fixedTopLeft,
      )}
      onClick={() => onMuteChange(!isMuted)}
      title={isMuted ? "Turn sound on" : "Mute sound"}
      type="button"
    >
      <img
        alt=""
        className="vd-icon-img h-5 w-5 sm:h-6 sm:w-6"
        src={isMuted ? soundOffIcon : soundOnIcon}
      />
    </button>
  );
}
