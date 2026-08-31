import type { BoardMood } from '@/types/match';
import type { MysteryPower } from '@/types/power';
import type { PlayerState } from '@/types/player';
import type { BoardTile, BoostEffect, TrapEffect } from '@/types/tile';
import { WIN_TILE } from '@/constants/board';
import {
  PEEK_AHEAD_TILES,
  SABOTAGE_BACK_TILES,
  TELEPORT_RANGE,
} from '@/constants/game';
import {
  BOOST_FORWARD_STEPS,
  TRAP_BACK_STEPS,
} from '@/constants/gameplay';
import { buildTileMap } from '@/game/engines/boardEngine';
import {
  clampTileNumber,
  getForwardMovementPath,
} from '@/game/engines/playerEngine';
import { pickRandomPower } from '@/game/engines/powerEngine';

export type TileResolutionResult = {
  finalPosition: number;
  message: string;
  grantedPower: MysteryPower | null;
  lastMysteryTile: number | null;
  powerConsumed: boolean;
  movementPath: number[];
};

type ResolveTileInput = {
  tile: BoardTile;
  landingPosition: number;
  player: PlayerState;
  boardTiles: BoardTile[];
  boardMood: BoardMood;
  shieldDisabled?: boolean;
  doubleBoostActive?: boolean;
};

function getTrapBackSteps(base: number, mood: BoardMood): number {
  if (base <= 0) {
    return 0;
  }
  if (mood === 'cruel') {
    return base + 1;
  }
  if (mood === 'kind') {
    return Math.max(1, base - 1);
  }
  return base;
}

function getBoostForwardSteps(
  base: number,
  mood: BoardMood,
  doubled: boolean,
): number {
  let steps = base;
  if (mood === 'kind') {
    steps += 1;
  }
  if (mood === 'cruel' && steps > 0) {
    steps = Math.max(1, steps - 1);
  }
  if (doubled) {
    steps *= 2;
  }
  return steps;
}

function getBackwardPath(from: number, steps: number): number[] {
  const path: number[] = [];
  for (let step = 1; step <= steps; step++) {
    path.push(clampTileNumber(from - step));
  }
  return path;
}

function findPreviousSafeTile(
  from: number,
  tileMap: Map<number, BoardTile>,
): number {
  for (let position = from - 1; position >= 1; position--) {
    if (tileMap.get(position)?.type === 'safe') {
      return position;
    }
  }
  return 1;
}

function findNextMysteryTile(
  from: number,
  tileMap: Map<number, BoardTile>,
): number {
  for (let position = from + 1; position <= WIN_TILE; position++) {
    if (tileMap.get(position)?.type === 'mystery') {
      return position;
    }
  }
  return from;
}

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

function resolveTrapPosition(
  effect: TrapEffect,
  from: number,
  player: PlayerState,
  tileMap: Map<number, BoardTile>,
  mood: BoardMood,
): { position: number; message: string; backSteps: number } {
  switch (effect) {
    case 'mud': {
      const steps = getTrapBackSteps(TRAP_BACK_STEPS.mud, mood);
      return {
        position: clampTileNumber(from - steps),
        message: `Trap! Back ${steps} tiles.`,
        backSteps: steps,
      };
    }
    case 'spike': {
      const steps = getTrapBackSteps(TRAP_BACK_STEPS.spike, mood);
      return {
        position: clampTileNumber(from - steps),
        message: `Spike trap! Back ${steps} tiles.`,
        backSteps: steps,
      };
    }
    case 'collapse': {
      const target = player.lastMysteryTile ?? from;
      return {
        position: clampTileNumber(target),
        message: 'Collapse! Sent to your last mystery tile.',
        backSteps: Math.max(0, from - target),
      };
    }
    case 'gust': {
      const position = findPreviousSafeTile(from, tileMap);
      return {
        position,
        message: 'Gust! Blown back to a safe tile.',
        backSteps: Math.max(0, from - position),
      };
    }
    default:
      return { position: from, message: 'Trap!', backSteps: 0 };
  }
}

