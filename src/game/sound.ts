import bankSound from "../assets/sound/bank.mp3";
import farkleSound from "../assets/sound/farkle.mp3";
import rollSound from "../assets/sound/roll.mp3";
import selectSound from "../assets/sound/select.mp3";

const soundSources = {
  roll: rollSound,
  select: selectSound,
  bank: bankSound,
  farkle: farkleSound,
};

type SoundName = keyof typeof soundSources | "win";

function playWinSound() {
  const AudioContextConstructor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  const audioContext = new AudioContextConstructor();
  const gain = audioContext.createGain();
  const notes = [523.25, 659.25, 783.99, 1046.5];

  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);

  notes.forEach((frequency, index) => {
    const startTime = audioContext.currentTime + index * 0.12;
    const oscillator = audioContext.createOscillator();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.22);
  });
}

export function playSound(name: SoundName) {
  if (name === "win") {
    playWinSound();
    return;
  }

  const sound = new Audio(soundSources[name]);

  sound.play().catch(() => {
    // Browser may block sound until the user interacts with the page.
  });
}
