import { cn } from '@/components/ui/cn';

type LegendItem = {
  icon: string;
  label: string;
  title: string;
  className: string;
};

const LEGEND_ITEMS: readonly LegendItem[] = [
  {
    icon: '☀️',
    label: 'Boost',
    title: 'Move forward',
    className: 'board-legend__item--boost',
  },
  {
    icon: '💀',
    label: 'Trap',
    title: 'Move backward',
    className: 'board-legend__item--trap',
  },
  {
    icon: '❓',
    label: 'Mystery',
    title: 'Get a power',
    className: 'board-legend__item--mystery',
  },
  {
    icon: '🏁',
    label: 'Start',
    title: 'Race begins',
    className: 'board-legend__item--start',
  },
] as const;

export type BoardLegendProps = {
  showTypes?: boolean;
  className?: string;
};

export function BoardLegend({ showTypes = true, className }: BoardLegendProps) {
  if (!showTypes) {
    return (
      <div className={cn('board-legend board-legend--fog', className)}>
        <p className="board-legend__fog-text">Fog mode — tile types hidden</p>
      </div>
    );
  }

  return (
    <div className={cn('board-legend', className)} aria-label="Tile legend">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className={cn('board-legend__item', item.className)}>
          <span className="board-legend__icon" aria-hidden>
            {item.icon}
          </span>
          <span className="board-legend__copy">
            <span className="board-legend__label">{item.label}</span>
            <span className="board-legend__title">{item.title}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
