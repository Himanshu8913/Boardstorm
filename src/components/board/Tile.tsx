import { START_TILE, WIN_TILE } from '@/constants/board';
import { getSafeTileVariant } from '@/constants/boardThemes';
import type { PlayerMotionEffect } from '@/types/animation';
import type { PlayerState } from '@/types/player';
import type { BoardTile, TileType } from '@/types/tile';
import { PlayerToken } from '@/components/board/PlayerToken';
import { TileIcon } from '@/components/board/TileIcon';
import {
  getTileAriaLabel,
  getTileDataType,
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
  const isFinish = tileNumber === WIN_TILE;
  const dataType = getTileDataType(tile, showType, isStart);
  const showIcon = dataType !== 'safe';
  const isActiveEffect = activeEffect !== null && activeEffect === dataType;
  const safeVariant = getSafeTileVariant(tileNumber);

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
      data-type={dataType}
      data-safe-variant={dataType === 'safe' ? safeVariant : undefined}
      data-finish={isFinish || undefined}
      className={cn(
        'game-tile',
        isMutating && 'tile-mutating',
        tileEffectClass,
        isActiveEffect && 'game-tile--active',
      )}
    >
      <span className="game-tile__number">{tileNumber}</span>

      {showIcon && <TileIcon type={dataType} />}

      <div className="game-tile__tokens">
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
