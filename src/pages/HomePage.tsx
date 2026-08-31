import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Boardstorm</h1>
      <p className="max-w-md text-lg text-boardstorm-muted">
        A board game that never plays the same way twice.
      </p>
      <Link
        to="/game"
        className="rounded-xl bg-boardstorm-accent px-8 py-3 text-lg font-semibold text-boardstorm-bg transition-opacity hover:opacity-90"
      >
        Play
      </Link>
    </section>
  );
}
