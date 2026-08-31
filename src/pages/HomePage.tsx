import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-12 text-center sm:py-20">
      <div className="relative">
        <span
          className="absolute -left-6 -top-4 text-3xl opacity-80"
          aria-hidden="true"
        >
          ⚡
        </span>
        <span
          className="absolute -right-6 top-2 text-2xl opacity-80"
          aria-hidden="true"
        >
          🎲
        </span>
        <h1 className="text-hero text-ink">Boardstorm</h1>
      </div>
      <p className="max-w-md text-lg font-medium text-secondary">
        Every Board. A New Storm.
      </p>
      <p className="max-w-sm text-sm text-ink-muted">
        A playful board game where the board changes every match. Learn in a
        minute — play for hours.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link to="/game" className="btn-primary">
          Play Now
        </Link>
        <Link to="/settings" className="btn-secondary">
          Settings
        </Link>
      </div>
      <p className="text-xs text-ink-muted">
        Full home screen polish — Phase 9
      </p>
    </section>
  );
}
