import { useEffect, useRef, useState } from "react";
import { HOLD_TO_END_GAME_MS } from "../appConstants";
import Button from "./GameButton";

type HoldToMenuButtonProps = {
  isHoldRequired: boolean;
  onReturnToMenu: () => void;
  size?: "normal" | "small";
};

export function HoldToMenuButton({
  isHoldRequired,
  onReturnToMenu,
  size = "normal",
}: HoldToMenuButtonProps) {
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
    if (!isHoldRequired) {
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
      onReturnToMenu();
    }, HOLD_TO_END_GAME_MS);
  }

  function handleClick() {
    if (!isHoldRequired) {
      onReturnToMenu();
    }
  }

  useEffect(() => clearHold, []);

  const label = isHoldRequired ? "Hold for Menu" : "Return to Menu";

  return (
    <Button
      onClick={handleClick}
      color="yellow"
      onPointerCancel={clearHold}
      onPointerDown={startHold}
      onPointerLeave={clearHold}
      onPointerUp={clearHold}
      size={size}
      title={
        isHoldRequired
          ? "Hold to return to the menu and lose game progress."
          : undefined
      }
    >
      {isHoldRequired ? (
        <span className="flex items-center gap-2">
          <span className="relative h-5 w-5" aria-hidden="true">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                className="stroke-yellow-100/50"
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
          <span className="sr-only">{label}</span>
          <HomeIcon />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="sr-only">{label}</span>
          <HomeIcon />
        </span>
      )}
    </Button>
  );
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <path d="m3 10.5 9-7 9 7" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}
