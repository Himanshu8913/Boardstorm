import { useMemo } from 'react';
import { BoardLegend } from '@/components/board/BoardLegend';
import { Tile } from '@/components/board/Tile';
import { BOARD_THEMES } from '@/constants/boardThemes';
import { MOOD_EMOJI } from '@/constants/gameplay';
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
  const match = useGameStore((state) => state.match);
  const settings = useGameStore((state) => state.settings);
  const animation = useGameStore((state) => state.animation);

  const tileMap = useMemo(() => getTileMap(board), [board]);
  const grid = useMemo(() => getBoardGrid(), []);
  const showType = settings.tileVisibility === 'visible';
  const currentPlayerId = getCurrentPlayerId(turn);
  const theme = BOARD_THEMES[match.boardMood];
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
      className={cn(
        'board-frame',
        theme.frameClass,
        animation.boardRumbling && 'board-rumbling',
        className,
      )}
    >
      <div className="board-frame__scene" aria-hidden />
      <div className="board-frame__ornament board-frame__ornament--tl" aria-hidden />
      <div className="board-frame__ornament board-frame__ornament--br" aria-hidden />

      <header className="board-frame__header">
        <span className="board-frame__badge" aria-hidden>
          {MOOD_EMOJI[match.boardMood]}
        </span>
        <div className="board-frame__titles">
          <p className="board-frame__brand">BOARDSTORM</p>
          <p className="board-frame__mood">{theme.label}</p>
        </div>
      </header>

      <div
        role="grid"
        aria-label="Boardstorm game board"
        aria-rowcount={grid.length}
        aria-colcount={grid[0]?.length ?? 0}
        className="board-frame__grid"
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

      <BoardLegend showTypes={showType} />
    </div>
  );
}
