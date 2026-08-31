import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Boardstorm</h1>
      <p className="max-w-md text-lg text-boardstorm-muted">
        A board game that never plays the same way twice.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/game"
          state={{ mode: 'solo' }}
          className="rounded-xl bg-boardstorm-accent px-8 py-3 text-lg font-semibold text-boardstorm-bg transition-opacity hover:opacity-90"
        >
          Solo vs Ghosts
        </Link>
        <Link
          to="/game"
          state={{ mode: 'multiplayer' }}
          className="rounded-xl border border-slate-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Local Multiplayer
        </Link>
      </div>
    </section>
  );
}
