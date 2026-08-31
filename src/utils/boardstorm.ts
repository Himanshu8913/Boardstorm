import {
  BOOST_EFFECTS,
  TRAP_EFFECTS,
  type BoardTile,
  type TileType,
} from '@/types/tile';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';

/** Number of full rounds between Boardstorm events. */
export const BOARDSTORM_ROUND_INTERVAL = 5;

/** Approximate number of tiles mutated per Boardstorm. */
export const BOARDSTORM_TILE_COUNT = 10;

/** Tile type cycle applied during a Boardstorm mutation. */
const TILE_MUTATION: Record<TileType, TileType> = {
  safe: 'trap',
  trap: 'boost',
  boost: 'mystery',
  mystery: 'safe',
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Returns how many rounds remain until the next Boardstorm.
 *
 * @param round - Current round number
 */
export function getRoundsUntilBoardstorm(round: number): number {
  const positionInCycle = ((round - 1) % BOARDSTORM_ROUND_INTERVAL) + 1;
  return BOARDSTORM_ROUND_INTERVAL + 1 - positionInCycle;
}

/**
 * Determines whether a Boardstorm should fire after a round increment.
 *
 * @param previousRound - Round before advancing turn
 * @param newRound - Round after advancing turn
 */
export function shouldTriggerBoardstorm(
  previousRound: number,
  newRound: number,
): boolean {
  return (
    newRound > previousRound &&
    newRound > 1 &&
    (newRound - 1) % BOARDSTORM_ROUND_INTERVAL === 0
  );
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Mutates a single tile to the next type in the Boardstorm cycle
 * and assigns a fresh sub-effect when becoming Trap or Boost.
 */
function mutateTile(tile: BoardTile): BoardTile {
  const newType = TILE_MUTATION[tile.type];

  if (newType === 'trap') {
    return {
      number: tile.number,
      type: newType,
      trapEffect: pickRandom(TRAP_EFFECTS),
    };
  }

  if (newType === 'boost') {
    return {
      number: tile.number,
      type: newType,
      boostEffect: pickRandom(BOOST_EFFECTS),
    };
  }

  return { number: tile.number, type: newType };
}

/**
 * Picks random tile numbers to mutate, excluding tile 1 (start).
 *
 * @param count - How many tiles to select
 */
function pickTilesToMutate(count: number): number[] {
  const pool = Array.from(
    { length: BOARD_TILE_COUNT - 1 },
    (_, index) => index + 2,
  );

  for (let index = pool.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, count);
}

export type BoardstormResult = {
  tiles: BoardTile[];
  mutatedNumbers: number[];
};

/**
 * Randomly mutates ~10 tiles following the Boardstorm type cycle.
 *
 * @param tiles - Current board state
 * @param mutateCount - Number of tiles to mutate (default 10)
 */
export function applyBoardstorm(
  tiles: BoardTile[],
  mutateCount = BOARDSTORM_TILE_COUNT,
): BoardstormResult {
  const toMutate = pickTilesToMutate(mutateCount);
  const mutateSet = new Set(toMutate);

  const newTiles = tiles.map((tile) =>
    mutateSet.has(tile.number) ? mutateTile(tile) : tile,
  );

  return { tiles: newTiles, mutatedNumbers: toMutate };
}

/** Duration constants for the Boardstorm animation sequence (ms). */
export const BOARDSTORM_ANIMATION = {
  rumble: 800,
  highlight: 600,
  settle: 400,
} as const;

export { delay as boardstormDelay };
