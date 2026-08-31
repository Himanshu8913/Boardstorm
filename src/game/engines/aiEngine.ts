import { GHOST_RISK_DIE_WEIGHT, GHOST_SAFE_DIE_WEIGHT } from '@/constants/ai';
import type { DieType } from '@/types/dice';
import { random } from '@/game/random';

/** Ghost AI: 70% safe, 30% risk per 02_GAME_RULES.md */
export function pickGhostDie(): DieType {
  return random() < GHOST_SAFE_DIE_WEIGHT ? 'safe' : 'risk';
}

export function getGhostDieWeights(): {
  safe: number;
  risk: number;
} {
  return { safe: GHOST_SAFE_DIE_WEIGHT, risk: GHOST_RISK_DIE_WEIGHT };
}
