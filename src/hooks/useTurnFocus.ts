import { useEffect, useRef, type RefObject } from 'react';
import { getCurrentPlayerId } from '@/store/selectors';
import { useGameStore } from '@/store/gameStore';

/**
 * Moves focus to the roll button when a human player's turn begins.
 * Helps keyboard-only play without extra tabbing.
 */
export function useTurnFocus(
  rollButtonRef: RefObject<HTMLButtonElement | null>,
  enabled: boolean,
) {
  const currentPlayerId = useGameStore((state) =>
    getCurrentPlayerId(state.turn),
  );
  const currentPlayer = useGameStore((state) =>
    currentPlayerId ? state.players[currentPlayerId] : undefined,
  );
  const matchStatus = useGameStore((state) => state.match.status);
  const turn = useGameStore((state) => state.turn);
  const lastFocusedTurnRef = useRef('');

  useEffect(() => {
    if (
      !enabled ||
      matchStatus !== 'playing' ||
      !currentPlayer ||
      currentPlayer.isGhost ||
      !rollButtonRef.current
    ) {
      return;
    }

    const turnKey = `${currentPlayer.id}-${turn.round}-${turn.currentPlayerIndex}`;
    if (turnKey === lastFocusedTurnRef.current) {
      return;
    }

    lastFocusedTurnRef.current = turnKey;
    rollButtonRef.current.focus();
  }, [
    currentPlayer,
    enabled,
    matchStatus,
    rollButtonRef,
    turn.currentPlayerIndex,
    turn.round,
  ]);
}
