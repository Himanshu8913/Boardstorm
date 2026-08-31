import { PlayerDicePanel } from '@/components/game/PlayerDicePanel';
import { PlayerList } from '@/components/game/PlayerList';

/** Fixed bottom controls for mobile — dice panel + compact player list. */
export function MobileGameControls() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
      aria-label="Turn controls"
    >
      <div className="mobile-controls-sheet mx-auto max-h-[min(62vh,32rem)] w-full max-w-5xl overflow-y-auto rounded-t-2xl border-t border-border bg-surface/95 px-3 py-4 shadow-lg backdrop-blur-md sm:px-4">
        <div
          className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong"
          aria-hidden
        />
        <PlayerList compact />
        <div className="mt-3">
          <PlayerDicePanel sheet />
        </div>
      </div>
    </div>
  );
}
