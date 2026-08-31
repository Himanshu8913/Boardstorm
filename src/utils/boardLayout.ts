import {
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_SIZE,
  START_TILE,
  WIN_TILE,
} from '@/constants/board';

/**
 * Serpentine row for tile number (1-based). Even rows reverse column order.
 */
export function getTileRow(tileNumber: number): number {
  return Math.floor((tileNumber - 1) / BOARD_COLS);
}

export function getTileColumn(tileNumber: number): number {
  const row = getTileRow(tileNumber);
  const colInRow = (tileNumber - 1) % BOARD_COLS;
  return row % 2 === 0 ? colInRow : BOARD_COLS - 1 - colInRow;
}

/** 10×10 grid of tile numbers in render order (row-major). */
export function getBoardGrid(): number[][] {
  const grid: number[][] = [];
  for (let row = 0; row < BOARD_ROWS; row++) {
    const rowTiles: number[] = [];
    for (let col = 0; col < BOARD_COLS; col++) {
      const tileNumber =
        row % 2 === 0
          ? row * BOARD_COLS + col + 1
          : row * BOARD_COLS + (BOARD_COLS - col);
      rowTiles.push(tileNumber);
    }
    grid.push(rowTiles);
  }
  return grid;
}

export function clampTileNumber(position: number): number {
  return Math.max(START_TILE, Math.min(WIN_TILE, position));
}

export { BOARD_SIZE, START_TILE, WIN_TILE };
