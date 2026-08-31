export const BOARD_TILE_COUNT = 100;
export const BOARD_COLS = 10;
export const BOARD_ROWS = 10;

/**
 * Maps a grid cell to its tile number in classic snake layout.
 * Row 0 is the top of the board; tile 1 sits at the bottom-left.
 *
 * @param row - Grid row index (0 = top)
 * @param col - Grid column index (0 = left)
 */
export function getTileNumber(row: number, col: number): number {
  const fromBottom = BOARD_ROWS - 1 - row;
  const base = fromBottom * BOARD_COLS + 1;

  if (fromBottom % 2 === 0) {
    return base + col;
  }

  return base + (BOARD_COLS - 1 - col);
}

/** Builds the full 10×10 grid of tile numbers in render order (top row first). */
export function getBoardGrid(): number[][] {
  return Array.from({ length: BOARD_ROWS }, (_, row) =>
    Array.from({ length: BOARD_COLS }, (_, col) => getTileNumber(row, col)),
  );
}

export type TileGridPosition = {
  row: number;
  col: number;
};

/**
 * Inverse of {@link getTileNumber}: converts a tile number to grid coordinates.
 *
 * @param tileNumber - Tile number (1–100)
 */
export function getTileGridPosition(tileNumber: number): TileGridPosition {
  const fromBottom = Math.floor((tileNumber - 1) / BOARD_COLS);
  const row = BOARD_ROWS - 1 - fromBottom;
  const indexInRow = (tileNumber - 1) % BOARD_COLS;
  const col =
    fromBottom % 2 === 0 ? indexInRow : BOARD_COLS - 1 - indexInRow;

  return { row, col };
}
