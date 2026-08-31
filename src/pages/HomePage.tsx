import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Boardstorm</h1>
      <p className="max-w-md text-slate-600">
        Every Board. A New Storm.
      </p>
      <p className="text-sm text-slate-500">Home screen — coming in Phase 9</p>
      <Link
        to="/game"
        className="mt-4 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go to Game
      </Link>
    </section>
  );
}
