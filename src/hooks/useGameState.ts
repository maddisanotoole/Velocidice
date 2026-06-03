import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACTION_MESSAGE_DELAY_MS,
  DEFAULT_MATCH_LENGTH,
  DEFAULT_TARGET_SCORE,
  INVALID_SELECTION_HELP_DELAY_MS,
  SCORE_DELTA_DELAY_MS,
  TURN_SWITCH_DELAY_MS,
} from "../appConstants";
import {
  type GameMode,
  type GameRecords,
  type MatchLength,
  type PlayerId,
  type PlayerScores,
} from "../types";
import {
  debugRollsText,
  parseDebugRolls,
  takeDebugRoll,
} from "../game/debugRolls";
import { logDebug } from "../game/debugLog";
import { diceValuesText } from "../game/diceText";
import {
  getMatchWinner,
  getNextMatchScore,
  getRequiredMatchWins,
} from "../game/match";
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
import { getNextPlayer, shouldAutoSwitchAfterFarkle } from "../game/turnFlow";
import {
  getIsComputerControlledTurn,
  INVALID_SELECTION_MESSAGE,
} from "../game/viewState";
import { useComputerTurn } from "./useComputerTurn";

const INITIAL_PLAYER_SCORES: PlayerScores = {
  player: 0,
  player2: 0,
};

function turnDebugDetails(turn: TurnState) {
  return {
    dice: diceValuesText(turn.dice),
    status: turn.status,
  };
}

