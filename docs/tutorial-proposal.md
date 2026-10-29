# Tutorial game proposal

Research proposal; not yet implemented.

Offer an optional Learn to play action from the start menu. Use the real dice,
score boards and action buttons, with a persistent instruction card, step count,
and Exit / Restart controls.

## Practice sequence

1. Roll `[1,5,2,2,3,6]`. Ask the player to select the 1 and 5: 150 points.
   Allow deselection and explain why non-scoring selections cannot be banked.
2. Hold and reroll the remaining four dice to `[2,2,2,5]`. Explain that the
   150 round points are unbanked and at risk.
3. Select the three 2s and the 5: another 250 points. Bank 400 and explain
   that those points are now safe. All six dice score here, so optionally explain
   that rerolling instead would give hot dice and six fresh dice.
4. Continue to a second practice turn, selecting a single 1 for 100 points.
   Hold and reroll the remaining five to `[2,2,3,4,6]`: a Farkle. Explain that
   the unbanked 100 is lost while the banked 400 remains.
5. Finish with Start a game, returning to the player's normal setup.

## Implementation

- Use an isolated pure tutorial reducer and `useTutorialGame` rather than
  adding tutorial branches throughout `useGameState`.
- Reuse `scoreDice`, turn helpers, `DiceTray`, score boards and game buttons.
- Add tutorial entry in `StartMenu` and screen routing in `App`.
- Advance on the requested action; use explicit Continue after banking and
  Farkle so the explanation stays visible. Allow recoverable selection mistakes.
- Use complete fixed roll arrays with no random fallback. Never run AI,
  update match records or replace the player's saved setup in the tutorial.
- Announce step instructions politely, connect controls to instructions, retain
  keyboard access, use text alongside highlights, and respect reduced motion.

Do not drive the tutorial through developer roll presets: incomplete presets
fall back to random dice, and normal game state includes automatic turn timers,
AI actions and record writes that are unsuitable for a guided lesson.

## Validation

Test scripted scores, invalid selections and recovery, banking, Farkle preserving
banked points, restart and exit, and that tutorial actions never write records.
Check instructions and controls on narrow screens and with keyboard navigation.
