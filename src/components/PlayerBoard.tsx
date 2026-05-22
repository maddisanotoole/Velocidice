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
      <Row>
        <ScoreItem
          label="Target"
          value={targetScore}
          textSize={TextSize.SMALL}
        />
        <ScoreItem
          label="Player"
          value={playerScores.player}
          textSize={TextSize.SMALL}
          active={currentPlayer === "player"}
        />
        <ScoreItem
          label="Computer"
          value={playerScores.computer}
          textSize={TextSize.SMALL}
          active={currentPlayer === "computer"}
        />
      </Row>
    </Board>
  );
}
