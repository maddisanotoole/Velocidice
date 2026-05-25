import { useEffect, useRef, useState } from "react";
import { HOLD_TO_END_GAME_MS } from "../appConstants";
import type { PlayerId } from "../types";
import Button from "./GameButton";

type HoldToEndGameButtonProps = {
  onReset: () => void;
  winner: PlayerId | null;
};

export function HoldToEndGameButton({
  onReset,
  winner,
}: HoldToEndGameButtonProps) {
  const holdStartRef = useRef(0);
  const holdIntervalRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const progressCircleOffset = 50.27 * (1 - holdProgress);

  function clearHold() {
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }

    if (holdTimeoutRef.current !== null) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    holdStartRef.current = 0;
    setHoldProgress(0);
  }

  function startHold() {
    if (winner) {
      return;
    }

    clearHold();
    holdStartRef.current = Date.now();
    setHoldProgress(0);

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      setHoldProgress(Math.min(elapsed / HOLD_TO_END_GAME_MS, 1));
    }, 30);

    holdTimeoutRef.current = window.setTimeout(() => {
      onReset();
    }, HOLD_TO_END_GAME_MS);
  }

  function handleClick() {
    if (winner) {
      onReset();
    }
  }

  useEffect(() => clearHold, []);

  return (
    <Button
      onClick={handleClick}
      color={winner ? "green" : "red"}
      onPointerCancel={clearHold}
      onPointerDown={startHold}
      onPointerLeave={clearHold}
      onPointerUp={clearHold}
      title={winner ? undefined : "Hold to end this game and lose progress."}
    >
      {winner ? (
        "New Game "
      ) : (
        <span className="flex items-center gap-2">
          <span className="relative h-5 w-5" aria-hidden="true">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                className="stroke-red-200/40"
                cx="10"
                cy="10"
                fill="none"
                r="8"
                strokeWidth="3"
              />
              <circle
                className="stroke-white"
                cx="10"
                cy="10"
                fill="none"
                r="8"
                strokeDasharray="50.27"
                strokeDashoffset={progressCircleOffset}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </span>
          Hold to End Game
        </span>
      )}
    </Button>
  );
}
