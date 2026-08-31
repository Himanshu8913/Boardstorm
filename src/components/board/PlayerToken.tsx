import type { PlayerMotionEffect } from '@/types/animation';
import type { PlayerState } from '@/types/player';
import { cn } from '@/components/ui/cn';
import { getStackOffset } from '@/components/board/playerTokenLayout';

export type PlayerTokenProps = {
  player: PlayerState;
  tileNumber: number;
  stackIndex: number;
  stackTotal: number;
  motion?: PlayerMotionEffect | null;
  isHopping?: boolean;
  isCurrentTurn?: boolean;
};

const motionClasses: Record<PlayerMotionEffect, string> = {
  boost: 'token-motion-boost',
  trap: 'token-motion-trap',
  mystery: 'token-motion-mystery',
};

export function PlayerToken({
  player,
  tileNumber,
  stackIndex,
  stackTotal,
  motion = null,
  isHopping = false,
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
      aria-label={`${player.name}, on tile ${tileNumber}${player.isGhost ? ', ghost' : ''}`}
    >
      <div
        className={cn(
          'h-[clamp(10px,30%,22px)] w-[clamp(10px,30%,22px)] rounded-full border-2 border-white shadow-sm',
          player.isGhost && 'opacity-90',
          isHopping && 'anim-token-hop',
          isCurrentTurn && 'ring-2 ring-primary ring-offset-1',
          motion && motionClasses[motion],
        )}
        style={{ backgroundColor: player.color }}
      />
    </div>
  );
}
