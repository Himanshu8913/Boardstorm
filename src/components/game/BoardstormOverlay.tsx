import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import type { AnimationSpeed } from '@/types/settings';
import './boardstorm-overlay.css';

const BOARDSTORM_DURATION_MS = 1400;

function getDurationMs(speed: AnimationSpeed): number {
  if (speed === 'slow') {
    return BOARDSTORM_DURATION_MS * 1.5;
  }

  if (speed === 'fast') {
    return BOARDSTORM_DURATION_MS * 0.6;
  }

  return BOARDSTORM_DURATION_MS;
}

export function BoardstormOverlay() {
  const events = useGameStore((state) => state.events.events);
  const animationSpeed = useGameStore((state) => state.settings.animationSpeed);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastStormIdRef = useRef<string | null>(null);

  useEffect(() => {
    const latest = events[events.length - 1];
    if (!latest || latest.type !== 'boardstorm_started') {
      return;
    }

    if (lastStormIdRef.current === latest.id) {
      return;
    }

    lastStormIdRef.current = latest.id;
    setVisible(true);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
    }, getDurationMs(animationSpeed));

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [animationSpeed, events]);

  if (!visible) {
    return null;
  }

  return (
    <div className="boardstorm-overlay" role="status" aria-live="assertive">
      <div className="boardstorm-overlay__flash boardstorm-overlay__flash--one" />
      <div className="boardstorm-overlay__flash boardstorm-overlay__flash--two" />
      <div className="boardstorm-overlay__veil" />
      <p className="boardstorm-overlay__title">Boardstorm!</p>
      <p className="boardstorm-overlay__subtitle">The board is changing…</p>
    </div>
  );
}
