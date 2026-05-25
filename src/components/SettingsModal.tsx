import { useEffect } from "react";
import { GITHUB_REPOSITORY_URL } from "../appConstants";
import Button from "./GameButton";
import { MuteButton } from "./MuteButton";

type SettingsModalProps = {
  isMuted: boolean;
  onBackToMenu: () => void;
  onClose: () => void;
  onMuteChange: (isMuted: boolean) => void;
};

export function SettingsModal({
  isMuted,
  onBackToMenu,
  onClose,
  onMuteChange,
}: SettingsModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-zinc-800 p-4 text-white shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Settings</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Adjust game preferences.
            </p>
          </div>

          <Button onClick={onClose} color="red">
            Close
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <section className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700 px-3 py-3 sm:gap-4 sm:px-4">
            <span>
              <span className="block font-bold">Mute Sound</span>
              <span className="block text-sm text-zinc-400">
                Turn off game sound effects.
              </span>
            </span>
            <MuteButton isMuted={isMuted} onMuteChange={onMuteChange} />
          </section>

          <section className="rounded-lg border border-zinc-700 px-3 py-3 sm:px-4">
            <div className="mb-3">
              <h3 className="font-bold">Game Setup</h3>
              <p className="text-sm text-zinc-400">
                Return to the menu to change target score or restart setup.
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onBackToMenu} color="yellow">
                Back to Menu
              </Button>
            </div>
          </section>

          <a
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 font-bold text-white transition-colors hover:bg-zinc-700"
            href={GITHUB_REPOSITORY_URL}
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
