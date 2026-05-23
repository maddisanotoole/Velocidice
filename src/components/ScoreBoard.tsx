import type { ScoreBoardProps } from "../types";
import { Board } from "./Board";
import { Row } from "./Row";
import { ScoreItem } from "./ScoreItem";

export function ScoreBoard({
  currentPlayer,
  playerScores,
  roundScore,
  selectedScore,
  totalScoreDelta = 0,
  roundScoreDelta = 0,
}: ScoreBoardProps) {
  return (
    <Board>
      <Row>
        <ScoreItem
          delta={totalScoreDelta}
          label="Total"
          value={playerScores[currentPlayer]}
        />

        <ScoreItem delta={roundScoreDelta} label="Round" value={roundScore} />
        <ScoreItem
          delta={selectedScore}
          label="Selected"
          value={selectedScore}
        />
      </Row>
    </Board>
  );
}