function resolveBoostPosition(
  effect: BoostEffect,
  from: number,
  tileMap: Map<number, BoardTile>,
  mood: BoardMood,
  doubled: boolean,
): { position: number; message: string; path: number[] } {
  switch (effect) {
    case 'spring': {
      const steps = getBoostForwardSteps(
        BOOST_FORWARD_STEPS.spring,
        mood,
        doubled,
      );
      const path = getForwardMovementPath(from, steps);
      return {
        position: path.length > 0 ? path[path.length - 1] : from,
        path,
        message: `Boost! Forward ${steps} tiles.`,
      };
    }
    case 'rocket': {
      const steps = getBoostForwardSteps(
        BOOST_FORWARD_STEPS.rocket,
        mood,
        doubled,
      );
      const path = getForwardMovementPath(from, steps);
      return {
        position: path.length > 0 ? path[path.length - 1] : from,
        path,
        message: `Rocket boost! Forward ${steps} tiles.`,
      };
    }
    case 'vine': {
      const position = findNextMysteryTile(from, tileMap);
      return {
        position,
        path: position === from ? [] : [position],
        message:
          position === from
            ? 'Vine fizzled — no mystery ahead.'
            : 'Vine whips you to the next mystery tile!',
      };
    }
    case 'wind': {
      const position = findNearestBoostTile(from, tileMap);
      return {
        position,
        path: position === from ? [] : [position],
        message:
          position === from
            ? 'Wind dies down — no boost nearby.'
            : 'Wind carries you to the nearest boost!',
      };
    }
    default:
      return { position: from, path: [], message: 'Boost!' };
  }
}

/** Resolves trap/boost/mystery/safe landing per 02_GAME_RULES.md */
export function resolveTileLanding(
  input: ResolveTileInput,
): TileResolutionResult {
  const { tile, landingPosition, player, boardTiles, boardMood } = input;

  if (tile.type === 'safe') {
    return {
      finalPosition: landingPosition,
      message: 'Safe tile.',
      grantedPower: null,
      lastMysteryTile: player.lastMysteryTile,
      powerConsumed: false,
      movementPath: [],
    };
  }

  if (tile.type === 'mystery') {
    const grantedPower = pickRandomPower();
    return {
      finalPosition: landingPosition,
      message: `Mystery! You found ${grantedPower}.`,
      grantedPower,
      lastMysteryTile: landingPosition,
      powerConsumed: false,
      movementPath: [],
    };
  }

  if (tile.type === 'trap' && tile.trapEffect) {
    const shieldBlocks =
      player.activePower === 'shield' && !input.shieldDisabled;
    const phaseWalkBlocks = player.activePower === 'phaseWalk';

    if (shieldBlocks || phaseWalkBlocks) {
      const powerName = shieldBlocks ? 'Shield' : 'Phase Walk';
      return {
        finalPosition: landingPosition,
        message: `${powerName} blocked the trap!`,
        grantedPower: null,
        lastMysteryTile: player.lastMysteryTile,
        powerConsumed: true,
        movementPath: [],
      };
    }

    const tileMap = buildTileMap(boardTiles);
    const { position, message, backSteps } = resolveTrapPosition(
      tile.trapEffect,
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
      powerConsumed: false,
      movementPath: getBackwardPath(landingPosition, backSteps),
    };
  }

  if (tile.type === 'boost' && tile.boostEffect) {
    const tileMap = buildTileMap(boardTiles);
    const doubled =
      Boolean(input.doubleBoostActive) &&
      (tile.boostEffect === 'spring' || tile.boostEffect === 'rocket');

    const { position, message, path } = resolveBoostPosition(
      tile.boostEffect,
      landingPosition,
      tileMap,
      boardMood,
      doubled,
    );

    return {
      finalPosition: position,
      message,
      grantedPower: null,
      lastMysteryTile: player.lastMysteryTile,
      powerConsumed: doubled,
      movementPath: path,
    };
  }

  return {
    finalPosition: landingPosition,
    message: '',
    grantedPower: null,
    lastMysteryTile: player.lastMysteryTile,
    powerConsumed: false,
    movementPath: [],
  };
}

export function getPeekTiles(
  from: number,
  boardTiles: BoardTile[],
): BoardTile[] {
  return boardTiles.filter(
    (tile) => tile.number > from && tile.number <= from + PEEK_AHEAD_TILES,
  );
}

export function clampTeleportTarget(from: number, target: number): number {
  const min = clampTileNumber(from - TELEPORT_RANGE);
  const max = clampTileNumber(from + TELEPORT_RANGE);
  return clampTileNumber(Math.max(min, Math.min(max, target)));
}

export function getSabotagePosition(position: number): number {
  return clampTileNumber(position - SABOTAGE_BACK_TILES);
}
