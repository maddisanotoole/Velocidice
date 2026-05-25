import { DieStatus, type Die } from "../types";
import {
  countDiceValues,
  countPairs,
  countTriplets,
  findFiveDieStraightValues,
  isSixDieStraight,
  scoreDice,
} from "./scoring";

const COMPUTER_BANK_THRESHOLDS = [750, 500, 300] as const;
const PLAYER_CLOSE_TO_WINNING_POINTS = 300;
const MINIMUM_SMALL_ROLL_BANK_SCORE = 300;
const PLENTY_OF_DICE_REMAINING = 4;
const SMALL_SELECTION_SCORE = 150;

export type ComputerBankDecisionDetails = Record<
  string,
  number | boolean | string
>;

export type ComputerBankDecision = {
  shouldBank: boolean;
  message: string;
  details: ComputerBankDecisionDetails;
};

type ComputerBankDecisionInput = {
  bankableScore: number;
  computerPointsToWin: number;
  playerPointsToWin: number;
  remainingDice: number;
  rerollCount: number;
  selectedScore: number;
};

export function getComputerBankThreshold(rerollCount: number): number {
  return (
    COMPUTER_BANK_THRESHOLDS[rerollCount] ??
    COMPUTER_BANK_THRESHOLDS[COMPUTER_BANK_THRESHOLDS.length - 1]
  );
}

export function getComputerBankDecision({
  bankableScore,
  computerPointsToWin,
  playerPointsToWin,
  remainingDice,
  rerollCount,
  selectedScore,
}: ComputerBankDecisionInput): ComputerBankDecision {
  const computerBankThreshold = getComputerBankThreshold(rerollCount);
  const effectiveBankThreshold = Math.min(
    computerBankThreshold,
    computerPointsToWin,
  );
  const playerIsCloseToWinning =
    playerPointsToWin <= PLAYER_CLOSE_TO_WINNING_POINTS;
  const hasPlentyOfDiceRemaining = remainingDice >= PLENTY_OF_DICE_REMAINING;
  const hasSmallSelectionWithPlentyOfDice =
    selectedScore <= SMALL_SELECTION_SCORE &&
    bankableScore < computerPointsToWin &&
    hasPlentyOfDiceRemaining;

  const sharedDetails = {
    bankableScore,
    computerBankThreshold,
    computerPointsToWin,
    effectiveBankThreshold,
    playerIsCloseToWinning,
    playerPointsToWin,
    remainingDice,
    rerollCount,
    selectedScore,
    hasPlentyOfDiceRemaining,
    hasSmallSelectionWithPlentyOfDice,
  };

  if (bankableScore >= computerPointsToWin) {
    return {
      shouldBank: true,
      message: "[Computer] Decision: bank because computer can win now",
      details: sharedDetails,
    };
  }

  if (
    remainingDice <= 2 &&
    bankableScore >= MINIMUM_SMALL_ROLL_BANK_SCORE &&
    !playerIsCloseToWinning
  ) {
    return {
      shouldBank: true,
      message: "[Computer] Decision: bank because fewer than 3 dice remain",
      details: sharedDetails,
    };
  }

  if (hasSmallSelectionWithPlentyOfDice) {
    return {
      shouldBank: false,
      message: "[Computer] Decision: take risk, hold and reroll",
      details: {
        ...sharedDetails,
        reason: "Small score with plenty of dice remaining",
      },
    };
  }

  if (!playerIsCloseToWinning && bankableScore >= effectiveBankThreshold) {
    return {
      shouldBank: true,
      message: "[Computer] Decision: bank because threshold was reached",
      details: sharedDetails,
    };
  }

  return {
    shouldBank: false,
    message: "[Computer] Decision: take risk, hold and reroll",
    details: {
      ...sharedDetails,
      reason: playerIsCloseToWinning
        ? "Player is close to winning"
        : "Bank threshold not reached",
    },
  };
}

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

function chooseSingleScoringDice(activeDice: Die[]): Die[] {
  const ones = getDiceByValue(activeDice, 1);
  const fives = getDiceByValue(activeDice, 5);

  if (activeDice.length > 3 && ones.length > 0) {
    return ones;
  }

  if (activeDice.length > 3 && fives.length > 0) {
    return [fives[0]];
  }

  return activeDice.filter((die) => die.value === 1 || die.value === 5);
}

export function chooseAdditionalBankingDice(dice: Die[]): Die[] {
  return getActiveDice(dice).filter(
    (die) => die.value === 1 || die.value === 5,
  );
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

  return chooseSingleScoringDice(activeDice);
}

export const getBestScoringSelection = chooseComputerDice;
