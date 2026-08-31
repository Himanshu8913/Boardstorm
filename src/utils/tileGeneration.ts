import type { BoardMood } from '@/types/boardMood';
import {
  BOOST_EFFECTS,
  TRAP_EFFECTS,
  type BoardTile,
  type BoostEffect,
  type TileType,
  type TrapEffect,
} from '@/types/tile';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';

type TileWeights = Record<TileType, number>;

/**
 * Relative weights for tile type selection per board mood.
 * Values are proportional — only ratios matter, not absolute sums.
 */
const MOOD_TILE_WEIGHTS: Record<BoardMood, TileWeights> = {
  kind: { safe: 60, trap: 5, boost: 25, mystery: 10 },
  balanced: { safe: 70, trap: 10, boost: 10, mystery: 10 },
  cruel: { safe: 55, trap: 30, boost: 10, mystery: 5 },
  chaotic: { safe: 55, trap: 10, boost: 10, mystery: 25 },
};

/**
 * Picks a random item from a readonly array with uniform probability.
 */
function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Selects a tile type using weighted random choice.
 *
 * @param weights - Relative weights for each tile type
 */
function pickWeightedTileType(weights: TileWeights): TileType {
  const entries = Object.entries(weights) as [TileType, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [type, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return type;
    }
  }

  return 'safe';
}

/**
 * Assigns a trap or boost sub-effect when the tile is generated.
 * Effects are stored now but resolved in a later phase.
 */
function assignTileEffect(
  type: TileType,
): Pick<BoardTile, 'trapEffect' | 'boostEffect'> {
  if (type === 'trap') {
    return { trapEffect: pickRandom(TRAP_EFFECTS) };
  }

  if (type === 'boost') {
    return { boostEffect: pickRandom(BOOST_EFFECTS) };
  }

  return {};
}

/**
 * Generates a randomized board of 100 tiles for the given mood.
 * Tile 1 is always Safe (player start). All other tiles are weighted
 * by mood to produce roughly 70% Safe / 30% Special overall.
 *
 * @param mood - Board mood controlling type distribution
 */
export function generateBoard(mood: BoardMood): BoardTile[] {
  const weights = MOOD_TILE_WEIGHTS[mood];

  return Array.from({ length: BOARD_TILE_COUNT }, (_, index) => {
    const number = index + 1;

    if (number === 1) {
      return { number, type: 'safe' as const };
    }

    const type = pickWeightedTileType(weights);

    return {
      number,
      type,
      ...assignTileEffect(type),
    };
  });
}

/**
 * Builds a lookup map from tile number to its generated data.
 *
 * @param tiles - Full board tile array from {@link generateBoard}
 */
export function createTileMap(tiles: BoardTile[]): Map<number, BoardTile> {
  return new Map(tiles.map((tile) => [tile.number, tile]));
}

export type { TrapEffect, BoostEffect };
