import { BOARD_COLS, getBoardGrid } from '@/utils/boardLayout';
import { Tile } from './Tile';

const grid = getBoardGrid();

export function GameBoard() {
  return (
    <div className="w-full max-w-3xl">
      <div
        className="grid gap-0.5 sm:gap-1"
        style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Game board, 100 tiles"
      >
        {grid.map((row) =>
          row.map((tileNumber) => (
            <Tile
              key={tileNumber}
              number={tileNumber}
              isStart={tileNumber === 1}
            />
          )),
        )}
      </div>
    </div>
  );
}
