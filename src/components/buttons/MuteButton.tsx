import soundOffIcon from "../../assets/images/sound_off.svg";
import soundOnIcon from "../../assets/images/sound_on.svg";
import { cx, theme } from "../../theme/classes";

type MuteButtonProps = {
  isMuted: boolean;
  onMuteChange: (isMuted: boolean) => void;
};

export function MuteButton({ isMuted, onMuteChange }: MuteButtonProps) {
  return (
    <button
      aria-label={isMuted ? "Turn sound on" : "Mute sound"}
      className={cx(
        theme.iconButton.base,
        theme.iconButton.dark,
        theme.iconButton.size,
      )}
      onClick={() => onMuteChange(!isMuted)}
      title={isMuted ? "Turn sound on" : "Mute sound"}
      type="button"
    >
      <img
        alt=""
        className="h-5 w-5 sm:h-6 sm:w-6"
        src={isMuted ? soundOffIcon : soundOnIcon}
      />
    </button>
  );
}
