import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from './components/FilterBar';
import { ModuleTabs } from './components/ModuleTabs';
import { useFilterSync } from './hooks/useFilterSync';
import { useFilterStore } from './state/filterStore';
import { ActiveFilterSummary } from './components/ActiveFilterSummary';
import { SaaSModule } from './modules/SaaSModule';
import { EcommerceModule } from './modules/EcommerceModule';
import { CorporateModule } from './modules/CorporateModule';
import { CustomAppModule } from './modules/CustomAppModule';
import { MediaModule } from './modules/MediaModule';
import { EdtechModule } from './modules/EdtechModule';
import { NichesModule } from './modules/NichesModule';

const moduleComponents: Record<string, JSX.Element> = {
  saas: <SaaSModule />,
  ecommerce: <EcommerceModule />,
  corporate: <CorporateModule />,
  customapp: <CustomAppModule />,
  media: <MediaModule />,
  edtech: <EdtechModule />,
  niches: <NichesModule />
};

const modules = [
  {
    id: 'saas',
    label: 'SaaS',
    description: 'Subscription intelligence, API ops, and billing orchestration for B2B platforms.'
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Merchandising performance, orders, fulfillment health, and lifecycle automation.'
  },
  {
    id: 'corporate',
    label: 'Corporate Analytics',
    description: 'Marketing-to-revenue visibility with SLA escalation and conversion guardrails.'
  },
  {
    id: 'customapp',
    label: 'Custom Web App',
    description: 'Kanban productivity, automation rituals, and workload balancing insights.'
  },
  {
    id: 'media',
    label: 'Content & Media',
    description: 'Publishing workflow orchestration, engagement, and semantic automation.'
  },
  {
    id: 'edtech',
    label: 'EdTech',
    description: 'FERPA-ready learning analytics, credentialing, and mentor load balancing.'
  },
  {
    id: 'niches',
    label: 'Specialized Niches',
    description: 'Real estate, finance, and healthcare overlays with regulatory compliance.'
  }
];

const ModuleRenderer = ({ moduleId }: { moduleId: string }) => {
  const element = moduleComponents[moduleId] ?? moduleComponents.saas;
  return <Suspense fallback={<div className="card-surface">Loading module…</div>}>{element}</Suspense>;
};

const toggleTheme = () => {
  const root = document.documentElement;
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  } else {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  }
};

const App = () => {
  useFilterSync();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('module') ?? 'saas';
  const verticalFilter = useFilterStore((state) => state.filters.vertical);

  const activeDefinition = useMemo(() => modules.find((module) => module.id === activeModule) ?? modules[0], [activeModule]);

  useEffect(() => {
    if (verticalFilter !== 'all' && verticalFilter !== activeModule) {
      const next = new URLSearchParams(searchParams);
      next.set('module', verticalFilter);
      setSearchParams(next, { replace: true });
    }
  }, [verticalFilter, activeModule, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-[var(--surface-0)] pb-16">
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface-1)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-primary-500 px-4 py-2 text-[14px] font-semibold text-white shadow-elevation">
              Portfolio-Grade Product Operations
            </span>
            <span className="hidden text-[14px] text-[var(--color-text-muted)] lg:block">
              Unified premium design with module individuality.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-[var(--border-strong)] px-4 py-2 text-[14px] font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--surface-0)]"
            >
              Toggle theme
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pt-8">
        <ModuleTabs
          modules={modules}
          activeId={activeDefinition.id}
          onSelect={(moduleId) => {
            const next = new URLSearchParams(searchParams);
            next.set('module', moduleId);
            setSearchParams(next, { replace: true });
          }}
        />
        <FilterBar />
        <ActiveFilterSummary />
        <section
          id={`${activeDefinition.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeDefinition.id}-tab`}
          className="flex flex-col gap-6"
        >
          <ModuleRenderer moduleId={activeDefinition.id} />
        </section>
      </main>
    </div>
  );
};

export default App;
