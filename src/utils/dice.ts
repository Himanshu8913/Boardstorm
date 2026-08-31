import { DIE_CONFIG, type DieType } from '@/types/dice';

/**
 * Returns a uniform random integer in the inclusive range [min, max].
 *
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 */
export function rollInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Rolls the selected die and returns the result.
 *
 * Safe Die: 1–4. Risk Die: 1–8.
 *
 * @param dieType - Which die to roll
 */
export function rollDie(dieType: DieType): number {
  const { min, max } = DIE_CONFIG[dieType];
  return rollInRange(min, max);
}
