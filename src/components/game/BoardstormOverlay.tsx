import { useGameStore } from '@/hooks/useGameStore';
import './boardstorm-overlay.css';

export function BoardstormOverlay() {
  const boardRumbling = useGameStore((state) => state.animation.boardRumbling);
  const mutatingCount = useGameStore(
    (state) => state.animation.mutatingTileNumbers.length,
  );

  const visible = boardRumbling || mutatingCount > 0;

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
