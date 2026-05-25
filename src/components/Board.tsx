import { BoardSize, type BoardSizeType } from "../types";

type BoardProps = {
  children: React.ReactNode;
  size?: BoardSizeType;
};

const boardSizeClasses = {
  [BoardSize.SMALL]: "gap-2 rounded-xl px-2 py-2 sm:gap-3 sm:px-3",
  [BoardSize.NORMAL]: "gap-3 rounded-2xl px-3 py-2 sm:gap-5 sm:px-5 sm:py-3",
} as const;

export function Board({ children, size = BoardSize.NORMAL }: BoardProps) {
  return (
    <div
      className={`flex max-w-full flex-col bg-zinc-800 shadow-xl ${boardSizeClasses[size]}`}
    >
      {children}
    </div>
  );
}
