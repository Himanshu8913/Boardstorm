import { useRef } from 'react';
import { useTurnFocus } from '@/hooks/useTurnFocus';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import { getCurrentPlayerId } from '@/store/selectors';
import { DiceDisplay, DiceSelector } from '@/components/dice';
import { PowerUsePanel } from '@/components/game/PowerUsePanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/cn';
import type { PlayerId } from '@/types/playerId';

function PlayerTurnPanel({
  playerId,
  expanded,
}: {
  playerId: PlayerId;
  expanded: boolean;
}) {
  const controller = useGameController();
  const player = useGameStore((state) => state.players[playerId]);
  const dice = useGameStore((state) => state.dice);
  const animation = useGameStore((state) => state.animation);
  const canEndTurn = useGameStore((state) => state.ui.canEndTurn);
  const currentPlayerId = useGameStore((state) =>
    getCurrentPlayerId(state.turn),
  );
  const matchStatus = useGameStore((state) => state.match.status);
  const rollButtonRef = useRef<HTMLButtonElement>(null);
  const isCurrent = currentPlayerId === playerId;

  useTurnFocus(rollButtonRef, isCurrent && expanded && Boolean(player));

  if (!player) {
    return null;
  }

  const canInteract =
    isCurrent &&
    !player.isGhost &&
    matchStatus === 'playing' &&
    dice.rollingPlayerId === null;

  const selectedDie = dice.selected[playerId] ?? 'safe';
  const lastRoll = dice.lastRoll[playerId] ?? null;
  const rolling = dice.rollingPlayerId === playerId;
  const spinning = animation.rollingPlayerId === playerId;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface shadow-sm transition-all duration-fast',
        expanded ? 'p-4' : 'px-3 py-2',
        isCurrent && 'ring-2 ring-primary/30',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: player.color }}
            aria-hidden
          />
          {player.name}
        </div>
        {!expanded && lastRoll !== null && (
          <span className="text-xs tabular-nums text-ink-muted">
            Rolled {lastRoll}
          </span>
        )}
      </div>

      {expanded && (
        <div
          className="mt-4 flex flex-col gap-4"
          role="group"
          aria-label={`${player.name} dice and turn actions`}
        >
          <DiceSelector
            selected={selectedDie}
            disabled={!canInteract || canEndTurn}
            onSelect={(dieType) => controller.selectDie(playerId, dieType)}
          />

          <DiceDisplay
            dieType={selectedDie}
            value={lastRoll}
            rolling={rolling}
            spinning={spinning}
          />

          <div className="grid grid-cols-2 gap-3">
            <Button
              ref={rollButtonRef}
              aria-label={`Roll ${selectedDie} die`}
              disabled={!canInteract || canEndTurn}
              onClick={() => controller.roll(playerId)}
            >
              Roll
            </Button>
            <Button
              variant="secondary"
              aria-label="End turn"
              disabled={!canInteract || !canEndTurn}
              onClick={() => controller.endTurn(playerId)}
            >
              End Turn
            </Button>
          </div>

          <PowerUsePanel playerId={playerId} disabled={!canInteract} />
        </div>
      )}
    </div>
  );
}

export function PlayerDicePanel({ sheet = false }: { sheet?: boolean }) {
  const turn = useGameStore((state) => state.turn);
  const currentPlayerId = useGameStore((state) =>
    getCurrentPlayerId(state.turn),
  );

  if (sheet) {
    if (currentPlayerId === null) {
      return null;
    }

    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink">Your turn</h2>
        <PlayerTurnPanel playerId={currentPlayerId} expanded />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ink">Turn controls</h2>
      {turn.playerOrder.map((playerId) => (
        <PlayerTurnPanel
          key={playerId}
          playerId={playerId}
          expanded={playerId === currentPlayerId}
        />
      ))}
    </div>
  );
}
