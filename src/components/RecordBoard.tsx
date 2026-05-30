import { BoardSize, type GameRecords } from "../types";
import { Board } from "./Board";
import { Row } from "./Row";

type RecordBoardProps = {
  records: GameRecords;
};

export function RecordBoard({ records }: RecordBoardProps) {
  return (
    <Board size={BoardSize.SMALL}>
      <Row>
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
            Wins
          </span>
          <span className="text-base font-black text-white">
            {records.vsComputer.wins}
          </span>
        </span>
        <span className="flex items-baseline gap-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">
            Losses
          </span>
          <span className="text-base font-black text-white">
            {records.vsComputer.losses}
          </span>
        </span>
      </Row>
    </Board>
  );
}
