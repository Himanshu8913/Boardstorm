import type { Player } from '@/types/player';
import type { BoardTile } from '@/types/tile';
import type { TileType } from '@/types/tile';
import type { PlayerMotionEffect } from '@/types/animation';
import { TILE_TYPE_LABELS, TILE_TYPE_STYLES } from '@/types/tile';
import { PlayerToken } from './PlayerToken';

type TileProps = {
  tile: BoardTile;
  isStart?: boolean;
  isMutating?: boolean;
  activeEffect?: TileType | null;
  playerMotions?: Map<number, PlayerMotionEffect>;
  players: Player[];
};

const EFFECT_CLASSES: Record<TileType, string> = {
  safe: '',
  boost: 'animate-boost-tile',
  trap: 'animate-trap-tile',
  mystery: 'animate-mystery-tile',
};

export function Tile({
  tile,
  isStart = false,
  isMutating = false,
  activeEffect = null,
  playerMotions,
  players,
}: TileProps) {
  const typeStyle = TILE_TYPE_STYLES[tile.type];
  const typeLabel = TILE_TYPE_LABELS[tile.type];
  const effectClass =
    activeEffect === tile.type ? EFFECT_CLASSES[tile.type] : '';

  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-sm border text-[clamp(0.5rem,2.5vw,0.875rem)] font-semibold sm:rounded-md ${
        isStart
          ? 'border-boardstorm-accent bg-amber-500/20 text-amber-300 ring-2 ring-boardstorm-accent ring-offset-1 ring-offset-boardstorm-bg'
          : typeStyle
      } ${isMutating ? 'animate-boardstorm-tile ring-2 ring-yellow-400' : ''} ${effectClass}`}
      aria-label={
        isStart
          ? `Tile ${tile.number}, start, ${tile.type}`
          : `Tile ${tile.number}, ${tile.type}`
      }
    >
      <span className="absolute left-0.5 top-0.5 text-[0.55rem] opacity-60">
        {typeLabel}
      </span>
      {tile.number}
      {players.map((player, index) => (
        <PlayerToken
          key={player.id}
          player={player}
          offsetIndex={index}
          motion={playerMotions?.get(player.id) ?? null}
        />
      ))}
    </div>
  );
}
