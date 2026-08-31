const STEP_DELAY_MS = 120;

/**
 * Animates a player token hopping tile-by-tile from one position to another.
 * Invokes `onStep` after each intermediate tile so the UI updates incrementally.
 *
 * @param from - Starting tile number (1–100)
 * @param to - Target tile number (1–100)
 * @param onStep - Callback fired with the new tile after each hop
 */
export async function animatePlayerToPosition(
  from: number,
  to: number,
  onStep: (position: number) => void,
): Promise<void> {
  if (to === from) {
    return;
  }

  const direction = to > from ? 1 : -1;
  let current = from;

  while (current !== to) {
    current += direction;
    onStep(current);
    await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));
  }
}

/**
 * Clamps a target tile to the valid board range [1, maxTile].
 *
 * @param position - Current tile number
 * @param steps - Number of tiles to move (positive or negative)
 * @param maxTile - Highest tile on the board (default 100)
 */
export function calculateTargetPosition(
  position: number,
  steps: number,
  maxTile: number,
): number {
  return Math.min(maxTile, Math.max(1, position + steps));
}
