import { useEffect } from "react";
import type { GameRecords } from "../../types";
import Button from "../buttons/GameButton";
import { cx, theme } from "../../theme/classes";

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
    <div className={theme.modal.overlay} onClick={onClose}>
      <section
        aria-modal="true"
        className={cx(theme.modal.panel, "max-w-md")}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={theme.modal.header}>
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Statistics</h2>
            <p className={cx("mt-1 text-sm", theme.text.muted)}>
              Vs computer records.
            </p>
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
    <div className={theme.panel.tile}>
      <span
        className={cx(
          "block text-xs font-bold uppercase tracking-wide",
          theme.text.muted,
        )}
      >
        {label}
      </span>
      <span
        className={cx("mt-1 block text-2xl font-black", theme.text.heading)}
      >
        {value}
      </span>
    </div>
  );
}
