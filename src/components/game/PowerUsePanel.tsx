import { useState } from 'react';
import { START_TILE, WIN_TILE } from '@/constants/board';
import { TELEPORT_RANGE } from '@/constants/game';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { PlayerId } from '@/types/playerId';

export type PowerUsePanelProps = {
  playerId: PlayerId;
  disabled?: boolean;
};

export function PowerUsePanel({ playerId, disabled = false }: PowerUsePanelProps) {
  const controller = useGameController();
  const player = useGameStore((state) => state.players[playerId]);
  const players = useGameStore((state) => state.players);
  const canEndTurn = useGameStore((state) => state.ui.canEndTurn);
  const [teleportTarget, setTeleportTarget] = useState(
    () => player?.position ?? START_TILE,
  );

  if (!player?.activePower) {
    return null;
  }

  const power = player.activePower;
  const isActivatable = controller.isPowerActivatable(power);
  const label = controller.getPowerLabel(power);

  const activatePower = (action: Parameters<typeof controller.usePower>[1]) => {
    controller.usePower(playerId, action);
  };

  return (
    <div className="rounded-lg border border-mystery/30 bg-mystery/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Active power
        </span>
        <Badge variant="mystery">{label}</Badge>
      </div>

      {!isActivatable && (
        <p className="mt-2 text-xs text-ink-muted">
          Passive — activates automatically when conditions are met.
        </p>
      )}

      {power === 'luckyRoll' && (
        <Button
          className="mt-3"
          fullWidth
          size="sm"
          disabled={disabled || !canEndTurn}
          onClick={() => activatePower({ type: 'luckyRoll' })}
        >
          Use Lucky Roll
        </Button>
      )}

      {power === 'peek' && (
        <Button
          className="mt-3"
          fullWidth
          size="sm"
          disabled={disabled}
          onClick={() => activatePower({ type: 'peek' })}
        >
          Peek ahead
        </Button>
      )}

      {power === 'teleport' && (
        <div className="mt-3 flex flex-col gap-2">
          <label className="text-xs text-ink-muted" htmlFor={`teleport-${playerId}`}>
            Target tile (±{TELEPORT_RANGE})
          </label>
          <input
            id={`teleport-${playerId}`}
            type="number"
            min={START_TILE}
            max={WIN_TILE}
            value={teleportTarget}
            disabled={disabled}
            onChange={(event) => setTeleportTarget(Number(event.target.value))}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
          <Button
            fullWidth
            size="sm"
            disabled={disabled}
            onClick={() =>
              activatePower({ type: 'teleport', targetTile: teleportTarget })
            }
          >
            Teleport
          </Button>
        </div>
      )}

      {power === 'sabotage' && (
        <div className="mt-3 flex flex-col gap-2">
          <span className="text-xs text-ink-muted">Choose opponent</span>
          {Object.values(players)
            .filter((opponent) => opponent.id !== playerId)
            .map((opponent) => (
              <Button
                key={opponent.id}
                variant="danger"
                size="sm"
                fullWidth
                disabled={disabled}
                onClick={() =>
                  activatePower({
                    type: 'sabotage',
                    targetPlayerId: opponent.id,
                  })
                }
              >
                Sabotage {opponent.name}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
