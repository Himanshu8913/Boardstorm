import { useEffect, useRef } from 'react';
import { pickGhostDie } from '@/game/engines/aiEngine';
import { getCurrentPlayerId } from '@/game/engines/turnEngine';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';

const GHOST_THINK_MS = 700;
const GHOST_END_TURN_MS = 900;

/** Auto-plays ghost turns in solo mode. */
export function useGhostTurn() {
  const controller = useGameController();
  const timerRef = useRef<number | null>(null);

  const status = useGameStore((state) => state.match.status);
  const aiEnabled = useGameStore((state) => state.ai.enabled);
  const canEndTurn = useGameStore((state) => state.ui.canEndTurn);
  const rollingPlayerId = useGameStore((state) => state.dice.rollingPlayerId);
  const currentPlayerId = useGameStore((state) =>
    getCurrentPlayerId(state.turn),
  );
  const currentPlayer = useGameStore((state) =>
    currentPlayerId ? state.players[currentPlayerId] : undefined,
  );

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (status !== 'playing' || !aiEnabled || !currentPlayer?.isGhost) {
      return;
    }

    if (rollingPlayerId !== null) {
      return;
    }

    if (canEndTurn) {
      timerRef.current = window.setTimeout(() => {
        if (currentPlayerId !== null) {
          controller.endTurn(currentPlayerId);
        }
      }, GHOST_END_TURN_MS);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      if (currentPlayerId === null) {
        return;
      }

      controller.selectDie(currentPlayerId, pickGhostDie());
      controller.roll(currentPlayerId);
    }, GHOST_THINK_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    aiEnabled,
    canEndTurn,
    controller,
    currentPlayer?.isGhost,
    currentPlayerId,
    rollingPlayerId,
    status,
  ]);
}
