'use client';

import { useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUpRight,
  Check,
  Moon,
  Sun,
  Earth,
  Workflow,
  Activity,
  ClipboardList,
  Sparkles,
  Loader2,
  Play,
  Pause,
  AlertTriangle,
  Bell,
  Filter,
  Search,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchPortfolioDashboard,
  type PortfolioDashboardResponse,
  type TabDefinition,
} from './data';
import { useDashboardStore, type DateRange } from '@/state/dashboardStore';
import { useThemeContext } from '@/components/theme/ThemeProvider';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { KPIBand } from '@/components/ui/KPIBand';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterChip } from '@/components/ui/FilterChip';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/ui/ChartCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { useToast } from '@/components/ui/ToastProvider';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatRelativeTime, downloadAs, cn } from '@/lib/utils';

const accentTokens: Record<TabDefinition['id'], string> = {
  saas: '--vertical-saas',
  commerce: '--vertical-commerce',
  corporate: '--vertical-corporate',
  customApp: '--vertical-custom',
  content: '--vertical-content',
  edtech: '--vertical-edtech',
  specialized: '--vertical-specialized',
};

const dateRangeOptions = [
  { id: 'last_7', label: 'Last 7 days' },
  { id: 'last_30', label: 'Last 30 days' },
  { id: 'quarter', label: 'Quarter to date' },
  { id: 'year', label: 'Year to date' },
];

const segmentOptions = [
  { id: 'all', label: 'All segments' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'midmarket', label: 'Mid-market' },
  { id: 'smb', label: 'SMB' },
];

const channelOptions = [
  { id: 'global', label: 'Global' },
  { id: 'amer', label: 'Americas' },
  { id: 'emea', label: 'EMEA' },
  { id: 'apac', label: 'APAC' },
];

type OrchestratorTab = 'runs' | 'recipes' | 'billing';

const orchestratorTabs: Array<{ id: OrchestratorTab; label: string; description: string }> = [
  { id: 'runs', label: 'Runs', description: 'Latest execution health with last run visibility' },
  { id: 'recipes', label: 'Recipes', description: 'Reusable automation playbooks and owners' },
  { id: 'billing', label: 'Billing', description: 'Cycle orchestration and settlement status' },
];

const navigationAnchors = [
  { id: 'insights', label: 'Insights' },
  { id: 'details', label: 'Details' },
  { id: 'actions', label: 'Actions' },
];

type DashboardClientProps = {
  initialData: PortfolioDashboardResponse;
};

type AutomationWithModule = PortfolioDashboardResponse['saas']['automation'][number] & {
  module: TabDefinition['id'];
  moduleLabel: string;
};

type ModuleProps<T> = {
  data: T;
  accent: string;
  metadata: PortfolioDashboardResponse['metadata'];
  analytics: ReturnType<typeof useAnalytics>;
};

function EmptyPanel({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--surface-border)] bg-white/70 px-6 py-10 text-center text-sm text-slate-600',
        className,
      )}
      role="status"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#4B5DFF]/10 text-[#4B5DFF]" aria-hidden>
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-xs text-slate-500">{description}</p>
      {action ? <div className="mt-4 flex items-center justify-center gap-2">{action}</div> : null}
    </div>
  );
}

function aggregateAutomations(data: PortfolioDashboardResponse): AutomationWithModule[] {
  const collections: Array<[TabDefinition['id'], AutomationWithModule[]]> = [
    ['saas', data.saas.automation.map((automation) => ({ ...automation, module: 'saas', moduleLabel: 'SaaS Platform' }))],
    ['commerce', data.commerce.automation.map((automation) => ({ ...automation, module: 'commerce', moduleLabel: 'E-commerce' }))],
    ['corporate', data.corporate.automation.map((automation) => ({ ...automation, module: 'corporate', moduleLabel: 'Corporate Analytics' }))],
    ['customApp', data.customApp.automation.map((automation) => ({ ...automation, module: 'customApp', moduleLabel: 'Custom App' }))],
    ['content', data.content.automation.map((automation) => ({ ...automation, module: 'content', moduleLabel: 'Content & Media' }))],
    ['edtech', data.edtech.automation.map((automation) => ({ ...automation, module: 'edtech', moduleLabel: 'EdTech' }))],
    ['specialized', [
      ...data.specialized.realEstate.automation.map((automation) => ({ ...automation, module: 'specialized', moduleLabel: 'Real Estate' })),
      ...data.specialized.finance.automation.map((automation) => ({ ...automation, module: 'specialized', moduleLabel: 'Finance' })),
      ...data.specialized.healthcare.automation.map((automation) => ({ ...automation, module: 'specialized', moduleLabel: 'Healthcare' })),
    ]],
  ];

  return collections.flatMap(([, items]) => items);
}

type GlobalHeaderProps = {
  data: PortfolioDashboardResponse;
  selectedModule: TabDefinition['id'];
  onModuleChange: (id: TabDefinition['id']) => void;
  filters: ReturnType<typeof useDashboardStore>['filters'];
  onFilterChange: (filters: Partial<ReturnType<typeof useDashboardStore>['filters']>) => void;
  onClearFilters: () => void;
  theme: string;
  toggleTheme: () => void;
  direction: 'ltr' | 'rtl';
  setDirection: (dir: 'ltr' | 'rtl') => void;
  onRequestDeck: () => void;
  analytics: ReturnType<typeof useAnalytics>;
};

