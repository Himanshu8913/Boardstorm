import type { Player } from '@/types/player';

type WinnerScreenProps = {
  winner: Player;
  onRestart: () => void;
};

/** Victory overlay shown when a player reaches tile 100. */
export function WinnerScreen({ winner, onRestart }: WinnerScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-boardstorm-accent bg-boardstorm-surface p-8 text-center shadow-2xl">
        <span className="text-5xl" role="img" aria-hidden="true">
          🏆
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">Victory!</h2>
          <p className="flex items-center justify-center gap-2 text-lg text-boardstorm-muted">
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: winner.color }}
            />
            <span className="font-semibold text-white">{winner.name}</span>
            reached tile 100!
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-boardstorm-accent px-10 py-3 text-lg font-semibold text-boardstorm-bg transition-opacity hover:opacity-90"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
