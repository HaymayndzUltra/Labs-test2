import { NavLink, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useGlobalFilters } from '../../state/filtersStore';
import { FilterChips } from '../primitives/FilterChips';
import { ToastViewport } from '../primitives/Toast';
import { VerticalAccentBar } from './VerticalAccentBar';

export interface ModuleRoute {
  path: string;
  label: string;
  accent: string;
}

interface AppShellProps {
  children: ReactNode;
  modules: readonly ({ path: string; label: string; accent: string })[];
}

export function AppShell({ children, modules }: AppShellProps) {
  const location = useLocation();
  const { filters, setFilter } = useGlobalFilters();
  const activeModule = modules.find((module) => location.pathname.includes(module.path));

  return (
    <div className="app-shell" data-accent={activeModule?.accent ?? 'saas'}>
      <VerticalAccentBar accent={activeModule?.accent ?? 'saas'} />
      <header className="app-shell__header" role="banner">
        <div>
          <h1 className="headline">Portfolio-grade Product Operations</h1>
          <p className="subtitle">Unified intelligence across SaaS, commerce, analytics, and more.</p>
        </div>
        <ThemeToggle />
      </header>
      <nav className="app-shell__nav" aria-label="Module navigation">
        <ul>
          {modules.map((module) => (
            <li key={module.path}>
              <NavLink
                to={`/${module.path}`}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
              >
                {module.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <section className="app-shell__filters" aria-label="Global filters">
        <FilterChips
          filters={filters}
          onFilterChange={(key, value) => setFilter(key, value)}
          options={{
            dateRange: ['Last 7 days', 'Last 30 days', 'Quarter to date'],
            segment: ['All segments', 'Enterprise', 'Mid-market', 'SMB'],
            channel: ['All channels', 'Web', 'Mobile', 'Partner']
          }}
        />
      </section>
      <main className="app-shell__main" role="main">
        {children}
      </main>
      <ToastViewport />
    </div>
  );
}
