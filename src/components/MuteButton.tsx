import soundOffIcon from "../assets/sound_off.svg";
import soundOnIcon from "../assets/sound_on.svg";

type MuteButtonProps = {
  isMuted: boolean;
  onMuteChange: (isMuted: boolean) => void;
};

export function MuteButton({ isMuted, onMuteChange }: MuteButtonProps) {
  return (
    <button
      aria-label={isMuted ? "Turn sound on" : "Mute sound"}
      className="rounded-full bg-zinc-950 p-3 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
      onClick={() => onMuteChange(!isMuted)}
      title={isMuted ? "Turn sound on" : "Mute sound"}
      type="button"
    >
      <img alt="" className="h-6 w-6" src={isMuted ? soundOffIcon : soundOnIcon} />
    </button>
  );
}