export function useGameState() {
  const [turn, setTurn] = useState<TurnState>(rollNewDice);
  const previousPlayerRef = useRef<PlayerId | null>(null);
  const previousSelectedDiceKeyRef = useRef("");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("player");
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [matchWinner, setMatchWinner] = useState<PlayerId | null>(null);
  const [matchLength, setMatchLength] =
    useState<MatchLength>(DEFAULT_MATCH_LENGTH);
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE);
  const [isMuted, setIsMuted] = useState(isSoundMuted);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("computer");
  const [records, setRecords] = useState<GameRecords>(loadRecords);
  const [playerScore, setPlayerScore] = useState<PlayerScores>(
    INITIAL_PLAYER_SCORES,
  );
  const [matchScore, setMatchScore] = useState<PlayerScores>(
    INITIAL_PLAYER_SCORES,
  );
  const [roundScore, setRoundScore] = useState(0);
  const [actionMessage, setActionMessage] = useState("");
  const [roundScoreDelta, setRoundScoreDelta] = useState(0);
  const [totalScoreDelta, setTotalScoreDelta] = useState(0);
  const [isTurnChanging, setIsTurnChanging] = useState(false);
  const [rerollCount, setRerollCount] = useState(0);
  const debugRollsRef = useRef(parseDebugRolls(""));
  const [debugRollPresetText, setDebugRollPresetText] = useState("");

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
  const requiredMatchWins = getRequiredMatchWins(matchLength);
  const isComputerControlledTurn = getIsComputerControlledTurn(
    gameMode,
    currentPlayer,
  );

  const consumeDebugRollValues = useCallback((diceCount: number): number[] => {
    if (diceCount <= 0 || debugRollsRef.current.length === 0) {
      return [];
    }

    const { nextRolls, values } = takeDebugRoll(
      debugRollsRef.current,
      diceCount,
    );

    debugRollsRef.current = nextRolls;
    setDebugRollPresetText(debugRollsText(nextRolls));

    return values;
  }, []);

  const rollNewDebugDice = useCallback((reason: string) => {
    const presetValues = consumeDebugRollValues(6);
    const nextTurn = rollNewDice(presetValues);

    logDebug("[Game Debug] Rolled new dice", {
      reason,
      presetValues,
      ...turnDebugDetails(nextTurn),
    });

    return nextTurn;
  }, [consumeDebugRollValues]);

  function setDebugRollsText(nextText: string) {
    debugRollsRef.current = parseDebugRolls(nextText);
    setDebugRollPresetText(nextText);
  }

  function resetGameState(message: string) {
    const nextTurn = rollNewDebugDice("resetGameState");

    logDebug("[Game Debug] Reset game state", {
      currentPlayer: "player",
      message,
      ...turnDebugDetails(nextTurn),
    });

    setPlayerScore(INITIAL_PLAYER_SCORES);
    setCurrentPlayer("player");
    setWinner(null);
    setTurn(nextTurn);
    setRoundScore(0);
    setActionMessage(message);
    setRoundScoreDelta(0);
    setTotalScoreDelta(0);
    setIsTurnChanging(false);
    setRerollCount(0);
  }

  function resetMatchState() {
    setMatchScore(INITIAL_PLAYER_SCORES);
    setMatchWinner(null);
  }

  const switchTurn = useCallback(() => {
    const nextTurn = rollNewDebugDice("switchTurn");

    setCurrentPlayer((prev) => {
      const nextPlayer = getNextPlayer(prev);

      logDebug("[Game Debug] Switching turn", {
        from: prev,
        to: nextPlayer,
        ...turnDebugDetails(nextTurn),
      });

      return nextPlayer;
    });
    setRoundScore(0);
    setRerollCount(0);
    playSound("roll");
    setTurn(nextTurn);
  }, [rollNewDebugDice]);

  function holdDice() {
    if (winner || isTurnChanging || hasFarkled || !selectedDiceAreValid) {
      return;
    }

    const nextDice = holdSelectedAndRollActive(
      dice,
      consumeDebugRollValues(getActiveDice(dice).length),
    );
    const nextActiveDice = getActiveDice(nextDice);

    if (nextActiveDice.length === 0) {
      const nextRoll = rollNewDebugDice("hotDice");

      if (isComputerControlledTurn) {
        logDebug("[Computer] Held dice and rolled hot dice", {
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
      logDebug("[Computer] Held dice and rerolled", {
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
    const nextPlayerScore = {
      ...playerScore,
      [currentPlayer]: playerScore[currentPlayer] + bankedScore,
    };
    const willWin = nextPlayerScore[currentPlayer] >= targetScore;

    if (!hasFarkled) {
      playSound(
        willWin && isComputerControlledTurn ? "lose" : willWin ? "win" : "bank",
      );

      if (isComputerControlledTurn) {
        logDebug("[Computer] Banked turn", {
          roundScore,
          selectedScore,
          bankedScore,
          newTotal: playerScore.player2 + bankedScore,
        });
      }

      setActionMessage("Banked");
      setTotalScoreDelta(bankedScore);
      setPlayerScore(nextPlayerScore);
    }

    if (willWin) {
      const nextMatchScore = getNextMatchScore(matchScore, currentPlayer);
      const nextMatchWinner = getMatchWinner(nextMatchScore, matchLength);

      setMatchScore(nextMatchScore);
      setMatchWinner(nextMatchWinner);

      if (gameMode === "computer" && nextMatchWinner) {
        setRecords((prev) => {
          const nextRecords = getRecordsWithVsComputerResult(
            prev,
            nextMatchWinner,
            matchLength,
            nextPlayerScore.player,
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

  function resetGame(message?: unknown) {
    const nextMessage =
      typeof message === "string"
        ? message
        : winner && !matchWinner
          ? "Next Game"
          : "Game Reset";

    if (!winner || matchWinner) {
      resetMatchState();
    }

    resetGameState(nextMessage);
    playSound("roll");
  }

  function startGame() {
    logDebug("[Game Debug] Starting game", {
      gameMode,
      targetScore,
    });

    primeSounds();
    resetMatchState();
    resetGameState("");
    setHasStartedGame(true);
    playSound("roll");
  }

  function backToMenu() {
    setHasStartedGame(false);
    resetGame("");
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

    logDebug("[Computer] Turn started", {
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
    if (!hasFarkled) {
      return;
    }

    logDebug("[Game Debug] Farkle observed", {
      currentPlayer,
      hasStartedGame,
      isComputerControlledTurn,
      isTurnChanging,
      winner,
      ...turnDebugDetails(turn),
    });

    if (
      !shouldAutoSwitchAfterFarkle({
        hasFarkled,
        hasStartedGame,
        isTurnChanging,
        winner,
      })
    ) {
      logDebug("[Game Debug] Farkle auto-switch skipped", {
        currentPlayer,
        hasStartedGame,
        isTurnChanging,
        winner,
      });
      return;
    }

    logDebug("[Game Debug] Farkle auto-switch scheduled", {
      currentPlayer,
      delayMs: TURN_SWITCH_DELAY_MS,
    });

    playSound("farkle");
    const timeout = setTimeout(() => {
      logDebug("[Game Debug] Farkle auto-switch fired", {
        currentPlayer,
      });
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
    }, TURN_SWITCH_DELAY_MS);

    return () => {
      logDebug("[Game Debug] Farkle auto-switch cleared", {
        currentPlayer,
      });
      clearTimeout(timeout);
    };
  }, [
    currentPlayer,
    hasFarkled,
    hasStartedGame,
    isComputerControlledTurn,
    isTurnChanging,
    switchTurn,
    turn,
    winner,
  ]);

  useEffect(() => {
    if (!hasStartedGame || !isTurnChanging) return;

    const timeout = setTimeout(() => {
      setTotalScoreDelta(0);
      setRoundScoreDelta(0);
      switchTurn();
      setIsTurnChanging(false);
    }, TURN_SWITCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [hasStartedGame, isTurnChanging, switchTurn]);

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
    matchLength,
    matchScore,
    matchWinner,
    playerScore,
    records,
    requiredMatchWins,
    rerollCount,
    resetGame,
    roundScore,
    roundScoreDelta,
    selectedDice,
    selectedDiceAreValid,
    selectedScore,
    setGameMode,
    setMatchLength,
    setTargetScore,
    startGame,
    targetScore,
    totalScoreDelta,
    winner,
    holdDice,
    selectDie,
    endTurn,
    debugRollPresetText,
    setDebugRollsText,
  };
}
