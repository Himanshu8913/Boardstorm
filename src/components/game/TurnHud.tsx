import { MOOD_EMOJI, MOOD_LABELS } from '@/constants/gameplay';
import { getRoundsUntilBoardstorm } from '@/game/engines/turnEngine';
import { useGameStore } from '@/hooks/useGameStore';
import { selectCurrentPlayer } from '@/store/selectors';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/components/ui/cn';

export function TurnHud() {
  const turn = useGameStore((state) => state.turn);
  const match = useGameStore((state) => state.match);
  const currentPlayer = useGameStore(selectCurrentPlayer);
  const roundsUntilBoardstorm = getRoundsUntilBoardstorm(turn.round);

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface-elevated/90 p-2 shadow-md backdrop-blur-sm',
        'sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:p-3',
      )}
      aria-live="polite"
    >
      <Badge variant="primary" className="min-h-11 justify-center text-xs sm:text-sm">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: currentPlayer?.color ?? '#94a3b8' }}
          aria-hidden
        />
        <span className="truncate">{currentPlayer?.name ?? '—'}</span>
      </Badge>

      <Badge variant="secondary" className="min-h-11 justify-center text-xs sm:text-sm">
        <span aria-hidden>{MOOD_EMOJI[match.boardMood]}</span>
        <span className="hidden sm:inline">{MOOD_LABELS[match.boardMood]}</span>
      </Badge>

      <Badge variant="default" className="min-h-11 justify-center text-xs sm:text-sm">
        <span className="sm:hidden">R{turn.round}</span>
        <span className="hidden sm:inline">Round {turn.round}</span>
      </Badge>

      <Badge variant="mystery" className="min-h-11 justify-center text-xs sm:text-sm">
        <span className="sm:hidden">⚡ {roundsUntilBoardstorm}</span>
        <span className="hidden sm:inline">
          Boardstorm in {roundsUntilBoardstorm}
        </span>
      </Badge>
    </div>
  );
}
