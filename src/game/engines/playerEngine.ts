import { WIN_TILE } from '@/constants/board';
import { clampTileNumber } from '@/utils/boardLayout';

/**
 * Returns each tile visited when moving forward, including bounce-back past 100.
 */
export function getForwardMovementPath(
  from: number,
  steps: number,
  winTile = WIN_TILE,
): number[] {
  if (steps <= 0) {
    return [];
  }

  const path: number[] = [];
  let position = from;
  let direction = 1;
  let remaining = steps;

  while (remaining > 0) {
    position += direction;
    remaining--;

    if (position > winTile) {
      const overshoot = position - winTile;
      position = winTile - overshoot;
      direction = -1;
    }

    path.push(position);
  }

  return path;
}

export function calculateFinalPosition(
  from: number,
  steps: number,
  winTile = WIN_TILE,
): number {
  const path = getForwardMovementPath(from, steps, winTile);
  return path.length > 0 ? path[path.length - 1] : from;
}

export function isWinningPosition(
  position: number,
  winTile = WIN_TILE,
): boolean {
  return position === winTile;
}

export { clampTileNumber };
