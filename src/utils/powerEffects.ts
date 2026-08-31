import type { BoardTile } from '@/types/tile';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { calculateTargetPosition } from '@/utils/playerMovement';

const TELEPORT_RANGE = 10;
const PEEK_DISTANCE = 5;
export const SABOTAGE_STEPS = 5;

/**
 * Returns valid teleport destinations within ±range of the player's position.
 *
 * @param position - Player's current tile
 * @param range - Maximum distance in either direction (default 10)
 */
export function getTeleportTargets(
  position: number,
  range = TELEPORT_RANGE,
): number[] {
  const min = Math.max(1, position - range);
  const max = Math.min(BOARD_TILE_COUNT, position + range);

  return Array.from({ length: max - min + 1 }, (_, index) => min + index).filter(
    (tile) => tile !== position,
  );
}

/**
 * Returns the next N tiles ahead of the player for the Peek power.
 *
 * @param position - Player's current tile
 * @param boardTiles - Full board tile data
 * @param count - Number of tiles to reveal (default 5)
 */
export function getPeekTiles(
  position: number,
  boardTiles: BoardTile[],
  count = PEEK_DISTANCE,
): BoardTile[] {
  const tileMap = new Map(boardTiles.map((tile) => [tile.number, tile]));
  const peeked: BoardTile[] = [];

  for (let step = 1; step <= count; step++) {
    const tileNumber = position + step;
    if (tileNumber > BOARD_TILE_COUNT) {
      break;
    }

    const tile = tileMap.get(tileNumber);
    if (tile) {
      peeked.push(tile);
    }
  }

  return peeked;
}

/**
 * Calculates the new position after sabotaging a player backward.
 *
 * @param position - Target player's current tile
 */
export function getSabotagePosition(position: number): number {
  return calculateTargetPosition(position, -SABOTAGE_STEPS, BOARD_TILE_COUNT);
}

/**
 * Formats peek results into a readable status message.
 *
 * @param tiles - Tiles revealed by Peek
 */
export function formatPeekMessage(tiles: BoardTile[]): string {
  if (tiles.length === 0) {
    return 'Peek: No tiles ahead to reveal.';
  }

  const summary = tiles
    .map((tile) => `#${tile.number} (${tile.type})`)
    .join(', ');

  return `Peek revealed: ${summary}`;
}
