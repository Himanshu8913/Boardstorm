import type { SoundId } from '@/services/audio/sounds';

type AudioContextLike = AudioContext;

function getMasterGain(
  context: AudioContextLike,
  volume: number,
): GainNode {
  const gain = context.createGain();
  gain.gain.value = Math.max(0, Math.min(1, volume));
  gain.connect(context.destination);
  return gain;
}

function playTone(
  context: AudioContextLike,
  destination: GainNode,
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  volume = 0.2,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(destination);

  const now = context.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000 + 0.02);
}

function playNoiseBurst(
  context: AudioContextLike,
  destination: GainNode,
  durationMs: number,
  volume = 0.08,
): void {
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * (durationMs / 1000)));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index++) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(destination);
  source.start();
}

export function synthesizeSound(
  context: AudioContextLike,
  soundId: SoundId,
  masterVolume: number,
): void {
  const destination = getMasterGain(context, masterVolume);
  const now = context.currentTime;

  switch (soundId) {
    case 'diceRoll': {
      playNoiseBurst(context, destination, 420, 0.1);
      playTone(context, destination, 180, 120, 'triangle', 0.12);
      playTone(context, destination, 120, 180, 'square', 0.08);
      break;
    }

    case 'diceStop': {
      playTone(context, destination, 520, 60, 'square', 0.1);
      break;
    }

    case 'step': {
      playTone(context, destination, 320, 50, 'triangle', 0.08);
      break;
    }

    case 'trap': {
      playTone(context, destination, 110, 180, 'sawtooth', 0.14);
      playNoiseBurst(context, destination, 160, 0.06);
      playTone(context, destination, 80, 120, 'sine', 0.1);
      break;
    }

    case 'boost': {
      playTone(context, destination, 440, 90, 'sine', 0.12);
      playTone(context, destination, 660, 110, 'sine', 0.1);
      playTone(context, destination, 880, 140, 'triangle', 0.08);
      break;
    }

    case 'mystery': {
      playTone(context, destination, 740, 160, 'sine', 0.1);
      playTone(context, destination, 980, 220, 'triangle', 0.08);
      playTone(context, destination, 620, 280, 'sine', 0.06);
      break;
    }

    case 'collision': {
      playTone(context, destination, 240, 70, 'square', 0.1);
      playNoiseBurst(context, destination, 80, 0.05);
      break;
    }

    case 'boardstorm': {
      playTone(context, destination, 60, 500, 'sawtooth', 0.12);
      playNoiseBurst(context, destination, 700, 0.09);
      playTone(context, destination, 90, 300, 'triangle', 0.08);
      window.setTimeout(() => {
        playTone(context, destination, 300, 120, 'square', 0.1);
      }, 280);
      break;
    }

    case 'victory': {
      [523, 659, 784, 1047].forEach((frequency, index) => {
        window.setTimeout(() => {
          playTone(context, destination, frequency, 180, 'triangle', 0.12);
        }, index * 120);
      });
      break;
    }

    case 'uiClick': {
      playTone(context, destination, 640, 40, 'sine', 0.07);
      break;
    }

    case 'luckyRoll': {
      playTone(context, destination, 500, 80, 'triangle', 0.1);
      playTone(context, destination, 760, 120, 'sine', 0.09);
      break;
    }

    case 'teleport': {
      playNoiseBurst(context, destination, 180, 0.05);
      playTone(context, destination, 420, 160, 'sine', 0.1);
      playTone(context, destination, 880, 200, 'triangle', 0.07);
      break;
    }

    case 'sabotage': {
      playTone(context, destination, 200, 100, 'square', 0.11);
      playTone(context, destination, 150, 140, 'sawtooth', 0.08);
      break;
    }

    case 'peek': {
      playTone(context, destination, 900, 120, 'sine', 0.08);
      playTone(context, destination, 1200, 160, 'triangle', 0.06);
      break;
    }

    case 'shield': {
      playTone(context, destination, 700, 140, 'sine', 0.09);
      playTone(context, destination, 560, 180, 'triangle', 0.07);
      break;
    }

    default: {
      void now;
      break;
    }
  }
}
