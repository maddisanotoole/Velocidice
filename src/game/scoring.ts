type ScoreResult = {
  score: number;
  allDiceScore: boolean;
};

export type DiceCounts = number[];

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

export function scoreDice(values: number[]): ScoreResult {
  if (values.length === 0) {
    return {
      score: 0,
      allDiceScore: false,
    };
  }
  let score = 0;
  let allDiceScore = true;
  const counts = countDiceValues(values);

  if (values.length === 6) {
    if (isSixDieStraight(counts)) {
      return {
        score: 1500,
        allDiceScore: true,
      };
    }

    if (countTriplets(counts) === 2) {
      return {
        score: 2500,
        allDiceScore: true,
      };
    }

    if (countPairs(counts) === 3) {
      return {
        score: 750,
        allDiceScore: true,
      };
    }
  }

  if (values.length >= 5) {
    const straightValues = findFiveDieStraightValues(counts);

    if (straightValues) {
      score += 1000;

      // remove the value of the straight, so we can score the remaining die
      for (const value of straightValues) {
        counts[value]--;
      }
    }
  }

  for (const index in counts) {
    const count = counts[index];
    const newScore = calculateScore(count, Number(index));
    score += newScore;

    if (count > 0 && newScore === 0) {
      allDiceScore = false;
    }
  }

  return {
    score,
    allDiceScore: score > 0 && allDiceScore,
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
