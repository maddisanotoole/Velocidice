import settingsIcon from "../assets/settings.svg";

type SettingsButtonProps = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      aria-label="Open settings"
      className="fixed right-4 top-4 z-40 rounded-full bg-zinc-800 p-3 text-white shadow-lg transition-colors hover:bg-zinc-700 active:bg-zinc-600"
      onClick={onClick}
      title="Settings"
      type="button"
    >
      <img alt="" className="h-6 w-6" src={settingsIcon} />
    </button>
  );
}
