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

const rollSoundSources = [rollSound, rollSoundTwo, rollSoundThree];
const audioCache = Object.fromEntries(
  Object.entries(soundSources).map(([name, source]) => [
    name,
    createAudio(source),
  ]),
) as Record<keyof typeof soundSources, HTMLAudioElement>;
const rollAudioCache = rollSoundSources.map(createAudio);
let nextRollSoundIndex = 0;
let muted = false;

type SoundName = keyof typeof soundSources | "roll";

function createAudio(source: string) {
  const audio = new Audio(source);
  audio.preload = "auto";

  return audio;
}

function getNextRollSound() {
  const sound = rollAudioCache[nextRollSoundIndex];
  nextRollSoundIndex = (nextRollSoundIndex + 1) % rollAudioCache.length;

  return sound;
}

function playAudio(audio: HTMLAudioElement) {
  const sound = audio.cloneNode() as HTMLAudioElement;

  sound.volume = audio.volume;
  sound.play().catch(() => {
    // Browser may block sound until the user interacts with the page.
  });
}

export function playSound(name: SoundName) {
  if (muted) {
    return;
  }

  const sound = name === "roll" ? getNextRollSound() : audioCache[name];

  playAudio(sound);
}

export function primeSounds() {
  const sounds = [...Object.values(audioCache), ...rollAudioCache];

  sounds.forEach((sound) => {
    sound.load();

    sound.muted = true;
    sound
      .play()
      .then(() => {
        sound.pause();
        sound.currentTime = 0;
        sound.muted = false;
      })
      .catch(() => {
        sound.muted = false;
      });
  });
}

export function setSoundMuted(isMuted: boolean) {
  muted = isMuted;
}

export function isSoundMuted() {
  return muted;
}
