import type { GameRecords, PlayerId } from "../types";

const RECORDS_STORAGE_KEY = "velocidice.records";

export const DEFAULT_RECORDS: GameRecords = {
  vsComputer: {
    wins: 0,
    losses: 0,
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

  return {
    vsComputer: {
      wins: isRecordValue(wins) ? wins : DEFAULT_RECORDS.vsComputer.wins,
      losses: isRecordValue(losses)
        ? losses
        : DEFAULT_RECORDS.vsComputer.losses,
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
): GameRecords {
  return {
    ...records,
    vsComputer: {
      wins:
        winner === "player"
          ? records.vsComputer.wins + 1
          : records.vsComputer.wins,
      losses:
        winner === "player2"
          ? records.vsComputer.losses + 1
          : records.vsComputer.losses,
    },
  };
}
