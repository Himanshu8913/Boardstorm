import {
  MYSTERY_POWERS,
  PASSIVE_POWERS,
} from '@/constants/gameplay';
import type { MysteryPower, PowerAction } from '@/types/power';
import { randomPick } from '@/game/random';

export function isPassivePower(power: MysteryPower): boolean {
  return (PASSIVE_POWERS as readonly string[]).includes(power);
}

export function pickRandomPower(): MysteryPower {
  return randomPick(MYSTERY_POWERS);
}

export function canActivatePower(power: MysteryPower): boolean {
  return !isPassivePower(power);
}

export function validatePowerAction(
  power: MysteryPower,
  action: PowerAction,
): boolean {
  if (action.type !== power) {
    return false;
  }

  return canActivatePower(power);
}

export function createPowerMeta(
  type: MysteryPower,
  acquiredRound: number,
): { type: MysteryPower; acquiredRound: number; consumed: boolean } {
  return { type, acquiredRound, consumed: false };
}
