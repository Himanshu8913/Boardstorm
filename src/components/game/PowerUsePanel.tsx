import { useState } from 'react';
import type { Player } from '@/types/player';
import {
  isPassivePower,
  POWER_DESCRIPTIONS,
  POWER_LABELS,
} from '@/types/power';
import { getTeleportTargets } from '@/utils/powerEffects';

export type PowerAction =
  | { type: 'luckyRoll' }
  | { type: 'peek' }
  | { type: 'teleport'; targetTile: number }
  | { type: 'sabotage'; targetPlayerId: number };

type PowerUsePanelProps = {
  player: Player;
  allPlayers: Player[];
  isCurrentTurn: boolean;
  canUsePower: boolean;
  hasRolled: boolean;
  onUsePower: (action: PowerAction) => void;
};

export function PowerUsePanel({
  player,
  allPlayers,
  isCurrentTurn,
  canUsePower,
  hasRolled,
  onUsePower,
}: PowerUsePanelProps) {
  const [selectingTarget, setSelectingTarget] = useState<
    'teleport' | 'sabotage' | null
  >(null);

  if (!player.activePower || !isCurrentTurn) {
    return null;
  }

  const power = player.activePower;
  const isPassive = isPassivePower(power);

  const handleUse = () => {
    if (power === 'teleport') {
      setSelectingTarget('teleport');
      return;
    }

    if (power === 'sabotage') {
      setSelectingTarget('sabotage');
      return;
    }

    if (power === 'luckyRoll') {
      onUsePower({ type: 'luckyRoll' });
      return;
    }

    if (power === 'peek') {
      onUsePower({ type: 'peek' });
    }
  };

  const canActivate =
    canUsePower &&
    !isPassive &&
    (power !== 'luckyRoll' || hasRolled);

  const teleportTargets =
    power === 'teleport' ? getTeleportTargets(player.position) : [];

  const sabotageTargets = allPlayers.filter(
    (entry) => entry.id !== player.id,
  );

  return (
    <div className="flex flex-col gap-2 rounded-md border border-purple-700/50 bg-purple-950/20 p-2">
      <div>
        <p className="text-xs font-semibold text-purple-200">
          {POWER_LABELS[power]}
          {isPassive && (
            <span className="ml-1 font-normal text-purple-400">(Passive)</span>
          )}
        </p>
        <p className="text-xs text-purple-300/80">
          {POWER_DESCRIPTIONS[power]}
        </p>
      </div>

      {!isPassive && selectingTarget !== 'teleport' && selectingTarget !== 'sabotage' && (
        <button
          type="button"
          disabled={!canActivate}
          onClick={handleUse}
          className="rounded-md bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-600 disabled:opacity-50"
        >
          Use Power
        </button>
      )}

      {selectingTarget === 'teleport' && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-purple-300">Choose destination:</p>
          <div className="flex max-h-24 flex-wrap gap-1 overflow-y-auto">
            {teleportTargets.map((tile) => (
              <button
                key={tile}
                type="button"
                disabled={!canUsePower}
                onClick={() => {
                  onUsePower({ type: 'teleport', targetTile: tile });
                  setSelectingTarget(null);
                }}
                className="rounded bg-purple-800 px-2 py-0.5 text-xs text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {tile}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSelectingTarget(null)}
            className="text-xs text-boardstorm-muted hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {selectingTarget === 'sabotage' && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-purple-300">Choose target:</p>
          <div className="flex flex-wrap gap-1">
            {sabotageTargets.map((target) => (
              <button
                key={target.id}
                type="button"
                disabled={!canUsePower}
                onClick={() => {
                  onUsePower({ type: 'sabotage', targetPlayerId: target.id });
                  setSelectingTarget(null);
                }}
                className="rounded bg-purple-800 px-2 py-0.5 text-xs text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {target.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSelectingTarget(null)}
            className="text-xs text-boardstorm-muted hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
