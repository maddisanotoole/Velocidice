export const DieStatus = {
  ACTIVE: "ACTIVE",
  SELECTED: "SELECTED",
  HELD: "HELD",
};
export type DieStatusType = (typeof DieStatus)[keyof typeof DieStatus];

export type Die = {
  id: number;
  value: number;
  status: DieStatusType;
  group?: number;
};

export type PlayerId = "player" | "player2";

export type GameMode = "computer" | "local";

export type PlayerScores = {
  player: number;
  player2: number;
};

export type ScoreBoardProps = {
  currentPlayer: PlayerId;
  playerScores: PlayerScores;
  roundScore: number;
  selectedScore: number;
  totalScoreDelta?: number;
  roundScoreDelta?: number;
};

export const TextSize = {
  SMALL: "SMALL",
  NORMAL: "NORMAL",
} as const;

export type TextSizeType = (typeof TextSize)[keyof typeof TextSize];

export const BoardSize = {
  SMALL: "SMALL",
  NORMAL: "NORMAL",
} as const;

export type BoardSizeType = (typeof BoardSize)[keyof typeof BoardSize];

export type ComputerAction =
  | "select-scoring-dice"
  | "hold-and-reroll"
  | "bank"
  | "end-farkled-turn";
