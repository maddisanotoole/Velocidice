import type {
  DiceCounts,
  ScoreDiceInput,
  ScoreResult,
  ScoringDieInput,
} from "../types";

export const LOW_STRAIGHT = [1, 2, 3, 4, 5] as const;
export const HIGH_STRAIGHT = [2, 3, 4, 5, 6] as const;

export function countDiceValues(values: number[]): DiceCounts {
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const value of values) {
    counts[value]++;
  }

  return counts;
}

export function isSixDieStraight(counts: DiceCounts): boolean {
  return counts.slice(1).every((count) => count === 1);
}

export function findFiveDieStraightValues(
  counts: DiceCounts,
): number[] | null {
  if (LOW_STRAIGHT.every((value) => counts[value] >= 1)) {
    return [...LOW_STRAIGHT];
  }

  if (HIGH_STRAIGHT.every((value) => counts[value] >= 1)) {
    return [...HIGH_STRAIGHT];
  }

  return null;
}

export function countPairs(counts: DiceCounts): number {
  return counts.slice(1).filter((count) => count === 2).length;
}

export function countTriplets(counts: DiceCounts): number {
  return counts.slice(1).filter((count) => count === 3).length;
}

function normalizeScoringDice(dice: ScoreDiceInput[]): ScoringDieInput[] {
  return dice.map((die, index) =>
    typeof die === "number" ? { id: index, value: die } : die,
  );
}

export function scoreDice(inputDice: ScoreDiceInput[]): ScoreResult {
  if (inputDice.length === 0) {
    return {
      score: 0,
      allDiceScore: false,
      scoringDice: [],
      nonScoringDice: [],
    };
  }

  const dice = normalizeScoringDice(inputDice);
  const values = dice.map((die) => die.value);
  let score = 0;
  const counts = countDiceValues(values);
  const scoringDieIndexes = new Set<number>();

  if (values.length === 6) {
    if (isSixDieStraight(counts)) {
      return {
        score: 1500,
        allDiceScore: true,
        scoringDice: dice,
        nonScoringDice: [],
      };
    }

    if (countTriplets(counts) === 2) {
      return {
        score: 2500,
        allDiceScore: true,
        scoringDice: dice,
        nonScoringDice: [],
      };
    }

    if (countPairs(counts) === 3) {
      return {
        score: 750,
        allDiceScore: true,
        scoringDice: dice,
        nonScoringDice: [],
      };
    }
  }

  if (values.length >= 5) {
    const straightValues = findFiveDieStraightValues(counts);

    if (straightValues) {
      score += 1000;

      // remove the value of the straight, so we can score the remaining die
      for (const value of straightValues) {
        const scoringDieIndex = dice.findIndex(
          (die, index) =>
            die.value === value && !scoringDieIndexes.has(index),
        );

        if (scoringDieIndex >= 0) {
          scoringDieIndexes.add(scoringDieIndex);
        }

        counts[value]--;
      }
    }
  }

  for (let value = 1; value < counts.length; value++) {
    const count = counts[value];
    const newScore = calculateScore(count, value);
    score += newScore;

    if (newScore > 0) {
      for (const [index, die] of dice.entries()) {
        if (die.value === value && !scoringDieIndexes.has(index)) {
          scoringDieIndexes.add(index);
        }
      }
    }
  }

  const scoringDice = dice.filter((_, index) => scoringDieIndexes.has(index));
  const nonScoringDice = dice.filter(
    (_, index) => !scoringDieIndexes.has(index),
  );

  return {
    score,
    allDiceScore: score > 0 && nonScoringDice.length === 0,
    scoringDice,
    nonScoringDice,
  };
}

const calculateScore = (count: number, index: number): number => {
  const baseScore = [0, 100, 0, 0, 0, 50, 0];
  const threeOfAKind = [0, 1000, 200, 300, 400, 500, 600];
  if (count === 0) {
    return 0;
  }

  if (count < 3) {
    if (index == 1 || index == 5) {
      return baseScore[index] * count;
    }
    return 0;
  }
  const tripleScore = threeOfAKind[index];
  const multiplier = count - 2;

  return tripleScore * multiplier;
};
