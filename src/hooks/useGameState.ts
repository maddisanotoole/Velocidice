import { useEffect, useRef, useState } from "react";
import {
  ACTION_MESSAGE_DELAY_MS,
  DEFAULT_TARGET_SCORE,
  INVALID_SELECTION_HELP_DELAY_MS,
  SCORE_DELTA_DELAY_MS,
  TURN_SWITCH_DELAY_MS,
} from "../appConstants";
import {
  type GameMode,
  type GameRecords,
  type PlayerId,
  type PlayerScores,
} from "../types";
import { diceValuesText } from "../game/diceText";
import {
  getRecordsWithVsComputerResult,
  loadRecords,
  saveRecords,
} from "../game/records";
import { scoreDice } from "../game/scoring";
import {
  isSoundMuted,
  playSound,
  primeSounds,
  setSoundMuted,
} from "../game/sound";
import {
  createRollingTurn,
  didFarkle,
  getActiveDice,
  getSelectedDice,
  holdSelectedAndRollActive,
  rollNewDice,
  toggleDieSelection,
  type TurnState,
} from "../game/turn";
import {
  getIsComputerControlledTurn,
  INVALID_SELECTION_MESSAGE,
} from "../game/viewState";
import { useComputerTurn } from "./useComputerTurn";

const INITIAL_PLAYER_SCORES: PlayerScores = {
  player: 0,
  player2: 0,
};

