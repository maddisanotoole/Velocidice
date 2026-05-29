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
  playerLabels: Record<PlayerId, string>;
};
export function PlayerBoard({
  targetScore,
  currentPlayer,
  playerScores,
  playerLabels,
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
          label={playerLabels.player}
          value={playerScores.player}
          textSize={TextSize.SMALL}
          active={currentPlayer === "player"}
        />
        <ScoreItem
          label={playerLabels.player2}
          value={playerScores.player2}
          textSize={TextSize.SMALL}
          active={currentPlayer === "player2"}
        />
      </Row>
    </Board>
  );
}
