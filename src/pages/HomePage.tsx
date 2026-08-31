import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import '@/styles/home-brand.css';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="home-screen relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="home-screen__vortex" aria-hidden />
      <div className="home-screen__stars" aria-hidden />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <h1 className="brand-logo">BOARDSTORM</h1>
        <p className="mt-3 text-lg font-medium text-ink sm:text-xl">
          Every Board. A New Storm.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Roll. Move. Power Up. Win!
        </p>

        <div className="mt-12 flex w-full flex-col gap-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate('/modes')}
            aria-label="Play — choose game mode"
          >
            Play
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/modes')}
            aria-label="Quick match — choose game mode"
          >
            Quick Match
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/settings"
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-fast hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
              <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zM9.37 2.9l-1.2.98A7.5 7.5 0 0 0 5.5 6.2l-1.52.26a1 1 0 0 0-.82.98v2.12c0 .45.3.84.73.97l1.52.45a7.5 7.5 0 0 0 1.67 2.92l-.7 1.4a1 1 0 0 0 .18 1.08l1.5 1.5a1 1 0 0 0 1.08.18l1.4-.7a7.5 7.5 0 0 0 2.92 1.67l.45 1.52c.13.43.52.73.97.73h2.12c.48 0 .89-.35.98-.82l.26-1.52a7.5 7.5 0 0 0 2.92-1.67l1.4.7a1 1 0 0 0 1.08-.18l1.5-1.5a1 1 0 0 0 .18-1.08l-.7-1.4a7.5 7.5 0 0 0 1.67-2.92l1.52-.45a1 1 0 0 0 .73-.97V9.37a1 1 0 0 0-.82-.98l-1.52-.26a7.5 7.5 0 0 0-1.67-2.32z" />
            </svg>
            Settings
          </Link>
        </div>
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

        @keyframes home-vortex {
          0%,
          100% {
            transform: translate(-50%, -55%) scale(1);
          }
          50% {
            transform: translate(-50%, -55%) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-screen__vortex {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
