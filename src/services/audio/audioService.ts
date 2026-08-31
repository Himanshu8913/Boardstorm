import type { SettingsState } from '@/types/settings';
import { eventToSounds } from '@/services/audio/eventSounds';
import { SOUND_CONCURRENCY_LIMITS, type SoundId } from '@/services/audio/sounds';
import { synthesizeSound } from '@/services/audio/synthSounds';
import { useGameStore } from '@/store/gameStore';

type AudioSettings = Pick<
  SettingsState,
  'soundEnabled' | 'sfxVolume' | 'musicEnabled' | 'musicVolume'
>;

class AudioService {
  private context: AudioContext | null = null;
  private activeCounts = new Map<SoundId, number>();
  private settings: AudioSettings = {
    soundEnabled: true,
    sfxVolume: 80,
    musicEnabled: true,
    musicVolume: 60,
  };

  async ensureContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      this.context = new AudioContextClass();
    }

    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch {
        return null;
      }
    }

    return this.context;
  }

  updateSettings(settings: AudioSettings): void {
    this.settings = settings;
  }

  private getEffectiveVolume(): number {
    if (!this.settings.soundEnabled) {
      return 0;
    }

    return this.settings.sfxVolume / 100;
  }

  private canPlay(soundId: SoundId): boolean {
    const limit = SOUND_CONCURRENCY_LIMITS[soundId];
    if (limit === undefined) {
      return true;
    }

    return (this.activeCounts.get(soundId) ?? 0) < limit;
  }

  private trackStart(soundId: SoundId, durationMs: number): void {
    const count = this.activeCounts.get(soundId) ?? 0;
    this.activeCounts.set(soundId, count + 1);

    window.setTimeout(() => {
      const next = (this.activeCounts.get(soundId) ?? 1) - 1;
      if (next <= 0) {
        this.activeCounts.delete(soundId);
      } else {
        this.activeCounts.set(soundId, next);
      }
    }, durationMs);
  }

  play(soundId: SoundId): void {
    if (!this.settings.soundEnabled) {
      return;
    }

    if (!this.canPlay(soundId)) {
      return;
    }

    void this.ensureContext().then((context) => {
      if (!context) {
        return;
      }

      const volume = this.getEffectiveVolume();
      if (volume <= 0) {
        return;
      }

      synthesizeSound(context, soundId, volume);
      this.trackStart(soundId, getSoundDurationMs(soundId));
    });
  }

  playUiClick(): void {
    this.play('uiClick');
  }
}

function getSoundDurationMs(soundId: SoundId): number {
  switch (soundId) {
    case 'diceRoll':
      return 600;
    case 'boardstorm':
      return 1400;
    case 'victory':
      return 2000;
    case 'mystery':
      return 500;
    case 'boost':
      return 350;
    case 'trap':
      return 300;
    case 'collision':
      return 200;
    case 'step':
      return 90;
    default:
      return 150;
  }
}

export const audioService = new AudioService();

let processedEventCount = 0;
let initialized = false;

function handleUiClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (target.closest('button, [role="switch"], input[type="range"]')) {
    audioService.playUiClick();
  }
}

function unlockAudio(): void {
  void audioService.ensureContext();
}

export function initGameAudio(): void {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  initialized = true;

  const store = useGameStore.getState();
  audioService.updateSettings(store.settings);

  useGameStore.subscribe((state) => {
    audioService.updateSettings(state.settings);

    if (state.events.events.length === 0) {
      processedEventCount = 0;
      return;
    }

    if (state.events.events.length <= processedEventCount) {
      return;
    }

    const newEvents = state.events.events.slice(processedEventCount);
    processedEventCount = state.events.events.length;

    for (const event of newEvents) {
      if (event.type === 'dice_rolled') {
        audioService.play('diceRoll');
        window.setTimeout(() => audioService.play('diceStop'), 420);
        continue;
      }

      for (const soundId of eventToSounds(event)) {
        audioService.play(soundId);
      }
    }
  });

  document.addEventListener('click', handleUiClick, true);
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });
}

export function disposeGameAudio(): void {
  document.removeEventListener('click', handleUiClick, true);
  initialized = false;
  processedEventCount = 0;
}
