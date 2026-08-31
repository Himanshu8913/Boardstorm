import type { PlayerMotionEffect } from '@/types/animation';
import type { PlayerState } from '@/types/player';
import { cn } from '@/components/ui/cn';
import { getStackOffset } from '@/components/board/playerTokenLayout';

export type PlayerTokenProps = {
  player: PlayerState;
  stackIndex: number;
  stackTotal: number;
  motion?: PlayerMotionEffect | null;
  isCurrentTurn?: boolean;
};

const motionClasses: Record<PlayerMotionEffect, string> = {
  boost: 'token-motion-boost',
  trap: 'token-motion-trap',
  mystery: 'token-motion-mystery',
};

export function PlayerToken({
  player,
  stackIndex,
  stackTotal,
  motion = null,
  isCurrentTurn = false,
}: PlayerTokenProps) {
  const offset = getStackOffset(stackIndex, stackTotal);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      }}
      title={player.name}
      aria-label={player.name}
    >
      <div
        className={cn(
          'h-[clamp(10px,30%,22px)] w-[clamp(10px,30%,22px)] rounded-full border-2 border-white shadow-sm',
          player.isGhost && 'opacity-90',
          isCurrentTurn && 'ring-2 ring-primary ring-offset-1',
          motion && motionClasses[motion],
        )}
        style={{ backgroundColor: player.color }}
      />
    </div>
  );
}
