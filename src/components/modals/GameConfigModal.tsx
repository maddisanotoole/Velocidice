import { useEffect, useRef } from "react";
import Button from "../buttons/GameButton";
import { MatchLengthSlider } from "../sliders/MatchLengthSlider";
import { TargetScoreSlider } from "../sliders/TargetScoreSlider";
import { playSound } from "../../game/sound";
import { cx, theme } from "../../theme/classes";
import type { GameMode, MatchLength } from "../../types";

type GameConfigModalProps = {
  gameMode: GameMode;
  matchLength: MatchLength;
  targetScore: number;
  onGameModeChange: (mode: GameMode) => void;
  onMatchLengthChange: (length: MatchLength) => void;
  onTargetScoreChange: (score: number) => void;
  onClose: () => void;
};

export function GameConfigModal({ gameMode, matchLength, targetScore, onGameModeChange, onMatchLengthChange, onTargetScoreChange, onClose }: GameConfigModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function changeGameMode(mode: GameMode) {
    if (mode !== gameMode) playSound("select");
    onGameModeChange(mode);
  }

  return (
    <dialog ref={dialog} aria-labelledby="game-config-title" aria-describedby="game-config-description"
      className={cx(theme.modal.panel, "m-auto max-w-md backdrop:bg-black/70")}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className={theme.modal.header}>
        <div><h2 id="game-config-title" className="text-2xl font-black">Game config</h2>
          <p id="game-config-description" className={cx("mt-1 text-sm", theme.text.muted)}>Set up your next game. Changes apply immediately.</p></div>
        <Button onClick={onClose}>Done</Button>
      </div>
        <section className={theme.panel.section}>
          <h2 className="font-bold">Game Mode</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={gameMode === "computer"}
              onClick={() => changeGameMode("computer")}
              className={cx(
                theme.option.base,
                "px-3 py-3 text-sm",
                gameMode === "computer"
                  ? theme.option.selected
                  : theme.option.unselected,
              )}
            >
              Computer
            </button>
            <button
              type="button"
              aria-pressed={gameMode === "local"}
              onClick={() => changeGameMode("local")}
              className={cx(
                theme.option.base,
                "px-3 py-3 text-sm",
                gameMode === "local"
                  ? theme.option.selected
                  : theme.option.unselected,
              )}
            >
              Local 2-Player
            </button>
          </div>
        </section>
        <MatchLengthSlider
          matchLength={matchLength}
          onMatchLengthChange={onMatchLengthChange}
        />

        <section className={theme.panel.section}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Target Score</h2>
              <p className={cx("text-sm", theme.text.muted)}>
                Choose the score needed to win.
              </p>
            </div>
            <span className={cx("text-lg font-black", theme.text.heading)}>
              {targetScore}
            </span>
          </div>
          <TargetScoreSlider
            onTargetScoreChange={onTargetScoreChange}
            targetScore={targetScore}
          />
        </section>
    </dialog>
  );
}
