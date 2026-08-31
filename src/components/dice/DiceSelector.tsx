import type { DieType } from '@/types/dice';
import { cn } from '@/components/ui/cn';

export type DiceSelectorProps = {
  selected: DieType;
  onSelect: (dieType: DieType) => void;
  disabled?: boolean;
};

function SafeDieIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('h-6 w-6', className)}
      fill="currentColor"
    >
      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm0 2.2 6 2.25V11c0 3.9-2.6 7.6-6 8.8-3.4-1.2-6-4.9-6-8.8V6.45l6-2.25z" />
    </svg>
  );
}

function RiskDieIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('h-6 w-6', className)}
      fill="currentColor"
    >
      <path d="M12 2c.6 0 1.1.4 1.3 1l7.7 18.5c.3.7-.2 1.5-1 1.5H4c-.8 0-1.3-.8-1-1.5L10.7 3c.2-.6.7-1 1.3-1zm0 4.2L6.4 18h11.2L12 6.2zM11 9h2v6h-2V9zm0 8h2v2h-2v-2z" />
    </svg>
  );
}

const dieOptions: {
  type: DieType;
  label: string;
  range: string;
  icon: typeof SafeDieIcon;
  selectedClass: string;
}[] = [
  {
    type: 'safe',
    label: 'Safe',
    range: '1–4',
    icon: SafeDieIcon,
    selectedClass:
      'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2',
  },
  {
    type: 'risk',
    label: 'Risk',
    range: '1–8',
    icon: RiskDieIcon,
    selectedClass:
      'border-danger bg-danger/10 text-danger ring-2 ring-danger ring-offset-2',
  },
];

export function DiceSelector({
  selected,
  onSelect,
  disabled = false,
}: DiceSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="group"
      aria-label="Choose die type"
    >
      {dieOptions.map(({ type, label, range, icon: Icon, selectedClass }) => {
        const isSelected = selected === type;

        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => onSelect(type)}
            className={cn(
              'flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-border bg-surface px-3 py-3 text-sm font-semibold transition-all duration-fast',
              'hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              'disabled:pointer-events-none disabled:opacity-50 disabled:scale-100',
              isSelected && selectedClass,
            )}
          >
            <Icon />
            <span>{label}</span>
            <span className="text-xs font-normal opacity-80">{range}</span>
          </button>
        );
      })}
    </div>
  );
}
