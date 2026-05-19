import type { ScoreBoardProps } from "../types";
import { Board } from "./Board";
import { ScoreItem } from "./ScoreItem";

export function ScoreBoard({
  currentPlayer,
  playerScores,
  roundScore,
  selectedScore,
}: ScoreBoardProps) {
  return (
    <Board>
      <div className="flex gap-8">
        <ScoreItem label="Total" value={playerScores[currentPlayer]} />

        <ScoreItem label="Round" value={roundScore} />
        <ScoreItem label="Selected" value={selectedScore} />
      </div>
    </Board>
  );
}
