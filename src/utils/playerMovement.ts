const STEP_DELAY_MS = 120;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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
    await delay(STEP_DELAY_MS);
  }
}

/**
 * Animates a player along a precomputed path, one tile at a time.
 *
 * @param path - Ordered tile numbers to visit (excluding the start tile)
 * @param onStep - Callback fired at each tile along the path
 */
export async function animateAlongPath(
  path: number[],
  onStep: (position: number) => void,
): Promise<void> {
  for (const position of path) {
    onStep(position);
    await delay(STEP_DELAY_MS);
  }
}

/**
 * Clamps a target tile to the valid board range [1, maxTile].
 * Used for trap/boost movement that does not bounce.
 *
 * @param position - Current tile number
 * @param steps - Number of tiles to move (positive or negative)
 * @param maxTile - Highest tile on the board
 */
export function calculateTargetPosition(
  position: number,
  steps: number,
  maxTile: number,
): number {
  return Math.min(maxTile, Math.max(1, position + steps));
}

/**
 * Builds the tile-by-tile path for forward movement with bounce-back
 * at the final tile. Overshooting tile 100 reverses direction.
 *
 * @param position - Starting tile
 * @param steps - Forward steps from a dice roll
 * @param maxTile - Winning tile (100)
 */
export function getForwardMovementPath(
  position: number,
  steps: number,
  maxTile: number,
): number[] {
  if (steps <= 0) {
    return [];
  }

  const path: number[] = [];
  let current = position;
  let direction = 1;
  let remaining = steps;

  while (remaining > 0) {
    const next = current + direction;

    if (next > maxTile) {
      direction = -1;
      continue;
    }

    if (next < 1) {
      direction = 1;
      continue;
    }

    path.push(next);
    current = next;
    remaining--;
  }

  return path;
}

/**
 * Returns the final tile after forward movement with bounce-back.
 *
 * @param position - Starting tile
 * @param steps - Forward steps from a dice roll
 * @param maxTile - Winning tile (100)
 */
export function calculateBouncePosition(
  position: number,
  steps: number,
  maxTile: number,
): number {
  const path = getForwardMovementPath(position, steps, maxTile);
  return path.length > 0 ? path[path.length - 1] : position;
}

/**
 * Checks whether a player has won by reaching the final tile.
 *
 * @param position - Player's current tile
 * @param maxTile - Winning tile (100)
 */
export function isWinningPosition(position: number, maxTile: number): boolean {
  return position === maxTile;
}
