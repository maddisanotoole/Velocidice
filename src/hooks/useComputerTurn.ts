import { useEffect, type Dispatch, type SetStateAction } from "react";
import { COMPUTER_TURN_DELAY_MS } from "../appConstants";
import { DieStatus, type Die, type PlayerId, type PlayerScores } from "../types";
import {
  chooseAdditionalBankingDice,
  chooseComputerDice,
  getComputerBankDecision,
  type ComputerBankDecisionDetails,
} from "../game/computer";
import { diceValuesText } from "../game/diceText";
import { scoreDice } from "../game/scoring";
import { playSound } from "../game/sound";
import {
  getActiveDice,
  pointsToWin,
  type TurnState,
} from "../game/turn";

type UseComputerTurnArgs = {
  currentPlayer: PlayerId;
  dice: Die[];
  endTurn: () => void;
  hasFarkled: boolean;
  holdDice: () => void;
  isEnabled: boolean;
  isTurnChanging: boolean;
  playerScore: PlayerScores;
  rerollCount: number;
  roundScore: number;
  selectedDice: Die[];
  selectedScore: number;
  setTurn: Dispatch<SetStateAction<TurnState>>;
  targetScore: number;
  winner: PlayerId | null;
};

export function useComputerTurn({
  currentPlayer,
  dice,
  endTurn,
  hasFarkled,
  holdDice,
  isEnabled,
  isTurnChanging,
  playerScore,
  rerollCount,
  roundScore,
  selectedDice,
  selectedScore,
  setTurn,
  targetScore,
  winner,
}: UseComputerTurnArgs) {
  const isComputerTurn = isEnabled && currentPlayer === "player2";

  useEffect(() => {
    if (!isComputerTurn || hasFarkled || winner || isTurnChanging) return;

    const timeout = setTimeout(() => {
      if (hasFarkled) {
        endTurn();
        return;
      }

      if (selectedDice.length === 0) {
        const selection = chooseComputerDice(dice);
        const selectedIds = new Set(selection.map((die) => die.id));

        console.info("[Computer] Evaluating roll", {
          rollNumber: rerollCount + 1,
          activeDice: diceValuesText(getActiveDice(dice)),
          selectedDice: diceValuesText(selection),
          selectedScore: scoreDice(selection.map((die) => die.value)).score,
        });

        if (selectedIds.size === 0) {
          console.info("[Computer] Decision: no scoring dice, end turn");
          endTurn();
          return;
        }

        console.info("[Computer] Decision: select scoring dice", {
          selectedDice: diceValuesText(selection),
        });

        playSound("select");
        setTurn((prev) => ({
          ...prev,
          dice: prev.dice.map((die) =>
            selectedIds.has(die.id)
              ? { ...die, status: DieStatus.SELECTED }
              : die,
          ),
        }));
        return;
      }

      const remainingDice = getActiveDice(dice).length;
      const computerPointsToWin = pointsToWin(
        playerScore.player2,
        targetScore,
      );
      const playerPointsToWin = pointsToWin(playerScore.player, targetScore);
      const bankableScore = roundScore + selectedScore;
      const bankDecision = getComputerBankDecision({
        bankableScore,
        computerPointsToWin,
        playerPointsToWin,
        remainingDice,
        rerollCount,
        selectedScore,
      });

      console.info("[Computer] Evaluating selected dice", {
        rollNumber: rerollCount + 1,
        selectedDice: diceValuesText(selectedDice),
        selectedScore,
        roundScore,
        ...bankDecision.details,
      });

      if (remainingDice === 0) {
        console.info("[Computer] Decision: hot dice, hold and reroll all dice");
        holdDice();
        return;
      }

      function bankOrSelectExtraDice(
        message: string,
        details?: ComputerBankDecisionDetails,
      ) {
        const additionalBankingDice = chooseAdditionalBankingDice(dice);

        if (additionalBankingDice.length > 0) {
          const selectedIds = new Set(
            additionalBankingDice.map((die) => die.id),
          );

          console.info("[Computer] Decision: add scoring singles before banking", {
            selectedDice: diceValuesText(additionalBankingDice),
            reason: message,
            ...details,
          });

          playSound("select");
          setTurn((prev) => ({
            ...prev,
            dice: prev.dice.map((die) =>
              selectedIds.has(die.id)
                ? { ...die, status: DieStatus.SELECTED }
                : die,
            ),
          }));
          return;
        }

        console.info(message, details);
        endTurn();
      }

      if (bankDecision.shouldBank) {
        bankOrSelectExtraDice(bankDecision.message, bankDecision.details);
        return;
      }

      console.info(bankDecision.message, bankDecision.details);
      holdDice();
    }, COMPUTER_TURN_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [
    dice,
    endTurn,
    hasFarkled,
    holdDice,
    isEnabled,
    isComputerTurn,
    isTurnChanging,
    playerScore,
    rerollCount,
    roundScore,
    selectedDice,
    selectedScore,
    setTurn,
    targetScore,
    winner,
  ]);
}