function GlobalHeader({
  data,
  selectedModule,
  onModuleChange,
  filters,
  onFilterChange,
  onClearFilters,
  theme,
  toggleTheme,
  direction,
  setDirection,
  onRequestDeck,
  analytics,
}: GlobalHeaderProps) {
  const filterSummary = [
    dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Custom range',
    filters.segment ? `Segment: ${filters.segment}` : 'All segments',
    filters.channel ? `Channel: ${filters.channel.toUpperCase()}` : 'Global channel',
  ].join(' • ');

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--surface-border)] bg-[var(--surface-s1)]/95 backdrop-blur"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3" aria-labelledby="dashboard-hero-title">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{data.hero.subtitle}</p>
            <h1 id="dashboard-hero-title" className="text-display-lg text-slate-900">
              {data.hero.title}
            </h1>
            <p className="max-w-3xl text-sm text-slate-600">{data.hero.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#4B5DFF] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d4dd6] focus-visible:focus-ring"
                onClick={() => {
                  analytics.track('drill_down', { action: 'request_capability_deck' });
                  onRequestDeck();
                }}
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                {data.hero.cta}
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Filter className="h-4 w-4" aria-hidden />
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-700 shadow-sm" role="status">
                  {filterSummary}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3" aria-label="Theme and layout controls">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              >
                <Earth className="h-4 w-4" aria-hidden />
                {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
              </button>
            </div>
            <div className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 text-xs text-slate-500">
              <strong className="mr-2 font-semibold text-slate-700">Global freshness:</strong>
              {formatRelativeTime(data.globalFreshness.updatedAt)} • {data.globalFreshness.description}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500" role="status">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <Check className="h-3.5 w-3.5" aria-hidden /> Filters propagate to all modules
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <Bell className="h-3.5 w-3.5" aria-hidden /> Analytics tracking enabled
              </span>
            </div>
          </div>
        </div>

        <SegmentedTabs tabs={data.tabs} activeId={selectedModule} onChange={onModuleChange} />

        <div className="flex flex-wrap items-center gap-3" role="navigation" aria-label="Global filters">
          {dateRangeOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              active={filters.dateRange === option.id}
              onClick={() => {
                onFilterChange({ dateRange: option.id as typeof filters.dateRange });
                analytics.track('filter_change', { filter: 'dateRange', value: option.id });
              }}
              icon={filters.dateRange === option.id ? <Check className="h-4 w-4" aria-hidden /> : undefined}
            />
          ))}
          {segmentOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              active={(filters.segment ?? 'all') === option.id}
              onClick={() => {
                onFilterChange({ segment: option.id === 'all' ? null : option.id });
                analytics.track('filter_change', { filter: 'segment', value: option.id });
              }}
            />
          ))}
          {channelOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              active={(filters.channel ?? 'global') === option.id}
              onClick={() => {
                onFilterChange({ channel: option.id === 'global' ? null : option.id });
                analytics.track('filter_change', { filter: 'channel', value: option.id });
              }}
            />
          ))}
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
            onClick={() => {
              onClearFilters();
              analytics.track('filter_change', { filter: 'clear_all' });
            }}
          >
            Clear all
          </button>
        </div>
      </div>
    </header>
  );
}

type AutomationOrchestratorProps = {
  automations: AutomationWithModule[];
  billingCycles: PortfolioDashboardResponse['saas']['billingCycles'];
  metadata: PortfolioDashboardResponse['metadata'];
  analytics: ReturnType<typeof useAnalytics>;
  pushToast: ReturnType<typeof useToast>['push'];
};

const statusTone: Record<AutomationWithModule['status'], 'success' | 'warning' | 'danger'> = {
  healthy: 'success',
  warning: 'warning',
  failed: 'danger',
};

