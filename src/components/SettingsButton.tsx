import settingsIcon from "../assets/settings.svg";

type SettingsButtonProps = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      aria-label="Open settings"
      className="fixed right-3 top-3 z-40 rounded-full bg-zinc-800 p-2.5 text-white shadow-lg transition-colors hover:bg-zinc-700 active:bg-zinc-600 sm:right-4 sm:top-4 sm:p-3"
      onClick={onClick}
      title="Settings"
      type="button"
    >
      <img alt="" className="h-5 w-5 sm:h-6 sm:w-6" src={settingsIcon} />
    </button>
  );
}
