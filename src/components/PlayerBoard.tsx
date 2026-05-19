import {
  BoardSize,
  TextSize,
  type PlayerId,
  type PlayerScores,
} from "../types";
import { Board } from "./Board";
import { Row } from "./Row";
import { ScoreItem } from "./ScoreItem";

type PlayerBoardProps = {
  targetScore: number;
  currentPlayer: PlayerId;
  playerScores: PlayerScores;
};
export function PlayerBoard({
  targetScore,
  currentPlayer,
  playerScores,
}: PlayerBoardProps) {
  return (
    <Board size={BoardSize.SMALL}>
      <ScoreItem label="Turn" value={currentPlayer} textSize={TextSize.SMALL} />
      <Row>
        <ScoreItem
          label="Target"
          value={targetScore}
          textSize={TextSize.SMALL}
        />
        <ScoreItem
          label="Human"
          value={playerScores.player}
          textSize={TextSize.SMALL}
        />
        <ScoreItem
          label="Computer"
          value={playerScores.computer}
          textSize={TextSize.SMALL}
        />
      </Row>
    </Board>
  );
}
