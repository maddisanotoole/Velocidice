type ScoreResult = {
  score: number;
  allDiceScore: boolean;
};

export function scoreDice(values: number[]): ScoreResult {
  if (values.length === 0) {
    return {
      score: 0,
      allDiceScore: false,
    };
  }
  let score = 0;
  let allDiceScore = true;
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const value of values) {
    counts[value]++;
  }

  if (values.length === 6) {
    const isStraight = counts.slice(1).every((count) => count === 1);

    if (isStraight) {
      return {
        score: 1500,
        allDiceScore: true,
      };
    }

    const tripletCount = counts.slice(1).filter((count) => count === 3).length;

    if (tripletCount === 2) {
      return {
        score: 2500,
        allDiceScore: true,
      };
    }

    const pairCount = counts.slice(1).filter((count) => count === 2).length;

    const isThreePairs = pairCount === 3;
    if (isThreePairs) {
      return {
        score: 750,
        allDiceScore: true,
      };
    }
  }

  if (values.length >= 5) {
    const isLowStraight = [1, 2, 3, 4, 5].every((value) => counts[value] >= 1);
    const isHighStraight = [2, 3, 4, 5, 6].every((value) => counts[value] >= 1);

    if (isLowStraight || isHighStraight) {
      score += 1000;

      const straightValues = isLowStraight ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6];

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
