import type { Player } from '@/types/player';
import type { PlayerMotionEffect } from '@/types/animation';

type PlayerTokenProps = {
  player: Player;
  offsetIndex: number;
  motion?: PlayerMotionEffect | null;
};

const OFFSETS = [
  'top-0.5 left-0.5',
  'top-0.5 right-0.5',
  'bottom-0.5 left-0.5',
  'bottom-0.5 right-0.5',
] as const;

const MOTION_CLASSES: Record<PlayerMotionEffect, string> = {
  boost: 'animate-token-boost',
  trap: 'animate-token-trap',
  mystery: 'animate-token-mystery',
};

export function PlayerToken({
  player,
  offsetIndex,
  motion = null,
}: PlayerTokenProps) {
  const motionClass = motion ? MOTION_CLASSES[motion] : '';

  return (
    <span
      className={`absolute h-[28%] w-[28%] rounded-full border-2 border-white shadow-md ${OFFSETS[offsetIndex]} ${motionClass}`}
      style={{ backgroundColor: player.color }}
      title={player.name}
      aria-label={`${player.name} on tile ${player.position}`}
    />
  );
}
