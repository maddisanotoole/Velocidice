import { DieStatus, type Die, type PlayerId } from "../types";
import { DieFace } from "./DiceFace";

type DiceTrayProps = {
  currentPlayer: PlayerId;
  dice: Die[];
  invalidSelectedDieIds?: Set<number>;
  isTurnChanging: boolean;
  onSelectDie: (id: number) => void;
  rerollCount: number;
};

export function DiceTray({
  currentPlayer,
  dice,
  invalidSelectedDieIds = new Set<number>(),
  isTurnChanging,
  onSelectDie,
  rerollCount,
}: DiceTrayProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4">
      {dice.map((die) => (
        <DieFace
          key={`die_${die.id}`}
          currentPlayer={currentPlayer}
          isBanked={isTurnChanging && die.status === DieStatus.SELECTED}
          isInvalidSelection={invalidSelectedDieIds.has(die.id)}
          rollAnimationKey={`${currentPlayer}_${rerollCount}`}
          onClick={() => onSelectDie(die.id)}
          die={die}
        />
      ))}
    </div>
  );
}
