export function scoreDice(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  let score = 0;
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const value of values) {
    counts[value]++;
  }

  for (const index in counts) {
    const count = counts[index];
    const newScore = calculateScore(count, Number(index));
    score += newScore;
  }

  return score;
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
  const extraDice = count - 3;

  return tripleScore * Math.pow(2, extraDice);
};
