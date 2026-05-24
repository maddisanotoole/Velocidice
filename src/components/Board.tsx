import { BoardSize, type BoardSizeType } from "../types";

type BoardProps = {
  children: React.ReactNode;
  size?: BoardSizeType;
};

const boardSizeClasses = {
  [BoardSize.SMALL]: "gap-3 rounded-xl px-3 py-2",
  [BoardSize.NORMAL]: "gap-5 rounded-2xl px-5 py-3",
} as const;

export function Board({ children, size = BoardSize.NORMAL }: BoardProps) {
  return (
    <div
      className={`flex flex-col bg-zinc-800 shadow-xl ${boardSizeClasses[size]}`}
    >
      {children}
    </div>
  );
}
