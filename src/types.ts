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
