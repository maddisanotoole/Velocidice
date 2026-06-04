import {
  BoardSize,
  type MatchLength,
  type PlayerLabels,
  type PlayerScores,
} from "../../types";
import { Board } from "./Board";

type MatchBoardProps = {
  matchLength: MatchLength;
  matchScore: PlayerScores;
  playerLabels: PlayerLabels;
};

const matchLengthLabels: Record<MatchLength, string> = {
  1: "Single Game",
  3: "Best of 3",
  10: "Best of 10",
};

export function MatchBoard({
  matchLength,
  matchScore,
  playerLabels,
}: MatchBoardProps) {
  return (
    <Board size={BoardSize.SMALL}>
      <div className="flex items-baseline justify-center gap-3 sm:gap-4">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
          Match
        </span>
        <span className="text-sm font-black text-white">
          {matchLengthLabels[matchLength]}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-center gap-3 sm:gap-4">
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
            {playerLabels.player}
          </span>
          <span className="text-base font-black text-white">
            {matchScore.player}
          </span>
        </span>
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
            {playerLabels.player2}
          </span>
          <span className="text-base font-black text-white">
            {matchScore.player2}
          </span>
        </span>
      </div>
    </Board>
  );
}
