import '@/styles/home-brand.css';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isActive
      ? 'bg-primary/25 text-ink shadow-sm'
      : 'text-ink-muted hover:bg-elevated hover:text-ink'
  }`;

export function RootLayout() {
  const location = useLocation();
  const isFullBleed =
    location.pathname === '/' ||
    location.pathname === '/modes' ||
    location.pathname === '/setup';

  return (
    <div className="page-gradient flex min-h-screen flex-col overflow-x-hidden">
      <a href="#main-content" className="skip-link sr-only">
        Skip to main content
      </a>
      <header className="border-b border-border/80 bg-surface/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <NavLink
            to="/"
            className="brand-logo brand-logo--nav text-lg font-bold sm:text-xl"
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
            <NavLink to="/modes" className={navLinkClass}>
              Play
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
          isFullBleed ? 'px-0 py-0' : 'px-3 py-6 sm:px-4 sm:py-8'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
