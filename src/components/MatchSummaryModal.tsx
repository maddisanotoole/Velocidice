import { useEffect } from "react";
import {
  type MatchLength,
  type PlayerLabels,
  type PlayerScores,
} from "../types";
import { cx, theme } from "../theme/classes";
import Button from "./GameButton";

type MatchSummaryModalProps = {
  matchLength: MatchLength;
  matchScore: PlayerScores;
  onClose: () => void;
  onNewGame: () => void;
  playerLabels: PlayerLabels;
  playerScore: PlayerScores;
  targetScore: number;
};

const matchLengthLabels: Record<MatchLength, string> = {
  1: "Single game",
  3: "Best of 3",
  10: "Best of 10",
};

function getPossessiveLabel(label: string) {
  return label === "You" ? "Your" : label;
}

export function MatchSummaryModal({
  matchLength,
  matchScore,
  onClose,
  onNewGame,
  playerLabels,
  playerScore,
  targetScore,
}: MatchSummaryModalProps) {
  const playerPossessiveLabel = getPossessiveLabel(playerLabels.player);
  const player2PossessiveLabel = getPossessiveLabel(playerLabels.player2);

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
            <h2 className="text-2xl font-black sm:text-3xl">Match Complete</h2>
          </div>
          <Button onClick={onClose} color="red" size="small">
            Close
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SummaryTile
            label={`${playerPossessiveLabel} Games`}
            value={matchScore.player}
          />
          <SummaryTile
            label={`${player2PossessiveLabel} Games`}
            value={matchScore.player2}
          />
          <SummaryTile
            label={`${playerPossessiveLabel} Score`}
            value={playerScore.player}
          />
          <SummaryTile
            label={`${player2PossessiveLabel} Score`}
            value={playerScore.player2}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SummaryTile label="Target" value={targetScore} />
          <SummaryTile label="Format" value={matchLengthLabels[matchLength]} />
        </div>

        <div className="mt-5 flex justify-center sm:mt-6">
          <Button
            className="min-w-44 sm:min-w-56"
            color="green"
            onClick={onNewGame}
          >
            New Game
          </Button>
        </div>
      </section>
    </div>
  );
}

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
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
