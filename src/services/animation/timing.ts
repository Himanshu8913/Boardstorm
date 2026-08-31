import { DICE_ROLL_ANIMATION_MS } from '@/constants/dice';
import { ANIMATION_SPEED_MULTIPLIER } from '@/constants/settings';
import type { AnimationSpeed } from '@/types/settings';

export const ANIMATION_TIMING = {
  diceRoll: DICE_ROLL_ANIMATION_MS,
  tileStep: 90,
  trap: 300,
  boost: 350,
  mystery: 500,
  collision: 200,
  boardstorm: 1400,
  victory: 2000,
  teleportHop: 250,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scaleAnimationDuration(
  baseMs: number,
  speed: AnimationSpeed,
  reducedMotion = prefersReducedMotion(),
): number {
  if (reducedMotion) {
    return 0;
  }

  const multiplier = ANIMATION_SPEED_MULTIPLIER[speed];
  return Math.round(baseMs * multiplier);
}

export function wait(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
