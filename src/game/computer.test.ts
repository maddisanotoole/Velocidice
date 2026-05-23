import { describe, expect, it } from "vitest";
import { DieStatus, type Die } from "../types";
import { chooseComputerDice } from "./computer";

function diceFor(values: number[]): Die[] {
  return values.map((value, index) => ({
    id: index,
    value,
    status: DieStatus.ACTIVE,
  }));
}

function valuesFor(dice: Die[]): number[] {
  return dice.map((die) => die.value);
}

describe("chooseComputerDice", () => {
  it("chooses single scoring dice", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 2, 3, 4, 6, 2])))).toEqual(
      [1],
    );
    expect(valuesFor(chooseComputerDice(diceFor([2, 3, 4, 5, 2, 3])))).toEqual(
      [5],
    );
  });

  it("chooses all dice when every active die scores", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 5])))).toEqual([1, 5]);
    expect(valuesFor(chooseComputerDice(diceFor([1, 2, 3, 4, 5, 6])))).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  it("chooses a five-die straight without a non-scoring leftover die", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 2, 3, 4, 5, 2])))).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("chooses multiples before single dice", () => {
    expect(valuesFor(chooseComputerDice(diceFor([2, 2, 2, 1, 5, 6])))).toEqual([
      2, 2, 2,
    ]);
  });

  it("ignores dice that are not active", () => {
    const dice = diceFor([1, 5, 2]);
    dice[0] = { ...dice[0], status: DieStatus.HELD };

    expect(valuesFor(chooseComputerDice(dice))).toEqual([5]);
  });

  it("returns no dice when there is no scoring selection", () => {
    expect(valuesFor(chooseComputerDice(diceFor([2, 3, 4, 6])))).toEqual([]);
  });
});
