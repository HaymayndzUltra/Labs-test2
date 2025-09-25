import { useEffect } from 'react';
import { useQuery } from './lib/simpleQuery';
import { PageShell } from './components/layout/PageShell';
import { ModuleTabs } from './components/tabs/ModuleTabs';
import { GlobalFilters } from './components/filters/GlobalFilters';
import { DashboardSkeleton } from './features/dashboard/DashboardSkeleton';
import { DashboardModules } from './features/dashboard/DashboardModules';
import { getPortfolioDashboard } from './data/portfolio';
import { useUrlSync } from './hooks/useUrlSync';
import { liveMetricStream } from './lib/eventStream';
import { useDashboardStore } from './store/dashboardStore';
import { useToast } from './components/toast/ToastProvider';
import { formatChange } from './lib/formatting';
import { LiveActivityTicker } from './components/feedback/LiveActivityTicker';

export default function App() {
  useUrlSync();
  const { data, isPending, isError } = useQuery({ queryKey: ['portfolio-dashboard'], queryFn: getPortfolioDashboard });
  const pushLiveEvent = useDashboardStore((state) => state.pushLiveEvent);
  const { pushToast } = useToast();

  useEffect(() => {
    liveMetricStream.start();
    const unsubscribe = liveMetricStream.subscribe((event) => {
      pushLiveEvent(event);
      pushToast({
        title: `${event.kpi} refreshed`,
        description: `Δ ${formatChange(event.delta)}`,
        level: 'info',
      });
    });
    return () => {
      unsubscribe();
      liveMetricStream.stop();
    };
  }, [pushLiveEvent, pushToast]);

  if (isPending || !data) {
    return (
      <PageShell
        hero={{
          title: 'Loading portfolio dashboard',
          subtitle: 'Fetching module intelligence',
          description: 'Please hold while we hydrate your portfolio-grade product operations.',
          cta: 'Request access',
        }}
      >
        <DashboardSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    const requestId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    return (
      <PageShell hero={data?.hero ?? { title: 'Portfolio dashboard', subtitle: '', description: '', cta: 'Contact us' }}>
        <section className="surface-card" role="alert" style={{ display: 'grid', gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Unable to load dashboard</p>
          <p style={{ margin: 0, fontSize: 13 }}>
            Please refresh or contact support with request ID <code>{requestId}</code>.
          </p>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      hero={data.hero}
      generatedAt={data.generatedAt}
      filters={<GlobalFilters />}
      tabs={<ModuleTabs tabs={data.tabs} />}
      actions={<LiveActivityTicker />}
    >
      <DashboardModules data={data} />
    </PageShell>
  );
}
