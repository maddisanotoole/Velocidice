import { useEffect } from "react";
import {
  type MatchLength,
  type PlayerId,
  type PlayerLabels,
  type PlayerScores,
} from "../../types";
import {
  shareSummaryImage,
  type SummaryShareTile,
} from "../../utils/summaryShare";
import { cx, theme } from "../../theme/classes";
import Button from "../buttons/GameButton";

type GameSummaryModalProps = {
  actionLabel: string;
  matchLength: MatchLength;
  matchScore: PlayerScores;
  matchWinner: PlayerId | null;
  onClose: () => void;
  onNewGame: () => void;
  playerLabels: PlayerLabels;
  playerScore: PlayerScores;
  targetScore: number;
  winner: PlayerId;
};

const matchLengthLabels: Record<MatchLength, string> = {
  1: "Single game",
  3: "Best of 3",
  10: "Best of 10",
};

function getPossessiveLabel(label: string) {
  return label === "You" ? "Your" : label;
}

export function GameSummaryModal({
  actionLabel,
  matchLength,
  matchScore,
  matchWinner,
  onClose,
  onNewGame,
  playerLabels,
  playerScore,
  targetScore,
  winner,
}: GameSummaryModalProps) {
  const isMatchComplete = Boolean(matchWinner) && matchLength > 1;
  const canShareSummary = matchLength === 1 || isMatchComplete;
  const playerPossessiveLabel = getPossessiveLabel(playerLabels.player);
  const player2PossessiveLabel = getPossessiveLabel(playerLabels.player2);
  const shouldShowMatchScore = matchLength > 1;
  const title = isMatchComplete ? "Match Complete" : "Game Complete";
  const resultText = isMatchComplete
    ? `${playerLabels[matchWinner ?? winner]} won the ${
        matchLengthLabels[matchLength]
      } match.`
    : `${playerLabels[winner]} won the game.`;
  const gameUrl =
    typeof window === "undefined" ? "VelociDice" : window.location.origin;
  const summaryTiles: SummaryShareTile[] = [
    ...(shouldShowMatchScore
      ? [
          {
            label: `${playerPossessiveLabel} Games`,
            value: matchScore.player,
          },
          {
            label: `${player2PossessiveLabel} Games`,
            value: matchScore.player2,
          },
        ]
      : []),
    {
      label: `${playerPossessiveLabel} Score`,
      value: playerScore.player,
    },
    {
      label: `${player2PossessiveLabel} Score`,
      value: playerScore.player2,
    },
    {
      label: "Target",
      value: targetScore,
    },
    {
      label: "Format",
      value: matchLengthLabels[matchLength],
    },
  ];

  async function shareSummary() {
    try {
      await shareSummaryImage({
        gameUrl,
        resultText,
        tiles: summaryTiles,
        title,
      });
    } catch {
      // Sharing can be cancelled or blocked by the browser.
    }
  }

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
    <div className={theme.modal.centeredOverlay}>
      <section
        aria-modal="true"
        className={cx(theme.modal.panel, "max-w-md")}
        role="dialog"
      >
        <div className={theme.modal.header}>
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
            <p className={cx("mt-1 text-sm", theme.text.muted)}>{resultText}</p>
          </div>
          <Button onClick={onClose} color="red" size="small">
            Close
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {summaryTiles.slice(0, shouldShowMatchScore ? 4 : 2).map((tile) => (
            <SummaryTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {summaryTiles.slice(shouldShowMatchScore ? 4 : 2).map((tile) => (
            <SummaryTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-6">
          {canShareSummary && (
            <Button
              className="min-w-32 sm:min-w-40"
              color="blue"
              onClick={shareSummary}
            >
              Share
            </Button>
          )}
          <Button
            className="min-w-32 sm:min-w-40"
            color="green"
            onClick={onNewGame}
          >
            {actionLabel}
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
