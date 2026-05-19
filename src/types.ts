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

export type PlayerId = "human" | "computer";

export type PlayerScores = {
  human: number;
  computer: number;
};

export type ScoreBoardProps = {
  currentPlayer: PlayerId;
  playerScores: PlayerScores;
  roundScore: number;
  selectedScore: number;
};

export type ScoreItemProps = {
  label: string;
  value: number;
};
