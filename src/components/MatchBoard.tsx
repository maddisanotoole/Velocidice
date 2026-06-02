import { BoardSize, type PlayerLabels, type PlayerScores } from "../types";
import { Board } from "./Board";

type MatchBoardProps = {
  matchScore: PlayerScores;
  playerLabels: PlayerLabels;
  requiredWins: number;
};

export function MatchBoard({
  matchScore,
  playerLabels,
  requiredWins,
}: MatchBoardProps) {
  return (
    <Board size={BoardSize.SMALL}>
      <div className="flex items-baseline justify-center gap-3 sm:gap-4">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
          Match
        </span>
        <span className="text-sm font-black text-white">
          First to {requiredWins}
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
