import { useMemo } from 'react';
import { Tile } from '@/components/board/Tile';
import { useGameStore } from '@/hooks/useGameStore';
import {
  getCurrentPlayerId,
  getPlayersOnTileForDisplay,
  getTileMap,
} from '@/store/selectors';
import { getBoardGrid } from '@/utils/boardLayout';
import type { MoveTaskPayload } from '@/services/animation/payloads';
import { cn } from '@/components/ui/cn';
import './board.css';

export type GameBoardProps = {
  className?: string;
};

export function GameBoard({ className }: GameBoardProps) {
  const board = useGameStore((state) => state.board);
  const players = useGameStore((state) => state.players);
  const turn = useGameStore((state) => state.turn);
  const settings = useGameStore((state) => state.settings);
  const animation = useGameStore((state) => state.animation);

  const tileMap = useMemo(() => getTileMap(board), [board]);
  const grid = useMemo(() => getBoardGrid(), []);
  const showType = settings.tileVisibility === 'visible';
  const currentPlayerId = getCurrentPlayerId(turn);
  const activeEffect = animation.activeTileEffect?.tileNumber
    ? animation.activeTileEffect.effect
    : null;
  const activeEffectTile = animation.activeTileEffect?.tileNumber ?? null;
  const mutatingTiles = new Set(animation.mutatingTileNumbers);
  const hoppingPlayerId =
    animation.current?.type === 'move'
      ? (animation.current.payload as MoveTaskPayload).playerId
      : null;

  return (
    <div
      role="grid"
      aria-label="Boardstorm game board"
      aria-rowcount={grid.length}
      aria-colcount={grid[0]?.length ?? 0}
      className={cn(
        'grid w-full min-w-0 max-w-full grid-cols-10 gap-0.5 rounded-xl border-2 border-border-strong bg-surface-elevated p-1 shadow-lg sm:gap-1.5 sm:p-2 md:gap-2',
        animation.boardRumbling && 'board-rumbling',
        className,
      )}
    >
      {grid.map((row, rowIndex) =>
        row.map((tileNumber, columnIndex) => {
          const tile = tileMap.get(tileNumber);
          const playersOnTile = getPlayersOnTileForDisplay(
            players,
            tileNumber,
            animation.visualPositions,
          );

          return (
            <Tile
              key={tileNumber}
              tileNumber={tileNumber}
              tile={tile}
              players={playersOnTile}
              showType={showType}
              isMutating={mutatingTiles.has(tileNumber)}
              activeEffect={
                activeEffectTile === tileNumber ? activeEffect : null
              }
              playerMotions={animation.playerMotions}
              hoppingPlayerId={hoppingPlayerId}
              currentPlayerId={currentPlayerId}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
            />
          );
        }),
      )}
    </div>
  );
}
