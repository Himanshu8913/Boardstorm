import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-boardstorm-accent text-boardstorm-bg'
      : 'text-boardstorm-muted hover:bg-boardstorm-surface hover:text-white'
  }`;

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-700 bg-boardstorm-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-xl font-bold tracking-tight text-white">
            Boardstorm
          </NavLink>
          <nav className="flex gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/game" className={navLinkClass}>
              Game
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              Settings
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
