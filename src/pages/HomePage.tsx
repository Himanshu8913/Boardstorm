import { Link, useNavigate } from 'react-router-dom';
import { useGameController } from '@/hooks/useGameController';
import type { GameMode } from '@/types/match';

function GhostIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C8.5 2 6 4.6 6 8.1c0 2.1.9 3.9 2.3 5.2L7 22l5-2 5 2-1.3-8.7c1.4-1.3 2.3-3.1 2.3-5.2C17.9 4.6 15.4 2 12 2zm0 2.2c2 0 3.6 1.7 3.6 3.9 0 1.5-.8 2.8-2 3.6l-.6.4.4 2.6-1.4-.6-1.4.6.4-2.6-.6-.4c-1.2-.8-2-2.1-2-3.6 0-2.2 1.6-3.9 3.6-3.9z"
      />
    </svg>
  );
}

function PlayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden>
      <path
        fill="currentColor"
        d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.7 0-8 1.3-8 4v2h10v-2c0-.7.2-1.3.5-1.9C9.1 13.3 7.6 13 8 13zm8 0c-.4 0-1.1.3-2.5.9.3.6.5 1.2.5 1.9v2h8v-2c0-2.7-5.3-4-8-4z"
      />
    </svg>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const controller = useGameController();

  const startMode = (mode: GameMode) => {
    controller.startMatch(mode);
    navigate('/game');
  };

  return (
    <section className="home-screen relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-2 py-8 sm:px-4">
      <div className="home-screen__vortex" aria-hidden />
      <div className="home-screen__stars" aria-hidden />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="home-screen__logo">BOARDSTORM</h1>
        <p className="mt-3 text-lg font-medium text-ink sm:text-xl">
          Every Board. A New Storm.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Roll. Move. Power Up. Win!
        </p>

        <div className="mt-12 flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={() => startMode('solo')}
            className="home-cta home-cta--solo"
            aria-label="Start solo game versus ghost opponents"
          >
            <GhostIcon />
            <span className="home-cta__text">
              <span className="home-cta__title">Single Player vs Ghosts</span>
              <span className="home-cta__desc">
                Battle three AI rivals on a shifting board
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => startMode('multiplayer')}
            className="home-cta home-cta--multi"
            aria-label="Start local multiplayer game for two to four players"
          >
            <PlayersIcon />
            <span className="home-cta__text">
              <span className="home-cta__title">Local Multiplayer</span>
              <span className="home-cta__desc">
                Pass-and-play with up to four friends
              </span>
            </span>
          </button>
        </div>

        <Link
          to="/settings"
          className="focus-ring mt-10 inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-ink-muted transition-colors duration-fast hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
            <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zM9.37 2.9l-1.2.98A7.5 7.5 0 0 0 5.5 6.2l-1.52.26a1 1 0 0 0-.82.98v2.12c0 .45.3.84.73.97l1.52.45a7.5 7.5 0 0 0 1.67 2.92l-.7 1.4a1 1 0 0 0 .18 1.08l1.5 1.5a1 1 0 0 0 1.08.18l1.4-.7a7.5 7.5 0 0 0 2.92 1.67l.45 1.52c.13.43.52.73.97.73h2.12c.48 0 .89-.35.98-.82l.26-1.52a7.5 7.5 0 0 0 2.92-1.67l1.4.7a1 1 0 0 0 1.08-.18l1.5-1.5a1 1 0 0 0 .18-1.08l-.7-1.4a7.5 7.5 0 0 0 1.67-2.92l1.52-.45a1 1 0 0 0 .73-.97V7.44a1 1 0 0 0-.82-.98l-1.52-.26a7.5 7.5 0 0 0-1.67-2.32l1.2-.98a1 1 0 0 0 .24-1.27l-1.5-1.5a1 1 0 0 0-1.27-.24l-.98 1.2a7.5 7.5 0 0 0-2.32-1.67L16.56 1a1 1 0 0 0-.98-.82h-2.12a1 1 0 0 0-.98.82l-.26 1.52a7.5 7.5 0 0 0-2.32 1.67l-.98-1.2a1 1 0 0 0-1.27.24l-1.5 1.5a1 1 0 0 0 .24 1.27l1.2.98a7.5 7.5 0 0 0-1.67 2.32l-1.52.26a1 1 0 0 0-.82.98v2.12c0 .45.3.84.73.97l1.52.45a7.5 7.5 0 0 0 1.67 2.92l-.7 1.4a1 1 0 0 0 .18 1.08l1.5 1.5a1 1 0 0 0 1.08.18l1.4-.7a7.5 7.5 0 0 0 2.92 1.67l.45 1.52c.13.43.52.73.97.73h2.12c.48 0 .89-.35.98-.82l.26-1.52a7.5 7.5 0 0 0 2.92-1.67l1.4.7a1 1 0 0 0 1.08-.18l1.5-1.5a1 1 0 0 0 .18-1.08l-.7-1.4a7.5 7.5 0 0 0 1.67-2.92l1.52-.45a1 1 0 0 0 .73-.97V9.37a1 1 0 0 0-.82-.98l-1.52-.26a7.5 7.5 0 0 0-1.67-2.32z" />
          </svg>
          Settings
        </Link>
      </div>

      <style>{`
        .home-screen__vortex {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(90vw, 28rem);
          height: min(90vw, 28rem);
          transform: translate(-50%, -55%);
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgb(59 130 246 / 0.25) 0%,
            rgb(168 85 247 / 0.12) 40%,
            transparent 70%
          );
          filter: blur(2px);
          animation: home-vortex 8s ease-in-out infinite;
        }

        .home-screen__stars {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              1px 1px at 20% 30%,
              rgb(255 255 255 / 0.35) 0,
              transparent 100%
            ),
            radial-gradient(
              1px 1px at 70% 20%,
              rgb(255 255 255 / 0.25) 0,
              transparent 100%
            ),
            radial-gradient(
              1.5px 1.5px at 50% 80%,
              rgb(255 255 255 / 0.2) 0,
              transparent 100%
            );
        }

        .home-screen__logo {
          font-size: clamp(2.5rem, 8vw, 3.75rem);
          font-weight: 700;
          letter-spacing: 0.06em;
          background: linear-gradient(
            180deg,
            #fde68a 0%,
            #f97316 50%,
            #ea580c 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 4px 12px rgb(249 115 22 / 0.35));
        }

        .home-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          border: 0;
          border-radius: var(--radius-xl);
          padding: 1rem 1.25rem;
          text-align: left;
          cursor: pointer;
          transition:
            transform var(--duration-fast) var(--ease-out),
            box-shadow var(--duration-fast) var(--ease-out);
        }

        .home-cta:hover {
          transform: translateY(-2px) scale(1.01);
        }

        .home-cta:focus-visible {
          outline: 2px solid white;
          outline-offset: 3px;
        }

        .home-cta--solo {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          box-shadow: 0 8px 24px rgb(34 197 94 / 0.35);
        }

        .home-cta--multi {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 8px 24px rgb(59 130 246 / 0.35);
        }

        .home-cta__text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .home-cta__title {
          font-size: 1.0625rem;
          font-weight: 600;
        }

        .home-cta__desc {
          font-size: 0.8125rem;
          opacity: 0.9;
        }

        @keyframes home-vortex {
          0%,
          100% {
            transform: translate(-50%, -55%) scale(1);
          }
          50% {
            transform: translate(-50%, -55%) scale(1.08);
          }
        }
      `}</style>
    </section>
  );
}
