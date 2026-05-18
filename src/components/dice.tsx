import { type DieStatusType, type Die, DieStatus } from "../types";

interface DieProps {
  onClick: () => void;
  die: Die;
}

export const DieFace: React.FC<DieProps> = ({ onClick, die }) => {
  return (
    <div
      key={`die_${die.id}`}
      onClick={onClick}
      className={`
  w-16 h-16 rounded-xl flex items-center justify-center
  text-2xl font-bold cursor-pointer transition-all
  ${
    die.status === DieStatus.HELD
      ? "bg-green-500 text-white"
      : die.status === DieStatus.SELECTED
        ? "bg-yellow-400 text-black"
        : "bg-white text-black"
  }
`}
    >
      {die.value}
    </div>
  );
};
