/** Minimum time the splash stays visible (ms). */
export const SPLASH_MIN_DURATION_MS = 2000;

/** Fade-out after load completes (ms). */
export const SPLASH_FADE_OUT_MS = 450;

/** Progress tick interval (ms). */
export const SPLASH_PROGRESS_INTERVAL_MS = 40;

export const SPLASH_TAGLINE = 'Roll. Move. Power Up. Win!';

export const SPLASH_LOADING_LABEL = 'Loading…';

/** Decorative icons orbiting the logo (emoji for crisp display at all sizes). */
export const SPLASH_ORBIT_ICONS = [
  { id: 'dice-1', emoji: '🎲', angle: 0 },
  { id: 'boost', emoji: '⚡', angle: 60 },
  { id: 'mystery', emoji: '✨', angle: 120 },
  { id: 'shield', emoji: '🛡️', angle: 180 },
  { id: 'dice-2', emoji: '🎯', angle: 240 },
  { id: 'trap', emoji: '💀', angle: 300 },
] as const;
