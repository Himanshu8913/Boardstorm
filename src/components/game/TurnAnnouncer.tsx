import { useEffect, useRef } from 'react';
import { MOOD_LABELS } from '@/constants/gameplay';
import { useGameStore } from '@/hooks/useGameStore';
import { selectCurrentPlayer } from '@/store/selectors';

/** Visually hidden live region for turn and resolution announcements. */
export function TurnAnnouncer() {
  const currentPlayer = useGameStore(selectCurrentPlayer);
  const turn = useGameStore((state) => state.turn);
  const match = useGameStore((state) => state.match);
  const resolutionMessage = useGameStore((state) => state.ui.resolutionMessage);
  const turnRef = useRef<HTMLDivElement>(null);
  const resolutionRef = useRef<HTMLDivElement>(null);
  const lastTurnKeyRef = useRef('');

  useEffect(() => {
    if (!currentPlayer || match.status !== 'playing') {
      return;
    }

    const turnKey = `${turn.round}-${currentPlayer.id}`;
    if (turnKey === lastTurnKeyRef.current) {
      return;
    }

    lastTurnKeyRef.current = turnKey;
    if (turnRef.current) {
      turnRef.current.textContent = `${currentPlayer.name}'s turn. Round ${turn.round}. ${MOOD_LABELS[match.boardMood]} board.`;
    }
  }, [currentPlayer, match.boardMood, match.status, turn.round]);

  useEffect(() => {
    if (!resolutionMessage || !resolutionRef.current) {
      return;
    }

    resolutionRef.current.textContent = resolutionMessage;
  }, [resolutionMessage]);

  return (
    <>
      <div
        ref={turnRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        ref={resolutionRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </>
  );
}