function AutomationOrchestrator({
  automations,
  billingCycles,
  metadata,
  analytics,
  pushToast,
}: AutomationOrchestratorProps) {
  const [activeTab, setActiveTab] = useState<OrchestratorTab>('runs');
  const [loading, setLoading] = useState<Record<string, 'simulate' | 'run' | null>>({});

  const summary = useMemo(() => {
    const priority: Record<AutomationWithModule['status'], number> = { healthy: 0, warning: 1, failed: 2 };
    return [...automations]
      .sort((a, b) => {
        const statusDiff = priority[a.status] - priority[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime();
      })
      .slice(0, 3);
  }, [automations]);

  const handleAction = useCallback(
    async (automation: AutomationWithModule, action: 'simulate' | 'run') => {
      setLoading((state) => ({ ...state, [automation.id]: action }));
      analytics.track(action === 'simulate' ? 'automation_simulate' : 'automation_run', {
        automationId: automation.id,
        module: automation.module,
      });

      const correlationId = `${automation.logId}-${Date.now()}`;

      try {
        await new Promise((resolve) => setTimeout(resolve, action === 'simulate' ? 900 : 1400));
        pushToast({
          title: action === 'simulate' ? 'Simulation complete' : 'Automation executed',
          description: `${automation.title} (${automation.moduleLabel}) • Correlation ${correlationId}`,
          tone: action === 'simulate' ? 'info' : 'success',
        });
      } catch (error) {
        console.error('Automation action failed', error);
        pushToast({
          title: 'Automation failed',
          description: `Correlation ${correlationId}. Please retry or inspect logs.`,
          tone: 'danger',
        });
      } finally {
        setLoading((state) => ({ ...state, [automation.id]: null }));
      }
    },
    [analytics, pushToast]
  );

  return (
    <section id="orchestrator" className="space-y-6" aria-labelledby="automation-orchestrator-heading">
      <Card
        metadata={metadata['automation-orchestrator'] ?? metadata.default}
        className="border border-[var(--surface-border)]"
        padding="lg"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Automation control</p>
            <h2 id="automation-orchestrator-heading" className="text-display-sm text-slate-900">
              Unified automation orchestrator
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Builder, orchestration, billing, and workflow automations consolidated into a single control plane with last-run
              visibility and health telemetry.
            </p>
          </div>
        <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
          {summary.length === 0 ? (
            <EmptyPanel
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
              title="Connect automations"
              description="Add at least one automation from the action hub to populate health telemetry."
              action={
                <a
                  href="#action-hub"
                  className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
                >
                  Open action hub
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              }
              className="col-span-full bg-white"
            />
          ) : (
            summary.map((automation) => (
              <div key={automation.id} className="rounded-2xl border border-[var(--surface-border)] bg-white/60 p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{automation.title}</span>
                  <StatusChip label={automation.status} tone={statusTone[automation.status]} />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">{automation.moduleLabel}</p>
                <p className="text-[11px] text-slate-500">Last run {formatRelativeTime(automation.lastRun)}</p>
              </div>
            ))
          )}
        </div>
        </div>

        <div className="mt-6">
          <SegmentedTabs tabs={orchestratorTabs} activeId={activeTab} onChange={(id) => setActiveTab(id as OrchestratorTab)} />
        </div>

        <div className="mt-6" role="tabpanel" aria-live="polite">
          {activeTab === 'runs' ? (
            <div className="space-y-3" aria-label="Automation runs list">
              {automations.length === 0 ? (
                <EmptyPanel
                  icon={<Sparkles className="h-5 w-5" aria-hidden />}
                  title="No automations yet"
                  description="Configure automations to monitor run health, status, and last-run telemetry here."
                  action={
                    <a
                      href="#action-hub"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
                    >
                      Launch action hub
                    </a>
                  }
                />
              ) : (
                automations.map((automation) => {
                  const state = loading[automation.id];
                  return (
                    <article
                      key={automation.id}
                      className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 transition hover:border-[var(--primary-200)] focus-within:ring-2 focus-within:ring-[var(--primary-200)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{automation.title}</h3>
                          <p className="text-xs text-slate-500">{automation.moduleLabel}</p>
                          <p className="mt-1 text-xs text-slate-500">Last run {formatRelativeTime(automation.lastRun)}</p>
                        </div>
                        <StatusChip label={automation.status} tone={statusTone[automation.status]} />
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                        <span className="rounded-full bg-white px-3 py-1 font-medium">Trigger: {automation.trigger}</span>
                        <span className="rounded-full bg-white px-3 py-1 font-medium">Owner: {automation.owner}</span>
                        <span className="rounded-full bg-white px-3 py-1 font-medium">Channel: {automation.channel}</span>
                        <span className="rounded-full bg-white px-3 py-1 font-medium">Cadence: {automation.cadence}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                          onClick={() => handleAction(automation, 'simulate')}
                          disabled={Boolean(state)}
                        >
                          {state === 'simulate' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                          Simulate
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#4B5DFF] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d4dd6] focus-visible:focus-ring"
                          onClick={() => handleAction(automation, 'run')}
                          disabled={Boolean(state)}
                        >
                          {state === 'run' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                          Run now
                        </button>
                        <span className="text-[11px] text-slate-500">Log ID {automation.logId}</span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          ) : null}

          {activeTab === 'recipes' ? (
            <div className="grid gap-4 md:grid-cols-2" aria-label="Automation recipes">
              {automations.length === 0 ? (
                <EmptyPanel
                  icon={<Workflow className="h-5 w-5" aria-hidden />}
                  title="No recipes available"
                  description="Documented recipes will appear once automations are configured."
                  action={
                    <a
                      href="#action-hub"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
                    >
                      Configure automations
                    </a>
                  }
                  className="col-span-full"
                />
              ) : (
                automations.map((automation) => (
                  <Card
                    key={`${automation.id}-recipe`}
                    metadata={metadata['automation-orchestrator'] ?? metadata.default}
                    padding="md"
                    className="border border-[var(--surface-border)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{automation.title}</h3>
                        <p className="text-xs text-slate-500">{automation.moduleLabel}</p>
                      </div>
                      <StatusChip label={automation.status} tone={statusTone[automation.status]} />
                    </div>
                    <p className="text-xs text-slate-600">{automation.action}</p>
                    <p className="text-[11px] text-slate-500">Trigger {automation.trigger}</p>
                  </Card>
                ))
              )}
            </div>
          ) : null}

          {activeTab === 'billing' ? (
            <div className="space-y-3" aria-label="Billing cycles">
              {billingCycles.length === 0 ? (
                <EmptyPanel
                  icon={<ClipboardList className="h-5 w-5" aria-hidden />}
                  title="No billing cycles tracked"
                  description="Connect billing automation to surface cycle progress and owner accountability."
                  className="bg-white"
                />
              ) : (
                billingCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--surface-border)] bg-white/70 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{cycle.label}</p>
                      <p className="text-xs text-slate-500">Next run {cycle.nextRun}</p>
                      <p className="text-xs text-slate-500">Owners: {cycle.owners.join(', ')}</p>
                    </div>
                    <StatusChip
                      label={cycle.status}
                      tone={cycle.status === 'completed' ? 'success' : cycle.status === 'processing' ? 'info' : 'warning'}
                    />
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}

type ActionHubProps = {
  automations: AutomationWithModule[];
  alerts: Array<{ id: string; message: string; severity: 'info' | 'warning' | 'critical' }>;
  metadata: PortfolioDashboardResponse['metadata'];
  analytics: ReturnType<typeof useAnalytics>;
  pushToast: ReturnType<typeof useToast>['push'];
};

const actionHubTabs = [
  { id: 'exports', label: 'Exports' },
  { id: 'automations', label: 'Automations' },
  { id: 'alerts', label: 'Alerts' },
];

function ActionHub({ automations, alerts, metadata, analytics, pushToast }: ActionHubProps) {
  const [activeTab, setActiveTab] = useState<'exports' | 'automations' | 'alerts'>('exports');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    setExportFormat(format);
    analytics.track('export_triggered', { format });
    if (format === 'pdf') {
      pushToast({ title: 'Export queued', description: 'PDF export will be delivered via email shortly.', tone: 'info' });
      return;
    }
    const exportRows = automations.map((automation) => ({
      id: automation.id,
      title: automation.title,
      module: automation.moduleLabel,
      lastRun: automation.lastRun,
      status: automation.status,
    }));
    downloadAs(format, `automations.${format}`, exportRows);
  };

  return (
    <aside id="action-hub" className="space-y-4" aria-labelledby="action-hub-title">
      <Card metadata={metadata['automation-orchestrator'] ?? metadata.default} className="border border-[var(--surface-border)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Operations hub</p>
            <h2 id="action-hub-title" className="text-title-lg text-slate-900">
              Action hub
            </h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {automations.length} automations • {alerts.length} alerts
          </span>
        </div>

        <div className="mt-4 flex gap-2" role="tablist" aria-label="Action hub tabs">
          {actionHubTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={cn(
                'inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition focus-visible:focus-ring',
                activeTab === tab.id
                  ? 'border-[#4B5DFF] bg-[#4B5DFF]/10 text-[#4B5DFF]'
                  : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/70'
              )}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4" role="tabpanel">
          {activeTab === 'exports' ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-600" htmlFor="export-format">
                Export automations snapshot
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="export-format"
                  className="min-h-[40px] flex-1 rounded-full border border-[var(--surface-border)] px-3 py-2 text-sm focus-visible:focus-ring"
                  value={exportFormat}
                  onChange={(event) => handleExport(event.target.value as typeof exportFormat)}
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
                <button
                  type="button"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#4B5DFF] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#3d4dd6] focus-visible:focus-ring"
                  onClick={() => handleExport(exportFormat)}
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                  Export
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Exports include run history, owners, and last-run timestamps.</p>
            </div>
          ) : null}

          {activeTab === 'automations' ? (
            <div className="space-y-3" aria-label="Automations summary">
              {automations.length === 0 ? (
                <EmptyPanel
                  icon={<Workflow className="h-5 w-5" aria-hidden />}
                  title="No automations connected"
                  description="Use the orchestrator to add exports, alerts, and billing workflows to this workspace."
                  action={
                    <a
                      href="#orchestrator"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
                    >
                      Go to orchestrator
                    </a>
                  }
                  className="bg-white"
                />
              ) : (
                <>
                  {automations.slice(0, 8).map((automation) => (
                    <div
                      key={`${automation.id}-summary`}
                      className="flex items-center justify-between gap-2 rounded-full bg-white px-3 py-2 text-xs text-slate-600"
                    >
                      <span className="truncate font-semibold text-slate-800">{automation.title}</span>
                      <div className="flex items-center gap-2">
                        <span>{automation.moduleLabel}</span>
                        <StatusChip label={automation.status} tone={statusTone[automation.status]} />
                      </div>
                    </div>
                  ))}
                  {automations.length > 8 ? (
                    <a
                      href="#orchestrator"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
                    >
                      View orchestrator
                      <Link2 className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : null}
                </>
              )}
            </div>
          ) : null}

          {activeTab === 'alerts' ? (
            <div className="space-y-3" aria-label="Automation alerts">
              {alerts.length === 0 ? (
                <EmptyPanel
                  icon={<Bell className="h-5 w-5" aria-hidden />}
                  title="No alerts firing"
                  description="Great news—there are no automation alerts requiring review."
                  className="bg-white"
                />
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-sm',
                      alert.severity === 'critical'
                        ? 'border-[var(--danger-300)] bg-[var(--danger-50)] text-[var(--danger-700)]'
                        : alert.severity === 'warning'
                        ? 'border-[var(--warning-300)] bg-[var(--warning-50)] text-[var(--warning-700)]'
                        : 'border-[var(--info-300)] bg-[var(--info-50)] text-[var(--info-700)]'
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      {alert.severity}
                    </div>
                    <p className="mt-2 text-sm">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </Card>
    </aside>
  );
}

function AutomationList({
  items,
}: {
  items: PortfolioDashboardResponse['saas']['automation'];
}) {
  return (
    <Card className="border border-[var(--surface-border)]" padding="md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-title-sm text-slate-900">Automation orchestration</h3>
          <p className="text-xs text-slate-600">
            Trigger → Action → Channel → Cadence. Workflows expose retries, audit logs, and SLA health.
          </p>
        </div>
        <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
      </div>
      <div className="mt-5 space-y-3">
        {items.map((automation) => (
          <article
            key={automation.id}
            className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                <p className="text-xs text-slate-500">Trigger: {automation.trigger}</p>
              </div>
              <StatusChip
                label={automation.active ? 'Active' : 'Paused'}
                tone={automation.active ? 'success' : 'warning'}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">Action: {automation.action}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-1">Owner: {automation.owner}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1">Channel: {automation.channel}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1">Cadence: {automation.cadence}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Enterprise packs unlock predictive triggers, anomaly detection, and compliance exports.
      </p>
    </Card>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{subtitle}</p>
        <h2 className="text-display-md text-slate-900">{title}</h2>
      </div>
      <div className="h-1 w-24 rounded-full" style={{ background: `var(${accent})` }} aria-hidden />
    </div>
  );
}

function SaaSModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['saas']>) {
  const churnRows = data.churnSegments.map((segment) => ({
    segment: segment.label,
    share: `${segment.value}%`,
  }));

  const growthRows = data.growthTrend.map((point) => ({ month: point.label, mrr: point.value }));
  const apiRows = data.apiUsageTrend.map((point) => ({ week: point.label, usage: point.value }));
  const [hiddenSegments, setHiddenSegments] = useState<Record<string, boolean>>({});

  const visibleSegments = data.churnSegments.filter((segment) => !hiddenSegments[segment.id]);

  return (
    <section className="grid grid-cols-12 gap-6" id="saas-panel" role="tabpanel" aria-labelledby="saas">
      <div className="col-span-12">
        <SectionHeader
          title="Subscription intelligence & API operations"
          subtitle="SaaS platform"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <Card
          metadata={metadata['saas-subscription'] ?? metadata.default}
          className="border border-[var(--surface-border)]"
          role="region"
          aria-label="Subscription plans"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-title-sm text-slate-900">Subscription plans</h3>
              <p className="text-xs text-slate-600">
                Tiered pricing, seat allocation, and churn performance with activation benchmarks.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-[#4B5DFF]" aria-hidden />
          </div>
          <div className="mt-4 max-h-[360px] overflow-auto rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Subscription plans table">
              <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Active users</th>
                  <th className="px-4 py-3 text-left">Activation</th>
                  <th className="px-4 py-3 text-left">API allocation</th>
                  <th className="px-4 py-3 text-left">Churn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-700">
                {data.subscriptionPlans.map((plan, index) => (
                  <tr key={plan.id} className={index % 2 === 0 ? 'bg-white/60' : undefined}>
                    <td className="px-4 py-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{plan.name}</span>
                        {plan.badge ? (
                          <span className="rounded-full bg-[#4B5DFF]/10 px-2 py-0.5 text-[11px] font-semibold text-[#4B5DFF]">
                            {plan.badge}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-[11px]">{plan.price}</td>
                    <td className="px-4 py-[11px]">{plan.activeUsers.toLocaleString()}</td>
                    <td className="px-4 py-[11px]">{plan.activationRate}</td>
                    <td className="px-4 py-[11px]">{plan.apiAllocation}</td>
                    <td className="px-4 py-[11px]">{plan.churn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <Card
          metadata={metadata['saas-churn'] ?? metadata.default}
          className="border border-[var(--surface-border)]"
          role="region"
          aria-label="Churn health"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Churn health distribution</h3>
              <p className="text-xs text-slate-600">Toggle segments to focus retention energy.</p>
            </div>
          </div>
          <div className="mt-4" role="figure" aria-label="Churn segments chart">
            <ResponsiveContainer height={240}>
              <PieChart>
                <Pie dataKey="value" data={visibleSegments} innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {visibleSegments.map((segment) => (
                    <Cell key={segment.id} fill={segment.color} stroke="#1f2937" strokeWidth={1.5} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)', background: 'var(--surface-s1)' }}
                  formatter={(value: number, name, props) => [
                    `${value}%`,
                    `${props.payload.label} (${((value as number) / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })})`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600" role="list">
              {data.churnSegments.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  role="listitem"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 focus-visible:focus-ring',
                    hiddenSegments[segment.id]
                      ? 'border-slate-200 bg-slate-100 text-slate-400'
                      : 'border-slate-300 bg-white text-slate-700'
                  )}
                  onClick={() =>
                    setHiddenSegments((state) => ({ ...state, [segment.id]: !state[segment.id] }))
                  }
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden
                  />
                  {segment.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <details className="rounded-2xl border border-[var(--surface-border)] bg-white/70" aria-label="Billing cycles">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-900">
            Billing cycle orchestration
            <ClipboardList className="h-5 w-5 text-[#4B5DFF]" aria-hidden />
          </summary>
          <div className="space-y-3 px-6 pb-4 text-xs text-slate-600">
            {data.billingCycles.map((cycle) => (
              <div key={cycle.id} className="rounded-2xl border border-[var(--surface-border)] px-4 py-3">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{cycle.label}</span>
                  <StatusChip
                    label={cycle.status}
                    tone={cycle.status === 'completed' ? 'success' : cycle.status === 'processing' ? 'info' : 'warning'}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Next run {cycle.nextRun}</p>
                <p className="text-xs text-slate-500">Owners: {cycle.owners.join(', ')}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-6">
        <ChartCard
          id="saas-growth"
          title="MRR growth"
          description="Pre-aggregated monthly recurring revenue"
          rows={growthRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'mrr', label: 'MRR ($K)', align: 'right' },
          ]}
          metadata={metadata['saas-growth'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'View actions',
            onClick: () => analytics.track('drill_down', { module: 'saas', target: 'action-hub' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <LineChart data={data.growthTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'MRR']}
              />
              <Line type="monotone" dataKey="value" stroke="#4B5DFF" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          id="saas-api"
          title="API usage saturation"
          description="Live usage vs allocation"
          rows={apiRows}
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'usage', label: 'Usage (M calls)', align: 'right' },
          ]}
          metadata={metadata['saas-api'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Open action hub',
            onClick: () => analytics.track('drill_down', { module: 'saas', target: 'action-hub' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <AreaChart data={data.apiUsageTrend}>
              <defs>
                <linearGradient id="apiGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4B5DFF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4B5DFF" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                formatter={(value: number) => [`${value}M`, 'API calls']}
              />
              <Area type="monotone" dataKey="value" stroke="#4B5DFF" fill="url(#apiGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}


function CommerceModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['commerce']>) {
  const salesRows = data.salesTrend.map((point) => ({ month: point.label, revenue: point.value }));
  const productRows = data.topProducts.map((product) => ({
    product: product.name,
    category: product.category,
    revenue: product.revenue,
    conversion: product.conversionRate,
    inventory: product.inventory,
    trend: product.trend,
  }));

  return (
    <section className="grid grid-cols-12 gap-6" id="commerce-panel" role="tabpanel" aria-labelledby="commerce">
      <div className="col-span-12">
        <SectionHeader
          title="Merchandising, orders & fulfillment"
          subtitle="E-commerce"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-8 space-y-6">
        <ChartCard
          id="commerce-products"
          title="Top products leaderboard"
          description="Revenue, conversion, and inventory with zebra striping"
          rows={productRows}
          columns={[
            { key: 'product', label: 'Product' },
            { key: 'category', label: 'Category' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'conversion', label: 'Conversion' },
            { key: 'inventory', label: 'Inventory', align: 'right' },
            { key: 'trend', label: 'Trend', align: 'right' },
          ]}
          paginate
          rowsPerPage={10}
          metadata={metadata['commerce-products'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Route to action hub',
            onClick: () => analytics.track('drill_down', { module: 'commerce', target: 'action-hub' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <BarChart data={data.topProducts.slice(0, 10)}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
              <YAxis tickLine={false} axisLine={false} hide />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="revenue" radius={[12, 12, 12, 12]} fill="#4B5DFF" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <details className="rounded-2xl border border-[var(--surface-border)] bg-white/70" aria-label="Operational health">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-900">
            Operational health
            <Activity className="h-5 w-5 text-[#4B5DFF]" aria-hidden />
          </summary>
          <ul className="space-y-3 px-6 pb-4 text-xs text-slate-600">
            {data.operations.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <StatusChip
                    label={item.status}
                    tone={item.status === 'healthy' ? 'success' : item.status === 'attention' ? 'warning' : 'info'}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <ChartCard
          id="commerce-sales"
          title="Sales trends"
          description="Seasonally-adjusted GMV"
          rows={salesRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'revenue', label: 'GMV ($M)', align: 'right' },
          ]}
          metadata={metadata['commerce-sales'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Trigger export',
            onClick: () => analytics.track('export_triggered', { module: 'commerce', format: 'csv' }),
          }}
        >
          <ResponsiveContainer height={240}>
            <BarChart data={data.salesTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                formatter={(value: number) => [`$${value.toFixed(1)}M`, 'GMV']}
              />
              <Bar dataKey="value" radius={[12, 12, 12, 12]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function CorporateModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['corporate']>) {
  const funnelRows = data.funnel.map((stage) => ({
    stage: stage.stage,
    count: stage.count.toLocaleString(),
    conversion: stage.conversion,
    delta: `${stage.delta.toFixed(1)}%`,
  }));

  const sourceRows = data.leadSources.map((source) => ({ source: source.label, share: `${source.value}%` }));

  return (
    <section className="grid grid-cols-12 gap-6" id="corporate-panel" role="tabpanel" aria-labelledby="corporate">
      <div className="col-span-12">
        <SectionHeader
          title="Growth marketing & pipeline analytics"
          subtitle="Corporate analytics"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7 space-y-6">
        <ChartCard
          id="corporate-funnel"
          title="Conversion funnel"
          description="Visitors → MQL → SQL → Opportunities → Closed"
          rows={funnelRows}
          columns={[
            { key: 'stage', label: 'Stage' },
            { key: 'count', label: 'Volume', align: 'right' },
            { key: 'conversion', label: 'Conversion', align: 'right' },
            { key: 'delta', label: 'Δ', align: 'right' },
          ]}
          metadata={metadata['corporate-funnel'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Review orchestrator',
            onClick: () => analytics.track('drill_down', { module: 'corporate', target: 'action-hub' }),
          }}
          tone="accent"
        >
          <ResponsiveContainer height={320}>
            <BarChart data={data.funnel} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid horizontal={false} stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis type="number" hide />
              <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} width={200} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                formatter={(value: number) => [value.toLocaleString(), 'Volume']}
              />
              <Bar dataKey="count" fill="#4B5DFF" radius={[12, 12, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <details className="rounded-2xl border border-[var(--surface-border)] bg-white/70" aria-label="Executive insights">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-900">
            Executive insights
            <Sparkles className="h-5 w-5 text-[#4B5DFF]" aria-hidden />
          </summary>
          <ul className="space-y-3 px-6 pb-4 text-xs text-slate-600">
            {data.insights.map((insight) => (
              <li key={insight.id} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{insight.headline}</p>
                <p className="mt-1 text-xs text-slate-600">{insight.detail}</p>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <ChartCard
          id="corporate-sources"
          title="Lead source share"
          description="Attribution mix across top-performing channels"
          rows={sourceRows}
          columns={[{ key: 'source', label: 'Source' }, { key: 'share', label: 'Share', align: 'right' }]}
          metadata={metadata['corporate-sources'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Manage campaigns',
            onClick: () => analytics.track('drill_down', { module: 'corporate', target: 'action-hub' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <PieChart>
              <Pie dataKey="value" data={data.leadSources} innerRadius={70} outerRadius={110}>
                {data.leadSources.map((source) => (
                  <Cell key={source.id} fill={source.color} stroke="#1f2937" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function CustomAppModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['customApp']>) {
  const workloadRows = data.workloadDistribution.map((point) => ({ owner: point.label, active: point.value, planned: point.secondary }));

  return (
    <section className="grid grid-cols-12 gap-6" id="customApp-panel" role="tabpanel" aria-labelledby="customApp">
      <div className="col-span-12">
        <SectionHeader
          title="Productivity suite & automation"
          subtitle="Custom app"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7 space-y-6">
        <Card
          metadata={metadata['custom-kanban'] ?? metadata.default}
          className="border border-[var(--surface-border)]"
          role="region"
          aria-label="Kanban summary"
        >
          <h3 className="text-title-sm text-slate-900">Sprint kanban summary</h3>
          <p className="text-xs text-slate-600">Automation-enhanced delivery lanes with focus on accessibility and rituals.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {data.kanban.map((lane) => (
              <div key={lane.id} className="rounded-2xl border border-[var(--surface-border)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-slate-900">{lane.title}</p>
                <p className="text-[11px] text-slate-500">{lane.badge}</p>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  {lane.tasks.slice(0, 3).map((task) => (
                    <li key={task.id} className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-s1)] px-3 py-2">
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p>{task.owner} • Due {task.due}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <details className="rounded-2xl border border-[var(--surface-border)] bg-white/70" aria-label="Backlog ideas">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-slate-900">
            Backlog ideas
            <Sparkles className="h-5 w-5 text-[#4B5DFF]" aria-hidden />
          </summary>
          <ul className="space-y-2 px-6 pb-4 text-xs text-slate-600">
            {data.backlogIdeas.map((idea, index) => (
              <li key={idea} className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-s1)] px-3 py-2">
                <span className="font-semibold text-slate-900">{index + 1}.</span> {idea}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <ChartCard
          id="custom-workload"
          title="Workload distribution"
          description="Active vs planned tasks per owner"
          rows={workloadRows}
          columns={[
            { key: 'owner', label: 'Owner' },
            { key: 'active', label: 'Active', align: 'right' },
            { key: 'planned', label: 'Planned', align: 'right' },
          ]}
          metadata={metadata['custom-workload'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Automate assignments',
            onClick: () => analytics.track('automation_run', { module: 'customApp', scope: 'workload' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <BarChart data={data.workloadDistribution}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Legend verticalAlign="bottom" />
              <Bar dataKey="value" name="Active" fill="#4B5DFF" radius={[12, 12, 0, 0]} />
              <Bar dataKey="secondary" name="Planned" fill="#6366f1" radius={[0, 0, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function ContentModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['content']>) {
  const engagementRows = data.engagementTrend.map((point) => ({ period: point.label, score: point.value }));
  const [activeTab, setActiveTab] = useState<'stories' | 'queue'>('stories');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'in-review' | 'blocked'>('all');

  const filteredStories = data.topStories.filter((story) => (statusFilter === 'all' ? true : story.status.toLowerCase() === statusFilter.replace('-', ' ')));
  const filteredQueue = data.publishingQueue.filter((item) => (statusFilter === 'all' ? true : item.status === statusFilter));

  return (
    <section className="grid grid-cols-12 gap-6" id="content-panel" role="tabpanel" aria-labelledby="content">
      <div className="col-span-12">
        <SectionHeader
          title="Publishing workflow & engagement"
          subtitle="Content & media"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <ChartCard
          id="content-engagement"
          title="Engagement trend"
          description="Plays, reads, and watch time"
          rows={engagementRows}
          columns={[
            { key: 'period', label: 'Period' },
            { key: 'score', label: 'Engagement', align: 'right' },
          ]}
          metadata={metadata['content-engagement'] ?? metadata.default}
          footerLink={{
            href: '#action-hub',
            label: 'Create campaign',
            onClick: () => analytics.track('drill_down', { module: 'content', target: 'action-hub' }),
          }}
        >
          <ResponsiveContainer height={320}>
            <LineChart data={data.engagementTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(251, 146, 60, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                formatter={(value: number) => [`${value}`, 'Engagement score']}
              />
              <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <Card metadata={metadata['content-top-stories'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-title-sm text-slate-900">Stories & publishing queue</h3>
              <p className="text-xs text-slate-600">Shared filters keep editorial and distribution aligned.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn(
                  'inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold focus-visible:focus-ring',
                  activeTab === 'stories' ? 'border-[#4B5DFF] text-[#4B5DFF]' : 'border-[var(--surface-border)] text-slate-600'
                )}
                onClick={() => setActiveTab('stories')}
              >
                Top stories
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold focus-visible:focus-ring',
                  activeTab === 'queue' ? 'border-[#4B5DFF] text-[#4B5DFF]' : 'border-[var(--surface-border)] text-slate-600'
                )}
                onClick={() => setActiveTab('queue')}
              >
                Publishing queue
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <label htmlFor="content-status" className="font-semibold">Status filter</label>
            <select
              id="content-status"
              className="min-h-[36px] rounded-full border border-[var(--surface-border)] px-3 py-1 focus-visible:focus-ring"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <option value="all">All</option>
              <option value="ready">Ready</option>
              <option value="in-review">In review</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="mt-4 max-h-[280px] overflow-auto rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)]">
            {activeTab === 'stories' ? (
              <table className="min-w-full" aria-label="Top stories">
                <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Format</th>
                    <th className="px-4 py-3 text-left">Window</th>
                    <th className="px-4 py-3 text-right">Engagement</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)] text-sm">
                  {filteredStories.map((story, index) => (
                    <tr key={story.id} className={index % 2 === 0 ? 'bg-white/60' : undefined}>
                      <td className="px-4 py-[11px] font-semibold text-slate-900">{story.title}</td>
                      <td className="px-4 py-[11px] text-slate-600">{story.format}</td>
                      <td className="px-4 py-[11px] text-slate-600">{story.publishedAt}</td>
                      <td className="px-4 py-[11px] text-right text-slate-600">{story.engagement}</td>
                      <td className="px-4 py-[11px] text-right text-slate-600">{story.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full" aria-label="Publishing queue">
                <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Slot</th>
                    <th className="px-4 py-3 text-left">Topic</th>
                    <th className="px-4 py-3 text-left">Editor</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)] text-sm">
                  {filteredQueue.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white/60' : undefined}>
                      <td className="px-4 py-[11px] text-slate-600">{item.slot}</td>
                      <td className="px-4 py-[11px] font-semibold text-slate-900">{item.topic}</td>
                      <td className="px-4 py-[11px] text-slate-600">{item.editor}</td>
                      <td className="px-4 py-[11px] text-right text-slate-600">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

function EdTechModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['edtech']>) {
  const heatmapMax = Math.max(...data.activityHeatmap.values.map((entry) => entry.score));

  return (
    <section className="grid grid-cols-12 gap-6" id="edtech-panel" role="tabpanel" aria-labelledby="edtech">
      <div className="col-span-12">
        <SectionHeader
          title="Learning analytics & student success"
          subtitle="EdTech"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-6">
        <Card metadata={metadata['edtech-programs'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-title-sm text-slate-900">Program performance</h3>
              <p className="text-xs text-slate-600">Enrollment, completion, average scores with adjacent alerts.</p>
            </div>
          </div>
          <div className="mt-4 max-h-[260px] overflow-auto rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Program performance table">
              <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-right">Enrollment</th>
                  <th className="px-4 py-3 text-right">Completion</th>
                  <th className="px-4 py-3 text-right">Avg score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] text-sm">
                {data.courses.map((course, index) => (
                  <tr key={course.id} className={index % 2 === 0 ? 'bg-white/60' : undefined}>
                    <td className="px-4 py-[11px] font-semibold text-slate-900">{course.title}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.enrollment.toLocaleString()}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.completion}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Alerts</h4>
            {data.alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs',
                  alert.severity === 'critical'
                    ? 'bg-[var(--danger-50)] text-[var(--danger-700)]'
                    : alert.severity === 'warning'
                    ? 'bg-[var(--warning-50)] text-[var(--warning-700)]'
                    : 'bg-[var(--info-50)] text-[var(--info-700)]'
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-6">
        <Card metadata={metadata['edtech-heatmap'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-title-sm text-slate-900">Student activity heatmap</h3>
              <p className="text-xs text-slate-600">Reduced saturation with numeric labels and accessible patterns.</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-center" aria-label="Student activity heatmap table">
              <thead className="text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-2 py-2 text-left">Week</th>
                  {data.activityHeatmap.days.map((day) => (
                    <th key={day} className="px-2 py-2 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.activityHeatmap.weeks.map((week) => (
                  <tr key={week}>
                    <td className="px-2 py-2 text-left font-semibold text-slate-900">{week}</td>
                    {data.activityHeatmap.days.map((day) => {
                      const cell = data.activityHeatmap.values.find((value) => value.week === week && value.day === day);
                      const score = cell?.score ?? 0;
                      const intensity = score / heatmapMax;
                      const pattern = intensity > 0.6 ? 'repeating-linear-gradient(45deg, rgba(79, 70, 229, 0.35), rgba(79, 70, 229, 0.35) 8px, transparent 8px, transparent 16px)' : 'none';
                      return (
                        <td
                          key={`${week}-${day}`}
                          className="px-2 py-2 text-xs font-semibold text-slate-700"
                          style={{
                            backgroundColor: `rgba(79, 70, 229, ${0.08 + intensity * 0.35})`,
                            backgroundImage: pattern,
                            borderRadius: 10,
                          }}
                        >
                          {score}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}

function SpecializedModule({ data, accent, metadata, analytics }: ModuleProps<PortfolioDashboardResponse['specialized']>) {
  const momentumRows = data.realEstate.trend.map((point) => ({ month: point.label, momentum: point.value }));
  const expenseRows = data.finance.expenses.map((point) => ({ week: point.label, actual: point.value, budget: point.secondary }));
  const [searchTerm, setSearchTerm] = useState('');
  const listings = data.realEstate.pipeline.filter((listing) => listing.address.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section className="grid grid-cols-12 gap-6" id="specialized-panel" role="tabpanel" aria-labelledby="specialized">
      <div className="col-span-12">
        <SectionHeader
          title="Real estate, finance & healthcare"
          subtitle="Specialized niches"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-8">
        <Card metadata={metadata['specialized-realestate'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <h3 className="text-title-sm text-slate-900">Audience growth & engagement</h3>
          <p className="text-xs text-slate-600">Dual-axis view combining market momentum with expense pacing.</p>
          <ResponsiveContainer height={320}>
            <ComposedChart data={data.realEstate.trend.map((point, index) => ({
              month: point.label,
              momentum: point.value,
              expense: expenseRows[index]?.actual ?? 0,
            }))}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="momentum" name="Audience growth" fill="#4B5DFF" radius={[12, 12, 12, 12]} />
              <Line yAxisId="right" type="monotone" dataKey="expense" name="Engagement rate" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card metadata={metadata['specialized-finance'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <h3 className="text-title-sm text-slate-900">ROI breakdown</h3>
          <p className="text-xs text-slate-600">Marketing and operations return contributions.</p>
          <ResponsiveContainer height={240}>
            <PieChart>
              <Pie dataKey="value" data={data.finance.roiBreakdown} innerRadius={70} outerRadius={110}>
                {data.finance.roiBreakdown.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} stroke="#1f2937" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-8 space-y-6">
        <Card metadata={metadata['specialized-realestate'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-title-sm text-slate-900">Active listings</h3>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by address"
              className="min-h-[36px] rounded-full border border-[var(--surface-border)] px-3 py-1 text-sm focus-visible:focus-ring"
            />
          </div>
          <div className="mt-4 max-h-[260px] overflow-auto rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Listings table">
              <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Stage</th>
                  <th className="px-4 py-3 text-right">Inquiries</th>
                  <th className="px-4 py-3 text-right">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] text-sm">
                {listings.map((listing, index) => (
                  <tr key={listing.id} className={index % 2 === 0 ? 'bg-white/60' : undefined}>
                    <td className="px-4 py-[11px] font-semibold text-slate-900">{listing.address}</td>
                    <td className="px-4 py-[11px] text-slate-600">{listing.stage}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{listing.inquiries}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{listing.agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card metadata={metadata['specialized-healthcare'] ?? metadata.default} className="border border-[var(--surface-border)]">
          <h3 className="text-title-sm text-slate-900">Upcoming appointments</h3>
          <ul className="mt-4 space-y-3">
            {data.healthcare.appointments.map((appointment) => (
              <li key={appointment.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{appointment.patient}</p>
                <p className="text-xs text-slate-600">{appointment.start} • {appointment.channel}</p>
                <p className="text-xs text-slate-600">{appointment.clinician} • {appointment.status}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
function getModuleMetrics(
  moduleId: TabDefinition['id'],
  data: PortfolioDashboardResponse
): PortfolioDashboardResponse['saas']['metrics'] {
  switch (moduleId) {
    case 'saas':
      return data.saas.metrics;
    case 'commerce':
      return data.commerce.metrics;
    case 'corporate':
      return data.corporate.metrics;
    case 'content':
      return data.content.metrics;
    case 'edtech':
      return data.edtech.metrics;
    case 'specialized':
      return [
        data.specialized.realEstate.metrics[0],
        data.specialized.finance.metrics[0],
        data.specialized.healthcare.metrics[0],
        data.specialized.healthcare.metrics[1],
      ];
    case 'customApp':
      return [
        {
          id: 'throughput',
          label: 'Sprint throughput',
          value: '94%',
          change: 2.1,
          trend: 'up',
          description: 'Tickets cleared last sprint',
        },
        {
          id: 'ideas',
          label: 'Ideas triaged',
          value: '128',
          change: 5.4,
          trend: 'up',
          description: 'Last 30 days',
        },
        {
          id: 'automation-coverage',
          label: 'Automation coverage',
          value: '76%',
          change: 3.2,
          trend: 'up',
          description: 'Tasks automated',
        },
        {
          id: 'focus-time',
          label: 'Focus time saved',
          value: '312 hrs',
          change: 7.8,
          trend: 'up',
          description: 'Quarter to date',
        },
      ];
    default:
      return data.saas.metrics;
  }
}

function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-[var(--surface-s0)] pb-16 text-slate-900" aria-busy="true">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-72 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-full max-w-3xl animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="h-60 animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { theme, toggleTheme, direction, setDirection } = useThemeContext();
  const { selectedModule, setModule, filters, setFilters } = useDashboardStore();
  const { push } = useToast();
  const analytics = useAnalytics();
  const errorLogId = useMemo(() => `ERR-${Date.now().toString(36)}`, []);
  const router = useRouter();

  const { data: queryData, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['portfolio-dashboard'],
    queryFn: fetchPortfolioDashboard,
    initialData,
  });
  const data = queryData ?? initialData;

  useLiveMetrics();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    analytics.track('visual_regression_snapshot', { module: selectedModule });
  }, [analytics, selectedModule]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        analytics.track('telemetry_observed', {
          metric: entry.name,
          value: entry.startTime,
        });
      }
    });
    try {
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.warn('PerformanceObserver paint not supported', error);
    }

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        analytics.track('telemetry_observed', { metric: 'largest-contentful-paint', value: lastEntry.startTime });
      }
    });
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.warn('PerformanceObserver LCP not supported', error);
    }

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
    };
  }, [analytics]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get('module') as TabDefinition['id'] | null;
    const dateRangeParam = params.get('dateRange') as DateRange | null;
    const segmentParam = params.get('segment');
    const channelParam = params.get('channel');
    if (moduleParam) setModule(moduleParam);
    if (dateRangeParam) setFilters({ dateRange: dateRangeParam });
    if (segmentParam) setFilters({ segment: segmentParam });
    if (channelParam) setFilters({ channel: channelParam });
  }, [setFilters, setModule]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('module', selectedModule);
    params.set('dateRange', filters.dateRange);
    if (filters.segment) {
      params.set('segment', filters.segment);
    } else {
      params.delete('segment');
    }
    if (filters.channel) {
      params.set('channel', filters.channel);
    } else {
      params.delete('channel');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, selectedModule, router]);

  useEffect(() => {
    if (!error) {
      return;
    }
    analytics.track('telemetry_observed', { metric: 'dashboard_error', logId: errorLogId });
  }, [analytics, error, errorLogId]);

  const accent = accentTokens[selectedModule];
  const moduleMetrics = data ? getModuleMetrics(selectedModule, data) : [];
  const automations = useMemo(() => (data ? aggregateAutomations(data) : []), [data]);
  const orchestratorAlerts = data?.edtech.alerts ?? [];
  const billingCycles = data?.saas.billingCycles ?? [];
  const clearFilters = useCallback(() => setFilters({ dateRange: 'last_30', segment: null, channel: null }), [setFilters]);
  const handleRequestDeck = useCallback(() => {
    push({ title: 'Capability deck requested', description: 'We will send the full portfolio within 5 minutes.', tone: 'info' });
  }, [push]);

  const moduleContent = useMemo(() => {
    if (!data) return null;
    switch (selectedModule) {
      case 'saas':
        return <SaaSModule data={data.saas} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'commerce':
        return <CommerceModule data={data.commerce} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'corporate':
        return <CorporateModule data={data.corporate} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'customApp':
        return <CustomAppModule data={data.customApp} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'content':
        return <ContentModule data={data.content} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'edtech':
        return <EdTechModule data={data.edtech} accent={accent} metadata={data.metadata} analytics={analytics} />;
      case 'specialized':
        return <SpecializedModule data={data.specialized} accent={accent} metadata={data.metadata} analytics={analytics} />;
      default:
        return null;
    }
  }, [accent, analytics, data, selectedModule]);

  if (isLoading && !queryData) {
    return <LoadingDashboard />;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-s0)] pb-16 text-slate-900">
      <GlobalHeader
        data={data}
        selectedModule={selectedModule}
        onModuleChange={setModule}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
        theme={theme}
        toggleTheme={toggleTheme}
        direction={direction}
        setDirection={setDirection}
        onRequestDeck={handleRequestDeck}
        analytics={analytics}
      />
      <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        {error ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--warning-300)] bg-[var(--warning-50)] px-4 py-3 text-sm text-[var(--warning-700)]"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden />
              <span>
                We couldn’t refresh the dashboard data. Reference log <strong>{errorLogId}</strong> for support.
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] focus-visible:focus-ring"
            >
              Retry sync
            </button>
          </div>
        ) : null}
        <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600" aria-label="In-page navigation">
          {navigationAnchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 focus-visible:focus-ring hover:bg-slate-100/70"
            >
              {anchor.label}
            </a>
          ))}
          {isFetching ? (
            <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Refreshing
            </span>
          ) : null}
        </nav>

        <section id="insights" className="space-y-4">
          <KPIBand metrics={moduleMetrics} accentToken={accent} onInspect={(metric) => analytics.track('drill_down', { module: selectedModule, metric: metric.id })} />
          <Card metadata={data.metadata.default} className="border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-600">
            Global filters persist in the URL for sharing and remain active when navigating across modules. Query params also drive automation context in the action hub.
          </Card>
        </section>

        <section id="details" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <AutomationOrchestrator
              automations={automations}
              billingCycles={billingCycles}
              metadata={data.metadata}
              analytics={analytics}
              pushToast={push}
            />
            {moduleContent}
          </div>
          <aside className="col-span-12 lg:col-span-4 space-y-6" id="actions">
            <ActionHub
              automations={automations}
              alerts={orchestratorAlerts}
              metadata={data.metadata}
              analytics={analytics}
              pushToast={push}
            />
            <Card metadata={data.metadata.default} className="border border-[var(--surface-border)] text-xs text-slate-600">
              <h3 className="text-title-sm text-slate-900">Telemetry summary</h3>
              <p>Filters: {filters.dateRange}, {filters.segment ?? 'all segments'}, {filters.channel ?? 'global channel'}</p>
              <p>Automations in focus: {automations.length}</p>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
