import type { Player } from '@/types/player';

type TurnHudProps = {
  round: number;
  currentPlayer: Player;
};

export function TurnHud({ round, currentPlayer }: TurnHudProps) {
  return (
    <div className="flex w-full max-w-3xl items-center justify-between rounded-lg border border-slate-700 bg-boardstorm-surface px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-boardstorm-muted">Round</span>
        <span className="text-lg font-bold text-white">{round}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: currentPlayer.color }}
        />
        <span className="text-sm font-medium text-white">
          {currentPlayer.name}&apos;s turn
        </span>
      </div>
    </div>
  );
}
