import { type Die, DieStatus, type PlayerId } from "../types";

interface DieProps {
  onClick: () => void;
  die: Die;
  currentPlayer: PlayerId;
  isBanked?: boolean;
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
}) => {
  const isHeld = die.status === DieStatus.HELD || isBanked;
  const isComputerTurn = currentPlayer === "computer";

  return (
    <div
      key={`die_${die.id}`}
      onClick={onClick}
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
    </div>
  );
};
