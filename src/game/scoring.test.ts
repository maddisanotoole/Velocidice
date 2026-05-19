// src/game/scoring.test.ts
import { describe, expect, it } from "vitest";
import { scoreDice } from "./scoring";

describe("scoreDice", () => {
  it("scores single ones and fives", () => {
    expect(scoreDice([1])).toEqual({
      score: 100,
      allDiceScore: true,
    });

    expect(scoreDice([5])).toEqual({
      score: 50,
      allDiceScore: true,
    });

    expect(scoreDice([1, 5])).toEqual({
      score: 150,
      allDiceScore: true,
    });
  });

  it("does not allow non-scoring dice", () => {
    expect(scoreDice([2])).toEqual({
      score: 0,
      allDiceScore: false,
    });

    expect(scoreDice([1, 2])).toEqual({
      score: 100,
      allDiceScore: false,
    });
  });

  it("scores three of a kind", () => {
    expect(scoreDice([1, 1, 1]).score).toBe(1000);
    expect(scoreDice([2, 2, 2]).score).toBe(200);
    expect(scoreDice([3, 3, 3]).score).toBe(300);
    expect(scoreDice([4, 4, 4]).score).toBe(400);
    expect(scoreDice([5, 5, 5]).score).toBe(500);
    expect(scoreDice([6, 6, 6]).score).toBe(600);
  });

  it("scores four of a kind as three-of-a-kind score times 2", () => {
    expect(scoreDice([1, 1, 1, 1])).toEqual({
      score: 2000,
      allDiceScore: true,
    });

    expect(scoreDice([2, 2, 2, 2])).toEqual({
      score: 400,
      allDiceScore: true,
    });
  });

  it("scores five of a kind as three-of-a-kind score times 3", () => {
    expect(scoreDice([1, 1, 1, 1, 1])).toEqual({
      score: 3000,
      allDiceScore: true,
    });

    expect(scoreDice([2, 2, 2, 2, 2])).toEqual({
      score: 600,
      allDiceScore: true,
    });
  });

  it("scores six of a kind as three-of-a-kind score times 4", () => {
    expect(scoreDice([1, 1, 1, 1, 1, 1])).toEqual({
      score: 4000,
      allDiceScore: true,
    });

    expect(scoreDice([2, 2, 2, 2, 2, 2])).toEqual({
      score: 800,
      allDiceScore: true,
    });
  });

  it("scores a six-die straight", () => {
    expect(scoreDice([1, 2, 3, 4, 5, 6])).toEqual({
      score: 1500,
      allDiceScore: true,
    });
  });

  it("scores a five-die straight", () => {
    expect(scoreDice([1, 2, 3, 4, 5])).toEqual({
      score: 1000,
      allDiceScore: true,
    });

    expect(scoreDice([2, 3, 4, 5, 6])).toEqual({
      score: 1000,
      allDiceScore: true,
    });
  });

  it("scores a five-die straight plus a scoring leftover die", () => {
    expect(scoreDice([1, 2, 3, 4, 5, 1])).toEqual({
      score: 1100,
      allDiceScore: true,
    });

    expect(scoreDice([1, 2, 3, 4, 5, 5])).toEqual({
      score: 1050,
      allDiceScore: true,
    });
  });

  it("rejects a five-die straight plus a non-scoring leftover die", () => {
    expect(scoreDice([1, 2, 3, 4, 5, 2])).toEqual({
      score: 1000,
      allDiceScore: false,
    });
  });

  it("scores three pairs", () => {
    expect(scoreDice([1, 1, 2, 2, 3, 3])).toEqual({
      score: 750,
      allDiceScore: true,
    });
  });

  it("scores two triplets", () => {
    expect(scoreDice([2, 2, 2, 3, 3, 3])).toEqual({
      score: 2500,
      allDiceScore: true,
    });
  });
});
