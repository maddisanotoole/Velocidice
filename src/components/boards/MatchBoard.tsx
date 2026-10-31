import {
  BoardSize,
  type MatchLength,
  type PlayerLabels,
  type PlayerScores,
} from "../../types";
import { Board } from "./Board";
import { MATCH_FORMAT_LABELS } from "../../game/match";

type MatchBoardProps = {
  matchLength: MatchLength;
  matchScore: PlayerScores;
  playerLabels: PlayerLabels;
};

export function MatchBoard({
  matchLength,
  matchScore,
  playerLabels,
}: MatchBoardProps) {
  return (
    <Board size={BoardSize.SMALL}>
      <div className="flex items-baseline justify-center gap-3 sm:gap-4">
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          Match
        </span>
        <span className="text-sm font-black text-[var(--ink)]">
          {MATCH_FORMAT_LABELS[matchLength]}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-center gap-3 sm:gap-4">
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            {playerLabels.player}
          </span>
          <span className="text-base font-black text-[var(--ink)]">
            {matchScore.player}
          </span>
        </span>
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            {playerLabels.player2}
          </span>
          <span className="text-base font-black text-[var(--ink)]">
            {matchScore.player2}
          </span>
        </span>
      </div>
    </Board>
  );
}
