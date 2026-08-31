import type { Player } from '@/types/player';
import { PlayerToken } from './PlayerToken';

type TileProps = {
  number: number;
  isStart?: boolean;
  players: Player[];
};

export function Tile({ number, isStart = false, players }: TileProps) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-sm border text-[clamp(0.5rem,2.5vw,0.875rem)] font-semibold sm:rounded-md ${
        isStart
          ? 'border-boardstorm-accent bg-amber-500/20 text-amber-300 ring-2 ring-boardstorm-accent ring-offset-1 ring-offset-boardstorm-bg'
          : 'border-slate-600 bg-boardstorm-surface text-slate-300'
      }`}
      aria-label={isStart ? `Tile ${number}, start` : `Tile ${number}`}
    >
      {number}
      {players.map((player, index) => (
        <PlayerToken key={player.id} player={player} offsetIndex={index} />
      ))}
    </div>
  );
}
