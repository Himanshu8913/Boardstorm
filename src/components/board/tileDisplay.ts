import { START_TILE } from '@/constants/board';
import type { TileType } from '@/types/tile';
import type { BoardTile } from '@/types/tile';

const tileSurfaceClasses: Record<TileType, string> = {
  safe: 'bg-tile-safe text-tile-safe-text',
  trap: 'bg-tile-trap text-tile-trap-text',
  boost: 'bg-tile-boost text-tile-boost-text',
  mystery: 'bg-tile-mystery text-tile-mystery-text',
};

export function getDisplayTileType(
  tile: BoardTile | undefined,
  showType: boolean,
): TileType {
  if (!showType || !tile) {
    return 'safe';
  }

  return tile.type;
}

export function getTileSurfaceClass(
  tile: BoardTile | undefined,
  showType: boolean,
  isStart: boolean,
): string {
  if (isStart) {
    return 'bg-tile-start text-tile-safe-text ring-2 ring-tile-start-ring ring-inset';
  }

  const displayType = getDisplayTileType(tile, showType);
  return tileSurfaceClasses[displayType];
}

export function getTileAriaLabel(
  tileNumber: number,
  tile: BoardTile | undefined,
  showType: boolean,
  playerCount: number,
): string {
  const parts = [`Tile ${tileNumber}`];

  if (tileNumber === START_TILE) {
    parts.push('start');
  }

  if (showType && tile && tile.type !== 'safe') {
    parts.push(tile.type);
  }

  if (playerCount > 0) {
    parts.push(
      playerCount === 1
        ? '1 player'
        : `${playerCount} players`,
    );
  }

  return parts.join(', ');
}
