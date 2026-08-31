import type { DieType } from '@/types/dice';

/** Probability that a ghost chooses the Safe Die (vs Risk Die). */
export const GHOST_SAFE_DIE_CHANCE = 0.7;

/**
 * Picks a die for a ghost opponent: Safe Die 70%, Risk Die 30%.
 */
export function pickGhostDie(): DieType {
  return Math.random() < GHOST_SAFE_DIE_CHANCE ? 'safe' : 'risk';
}

/** Delay before a ghost begins its turn (ms). */
export const GHOST_TURN_DELAY_MS = 900;

/** Pause between a ghost's roll and ending its turn (ms). */
export const GHOST_END_TURN_DELAY_MS = 500;
