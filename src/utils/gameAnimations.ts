/** How long tile and token effect animations play (ms). */
export const TILE_EFFECT_DURATION_MS = 650;

/**
 * Schedules clearing an animation callback after the effect duration.
 *
 * @param clear - Function that resets animation state
 */
export function scheduleAnimationClear(clear: () => void): void {
  window.setTimeout(clear, TILE_EFFECT_DURATION_MS);
}
