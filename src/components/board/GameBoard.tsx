import type { Player } from '@/types/player';
import type { BoardTile } from '@/types/tile';
import { BOARD_COLS, getBoardGrid } from '@/utils/boardLayout';
import { Tile } from './Tile';

const grid = getBoardGrid();

type GameBoardProps = {
  players: Player[];
  tiles: BoardTile[];
  mutatingTiles?: number[];
};

export function GameBoard({
  players,
  tiles,
  mutatingTiles = [],
}: GameBoardProps) {
  const mutatingSet = new Set(mutatingTiles);
  const tileMap = new Map(tiles.map((tile) => [tile.number, tile]));

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
          row.map((tileNumber) => {
            const tile = tileMap.get(tileNumber);
            if (!tile) {
              return null;
            }

            return (
              <Tile
                key={tileNumber}
                tile={tile}
                isStart={tileNumber === 1}
                isMutating={mutatingSet.has(tileNumber)}
                players={playersByTile.get(tileNumber) ?? []}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
