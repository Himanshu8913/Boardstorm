import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isActive
      ? 'bg-primary/25 text-ink shadow-sm'
      : 'text-ink-muted hover:bg-elevated hover:text-ink'
  }`;

export function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="page-gradient flex min-h-screen flex-col overflow-x-hidden">
      <a href="#main-content" className="skip-link sr-only">
        Skip to main content
      </a>
      <header className="border-b border-border/80 bg-surface/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <NavLink
            to="/"
            className="home-screen__logo-nav text-lg font-bold tracking-wider sm:text-xl"
          >
            BOARDSTORM
          </NavLink>
          <nav
            className="flex flex-wrap justify-end gap-1 sm:gap-2"
            aria-label="Main"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/game" className={navLinkClass}>
              Game
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden" aria-label="Settings">
                Set
              </span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className={`mx-auto w-full max-w-7xl flex-1 ${
          isHome ? 'px-0 py-0' : 'px-3 py-6 sm:px-4 sm:py-8'
        }`}
      >
        <Outlet />
      </main>

      <style>{`
        .home-screen__logo-nav {
          background: linear-gradient(
            180deg,
            #fde68a 0%,
            #f97316 60%,
            #ea580c 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
