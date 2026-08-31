import type { CSSProperties } from 'react';
import { MOOD_CARDS } from '@/constants/moodCards';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import type { BoardMood } from '@/types/match';

export function BoardMoodReveal() {
  const controller = useGameController();
  const mode = useGameStore((state) => state.match.mode);

  const handleSelect = (mood: BoardMood) => {
    controller.beginPlay(mood);
  };

  return (
    <section className="mood-select mx-auto flex w-full max-w-4xl flex-col items-center gap-8 py-4 sm:py-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Board Mood
        </p>
        <h1 className="mt-2 text-page-title text-ink">Choose Your Storm</h1>
        <p className="mt-2 max-w-lg text-sm text-ink-muted">
          {mode === 'solo'
            ? 'Pick how wild the board feels. Your ghosts are waiting.'
            : 'Pick how wild the board feels before you gather at the table.'}
        </p>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4">
        {MOOD_CARDS.map((card) => (
          <button
            key={card.mood}
            type="button"
            onClick={() => handleSelect(card.mood)}
            className="mood-card group text-left"
            style={{ '--mood-accent': card.accentVar } as CSSProperties}
            aria-label={`Start with ${card.label} board — ${card.tagline}`}
          >
            <span className="mood-card__glow" aria-hidden />
            <span className="mood-card__emoji" aria-hidden>
              {card.emoji}
            </span>
            <span className="mood-card__label">{card.label}</span>
            <span className="mood-card__tagline">{card.tagline}</span>
            <span className="mood-card__desc">{card.description}</span>
          </button>
        ))}
      </div>

      <style>{`
        .mood-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow: hidden;
          border-radius: var(--radius-xl);
          border: 2px solid var(--color-border);
          background: var(--color-surface-elevated);
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition:
            transform var(--duration-fast) var(--ease-out),
            border-color var(--duration-fast) var(--ease-out),
            box-shadow var(--duration-fast) var(--ease-out);
        }

        .mood-card:hover {
          transform: translateY(-4px);
          border-color: var(--mood-accent);
          box-shadow: 0 12px 32px rgb(0 0 0 / 0.4);
        }

        .mood-card:focus-visible {
          outline: 2px solid var(--mood-accent);
          outline-offset: 3px;
        }

        .mood-card__glow {
          position: absolute;
          top: -2rem;
          right: -2rem;
          width: 8rem;
          height: 8rem;
          border-radius: 9999px;
          background: var(--mood-accent);
          opacity: 0.15;
          filter: blur(24px);
          transition: opacity var(--duration-fast);
        }

        .mood-card:hover .mood-card__glow {
          opacity: 0.35;
        }

        .mood-card__emoji {
          font-size: 2.5rem;
          line-height: 1;
        }

        .mood-card__label {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .mood-card__tagline {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--mood-accent);
        }

        .mood-card__desc {
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
