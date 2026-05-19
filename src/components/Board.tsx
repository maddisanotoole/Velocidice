import { BoardSize, type BoardSizeType } from "../types";

type BoardProps = {
  children: React.ReactNode;
  size?: BoardSizeType;
};

const boardSizeClasses = {
  [BoardSize.SMALL]: "gap-4 rounded-xl px-4 py-3",
  [BoardSize.NORMAL]: "gap-8 rounded-2xl px-8 py-6",
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
