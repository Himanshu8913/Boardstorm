import { START_TILE } from '@/constants/board';
import type { PlayerMotionEffect } from '@/types/animation';
import type { PlayerState } from '@/types/player';
import type { BoardTile, TileType } from '@/types/tile';
import { PlayerToken } from '@/components/board/PlayerToken';
import { TileIcon } from '@/components/board/TileIcon';
import {
  getDisplayTileType,
  getTileAriaLabel,
  getTileSurfaceClass,
} from '@/components/board/tileDisplay';
import { cn } from '@/components/ui/cn';

export type TileProps = {
  tileNumber: number;
  tile?: BoardTile;
  players: PlayerState[];
  showType: boolean;
  isMutating?: boolean;
  activeEffect?: TileType | null;
  playerMotions?: Record<number, PlayerMotionEffect>;
  hoppingPlayerId?: number | null;
  currentPlayerId?: number | null;
  rowIndex: number;
  columnIndex: number;
};

export function Tile({
  tileNumber,
  tile,
  players,
  showType,
  isMutating = false,
  activeEffect = null,
  playerMotions = {},
  hoppingPlayerId = null,
  currentPlayerId = null,
  rowIndex,
  columnIndex,
}: TileProps) {
  const isStart = tileNumber === START_TILE;
  const displayType = getDisplayTileType(tile, showType);
  const showIcon = isStart || (showType && displayType !== 'safe');
  const isActiveEffect = activeEffect !== null && activeEffect === displayType;
  const tileEffectClass =
    isActiveEffect && activeEffect === 'trap'
      ? 'anim-tile-trap'
      : isActiveEffect && activeEffect === 'boost'
        ? 'anim-tile-boost'
        : isActiveEffect && activeEffect === 'mystery'
          ? 'anim-tile-mystery'
          : null;

  return (
    <div
      role="gridcell"
      aria-rowindex={rowIndex + 1}
      aria-colindex={columnIndex + 1}
      aria-label={getTileAriaLabel(tileNumber, tile, showType, players.length)}
      className={cn(
        'relative aspect-square min-w-0 rounded-xs shadow-sm transition-shadow duration-fast sm:rounded-sm',
        getTileSurfaceClass(tile, showType, isStart),
        isMutating && 'tile-mutating',
        tileEffectClass,
        isActiveEffect && 'shadow-md ring-2 ring-inset ring-white/60',
      )}
    >
      <span className="absolute left-0.5 top-0.5 z-10 text-[clamp(0.625rem,2.2vw,0.875rem)] font-semibold leading-none opacity-80 sm:left-1 sm:top-1">
        {tileNumber}
      </span>

      {showIcon && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-2">
          <TileIcon type={displayType} isStart={isStart} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0">
        {players.map((player, index) => (
          <PlayerToken
            key={player.id}
            player={player}
            tileNumber={tileNumber}
            stackIndex={index}
            stackTotal={players.length}
            motion={playerMotions[player.id] ?? null}
            isHopping={hoppingPlayerId === player.id}
            isCurrentTurn={currentPlayerId === player.id}
          />
        ))}
      </div>
    </div>
  );
}
