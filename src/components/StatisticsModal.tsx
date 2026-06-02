import { useEffect } from "react";
import type { GameRecords } from "../types";
import Button from "./GameButton";

type StatisticsModalProps = {
  onClose: () => void;
  records: GameRecords;
};

export function StatisticsModal({ onClose, records }: StatisticsModalProps) {
  const stats = records.vsComputer;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-zinc-800 p-4 text-white shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Statistics</h2>
            <p className="mt-1 text-sm text-zinc-400">Vs computer records.</p>
          </div>
          <Button onClick={onClose} color="red" size="small">
            Close
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatisticTile label="Total Wins" value={stats.wins} />
          <StatisticTile label="Total Losses" value={stats.losses} />
          <StatisticTile
            label="Highest Score"
            value={stats.highestPlayerScore}
          />
          <StatisticTile
            label="Single Wins"
            value={stats.matchesWonByLength[1]}
          />
          <StatisticTile
            label="Best of 3 Wins"
            value={stats.matchesWonByLength[3]}
          />
          <StatisticTile
            label="Best of 10 Wins"
            value={stats.matchesWonByLength[10]}
          />
        </div>
      </section>
    </div>
  );
}

function StatisticTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3">
      <span className="block text-xs font-bold uppercase tracking-wide text-zinc-400">
        {label}
      </span>
      <span className="mt-1 block text-2xl font-black text-white">
        {value}
      </span>
    </div>
  );
}
