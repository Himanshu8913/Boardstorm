export const BOARD_TILE_COUNT = 100;
export const BOARD_COLS = 10;
export const BOARD_ROWS = 10;

/** Returns tile number (1–100) for a grid cell in snake layout. Row 0 is top. */
export function getTileNumber(row: number, col: number): number {
  const fromBottom = BOARD_ROWS - 1 - row;
  const base = fromBottom * BOARD_COLS + 1;

  if (fromBottom % 2 === 0) {
    return base + col;
  }

  return base + (BOARD_COLS - 1 - col);
}

export function getBoardGrid(): number[][] {
  return Array.from({ length: BOARD_ROWS }, (_, row) =>
    Array.from({ length: BOARD_COLS }, (_, col) => getTileNumber(row, col)),
  );
}

export type TileGridPosition = {
  row: number;
  col: number;
};

/** Returns grid coordinates for a tile number in snake layout. */
export function getTileGridPosition(tileNumber: number): TileGridPosition {
  const fromBottom = Math.floor((tileNumber - 1) / BOARD_COLS);
  const row = BOARD_ROWS - 1 - fromBottom;
  const indexInRow = (tileNumber - 1) % BOARD_COLS;
  const col =
    fromBottom % 2 === 0 ? indexInRow : BOARD_COLS - 1 - indexInRow;

  return { row, col };
}
