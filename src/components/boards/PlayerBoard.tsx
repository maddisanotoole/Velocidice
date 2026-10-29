import {
  BoardSize,
  TextSize,
  type PlayerId,
  type PlayerScores,
} from "../../types";
import { Board } from "./Board";
import { ScoreItem } from "../ScoreItem";

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
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        <ScoreItem
          compact
          label="Target"
          value={targetScore}
          textSize={TextSize.SMALL}
        />
        <ScoreItem
          compact
          label={playerLabels.player}
          value={playerScores.player}
          textSize={TextSize.SMALL}
          active={currentPlayer === "player"}
        />
        <ScoreItem
          compact
          label={playerLabels.player2}
          value={playerScores.player2}
          textSize={TextSize.SMALL}
          active={currentPlayer === "player2"}
        />
      </div>
    </Board>
  );
}
