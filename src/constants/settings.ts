import type { AnimationSpeed } from '@/types/settings';

export const DEFAULT_TURN_TIMER_SECONDS = 30;
export const MIN_TURN_TIMER_SECONDS = 15;
export const MAX_TURN_TIMER_SECONDS = 30;

export const DEFAULT_SFX_VOLUME = 80;
export const DEFAULT_MUSIC_VOLUME = 60;
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 100;

export const ANIMATION_SPEED_MULTIPLIER: Record<AnimationSpeed, number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.6,
};

export const SETTINGS_STORAGE_KEY = 'boardstorm-settings-v1';
