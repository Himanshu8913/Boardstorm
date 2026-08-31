import { DIE_CONFIG, type DieType } from '@/types/dice';
import { rollInRange } from '@/utils/dice';

const ROLL_DURATION_MS = 700;
const TICK_INTERVAL_MS = 70;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Cycles random face values to simulate a rolling die, then lands on
 * the predetermined result. The final value is computed before animation
 * so the outcome is not affected by frame timing.
 *
 * @param dieType - Die being rolled (determines value range for ticks)
 * @param finalValue - Predetermined roll result shown at animation end
 * @param onTick - Called on each frame with the currently displayed value
 */
export async function playDiceRollAnimation(
  dieType: DieType,
  finalValue: number,
  onTick: (displayValue: number) => void,
): Promise<void> {
  const { min, max } = DIE_CONFIG[dieType];
  const startTime = Date.now();

  while (Date.now() - startTime < ROLL_DURATION_MS) {
    onTick(rollInRange(min, max));
    await delay(TICK_INTERVAL_MS);
  }

  onTick(finalValue);
}
