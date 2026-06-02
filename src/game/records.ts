import type { GameRecords, MatchLength, PlayerId } from "../types";

const RECORDS_STORAGE_KEY = "velocidice.records";

export const DEFAULT_RECORDS: GameRecords = {
  vsComputer: {
    wins: 0,
    losses: 0,
    highestPlayerScore: 0,
    matchesWonByLength: {
      1: 0,
      3: 0,
      10: 0,
    },
  },
};

function isRecordValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function parseRecords(value: unknown): GameRecords {
  if (!value || typeof value !== "object") {
    return DEFAULT_RECORDS;
  }

  const records = value as Partial<{
    vsComputer: Partial<GameRecords["vsComputer"]>;
  }>;
  const wins = records.vsComputer?.wins;
  const losses = records.vsComputer?.losses;
  const highestPlayerScore = records.vsComputer?.highestPlayerScore;
  const matchesWonByLength = records.vsComputer?.matchesWonByLength;

  return {
    vsComputer: {
      wins: isRecordValue(wins) ? wins : DEFAULT_RECORDS.vsComputer.wins,
      losses: isRecordValue(losses)
        ? losses
        : DEFAULT_RECORDS.vsComputer.losses,
      highestPlayerScore: isRecordValue(highestPlayerScore)
        ? highestPlayerScore
        : DEFAULT_RECORDS.vsComputer.highestPlayerScore,
      matchesWonByLength: {
        1: isRecordValue(matchesWonByLength?.[1])
          ? matchesWonByLength[1]
          : DEFAULT_RECORDS.vsComputer.matchesWonByLength[1],
        3: isRecordValue(matchesWonByLength?.[3])
          ? matchesWonByLength[3]
          : DEFAULT_RECORDS.vsComputer.matchesWonByLength[3],
        10: isRecordValue(matchesWonByLength?.[10])
          ? matchesWonByLength[10]
          : DEFAULT_RECORDS.vsComputer.matchesWonByLength[10],
      },
    },
  };
}

export function loadRecords(): GameRecords {
  try {
    const storedRecords = window.localStorage.getItem(RECORDS_STORAGE_KEY);

    if (!storedRecords) {
      return DEFAULT_RECORDS;
    }

    return parseRecords(JSON.parse(storedRecords));
  } catch {
    return DEFAULT_RECORDS;
  }
}

export function saveRecords(records: GameRecords): void {
  try {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage failures so gameplay is never blocked.
  }
}

export function getRecordsWithVsComputerResult(
  records: GameRecords,
  winner: PlayerId,
  matchLength: MatchLength,
  playerScore: number,
): GameRecords {
  const playerWon = winner === "player";

  return {
    ...records,
    vsComputer: {
      wins:
        playerWon ? records.vsComputer.wins + 1 : records.vsComputer.wins,
      losses:
        winner === "player2"
          ? records.vsComputer.losses + 1
          : records.vsComputer.losses,
      highestPlayerScore: Math.max(
        records.vsComputer.highestPlayerScore,
        playerScore,
      ),
      matchesWonByLength: {
        ...records.vsComputer.matchesWonByLength,
        [matchLength]: playerWon
          ? records.vsComputer.matchesWonByLength[matchLength] + 1
          : records.vsComputer.matchesWonByLength[matchLength],
      },
    },
  };
}
