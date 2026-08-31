import type { TileType } from '@/types/tile';
import { cn } from '@/components/ui/cn';

export type TileIconProps = {
  type: TileType | 'start';
  className?: string;
};

export function TileIcon({ type, className }: TileIconProps) {
  if (type === 'start') {
    return (
      <span className={cn('game-tile__icon game-tile__icon--start', className)} aria-hidden>
        🏁
      </span>
    );
  }

  if (type === 'safe') {
    return null;
  }

  if (type === 'boost') {
    return (
      <span className={cn('game-tile__icon game-tile__icon--boost', className)} aria-hidden>
        ☀️
      </span>
    );
  }

  if (type === 'trap') {
    return (
      <span className={cn('game-tile__icon game-tile__icon--trap', className)} aria-hidden>
        💀
      </span>
    );
  }

  return (
    <span className={cn('game-tile__icon game-tile__icon--mystery', className)} aria-hidden>
      ❓
    </span>
  );
}
