import type { Player } from '@/types/player';
import type { DieType } from '@/types/dice';
import { DiceDisplay } from './DiceDisplay';
import { DiceSelector } from './DiceSelector';

type PlayerDicePanelProps = {
  player: Player;
  selectedDie: DieType;
  displayValue: number | null;
  lastRoll: number | null;
  isRolling: boolean;
  isDisabled: boolean;
  onSelectDie: (dieType: DieType) => void;
  onRoll: () => void;
};

export function PlayerDicePanel({
  player,
  selectedDie,
  displayValue,
  lastRoll,
  isRolling,
  isDisabled,
  onSelectDie,
  onRoll,
}: PlayerDicePanelProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-boardstorm-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          {player.name} — Tile {player.position}
        </span>
        <DiceDisplay value={displayValue} isRolling={isRolling} />
      </div>

      <DiceSelector
        selected={selectedDie}
        onSelect={onSelectDie}
        disabled={isDisabled}
      />

      <button
        type="button"
        disabled={isDisabled}
        onClick={onRoll}
        className="rounded-md bg-boardstorm-accent px-3 py-2 text-sm font-semibold text-boardstorm-bg hover:opacity-90 disabled:opacity-50"
      >
        {isRolling ? 'Rolling…' : 'Roll'}
      </button>

      {lastRoll !== null && !isRolling && (
        <p className="text-xs text-boardstorm-muted">
          Last roll: {lastRoll}
        </p>
      )}
    </div>
  );
}
