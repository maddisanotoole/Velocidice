import { DieStatus, type Die } from "../types";

export function rollDie(): number {
  return Math.floor(Math.random() * 6 + 1);
}

export function initializeDice() {
  const dice: Die[] = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    value: rollDie(),
    status: DieStatus.ACTIVE,
  }));
  return dice;
}
