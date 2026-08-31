type DiceDisplayProps = {
  value: number | null;
  isRolling: boolean;
};

export function DiceDisplay({ value, isRolling }: DiceDisplayProps) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 bg-slate-900 text-xl font-bold text-white ${
        isRolling
          ? 'animate-pulse border-boardstorm-accent'
          : 'border-slate-500'
      }`}
      aria-live="polite"
      aria-label={value !== null ? `Die showing ${value}` : 'Die'}
    >
      {value ?? '–'}
    </div>
  );
}
