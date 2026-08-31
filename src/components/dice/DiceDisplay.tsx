type DiceDisplayProps = {
  value: number | null;
  isRolling: boolean;
};

export function DiceDisplay({ value, isRolling }: DiceDisplayProps) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 bg-slate-900 text-xl font-bold text-white transition-colors ${
        isRolling
          ? 'animate-dice-roll border-boardstorm-accent bg-amber-500/10 shadow-lg shadow-amber-500/20'
          : 'border-slate-500'
      }`}
      aria-live="polite"
      aria-label={value !== null ? `Die showing ${value}` : 'Die'}
    >
      {value ?? '–'}
    </div>
  );
}
