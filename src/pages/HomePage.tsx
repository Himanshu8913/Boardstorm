import { Link, useNavigate } from 'react-router-dom';
import { useGameController } from '@/hooks/useGameController';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { GameMode } from '@/types/match';

function GhostIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C8.5 2 6 4.6 6 8.1c0 2.1.9 3.9 2.3 5.2L7 22l5-2 5 2-1.3-8.7c1.4-1.3 2.3-3.1 2.3-5.2C17.9 4.6 15.4 2 12 2zm0 2.2c2 0 3.6 1.7 3.6 3.9 0 1.5-.8 2.8-2 3.6l-.6.4.4 2.6-1.4-.6-1.4.6.4-2.6-.6-.4c-1.2-.8-2-2.1-2-3.6 0-2.2 1.6-3.9 3.6-3.9z"
      />
    </svg>
  );
}

function PlayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-secondary" aria-hidden>
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
    <section className="home-hero relative overflow-hidden rounded-2xl border border-border bg-surface/70 px-4 py-10 shadow-md sm:px-8 sm:py-14">
      <div className="home-hero__glow home-hero__glow--left" aria-hidden />
      <div className="home-hero__glow home-hero__glow--right" aria-hidden />
      <div className="home-hero__pattern" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Boardstorm
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl lg:text-hero">
          Every Board. A New Storm.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink-muted">
          Race to tile 100 on a board that shifts beneath you. Pick your dice,
          dodge traps, chase boosts, and survive the Boardstorm.
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => startMode('solo')}
            className="home-mode-card group text-left"
          >
            <Card
              padding="md"
              className="h-full border-primary/20 transition-all duration-fast group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-primary"
            >
              <CardHeader className="items-center sm:items-start">
                <GhostIcon />
                <CardTitle>Solo vs Ghosts</CardTitle>
              </CardHeader>
              <CardContent>
                Battle three ghost rivals. They play by the same rules — just a
                little braver with the risk die.
              </CardContent>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => startMode('multiplayer')}
            className="home-mode-card group text-left"
          >
            <Card
              padding="md"
              className="h-full border-secondary/25 transition-all duration-fast group-hover:-translate-y-1 group-hover:border-secondary/45 group-hover:shadow-secondary"
            >
              <CardHeader className="items-center sm:items-start">
                <PlayersIcon />
                <CardTitle>Local Multiplayer</CardTitle>
              </CardHeader>
              <CardContent>
                Pass-and-play with up to four friends on one screen. Perfect for
                couch chaos.
              </CardContent>
            </Card>
          </button>
        </div>

        <Link
          to="/settings"
          className="mt-8 text-sm font-medium text-ink-muted transition-colors duration-fast hover:text-primary"
        >
          Settings
        </Link>
      </div>

      <style>{`
        .home-hero {
          background: linear-gradient(
            160deg,
            var(--color-background) 0%,
            var(--color-background-accent) 45%,
            var(--color-surface) 100%
          );
        }

        .home-hero__pattern {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background-image: radial-gradient(
              circle at 20% 20%,
              rgb(37 99 235 / 0.16) 0,
              transparent 45%
            ),
            radial-gradient(
              circle at 80% 10%,
              rgb(245 158 11 / 0.2) 0,
              transparent 40%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgb(168 85 247 / 0.14) 0,
              transparent 50%
            );
        }

        .home-hero__glow {
          position: absolute;
          width: 12rem;
          height: 12rem;
          border-radius: 9999px;
          filter: blur(40px);
          opacity: 0.45;
        }

        .home-hero__glow--left {
          top: -2rem;
          left: -2rem;
          background: var(--color-primary);
        }

        .home-hero__glow--right {
          right: -2rem;
          bottom: -2rem;
          background: var(--color-secondary);
        }

        .home-mode-card {
          width: 100%;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }

        .home-mode-card:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 4px;
          border-radius: var(--radius-xl);
        }
      `}</style>
    </section>
  );
}
