import type { Player } from '@/types/player';

type PlayerTokenProps = {
  player: Player;
  offsetIndex: number;
};

const OFFSETS = [
  'top-0.5 left-0.5',
  'top-0.5 right-0.5',
  'bottom-0.5 left-0.5',
  'bottom-0.5 right-0.5',
] as const;

export function PlayerToken({ player, offsetIndex }: PlayerTokenProps) {
  return (
    <span
      className={`absolute h-[28%] w-[28%] rounded-full border-2 border-white shadow-md transition-transform duration-150 ease-out ${OFFSETS[offsetIndex]}`}
      style={{ backgroundColor: player.color }}
      title={player.name}
      aria-label={`${player.name} on tile ${player.position}`}
    />
  );
}
