import type { ScoreBoardProps } from "../types";
import { Board } from "./Board";
import { Row } from "./Row";
import { ScoreItem } from "./ScoreItem";

export function ScoreBoard({
  currentPlayer,
  playerScores,
  roundScore,
  selectedScore,
}: ScoreBoardProps) {
  return (
    <Board>
      <Row>
        <ScoreItem label="Total" value={playerScores[currentPlayer]} />

        <ScoreItem label="Round" value={roundScore} />
        <ScoreItem label="Selected" value={selectedScore} />
      </Row>
    </Board>
  );
}
