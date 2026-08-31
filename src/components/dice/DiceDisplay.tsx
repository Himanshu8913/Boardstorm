import type { DieType } from '@/types/dice';
import { cn } from '@/components/ui/cn';

export type DiceDisplayProps = {
  dieType: DieType | null;
  value: number | null;
  rolling?: boolean;
  spinning?: boolean;
  className?: string;
};

export function DiceDisplay({
  dieType,
  value,
  rolling = false,
  spinning = false,
  className,
}: DiceDisplayProps) {
  const label =
    value !== null
      ? `Rolled ${value}`
      : rolling
        ? 'Rolling…'
        : 'No roll yet';

  return (
    <div
      className={cn(
        'flex min-h-[96px] flex-col items-center justify-center rounded-xl border border-border bg-elevated px-4 py-3 text-center shadow-inner',
        (rolling || spinning) && 'animate-pulse',
        spinning && 'anim-dice-spin',
        className,
      )}
      aria-live="polite"
      aria-label={label}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {dieType === 'risk' ? 'Risk die' : dieType === 'safe' ? 'Safe die' : 'Last roll'}
      </span>
      <span className="mt-1 text-4xl font-semibold tabular-nums text-ink">
        {value ?? '—'}
      </span>
    </div>
  );
}
