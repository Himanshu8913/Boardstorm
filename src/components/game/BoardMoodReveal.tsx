import { MOOD_EMOJI, MOOD_LABELS } from '@/constants/gameplay';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/Button';

export function BoardMoodReveal() {
  const controller = useGameController();
  const boardMood = useGameStore((state) => state.match.boardMood);
  const mode = useGameStore((state) => state.match.mode);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <div className="animate-modal-in">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Board Mood
        </p>
        <div
          className="mt-4 text-7xl"
          role="img"
          aria-label={MOOD_LABELS[boardMood]}
        >
          {MOOD_EMOJI[boardMood]}
        </div>
        <h1 className="mt-4 text-page-title text-ink">
          {MOOD_LABELS[boardMood]} Board
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-muted">
          {mode === 'solo'
            ? 'Your ghosts are ready. The board will be generated when you begin.'
            : 'Gather your players. The board will be generated when you begin.'}
        </p>
      </div>

      <Button size="lg" onClick={() => controller.beginPlay()}>
        Let&apos;s Play
      </Button>
    </section>
  );
}
