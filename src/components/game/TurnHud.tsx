import type { Player } from '@/types/player';
import type { BoardMood } from '@/types/boardMood';
import { getMoodConfig } from '@/utils/boardMood';

type TurnHudProps = {
  round: number;
  currentPlayer: Player;
  boardMood: BoardMood;
};

export function TurnHud({ round, currentPlayer, boardMood }: TurnHudProps) {
  const moodConfig = getMoodConfig(boardMood);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 rounded-lg border border-slate-700 bg-boardstorm-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-boardstorm-muted">Round</span>
        <span className="text-lg font-bold text-white">{round}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-boardstorm-muted">
        <span aria-hidden="true">{moodConfig.emoji}</span>
        <span className="font-medium text-slate-300">{moodConfig.label}</span>
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
