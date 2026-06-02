import type { DebugRoll } from "../types";

export function parseDebugRolls(text: string): DebugRoll[] {
  return text
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/[\s,]+/)
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= 6),
    )
    .filter((roll) => roll.length > 0);
}

export function debugRollsText(rolls: DebugRoll[]): string {
  return rolls.map((roll) => roll.join(" ")).join("\n");
}

export function takeDebugRoll(
  rolls: DebugRoll[],
  diceCount: number,
): {
  nextRolls: DebugRoll[];
  values: number[];
} {
  const [roll = [], ...nextRolls] = rolls;

  return {
    nextRolls,
    values: roll.slice(0, diceCount),
  };
}
