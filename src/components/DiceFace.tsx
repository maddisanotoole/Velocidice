import { motion } from "framer-motion";
import { type Die, DieStatus, type PlayerId } from "../types";

interface DieProps {
  onClick: () => void;
  die: Die;
  currentPlayer: PlayerId;
  isBanked?: boolean;
  rollAnimationKey: string;
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
  "top-left": "left-3 top-3",
  "top-right": "right-3 top-3",
  "middle-left": "left-3 top-1/2 -translate-y-1/2",
  "middle-right": "right-3 top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
} as const;

export const DieFace: React.FC<DieProps> = ({
  onClick,
  die,
  currentPlayer,
  isBanked = false,
  rollAnimationKey,
}) => {
  const isHeld = die.status === DieStatus.HELD || isBanked;
  const isComputerTurn = currentPlayer === "computer";
  const shouldAnimateRoll = die.status === DieStatus.ACTIVE && !isBanked;

  return (
    <motion.div
      key={`die_${die.id}_${rollAnimationKey}`}
      onClick={onClick}
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
      className={`
  relative h-16 w-16 rounded-xl cursor-pointer transition-all shadow-lg
  ${
    isHeld
      ? "bg-green-500"
      : die.status === DieStatus.SELECTED
        ? "bg-yellow-400"
        : isComputerTurn
          ? "bg-purple-400"
          : "bg-white"
  }
`}
    >
      {pipPositions[die.value as keyof typeof pipPositions].map((position) => (
        <span
          className={`absolute h-3 w-3 rounded-full ${
            isHeld ? "bg-white" : "bg-zinc-950"
          } ${pipClasses[position]}`}
          key={position}
        />
      ))}
    </motion.div>
  );
};
