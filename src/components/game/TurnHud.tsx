import { MOOD_EMOJI, MOOD_LABELS } from '@/constants/gameplay';
import { getRoundsUntilBoardstorm } from '@/game/engines/turnEngine';
import { useGameStore } from '@/hooks/useGameStore';
import { selectCurrentPlayer } from '@/store/selectors';
import { Badge } from '@/components/ui/Badge';

export function TurnHud() {
  const turn = useGameStore((state) => state.turn);
  const match = useGameStore((state) => state.match);
  const currentPlayer = useGameStore(selectCurrentPlayer);
  const roundsUntilBoardstorm = getRoundsUntilBoardstorm(turn.round);

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 shadow-sm sm:gap-3 sm:px-4"
      aria-live="polite"
    >
      <Badge variant="primary">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: currentPlayer?.color ?? '#94a3b8' }}
          aria-hidden
        />
        {currentPlayer?.name ?? '—'}
      </Badge>

      <Badge variant="secondary">
        <span aria-hidden>{MOOD_EMOJI[match.boardMood]}</span>
        {MOOD_LABELS[match.boardMood]}
      </Badge>

      <Badge variant="default">Round {turn.round}</Badge>

      <Badge variant="mystery">
        Boardstorm in {roundsUntilBoardstorm}
      </Badge>
    </div>
  );
}
