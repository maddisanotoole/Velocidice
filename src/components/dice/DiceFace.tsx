import { motion, useReducedMotion } from "framer-motion";
import { type Die, DieStatus, type PlayerId } from "../../types";

interface DieProps {
  onClick: () => void;
  die: Die;
  currentPlayer: PlayerId;
  isBanked?: boolean;
  isInvalidSelection?: boolean;
  rollAnimationKey: string;
  disabled?: boolean;
}

const pipPositions = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: [
    "top-left",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-right",
  ],
} as const;

const pipClasses = {
  "top-left": "left-2.5 top-2.5 sm:left-3 sm:top-3",
  "top-right": "right-2.5 top-2.5 sm:right-3 sm:top-3",
  "middle-left": "left-2.5 top-1/2 -translate-y-1/2 sm:left-3",
  "middle-right": "right-2.5 top-1/2 -translate-y-1/2 sm:right-3",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-2.5 left-2.5 sm:bottom-3 sm:left-3",
  "bottom-right": "bottom-2.5 right-2.5 sm:bottom-3 sm:right-3",
} as const;

export const DieFace: React.FC<DieProps> = ({
  onClick,
  die,
  currentPlayer,
  isBanked = false,
  isInvalidSelection = false,
  rollAnimationKey,
  disabled = false,
}) => {
  const reducedMotion = useReducedMotion();
  const isHeld = die.status === DieStatus.HELD || isBanked;
  const isPlayer2Turn = currentPlayer === "player2";
  const shouldAnimateRoll = die.status === DieStatus.ACTIVE && !isBanked && !reducedMotion;

  return (
    <motion.button
      type="button"
      disabled={disabled || isHeld}
      aria-label={`Die ${die.id + 1}: ${die.value}${isHeld ? ", held" : isInvalidSelection ? ", does not score" : ""}`}
      aria-pressed={die.status === DieStatus.SELECTED && !isHeld}
      key={`die_${die.id}_${rollAnimationKey}`}
      onClick={onClick}
      data-player={currentPlayer}
      data-state={
        isHeld ? "held" : isInvalidSelection ? "invalid"
          : die.status === DieStatus.SELECTED ? "selected"
            : isPlayer2Turn ? "opponent" : "active"
      }
      initial={
        shouldAnimateRoll
          ? {
              rotate: -160,
              scale: 0.85,
              y: -8,
            }
          : false
      }
      animate={
        shouldAnimateRoll
          ? {
              rotate: [0, 120, 260, 360],
              scale: [1, 0.92, 1.08, 1],
              y: [0, -10, 4, 0],
            }
          : false
      }
      transition={
        shouldAnimateRoll
          ? {
              delay: die.id * 0.04,
              duration: 0.45,
              ease: "easeOut",
            }
          : {
              duration: 0,
            }
      }
      className="vd-die relative h-14 w-14 rounded-xl cursor-pointer transition-all shadow-lg disabled:cursor-default sm:h-16 sm:w-16"
    >
      {pipPositions[die.value as keyof typeof pipPositions].map((position) => (
        <span
          className={`vd-pip absolute h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${pipClasses[position]}`}
          key={position}
        />
      ))}
      {die.status === DieStatus.SELECTED && !isHeld && !isInvalidSelection && (
        <span className="vd-selection-tick" aria-hidden="true">✓</span>
      )}
      {isInvalidSelection && (
        <span
          aria-hidden="true"
          className="vd-invalid-badge absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border-2 text-sm font-black shadow-lg"
        >
          !
        </span>
      )}
    </motion.button>
  );
};
