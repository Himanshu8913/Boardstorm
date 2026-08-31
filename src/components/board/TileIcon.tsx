import type { TileType } from '@/types/tile';
import { cn } from '@/components/ui/cn';

export type TileIconProps = {
  type: TileType;
  isStart?: boolean;
  className?: string;
};

const iconClass = 'h-[42%] w-[42%] max-h-5 max-w-5 shrink-0';

export function TileIcon({ type, isStart = false, className }: TileIconProps) {
  if (isStart) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(iconClass, 'text-secondary', className)}
        fill="currentColor"
      >
        <path d="M6 3v18l6-3 6 3V3H6zm2 2h8v11.5l-4-2-4 2V5z" />
      </svg>
    );
  }

  if (type === 'safe') {
    return (
      <span
        aria-hidden
        className={cn(
          'h-1.5 w-1.5 rounded-full bg-tile-safe-text/40',
          className,
        )}
      />
    );
  }

  if (type === 'trap') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(iconClass, 'text-tile-trap-text', className)}
        fill="currentColor"
      >
        <path d="M12 2 1 21h22L12 2zm0 4.5 7.5 13.5h-15L12 6.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    );
  }

  if (type === 'boost') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(iconClass, 'text-tile-boost-text', className)}
        fill="currentColor"
      >
        <path d="M12 2.5 8.5 9H3l5.5 4-2 8.5L12 17l5.5 4.5-2-8.5L21 9h-5.5L12 2.5z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(iconClass, 'text-tile-mystery-text', className)}
      fill="currentColor"
    >
      <path d="M12 2l1.4 4.3H18l-3.6 2.6 1.4 4.3L12 10.6 8.2 13.2l1.4-4.3L6 6.3h4.6L12 2zm0 10.5 2.8 2-1.1 3.4L12 16.3l-1.7 1.6 1.1-3.4-2.8-2h3.5z" />
    </svg>
  );
}
