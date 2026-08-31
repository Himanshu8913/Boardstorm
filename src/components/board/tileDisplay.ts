import { START_TILE } from '@/constants/board';
import type { TileType } from '@/types/tile';
import type { BoardTile } from '@/types/tile';

export function getDisplayTileType(
  tile: BoardTile | undefined,
  showType: boolean,
): TileType {
  if (!showType || !tile) {
    return 'safe';
  }

  return tile.type;
}

export function getTileDataType(
  tile: BoardTile | undefined,
  showType: boolean,
  isStart: boolean,
): TileType | 'start' {
  if (isStart) {
    return 'start';
  }

  return getDisplayTileType(tile, showType);
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
    const typeLabels: Record<string, string> = {
      trap: 'trap, skull icon',
      boost: 'boost, sun icon',
      mystery: 'mystery, question icon',
    };
    parts.push(typeLabels[tile.type] ?? tile.type);
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
