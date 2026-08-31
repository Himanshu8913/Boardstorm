import { useCallback, useState } from 'react';
import { GameBoard } from '@/components/board/GameBoard';
import { INITIAL_PLAYERS, type Player } from '@/types/player';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { animatePlayerToPosition } from '@/utils/playerMovement';

export function GamePage() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [movingPlayerId, setMovingPlayerId] = useState<number | null>(null);

  const updatePlayerPosition = useCallback(
    (playerId: number, position: number) => {
      setPlayers((current) =>
        current.map((player) =>
          player.id === playerId ? { ...player, position } : player,
        ),
      );
    },
    [],
  );

  const movePlayer = useCallback(
    async (playerId: number, steps: number) => {
      if (movingPlayerId !== null) {
        return;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return;
      }

      const target = Math.min(
        BOARD_TILE_COUNT,
        Math.max(1, player.position + steps),
      );

      if (target === player.position) {
        return;
      }

      setMovingPlayerId(playerId);

      await animatePlayerToPosition(
        player.position,
        target,
        (position) => updatePlayerPosition(playerId, position),
      );

      setMovingPlayerId(null);
    },
    [movingPlayerId, players, updatePlayerPosition],
  );

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Game Board</h1>
      <GameBoard players={players} />
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <p className="text-center text-sm text-boardstorm-muted">
          Demo controls — move tokens programmatically
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-boardstorm-surface px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                {player.name} — Tile {player.position}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={movingPlayerId !== null}
                  onClick={() => movePlayer(player.id, 3)}
                  className="rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50"
                >
                  +3
                </button>
                <button
                  type="button"
                  disabled={movingPlayerId !== null}
                  onClick={() => movePlayer(player.id, -2)}
                  className="rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50"
                >
                  -2
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
