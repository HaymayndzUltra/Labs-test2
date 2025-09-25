import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { moduleMetadata } from '../utils/module-metadata';
import { ThemeToggle } from './ThemeToggle';
import { FilterBar } from './filters/FilterBar';
import { useUrlState } from '../hooks/useUrlState';
import { useLiveDateRange } from '../hooks/useLiveDateRange';
import { ToastRegion } from './Toast';

export function ShellLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeModule = useMemo(() => {
    return moduleMetadata.find((module) => location.pathname.startsWith(`/${module.slug}`)) ?? moduleMetadata[0];
  }, [location.pathname]);
  const [filters, setFilters] = useUrlState({
    range: 'last_30_days',
    segment: 'all',
    environment: 'production'
  });
  const dateRange = useLiveDateRange(filters.range);

  return (
    <div className="min-h-screen w-full bg-[color:var(--surface-0)] text-[color:var(--text-primary)]">
      <ToastRegion />
      <header className="sticky top-0 z-50 border-b-[1.5px] border-[color:var(--line-strong)] bg-[color:var(--surface-0)]/95 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-2 px-6 py-4">
          <div className="col-span-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-evergreen-600 font-semibold text-oat-50">
              CF
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-[color:var(--text-primary)]">CedarForge Ops Suite</p>
              <p className="text-xs text-[color:var(--text-secondary)]">Warm neo-industrial command</p>
            </div>
          </div>
          <div className="col-span-6 flex items-center justify-center gap-4">
            <nav className="flex gap-2" aria-label="Primary modules">
              {moduleMetadata.map((module) => (
                <button
                  key={module.slug}
                  className={`flex h-11 min-w-[96px] items-center justify-center rounded-[16px] border-[1.5px] px-4 text-sm font-semibold transition-all duration-200 ease-cedar focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)] ${
                    activeModule.slug === module.slug
                      ? 'border-[color:var(--accent-' + module.slug + ')] text-[color:var(--accent-' + module.slug + ')]'
                      : 'border-[color:var(--line-soft)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-' +
                        module.slug +
                        ')] hover:text-[color:var(--accent-' +
                        module.slug +
                        ')]'
                  }`}
                  onClick={() => navigate(`/${module.slug}`)}
                  type="button"
                >
                  {module.title}
                </button>
              ))}
            </nav>
          </div>
          <div className="col-span-3 flex items-center justify-end gap-4">
            <ThemeToggle />
            <div className="text-xs text-[color:var(--text-secondary)]">
              <div>{dateRange.label}</div>
              <div>{dateRange.description}</div>
            </div>
          </div>
        </div>
        <FilterBar filters={filters} onChange={setFilters} module={activeModule.slug} />
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <Outlet context={{ filters, dateRange }} />
      </main>
    </div>
  );
}
