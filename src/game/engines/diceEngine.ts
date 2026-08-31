import {
  RISK_DIE_MAX,
  RISK_DIE_MIN,
  SAFE_DIE_MAX,
  SAFE_DIE_MIN,
} from '@/constants/dice';
import type { DieType } from '@/types/dice';
import { randomInt } from '@/game/random';

export function getDieRange(dieType: DieType): { min: number; max: number } {
  if (dieType === 'risk') {
    return { min: RISK_DIE_MIN, max: RISK_DIE_MAX };
  }

  return { min: SAFE_DIE_MIN, max: SAFE_DIE_MAX };
}

export function rollDie(dieType: DieType): number {
  const { min, max } = getDieRange(dieType);
  return randomInt(min, max);
}
