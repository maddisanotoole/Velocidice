import { useEffect } from "react";
import {
  type MatchLength,
  type PlayerId,
  type PlayerLabels,
  type PlayerScores,
} from "../../types";
import {
  downloadSummaryImage,
  shareSummaryText,
  type SummaryShareTile,
} from "../../utils/summaryShare";
import downloadIcon from "../../assets/images/download.svg";
import shareIcon from "../../assets/images/share.svg";
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

const gameUrl = "https://velocidice.vercel.app/";

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
  const didPlayerWin = (matchWinner ?? winner) === "player";
  const sharedResultText = isMatchComplete
    ? `I ${didPlayerWin ? "won" : "lost"} the ${
        matchLengthLabels[matchLength]
      } match!`
    : `I ${didPlayerWin ? "won" : "lost"}!`;
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
  const sharedSummaryTiles: SummaryShareTile[] = [
    ...(shouldShowMatchScore
      ? [
          {
            label: "My Games",
            value: matchScore.player,
          },
          {
            label: `${playerLabels.player2} Games`,
            value: matchScore.player2,
          },
        ]
      : []),
    {
      label: "My Score",
      value: playerScore.player,
    },
    {
      label: `${playerLabels.player2} Score`,
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
  async function shareSummaryTextResult() {
    try {
      await shareSummaryText({
        gameUrl,
        resultText: sharedResultText,
        tiles: sharedSummaryTiles,
        title,
      });
    } catch {
      // Sharing can be cancelled or blocked by the browser.
    }
  }

  async function downloadSummary() {
    try {
      await downloadSummaryImage({
        gameUrl,
        resultText: sharedResultText,
        tiles: sharedSummaryTiles,
        title,
      });
    } catch {
      // Download can be blocked by the browser.
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
            <>
              <button
                aria-label="Share summary"
                className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors sm:h-11 sm:w-11",
                  theme.iconButton.dark,
                )}
                onClick={shareSummaryTextResult}
                title="Share summary"
                type="button"
              >
                <img
                  alt=""
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  src={shareIcon}
                />
              </button>
              <button
                aria-label="Download summary image"
                className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors sm:h-11 sm:w-11",
                  theme.iconButton.dark,
                )}
                onClick={downloadSummary}
                title="Download summary image"
                type="button"
              >
                <img
                  alt=""
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  src={downloadIcon}
                />
              </button>
            </>
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
