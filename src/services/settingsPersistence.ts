import {
  DEFAULT_MUSIC_VOLUME,
  DEFAULT_SFX_VOLUME,
  MAX_TURN_TIMER_SECONDS,
  MAX_VOLUME,
  MIN_TURN_TIMER_SECONDS,
  MIN_VOLUME,
  SETTINGS_STORAGE_KEY,
} from '@/constants/settings';
import { defaultSettingsState } from '@/store/defaults';
import type {
  AnimationSpeed,
  SettingsState,
  TileVisibility,
} from '@/types/settings';

const ANIMATION_SPEEDS: AnimationSpeed[] = ['slow', 'normal', 'fast'];
const TILE_VISIBILITIES: TileVisibility[] = ['visible', 'fog'];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isAnimationSpeed(value: unknown): value is AnimationSpeed {
  return (
    typeof value === 'string' &&
    (ANIMATION_SPEEDS as string[]).includes(value)
  );
}

function isTileVisibility(value: unknown): value is TileVisibility {
  return (
    typeof value === 'string' &&
    (TILE_VISIBILITIES as string[]).includes(value)
  );
}

function sanitizeVolume(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return clamp(Math.round(value), MIN_VOLUME, MAX_VOLUME);
}

/** Validates and merges persisted settings with defaults. */
export function sanitizeSettings(
  input: unknown,
): SettingsState {
  const defaults = defaultSettingsState();

  if (!input || typeof input !== 'object') {
    return defaults;
  }

  const raw = input as Partial<SettingsState>;

  return {
    tileVisibility: isTileVisibility(raw.tileVisibility)
      ? raw.tileVisibility
      : defaults.tileVisibility,
    animationSpeed: isAnimationSpeed(raw.animationSpeed)
      ? raw.animationSpeed
      : defaults.animationSpeed,
    soundEnabled: isBoolean(raw.soundEnabled)
      ? raw.soundEnabled
      : defaults.soundEnabled,
    musicEnabled: isBoolean(raw.musicEnabled)
      ? raw.musicEnabled
      : defaults.musicEnabled,
    sfxVolume: sanitizeVolume(raw.sfxVolume, DEFAULT_SFX_VOLUME),
    musicVolume: sanitizeVolume(raw.musicVolume, DEFAULT_MUSIC_VOLUME),
    turnTimerEnabled: isBoolean(raw.turnTimerEnabled)
      ? raw.turnTimerEnabled
      : defaults.turnTimerEnabled,
    turnTimerSeconds:
      typeof raw.turnTimerSeconds === 'number'
        ? clamp(
            Math.round(raw.turnTimerSeconds),
            MIN_TURN_TIMER_SECONDS,
            MAX_TURN_TIMER_SECONDS,
          )
        : defaults.turnTimerSeconds,
  };
}

export function loadPersistedSettings(): SettingsState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function savePersistedSettings(settings: SettingsState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function hydrateSettingsStore(
  applySettings: (settings: SettingsState) => void,
): void {
  const persisted = loadPersistedSettings();
  if (persisted) {
    applySettings(persisted);
  }
}
