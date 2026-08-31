import type { Player } from '@/types/player';
import type { DieType } from '@/types/dice';
import { PowerUsePanel, type PowerAction } from '@/components/game/PowerUsePanel';
import { DiceDisplay } from './DiceDisplay';
import { DiceSelector } from './DiceSelector';

type PlayerDicePanelProps = {
  player: Player;
  allPlayers: Player[];
  selectedDie: DieType;
  displayValue: number | null;
  lastRoll: number | null;
  isRolling: boolean;
  isCurrentTurn: boolean;
  canEndTurn: boolean;
  isDisabled: boolean;
  onSelectDie: (dieType: DieType) => void;
  onRoll: () => void;
  onEndTurn: () => void;
  onUsePower: (action: PowerAction) => void;
};

export function PlayerDicePanel({
  player,
  allPlayers,
  selectedDie,
  displayValue,
  lastRoll,
  isRolling,
  isCurrentTurn,
  canEndTurn,
  isDisabled,
  onSelectDie,
  onRoll,
  onEndTurn,
  onUsePower,
}: PlayerDicePanelProps) {
  const panelDisabled = isDisabled || !isCurrentTurn;

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 transition-colors ${
        isCurrentTurn
          ? 'border-boardstorm-accent bg-boardstorm-surface ring-1 ring-boardstorm-accent/40'
          : 'border-slate-700 bg-boardstorm-surface/60 opacity-70'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          {player.name} — Tile {player.position}
          {isCurrentTurn && (
            <span className="rounded bg-boardstorm-accent/20 px-1.5 py-0.5 text-xs text-amber-300">
              Your turn
            </span>
          )}
        </span>
        <DiceDisplay value={displayValue} isRolling={isRolling} />
      </div>

      <DiceSelector
        selected={selectedDie}
        onSelect={onSelectDie}
        disabled={panelDisabled}
      />

      <button
        type="button"
        disabled={panelDisabled}
        onClick={onRoll}
        className="rounded-md bg-boardstorm-accent px-3 py-2 text-sm font-semibold text-boardstorm-bg hover:opacity-90 disabled:opacity-50"
      >
        {isRolling ? 'Rolling…' : 'Roll'}
      </button>

      {isCurrentTurn && (
        <button
          type="button"
          disabled={!canEndTurn || isDisabled}
          onClick={onEndTurn}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          End Turn
        </button>
      )}

      <PowerUsePanel
        player={player}
        allPlayers={allPlayers}
        isCurrentTurn={isCurrentTurn}
        canUsePower={!isDisabled}
        hasRolled={canEndTurn}
        onUsePower={onUsePower}
      />

      {lastRoll !== null && !isRolling && (
        <p className="text-xs text-boardstorm-muted">
          Last roll: {lastRoll}
        </p>
      )}
    </div>
  );
}
