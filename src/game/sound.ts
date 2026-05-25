import bankSound from "../assets/sound/bank.mp3";
import farkleSound from "../assets/sound/farkle.mp3";
import loseSound from "../assets/sound/lose.mp3";
import rollSound from "../assets/sound/roll.mp3";
import rollSoundTwo from "../assets/sound/roll_2.mp3";
import rollSoundThree from "../assets/sound/roll_3.mp3";
import selectSound from "../assets/sound/select.mp3";
import winSound from "../assets/sound/win.mp3";

const soundSources = {
  select: selectSound,
  bank: bankSound,
  farkle: farkleSound,
  win: winSound,
  lose: loseSound,
};

const rollSounds = [rollSound, rollSoundTwo, rollSoundThree];
let nextRollSoundIndex = 0;
let muted = false;

type SoundName = keyof typeof soundSources | "roll";

function getNextRollSound() {
  const sound = rollSounds[nextRollSoundIndex];
  nextRollSoundIndex = (nextRollSoundIndex + 1) % rollSounds.length;

  return sound;
}

export function playSound(name: SoundName) {
  if (muted) {
    return;
  }

  const source = name === "roll" ? getNextRollSound() : soundSources[name];
  const sound = new Audio(source);

  sound.play().catch(() => {
    // Browser may block sound until the user interacts with the page.
  });
}

export function setSoundMuted(isMuted: boolean) {
  muted = isMuted;
}

export function isSoundMuted() {
  return muted;
}
