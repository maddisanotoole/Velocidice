import { useEffect, useReducer, useRef } from "react";
import Button from "../buttons/GameButton";
import { DiceTray } from "../dice/DiceTray";
import { ScoreBoard } from "../boards/ScoreBoard";
import { createTutorial, getTutorialSelection, TUTORIAL_STEPS, tutorialReducer } from "../../game/tutorial";
import { cx, theme } from "../../theme/classes";

export function TutorialGame({ onExit, onStartGame }: { onExit: () => void; onStartGame: () => void }) {
  const [state, dispatch] = useReducer(tutorialReducer, undefined, createTutorial);
  const heading = useRef<HTMLHeadingElement>(null);
  const lesson = TUTORIAL_STEPS[state.step];
  const selection = getTutorialSelection(state);
  const interactive = ["select", "bank", "risk"].includes(state.step);
  const requiredScore = state.step === "bank" ? 250 : state.step === "risk" ? 100 : 150;
  const ready = selection.allDiceScore && selection.score === requiredScore;
  const invalid = selection.nonScoringDice.length > 0;
  const isBankStep = state.step === "bank";

  useEffect(() => { heading.current?.focus(); }, [state.step]);

  return (
    <main className="flex min-h-0 w-full max-w-lg flex-1 flex-col items-center gap-5 overflow-y-auto py-3 sm:py-6">
      <header className="flex w-full flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold text-[var(--muted)]">Tutorial · Step {lesson.number} of 6</span>
        <div className="flex gap-2">
          <Button size="small" onClick={() => dispatch({ type: "restart" })}>Restart</Button>
          <Button size="small" onClick={onExit}>Exit tutorial</Button>
        </div>
      </header>
      <section className={cx(theme.panel.tile, "w-full")} aria-labelledby="tutorial-heading">
        <h1 id="tutorial-heading" ref={heading} tabIndex={-1} className="text-2xl font-black">{lesson.title}</h1>
        <p id="tutorial-instructions" className="mt-2 text-sm leading-relaxed">{lesson.instruction}</p>
        <p className="mt-3 text-xs text-[var(--muted)]">Practice only · Fixed rolls · No effect on statistics</p>
      </section>
      <ScoreBoard currentPlayer="player" playerScores={{ player: state.totalScore, player2: 0 }} roundScore={state.roundScore} selectedScore={interactive ? selection.score : 0} />
      {state.step !== "complete" && (
        <div role="group" aria-label="Practice dice" aria-describedby="tutorial-instructions">
          <DiceTray currentPlayer="player" dice={state.dice} invalidSelectedDieIds={new Set(selection.nonScoringDice.map(die => die.id))} isTurnChanging={state.step === "banked"} onSelectDie={id => dispatch({ type: "select", id })} rerollCount={state.rolls} disabled={!interactive} />
        </div>
      )}
      {interactive ? (
        <div className="w-full" role="group" aria-label="Practice actions" aria-describedby="tutorial-action-guidance">
          <div className="flex flex-wrap justify-center gap-3">
            <Button color="blue" themeRole="reroll_button" disabled={!ready || isBankStep} onClick={() => dispatch({ type: "reroll" })}>Hold & Reroll</Button>
            <Button color="yellow" disabled={!ready || !isBankStep} onClick={() => dispatch({ type: "bank" })}>Bank {state.roundScore + selection.score} points</Button>
          </div>
          <p id="tutorial-action-guidance" role="status" aria-atomic="true" className="mt-3 min-h-10 text-center text-sm">
            {invalid ? "Every selected die must score. Deselect the dice marked ! or complete a scoring combination."
              : ready ? isBankStep ? "Bank 400 points to finish this practice turn." : "Choose Hold & Reroll to continue."
              : isBankStep ? "Select all three 2s and the 5. The previously held dice stay aside."
              : state.step === "risk" ? "Select the 1 to continue." : "Select the 1 and the 5 to continue."}
          </p>
        </div>
      ) : state.step === "complete" ? (
        <Button themeRole="start_button" onClick={onStartGame}>Start a game</Button>
      ) : (
        <Button onClick={() => dispatch({ type: "continue" })}>Continue</Button>
      )}
    </main>
  );
}