export function useGameState() {
  const [turn, setTurn] = useState<TurnState>(rollNewDice);
  const previousPlayerRef = useRef<PlayerId | null>(null);
  const previousSelectedDiceKeyRef = useRef("");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("player");
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE);
  const [isMuted, setIsMuted] = useState(isSoundMuted);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("computer");
  const [records, setRecords] = useState<GameRecords>(loadRecords);
  const [playerScore, setPlayerScore] = useState<PlayerScores>(
    INITIAL_PLAYER_SCORES,
  );
  const [roundScore, setRoundScore] = useState(0);
  const [actionMessage, setActionMessage] = useState("");
  const [roundScoreDelta, setRoundScoreDelta] = useState(0);
  const [totalScoreDelta, setTotalScoreDelta] = useState(0);
  const [isTurnChanging, setIsTurnChanging] = useState(false);
  const [rerollCount, setRerollCount] = useState(0);

  const dice = turn.dice;
  const selectedDice = getSelectedDice(dice);
  const selectedScoreResult = scoreDice(selectedDice);
  const selectedScore = selectedScoreResult.score;
  const selectedDiceAreValid = selectedScoreResult.allDiceScore;
  const invalidSelectedDieIds = new Set(
    selectedScoreResult.nonScoringDice.map((die) => die.id),
  );
  const selectedDiceKey = selectedDice
    .map((die) => `${die.id}:${die.value}`)
    .join("|");
  const hasFarkled = turn.status === "farkled";
  const isComputerControlledTurn = getIsComputerControlledTurn(
    gameMode,
    currentPlayer,
  );

  function resetGameState(message: string) {
    setPlayerScore(INITIAL_PLAYER_SCORES);
    setCurrentPlayer("player");
    setWinner(null);
    setTurn(rollNewDice());
    setRoundScore(0);
    setActionMessage(message);
    setRoundScoreDelta(0);
    setTotalScoreDelta(0);
    setIsTurnChanging(false);
    setRerollCount(0);
  }

  function switchTurn() {
    setCurrentPlayer((prev) => (prev === "player" ? "player2" : "player"));
    setRoundScore(0);
    setRerollCount(0);
    playSound("roll");
    setTurn(rollNewDice());
  }

  function holdDice() {
    if (winner || isTurnChanging || hasFarkled || !selectedDiceAreValid) {
      return;
    }

    const nextDice = holdSelectedAndRollActive(dice);
    const nextActiveDice = getActiveDice(nextDice);

    if (nextActiveDice.length === 0) {
      const nextRoll = rollNewDice();

      if (isComputerControlledTurn) {
        console.info("[Computer] Held dice and rolled hot dice", {
          heldScore: selectedScore,
          nextRoll: diceValuesText(nextRoll.dice),
          nextStatus: nextRoll.status,
        });
      }

      setActionMessage("Hot dice!");
      playSound("roll");
      setRoundScoreDelta(selectedScore);
      setRerollCount((prev) => prev + 1);
      setRoundScore((prev) => prev + selectedScore);
      setTurn(nextRoll);
      return;
    }

    const nextStatus = didFarkle(nextDice) ? "farkled" : "rolling";

    if (isComputerControlledTurn) {
      console.info("[Computer] Held dice and rerolled", {
        heldScore: selectedScore,
        nextActiveDice: diceValuesText(getActiveDice(nextDice)),
        nextStatus,
      });
    }

    setTurn({
      dice: nextDice,
      status: nextStatus,
    });

    playSound("roll");
    if (nextStatus === "rolling") {
      setActionMessage("Held");
      setRoundScoreDelta(selectedScore);
      setRerollCount((prev) => prev + 1);
    }

    setRoundScore((prev) =>
      nextStatus === "farkled" ? 0 : prev + selectedScore,
    );
  }

  function selectDie(id: number) {
    if (winner || isTurnChanging || hasFarkled || isComputerControlledTurn) {
      return;
    }

    playSound("select");
    setTurn((prev) => ({
      ...prev,
      dice: toggleDieSelection(prev.dice, id),
    }));
  }

  function endTurn() {
    if (winner || isTurnChanging || (!hasFarkled && !selectedDiceAreValid)) {
      return;
    }

    const bankedScore = hasFarkled ? 0 : roundScore + selectedScore;
    const willWin = playerScore[currentPlayer] + bankedScore >= targetScore;

    if (!hasFarkled) {
      playSound(
        willWin && isComputerControlledTurn ? "lose" : willWin ? "win" : "bank",
      );

      if (isComputerControlledTurn) {
        console.info("[Computer] Banked turn", {
          roundScore,
          selectedScore,
          bankedScore,
          newTotal: playerScore.player2 + bankedScore,
        });
      }

      setActionMessage("Banked");
      setTotalScoreDelta(bankedScore);
      setPlayerScore((prev) => {
        const nextScore = prev[currentPlayer] + bankedScore;

        return {
          ...prev,
          [currentPlayer]: nextScore,
        };
      });
    }

    if (willWin) {
      if (gameMode === "computer") {
        setRecords((prev) => {
          const nextRecords = getRecordsWithVsComputerResult(
            prev,
            currentPlayer,
          );

          saveRecords(nextRecords);
          return nextRecords;
        });
      }

      setWinner(currentPlayer);
      setRoundScore(0);
      setTurn(createRollingTurn());
      return;
    }

    setIsTurnChanging(true);
  }

  function resetGame(message = winner ? "New Game" : "Game Reset") {
    resetGameState(message);
    playSound("roll");
  }

  function startGame() {
    primeSounds();
    resetGameState("");
    setHasStartedGame(true);
    playSound("roll");
  }

  function backToMenu() {
    setHasStartedGame(false);
    resetGame("Back to Menu");
  }

  function handleMuteChange(nextIsMuted: boolean) {
    setIsMuted(nextIsMuted);
    setSoundMuted(nextIsMuted);
  }

  useEffect(() => {
    const previousPlayer = previousPlayerRef.current;
    previousPlayerRef.current = currentPlayer;

    if (!isComputerControlledTurn || previousPlayer === "player2" || winner) {
      return;
    }

    console.info("[Computer] Turn started", {
      computerScore: playerScore.player2,
      playerScore: playerScore.player,
      targetScore,
      roll: diceValuesText(dice),
    });
  }, [
    currentPlayer,
    dice,
    isComputerControlledTurn,
    playerScore,
    targetScore,
    winner,
  ]);

  useComputerTurn({
    currentPlayer,
    dice,
    endTurn,
    hasFarkled,
    holdDice,
    isEnabled: hasStartedGame && gameMode === "computer",
    isTurnChanging,
    playerScore,
    rerollCount,
    roundScore,
    selectedDice,
    selectedScore,
    setTurn,
    targetScore,
    winner,
  });

  useEffect(() => {
    if (!hasStartedGame || !hasFarkled || winner || isTurnChanging) return;

    playSound("farkle");
    const timeout = setTimeout(() => {
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
    }, TURN_SWITCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [hasFarkled, hasStartedGame, winner, isTurnChanging]);

  useEffect(() => {
    if (!hasStartedGame || !isTurnChanging) return;

    const timeout = setTimeout(() => {
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
      setIsTurnChanging(false);
    }, TURN_SWITCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [hasStartedGame, isTurnChanging]);

  useEffect(() => {
    if (!actionMessage) return;

    if (actionMessage === INVALID_SELECTION_MESSAGE) {
      return;
    }

    const timeout = setTimeout(() => {
      setActionMessage("");
    }, ACTION_MESSAGE_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [actionMessage]);

  useEffect(() => {
    const previousSelectedDiceKey = previousSelectedDiceKeyRef.current;
    previousSelectedDiceKeyRef.current = selectedDiceKey;

    if (
      previousSelectedDiceKey !== selectedDiceKey &&
      actionMessage === INVALID_SELECTION_MESSAGE
    ) {
      setActionMessage("");
    }
  }, [actionMessage, selectedDiceKey]);

  useEffect(() => {
    if (
      !hasStartedGame ||
      winner ||
      isTurnChanging ||
      hasFarkled ||
      isComputerControlledTurn ||
      invalidSelectedDieIds.size === 0
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      setActionMessage(INVALID_SELECTION_MESSAGE);
    }, INVALID_SELECTION_HELP_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [
    hasFarkled,
    hasStartedGame,
    invalidSelectedDieIds.size,
    isComputerControlledTurn,
    isTurnChanging,
    selectedDiceKey,
    winner,
  ]);

  useEffect(() => {
    if (roundScoreDelta === 0 && totalScoreDelta === 0) return;

    const timeout = setTimeout(() => {
      setRoundScoreDelta(0);
      setTotalScoreDelta(0);
    }, SCORE_DELTA_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [roundScoreDelta, totalScoreDelta]);

  return {
    actionMessage,
    backToMenu,
    currentPlayer,
    dice,
    gameMode,
    handleMuteChange,
    hasFarkled,
    hasStartedGame,
    invalidSelectedDieIds,
    isComputerControlledTurn,
    isMuted,
    isTurnChanging,
    playerScore,
    records,
    rerollCount,
    resetGame,
    roundScore,
    roundScoreDelta,
    selectedDice,
    selectedDiceAreValid,
    selectedScore,
    setGameMode,
    setTargetScore,
    startGame,
    targetScore,
    totalScoreDelta,
    winner,
    holdDice,
    selectDie,
    endTurn,
  };
}
