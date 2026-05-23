import { DieStatus, type Die } from "../types";
import {
  countDiceValues,
  countPairs,
  countTriplets,
  findFiveDieStraightValues,
  isSixDieStraight,
  scoreDice,
} from "./scoring";

export const COMPUTER_BANK_THRESHOLD = 750;

function getActiveDice(dice: Die[]): Die[] {
  return dice.filter((die) => die.status === DieStatus.ACTIVE);
}

function getDiceByValue(dice: Die[], value: number): Die[] {
  return dice.filter((die) => die.value === value);
}

function getDiceWithValues(dice: Die[], values: number[]): Die[] {
  const remainingValues = [...values];
  const selectedDice: Die[] = [];

  for (const die of dice) {
    const valueIndex = remainingValues.indexOf(die.value);

    if (valueIndex >= 0) {
      selectedDice.push(die);
      remainingValues.splice(valueIndex, 1);
    }
  }

  return selectedDice;
}

export function chooseComputerDice(dice: Die[]): Die[] {
  const activeDice = getActiveDice(dice);
  const values = activeDice.map((die) => die.value);

  if (activeDice.length === 0) {
    return [];
  }

  const possibleScore = scoreDice(values);

  if (possibleScore.allDiceScore) {
    return activeDice;
  }

  const counts = countDiceValues(values);

  if (activeDice.length === 6 && isSixDieStraight(counts)) {
    return activeDice;
  }

  if (
    activeDice.length === 6 &&
    (countTriplets(counts) === 2 || countPairs(counts) === 3)
  ) {
    return activeDice;
  }

  const straightValues = findFiveDieStraightValues(counts);

  if (straightValues) {
    return getDiceWithValues(activeDice, straightValues);
  }

  for (let count = 6; count >= 3; count--) {
    for (let value = 1; value <= 6; value++) {
      if (counts[value] === count) {
        return getDiceByValue(activeDice, value);
      }
    }
  }

  return activeDice.filter((die) => die.value === 1 || die.value === 5);
}

export const getBestScoringSelection = chooseComputerDice;
