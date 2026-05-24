import { describe, expect, it } from "vitest";
import { DieStatus, type Die } from "../types";
import {
  chooseAdditionalBankingDice,
  chooseComputerDice,
  getComputerBankDecision,
  getComputerBankThreshold,
} from "./computer";

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

  it("prefers single ones over single fives when more than 3 dice are available", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 5, 2, 2, 3, 6])))).toEqual([
      1,
    ]);
  });

  it("still chooses single fives when there are no single ones", () => {
    expect(valuesFor(chooseComputerDice(diceFor([5, 2, 2, 3, 4, 4])))).toEqual([
      5,
    ]);
  });

  it("chooses only one single five when more than 3 dice are available", () => {
    expect(valuesFor(chooseComputerDice(diceFor([4, 5, 2, 3, 5, 2])))).toEqual([
      5,
    ]);
  });

  it("keeps single fives when 3 or fewer dice are available", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 5, 2])))).toEqual([1, 5]);
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

  it("does not add loose scoring singles while choosing dice to reroll", () => {
    expect(valuesFor(chooseComputerDice(diceFor([1, 1, 5, 1, 1, 3])))).toEqual([
      1, 1, 1, 1,
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

describe("chooseAdditionalBankingDice", () => {
  it("chooses only active scoring singles before banking", () => {
    const dice = diceFor([1, 1, 5, 1, 1, 3]);
    dice[0] = { ...dice[0], status: DieStatus.SELECTED };
    dice[1] = { ...dice[1], status: DieStatus.SELECTED };
    dice[3] = { ...dice[3], status: DieStatus.SELECTED };
    dice[4] = { ...dice[4], status: DieStatus.SELECTED };

    expect(valuesFor(chooseAdditionalBankingDice(dice))).toEqual([5]);
  });

  it("does not choose selected or held scoring singles again", () => {
    const dice = diceFor([1, 5, 1, 5]);
    dice[0] = { ...dice[0], status: DieStatus.SELECTED };
    dice[1] = { ...dice[1], status: DieStatus.HELD };

    expect(valuesFor(chooseAdditionalBankingDice(dice))).toEqual([1, 5]);
  });
});

describe("getComputerBankDecision", () => {
  it("banks immediately when the computer can win", () => {
    const decision = getComputerBankDecision({
      bankableScore: 400,
      computerPointsToWin: 400,
      playerPointsToWin: 2000,
      remainingDice: 5,
      rerollCount: 0,
    });

    expect(decision.shouldBank).toBe(true);
    expect(decision.message).toContain("can win now");
  });

  it("banks with few dice left once there are enough points to protect", () => {
    const decision = getComputerBankDecision({
      bankableScore: 350,
      computerPointsToWin: 2400,
      playerPointsToWin: 2000,
      remainingDice: 2,
      rerollCount: 0,
    });

    expect(decision.shouldBank).toBe(true);
    expect(decision.message).toContain("fewer than 3 dice");
  });

  it("keeps rolling with few dice left when the score is too small", () => {
    const decision = getComputerBankDecision({
      bankableScore: 150,
      computerPointsToWin: 2400,
      playerPointsToWin: 2000,
      remainingDice: 2,
      rerollCount: 0,
    });

    expect(decision.shouldBank).toBe(false);
  });

  it("uses the points needed to win as the banking threshold when it is lower", () => {
    const decision = getComputerBankDecision({
      bankableScore: 450,
      computerPointsToWin: 500,
      playerPointsToWin: 2000,
      remainingDice: 3,
      rerollCount: 0,
    });

    expect(decision.shouldBank).toBe(false);
    expect(decision.details.effectiveBankThreshold).toBe(500);
  });

  it("takes bigger risks when the player is close to winning", () => {
    const decision = getComputerBankDecision({
      bankableScore: 800,
      computerPointsToWin: 2000,
      playerPointsToWin: 300,
      remainingDice: 3,
      rerollCount: 0,
    });

    expect(decision.shouldBank).toBe(false);
    expect(decision.details.reason).toBe("Player is close to winning");
  });
});

describe("getComputerBankThreshold", () => {
  it("lowers the banking threshold as reroll count increases", () => {
    expect(getComputerBankThreshold(0)).toBe(750);
    expect(getComputerBankThreshold(1)).toBe(500);
    expect(getComputerBankThreshold(2)).toBe(300);
    expect(getComputerBankThreshold(3)).toBe(300);
  });
});
