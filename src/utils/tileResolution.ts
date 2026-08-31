import type { BoardMood } from '@/types/boardMood';
import type { MysteryPower } from '@/types/power';
import type { Player } from '@/types/player';
import type { BoardTile } from '@/types/tile';
import { MYSTERY_POWERS, POWER_LABELS } from '@/types/power';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { calculateTargetPosition } from '@/utils/playerMovement';

export type TileResolutionResult = {
  finalPosition: number;
  message: string;
  grantedPower: MysteryPower | null;
  lastMysteryTile: number | null;
};

type ResolveTileLandingInput = {
  tile: BoardTile;
  landingPosition: number;
  player: Player;
  boardTiles: BoardTile[];
  boardMood: BoardMood;
};

/**
 * Picks a random mystery power with uniform probability.
 */
function pickRandomPower(): MysteryPower {
  return MYSTERY_POWERS[Math.floor(Math.random() * MYSTERY_POWERS.length)];
}

/**
 * Applies mood-based bonus to trap backward movement on Cruel boards.
 */
function getTrapBackSteps(
  baseSteps: number,
  boardMood: BoardMood,
): number {
  return boardMood === 'cruel' ? baseSteps + 1 : baseSteps;
}

/**
 * Applies mood-based bonus to boost forward movement on Kind boards.
 */
function getBoostForwardSteps(
  baseSteps: number,
  boardMood: BoardMood,
): number {
  return boardMood === 'kind' ? baseSteps + 1 : baseSteps;
}

/**
 * Finds the nearest Safe tile when moving backward from a Gust trap.
 *
 * @param from - Current tile position
 * @param tileMap - Lookup of all board tiles by number
 */
function findPreviousSafeTile(
  from: number,
  tileMap: Map<number, BoardTile>,
): number {
  for (let position = from - 1; position >= 1; position--) {
    const tile = tileMap.get(position);
    if (tile?.type === 'safe') {
      return position;
    }
  }

  return 1;
}

/**
 * Finds the next Mystery tile ahead of the player for the Vine boost.
 *
 * @param from - Current tile position
 * @param tileMap - Lookup of all board tiles by number
 */
function findNextMysteryTile(
  from: number,
  tileMap: Map<number, BoardTile>,
): number {
  for (let position = from + 1; position <= BOARD_TILE_COUNT; position++) {
    const tile = tileMap.get(position);
    if (tile?.type === 'mystery') {
      return position;
    }
  }

  return from;
}

/**
 * Finds the closest Boost tile to the player for the Wind boost.
 * Ties favour the closer tile; equal distance favours the lower tile number.
 *
 * @param from - Current tile position
 * @param tileMap - Lookup of all board tiles by number
 */
function findNearestBoostTile(
  from: number,
  tileMap: Map<number, BoardTile>,
): number {
  let nearest = from;
  let minDistance = Infinity;

  for (const tile of tileMap.values()) {
    if (tile.type !== 'boost' || tile.number === from) {
      continue;
    }

    const distance = Math.abs(tile.number - from);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = tile.number;
    }
  }

  return nearest;
}

/**
 * Resolves a Trap tile effect and returns the new position.
 */
function resolveTrap(
  tile: BoardTile,
  landingPosition: number,
  player: Player,
  tileMap: Map<number, BoardTile>,
  boardMood: BoardMood,
): { position: number; message: string } {
  switch (tile.trapEffect) {
    case 'mud': {
      const steps = getTrapBackSteps(3, boardMood);
      const position = calculateTargetPosition(
        landingPosition,
        -steps,
        BOARD_TILE_COUNT,
      );
      return {
        position,
        message: `Mud trap! Moved back ${steps} tiles.`,
      };
    }
    case 'spike': {
      const steps = getTrapBackSteps(5, boardMood);
      const position = calculateTargetPosition(
        landingPosition,
        -steps,
        BOARD_TILE_COUNT,
      );
      return {
        position,
        message: `Spike trap! Moved back ${steps} tiles.`,
      };
    }
    case 'collapse': {
      const position = player.lastMysteryTile ?? 1;
      return {
        position,
        message: player.lastMysteryTile
          ? 'Collapse! Returned to your last Mystery tile.'
          : 'Collapse! No Mystery visited — sent to tile 1.',
      };
    }
    case 'gust': {
      const position = findPreviousSafeTile(landingPosition, tileMap);
      return {
        position,
        message: 'Gust trap! Blown back to the previous Safe tile.',
      };
    }
    default:
      return { position: landingPosition, message: 'Trap tile — no effect.' };
  }
}

/**
 * Resolves a Boost tile effect and returns the new position.
 */
function resolveBoost(
  tile: BoardTile,
  landingPosition: number,
  tileMap: Map<number, BoardTile>,
  boardMood: BoardMood,
): { position: number; message: string } {
  switch (tile.boostEffect) {
    case 'spring': {
      const steps = getBoostForwardSteps(3, boardMood);
      const position = calculateTargetPosition(
        landingPosition,
        steps,
        BOARD_TILE_COUNT,
      );
      return {
        position,
        message: `Spring boost! Moved forward ${steps} tiles.`,
      };
    }
    case 'rocket': {
      const steps = getBoostForwardSteps(6, boardMood);
      const position = calculateTargetPosition(
        landingPosition,
        steps,
        BOARD_TILE_COUNT,
      );
      return {
        position,
        message: `Rocket boost! Moved forward ${steps} tiles.`,
      };
    }
    case 'vine': {
      const position = findNextMysteryTile(landingPosition, tileMap);
      return {
        position,
        message:
          position === landingPosition
            ? 'Vine boost — no Mystery tile ahead.'
            : 'Vine boost! Jumped to the next Mystery tile.',
      };
    }
    case 'wind': {
      const position = findNearestBoostTile(landingPosition, tileMap);
      return {
        position,
        message:
          position === landingPosition
            ? 'Wind boost — no other Boost tile found.'
            : 'Wind boost! Moved to the nearest Boost tile.',
      };
    }
    default:
      return { position: landingPosition, message: 'Boost tile — no effect.' };
  }
}

/**
 * Resolves the tile a player lands on after a dice roll.
 * Safe tiles do nothing; Trap/Boost move the player; Mystery grants a power.
 * Resolution movement does not chain into further tile effects.
 *
 * @param input - Landing context including tile, player, and board state
 */
export function resolveTileLanding(
  input: ResolveTileLandingInput,
): TileResolutionResult {
  const { tile, landingPosition, player, boardTiles, boardMood } = input;
  const tileMap = new Map(boardTiles.map((entry) => [entry.number, entry]));

  if (tile.type === 'safe') {
    return {
      finalPosition: landingPosition,
      message: 'Safe tile — nothing happens.',
      grantedPower: null,
      lastMysteryTile: player.lastMysteryTile,
    };
  }

  if (tile.type === 'trap') {
    const { position, message } = resolveTrap(
      tile,
      landingPosition,
      player,
      tileMap,
      boardMood,
    );
    return {
      finalPosition: position,
      message,
      grantedPower: null,
      lastMysteryTile: player.lastMysteryTile,
    };
  }

  if (tile.type === 'boost') {
    const { position, message } = resolveBoost(
      tile,
      landingPosition,
      tileMap,
      boardMood,
    );
    return {
      finalPosition: position,
      message,
      grantedPower: null,
      lastMysteryTile: player.lastMysteryTile,
    };
  }

  const power = pickRandomPower();
  return {
    finalPosition: landingPosition,
    message: `Mystery tile! Received ${POWER_LABELS[power]} power.`,
    grantedPower: power,
    lastMysteryTile: landingPosition,
  };
}
