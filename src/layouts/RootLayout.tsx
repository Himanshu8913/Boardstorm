import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-fast ${
    isActive
      ? 'bg-primary text-ink-inverse shadow-sm'
      : 'text-ink-muted hover:bg-background-accent hover:text-ink'
  }`;

export function RootLayout() {
  return (
    <div className="page-gradient flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <NavLink
            to="/"
            className="text-xl font-semibold tracking-tight text-primary"
          >
            Boardstorm
          </NavLink>
          <nav className="flex gap-2" aria-label="Main">
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
