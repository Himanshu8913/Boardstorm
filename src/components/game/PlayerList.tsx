import { useGameStore } from '@/hooks/useGameStore';
import { getCurrentPlayerId } from '@/store/selectors';
import { cn } from '@/components/ui/cn';

export function PlayerList() {
  const players = useGameStore((state) => state.players);
  const turn = useGameStore((state) => state.turn);
  const currentPlayerId = useGameStore((state) =>
    getCurrentPlayerId(state.turn),
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-ink">Players</h2>
      <ul className="flex flex-col gap-2">
        {turn.playerOrder.map((playerId) => {
          const player = players[playerId];
          if (!player) {
            return null;
          }

          const isCurrent = playerId === currentPlayerId;

          return (
            <li
              key={playerId}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm',
                isCurrent
                  ? 'bg-primary/10 font-semibold text-ink'
                  : 'text-ink-muted',
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                  aria-hidden
                />
                {player.name}
                {player.isGhost && (
                  <span className="text-xs font-normal opacity-70">(ghost)</span>
                )}
              </span>
              <span className="tabular-nums">Tile {player.position}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
