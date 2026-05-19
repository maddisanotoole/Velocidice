import type { PlayerId, PlayerScores } from "../types";
import { Board } from "./Board";
import { ScoreItem } from "./ScoreItem";

type PlayerBoardProps = {
  currentPlayer: PlayerId;
  playerScores: PlayerScores;
};
export function PlayerBoard({ currentPlayer, playerScores }: PlayerBoardProps) {
  return (
    <Board>
      <div className="flex gap-8">
        <ScoreItem label="Human" value={playerScores.human} />

        <ScoreItem label="Computer" value={playerScores.computer} />

        <span className="text-sm uppercase text-zinc-400 tracking-wide">
          Turn
        </span>

        <span className="text-3xl font-black capitalize text-white">
          {currentPlayer}
        </span>
      </div>
    </Board>
  );
}
