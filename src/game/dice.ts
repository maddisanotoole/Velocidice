import { DieStatus, type Die } from "../types";

export function rollDie(): number {
  return Math.floor(Math.random() * 6 + 1);
}

export function initializeDice(values: number[] = []) {
  const dice: Die[] = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    value: values[index] ?? rollDie(),
    status: DieStatus.ACTIVE,
  }));
  return dice;
}
