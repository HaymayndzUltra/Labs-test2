import { NavLink, useLocation } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useGlobalFilters } from '../../state/filtersStore';
import { FilterBar } from '../primitives/FilterBar';
import { ToastViewport, useOptimisticAction } from '../primitives/Toast';
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
  const { filters, setFilter, resetFilters } = useGlobalFilters();
  const [isSaving, setIsSaving] = useState(false);
  const activeModule = modules.find((module) => location.pathname.includes(module.path));
  const saveFilters = useOptimisticAction(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    {
      pendingLabel: 'Saving filters…',
      successLabel: 'Filters saved',
      errorLabel: 'Unable to save filters'
    }
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFilters();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-shell" data-accent={activeModule?.accent ?? 'saas'}>
      <VerticalAccentBar accent={activeModule?.accent ?? 'saas'} />
      <div className="app-shell__inner">
        <header className="page-header" role="banner">
          <div className="page-header__top">
            <div>
              <h1 className="headline">Portfolio-grade Product Operations</h1>
              <p className="subtitle">Unified intelligence across SaaS, commerce, analytics, and more.</p>
            </div>
            <ThemeToggle />
          </div>
          <nav className="page-header__nav" aria-label="Module navigation">
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
          <FilterBar
            filters={filters}
            options={{
              dateRange: ['Last 7 days', 'Last 30 days', 'Quarter to date', 'Year to date'],
              channel: ['All channels', 'Web', 'Mobile app', 'Partner', 'Offline'],
              source: ['All sources', 'Organic', 'Paid', 'Referral', 'Direct']
            }}
            onFilterChange={(key, value) => setFilter(key, value)}
            onReset={() => resetFilters()}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </header>
        <div className="page-divider" role="presentation" />
        <main className="app-shell__main" role="main">
          {children}
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}
