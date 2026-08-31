import type { Player } from '@/types/player';
import { BOARD_COLS, getBoardGrid } from '@/utils/boardLayout';
import { Tile } from './Tile';

const grid = getBoardGrid();

type GameBoardProps = {
  players: Player[];
};

export function GameBoard({ players }: GameBoardProps) {
  const playersByTile = players.reduce<Map<number, Player[]>>((map, player) => {
    const tilePlayers = map.get(player.position) ?? [];
    tilePlayers.push(player);
    map.set(player.position, tilePlayers);
    return map;
  }, new Map());

  for (const tilePlayers of playersByTile.values()) {
    tilePlayers.sort((a, b) => a.id - b.id);
  }

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
              players={playersByTile.get(tileNumber) ?? []}
            />
          )),
        )}
      </div>
    </div>
  );
}
