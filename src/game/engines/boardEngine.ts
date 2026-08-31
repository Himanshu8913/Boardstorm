import { BOARD_SIZE, START_TILE } from '@/constants/board';
import { BOARDSTORM_MUTATION_COUNT } from '@/constants/boardstorm';
import {
  BOOST_EFFECTS,
  TRAP_EFFECTS,
} from '@/constants/gameplay';
import type { BoardMood } from '@/types/match';
import type { BoardTile, TileType } from '@/types/tile';
import { random, randomPick } from '@/game/random';

type TileWeights = Record<TileType, number>;

const MOOD_TILE_WEIGHTS: Record<BoardMood, TileWeights> = {
  kind: { safe: 0.5, trap: 0.1, boost: 0.32, mystery: 0.08 },
  cruel: { safe: 0.42, trap: 0.32, boost: 0.1, mystery: 0.16 },
  chaotic: { safe: 0.38, trap: 0.2, boost: 0.18, mystery: 0.24 },
  balanced: { safe: 0.45, trap: 0.2, boost: 0.2, mystery: 0.15 },
};

const TILE_TYPES: TileType[] = ['safe', 'trap', 'boost', 'mystery'];

function pickTileType(mood: BoardMood): TileType {
  const weights = MOOD_TILE_WEIGHTS[mood];
  const roll = random();
  let cumulative = 0;

  for (const type of TILE_TYPES) {
    cumulative += weights[type];
    if (roll <= cumulative) {
      return type;
    }
  }

  return 'safe';
}

function createTile(number: number, type: TileType): BoardTile {
  if (type === 'trap') {
    return { number, type, trapEffect: randomPick(TRAP_EFFECTS) };
  }

  if (type === 'boost') {
    return { number, type, boostEffect: randomPick(BOOST_EFFECTS) };
  }

  return { number, type };
}

/** Picks a random board mood with uniform probability. */
export function pickRandomBoardMood(
  moods: readonly BoardMood[],
): BoardMood {
  return randomPick(moods);
}

/** Generates 100 tiles for the given mood. Tile 1 is always safe. */
export function generateBoard(mood: BoardMood): BoardTile[] {
  const tiles: BoardTile[] = [];

  for (let number = START_TILE; number <= BOARD_SIZE; number++) {
    const type = number === START_TILE ? 'safe' : pickTileType(mood);
    tiles.push(createTile(number, type));
  }

  return tiles;
}

export function buildTileMap(tiles: BoardTile[]): Map<number, BoardTile> {
  return new Map(tiles.map((tile) => [tile.number, tile]));
}

export type BoardstormMutationResult = {
  tiles: BoardTile[];
  mutatedTileNumbers: number[];
};

/**
 * Mutates ~10 random tiles (types only). Tile numbers are unchanged.
 */
export function mutateBoardForBoardstorm(
  tiles: BoardTile[],
  mood: BoardMood,
  mutationCount = BOARDSTORM_MUTATION_COUNT,
): BoardstormMutationResult {
  const mutableIndices = tiles
    .map((tile, index) => (tile.number === START_TILE ? -1 : index))
    .filter((index) => index >= 0);

  const shuffled = [...mutableIndices].sort(() => random() - 0.5);
  const count = Math.min(mutationCount, shuffled.length);
  const selected = new Set(shuffled.slice(0, count));

  const mutatedTileNumbers: number[] = [];
  const nextTiles = tiles.map((tile, index) => {
    if (!selected.has(index)) {
      return tile;
    }

    const newType = pickTileType(mood);
    mutatedTileNumbers.push(tile.number);
    return createTile(tile.number, newType);
  });

  return { tiles: nextTiles, mutatedTileNumbers };
}
