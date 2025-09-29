'use client';

import { useEffect, useMemo, useState } from 'react';
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
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Check,
  Moon,
  Sun,
  Earth,
  Workflow,
  Activity,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchPortfolioDashboard,
  type PortfolioDashboardResponse,
  type TabDefinition,
  type MetricCard,
} from './data';
import { useDashboardStore, type DateRange, type Filters } from '@/state/dashboardStore';
import { useThemeContext } from '@/components/theme/ThemeProvider';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { KPIBand } from '@/components/ui/KPIBand';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterChip } from '@/components/ui/FilterChip';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/ui/ChartCard';
import { AutomationBuilder } from '@/components/ui/AutomationBuilder';
import { StatusChip } from '@/components/ui/StatusChip';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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

type DashboardClientProps = {
  initialData: PortfolioDashboardResponse;
};

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

type ModuleFilters = {
  filters: Filters;
};

function parseCurrencyValue(value: string): number {
  const numeric = Number(value.replace(/[^0-9.\-]/g, ''));
  if (Number.isNaN(numeric)) {
    return 0;
  }
  const hasMillion = /m/i.test(value);
  const hasThousand = /k/i.test(value);
  const multiplier = hasMillion ? 1_000_000 : hasThousand ? 1_000 : 1;
  return numeric * multiplier;
}

function formatCurrencyCompact(value: number): string {
  if (value === 0) return '—';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
    notation: value >= 1000 ? 'compact' : 'standard',
  }).format(value);
}

function getPercentValue(value: string): number {
  const numeric = Number(value.replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function AutomationSummaryGrid({
  items,
  columns = 2,
}: {
  items: PortfolioDashboardResponse['corporate']['automation'];
  columns?: 2 | 3;
}) {
  const gridTemplate = columns === 3 ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className={cn('grid gap-6', gridTemplate, 'motion-section')}>
      {items.map((automation, index) => (
        <Card
          key={automation.id}
          padding="md"
          className="automation-card h-full rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm transition"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                <p className="text-xs text-slate-600">Trigger: {automation.trigger}</p>
              </div>
              <StatusChip label={automation.active ? 'Active' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
            </div>
            <p className="text-xs text-slate-600">Action: {automation.action}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
              {[`Trigger | ${automation.trigger}`, `Channel | ${automation.channel}`, `Cadence | ${automation.cadence}`].map(
                (label) => (
                  <span key={label} className="automation-pill">{label}</span>
                ),
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SaaSModule({
  data,
  accent,
  metrics,
  filters,
}: {
  data: PortfolioDashboardResponse['saas'];
  accent: string;
  metrics: PortfolioDashboardResponse['saas']['metrics'];
} & ModuleFilters) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const moduleFilters = ['All modules', 'Billing', 'Engagement', 'Operations'];
  const planFilters = ['All plans', ...data.subscriptionPlans.map((plan) => plan.name)];
  const segmentFilters = ['All segments', 'Enterprise', 'Mid-market', 'SMB'];
  const [activeModuleFilter, setActiveModuleFilter] = useState(moduleFilters[0]);
  const [activePlanFilter, setActivePlanFilter] = useState(planFilters[0]);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState(segmentFilters[0]);

  const churnTrend = useMemo(() => {
    const baseline = data.growthTrend[0]?.value ?? 0;
    return data.growthTrend.map((point, index) => {
      const retention = Number((100 + (point.value - baseline) * 0.08).toFixed(1));
      const churnRate = Number(Math.max(1.2, 3.8 - index * 0.2).toFixed(1));
      return { label: point.label, retention, churnRate };
    });
  }, [data.growthTrend]);

  const growthRows = data.growthTrend.map((point) => ({ month: point.label, mrr: `$${point.value}K` }));
  const mrrBreakdownRows = data.subscriptionPlans.map((plan) => ({
    plan: plan.name,
    seatPrice: plan.price,
    users: plan.activeUsers.toLocaleString(),
    activation: plan.activationRate,
    share: `${Math.round((plan.activeUsers / data.subscriptionPlans.reduce((sum, item) => sum + item.activeUsers, 0)) * 100)}%`,
  }));

  const totalApiVolume = data.apiUsageTrend.reduce((sum, point) => sum + point.value, 0);
  const endpointLabels = ['Auth', 'Billing', 'Reports', 'Events', 'Webhooks', 'Exports', 'Usage', 'Integrations'];
  const endpointRows = data.apiUsageTrend.map((point, index) => {
    const share = totalApiVolume === 0 ? 0 : (point.value / totalApiVolume) * 100;
    return {
      endpoint: `/v1/${endpointLabels[index] ?? `endpoint-${index + 1}`}`,
      volume: `${point.value}M`,
      share: `${share.toFixed(1)}%`,
      trend: index % 2 === 0 ? '↑' : '→',
    };
  });

  const automationCondition = (active: boolean) => (active ? 'Signal detected' : 'Awaiting approval');

  return (
    <section className="space-y-8" id="saas-panel" role="tabpanel" aria-labelledby="saas">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] p-6 animate-dashboard-panel">
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-1">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">SaaS Overview</p>
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">
              Subscription health & platform engagement
            </h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">
              Cohort-aligned retention, plan mix, and API utilisation. Filters cascade to every insight module.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <FilterStack
              label="Module"
              options={moduleFilters}
              activeOption={activeModuleFilter}
              onSelect={setActiveModuleFilter}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-2 text-[12px] text-[var(--neutral-600,#5e6673)] lg:items-end">
            <FilterSummary label="Module" value={activeModuleFilter} />
            <FilterSummary label="Plan" value={activePlanFilter} />
            <FilterSummary label="Segment" value={activeSegmentFilter} />
            <p>
              Date range: {dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Last 30 days'} · Timezone:
              UTC
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FilterStack label="Plan" options={planFilters} activeOption={activePlanFilter} onSelect={setActivePlanFilter} />
          <FilterStack
            label="Segment"
            options={segmentFilters}
            activeOption={activeSegmentFilter}
            onSelect={setActiveSegmentFilter}
          />
          <div className="rounded-xl border border-dashed border-[var(--surface-border)] bg-white/70 px-4 py-3 text-[12px] text-[var(--neutral-600,#5e6673)]">
            Persisted filters sync to the automation orchestrator and reporting exports.
          </div>
        </div>
      </div>

      <div className="animate-dashboard-kpi">
        <KPIBand metrics={metrics} accentToken={accent} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7 border border-[var(--surface-border)]" role="region" aria-label="Subscription plans">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Subscription health</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Plan mix, activation, and churn coverage</p>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Subscription plans table">
              <thead className="sticky top-0 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Seat price</th>
                  <th className="px-4 py-3 text-right">Active users</th>
                  <th className="px-4 py-3 text-right">Activation</th>
                  <th className="px-4 py-3 text-right">Churn</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {data.subscriptionPlans.map((plan) => (
                  <tr key={plan.id} className="transition hover:bg-[rgba(59,130,246,0.05)]">
                    <td className="px-4 py-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--neutral-900,#0b0d12)]">{plan.name}</span>
                        {plan.badge ? (
                          <span className="rounded-full bg-[rgba(59,130,246,0.1)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary-600)]">
                            {plan.badge}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-[11px]">{plan.price}</td>
                    <td className="px-4 py-[11px] text-right">{plan.activeUsers.toLocaleString()}</td>
                    <td className="px-4 py-[11px] text-right">{plan.activationRate}</td>
                    <td className="px-4 py-[11px] text-right">{plan.churn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5 border border-[var(--surface-border)]" role="region" aria-label="Churn health trend">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Churn health</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">30-day retention vs. churn baseline</p>
            </div>
            <ClipboardList className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={churnTrend}>
                <defs>
                  <linearGradient id="saasRetention" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--vertical-saas)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--vertical-saas)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 8" stroke="rgba(94, 102, 115, 0.18)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number, key) => [`${value}%`, key === 'retention' ? 'Retention' : 'Churn']}
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }}
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="retention"
                  name="Retention"
                  stroke="var(--vertical-saas)"
                  fill="url(#saasRetention)"
                  strokeWidth={2}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={400}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="churnRate"
                  name="Churn"
                  stroke="var(--danger-500)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={400}
                  animationEasing="ease-in-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <ChartCard
          id="saas-growth"
          className="col-span-12 lg:col-span-8"
          title="MRR growth"
          description="Revenue intelligence"
          caption="Year-to-date MRR with cohort smoothing"
          rows={growthRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'mrr', label: 'MRR', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={320}>
            <LineChart data={data.growthTrend}>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(94, 102, 115, 0.18)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--vertical-saas)"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={420}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="col-span-12 lg:col-span-4 border border-[var(--surface-border)]" role="region" aria-label="MRR breakdown">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">MRR breakdown</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Plan contribution and activation</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="MRR breakdown table">
              <thead className="bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-right">Users</th>
                  <th className="px-4 py-3 text-right">Activation</th>
                  <th className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {mrrBreakdownRows.map((row) => (
                  <tr key={row.plan} className="transition hover:bg-[rgba(16,185,129,0.06)]">
                    <td className="px-4 py-[11px]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--neutral-900,#0b0d12)]">{row.plan}</span>
                        <span className="text-[11px] text-[var(--neutral-500,#5e6673)]">{row.seatPrice}</span>
                      </div>
                    </td>
                    <td className="px-4 py-[11px] text-right">{row.users}</td>
                    <td className="px-4 py-[11px] text-right">{row.activation}</td>
                    <td className="px-4 py-[11px] text-right">{row.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <ChartCard
          id="saas-api"
          className="col-span-12 lg:col-span-7"
          title="API usage trend"
          description="Platform operations"
          caption="Eight week rolling window with allocation bands"
          rows={data.apiUsageTrend.map((point) => ({ week: point.label, usage: `${point.value}M` }))}
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'usage', label: 'Usage', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={280}>
            <AreaChart data={data.apiUsageTrend}>
              <defs>
                <linearGradient id="saasApi" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--vertical-saas)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--vertical-saas)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(94, 102, 115, 0.18)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--vertical-saas)"
                fill="url(#saasApi)"
                strokeWidth={2}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={420}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="col-span-12 lg:col-span-5 border border-[var(--surface-border)]" role="region" aria-label="API calls by endpoint">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">API calls by endpoint</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Ranked volume and share</p>
            </div>
            <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="API endpoints table">
              <thead className="bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Endpoint</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                  <th className="px-4 py-3 text-right">Share</th>
                  <th className="px-4 py-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {endpointRows.map((row) => (
                  <tr key={row.endpoint} className="transition hover:bg-[rgba(59,130,246,0.05)]">
                    <td className="px-4 py-[11px]">
                      <span className="block truncate" title={row.endpoint}>
                        {row.endpoint}
                      </span>
                    </td>
                    <td className="px-4 py-[11px] text-right">{row.volume}</td>
                    <td className="px-4 py-[11px] text-right">{row.share}</td>
                    <td className="px-4 py-[11px] text-right" aria-label={row.trend === '↑' ? 'Increasing' : 'Stable'}>
                      {row.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <AutomationBuilder
          className="col-span-12 lg:col-span-6 h-full"
          verticalAccent={accent}
          onCreate={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        />
        <Card className="col-span-12 lg:col-span-6 flex h-full flex-col gap-4 border border-[var(--surface-border)]" role="region" aria-label="Automation orchestration">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Automation orchestration</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Trigger → Condition → Action → Channel → Cadence</p>
            </div>
            <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <ul className="grid gap-3">
            {data.automation.map((automation) => (
              <li key={automation.id} className="rounded-2xl border border-[var(--surface-border)] bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</p>
                  <StatusChip
                    label={automation.active ? 'Active' : 'Paused'}
                    tone={automation.active ? 'success' : 'warning'}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">
                  <AutomationPill label={`Trigger | ${automation.trigger}`} />
                  <AutomationPill label={`Condition | ${automationCondition(automation.active)}`} />
                  <AutomationPill label={`Action | ${automation.action}`} />
                  <AutomationPill label={`Channel | ${automation.channel}`} />
                  <AutomationPill label={`Cadence | ${automation.cadence}`} />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">
            Owners: {data.billingCycles.map((cycle) => cycle.owners.join(', ')).join(' • ')}
          </p>
        </Card>
      </div>
    </section>
  );
}

function FilterStack({
  label,
  options,
  activeOption,
  onSelect,
}: {
  label: string;
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              'dashboard-pill inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition focus-visible:focus-ring',
              activeOption === option
                ? 'border-[var(--primary-500)] bg-[rgba(59,130,246,0.12)] text-[var(--primary-600)]'
                : 'border-[var(--surface-border)] text-[var(--neutral-600,#5e6673)] hover:bg-white',
            )}
            onClick={() => onSelect(option)}
            aria-pressed={activeOption === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSummary({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[12px] text-[var(--neutral-600,#5e6673)]">
      <span className="font-semibold text-[var(--neutral-500,#5e6673)]">{label}:</span> {value}
    </span>
  );
}

function AutomationPill({ label }: { label: string }) {
  return (
    <span
      className="dashboard-pill inline-flex items-center rounded-full border border-[var(--surface-border)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--neutral-600,#5e6673)]"
      title={label}
    >
      {label}
    </span>
  );
}

function CommerceModule({
  data,
  accent,
  metrics,
  filters,
}: {
  data: PortfolioDashboardResponse['commerce'];
  accent: string;
  metrics: PortfolioDashboardResponse['commerce']['metrics'];
} & ModuleFilters) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const categoryFilters = ['All categories', ...Array.from(new Set(data.topProducts.map((product) => product.category)))];
  const regionFilters = ['Global', 'Americas', 'EMEA', 'APAC'];
  const [activeCategory, setActiveCategory] = useState(categoryFilters[0]);
  const [activeRegion, setActiveRegion] = useState(regionFilters[0]);
  const dateRangeLabel = dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Last 30 days';

  const salesRows = data.salesTrend.map((point) => ({ month: point.label, revenue: `$${point.value}M` }));
  const channelMixSeries = data.salesTrend.slice(0, 5).map((point) => point.value);
  const channelTotal = channelMixSeries.reduce((sum, value) => sum + value, 0) || 1;
  const channelColors = ['#10b981', '#34d399', '#059669', '#0d9488', '#14b8a6'];
  const channelLabels = ['Direct', 'Paid', 'Marketplace', 'Email', 'Affiliate'];
  const channelMix = channelLabels.map((label, index) => ({
    id: label,
    label,
    value: channelMixSeries[index] ?? channelMixSeries[0] ?? 0,
    color: channelColors[index % channelColors.length],
  }));
  const regionLabels = ['North America', 'Europe', 'APAC', 'LatAm'];
  const regionPerformance = regionLabels.map((label, index) => ({
    region: label,
    revenue: data.salesTrend[data.salesTrend.length - 4 + index]?.value ?? 0,
  }));

  return (
    <section className="space-y-8" id="commerce-panel" role="tabpanel" aria-labelledby="commerce">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] p-6 animate-dashboard-panel">
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-6 space-y-2">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              E-commerce Performance
            </p>
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">
              Merchandising, orders, and fulfillment health
            </h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">
              Filter by category and region to sync insights across GMV, channel mix, and automations.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col items-start gap-2 text-[12px] text-[var(--neutral-600,#5e6673)] lg:items-end">
            <FilterSummary label="Category" value={activeCategory} />
            <FilterSummary label="Region" value={activeRegion} />
            <p>Date range: {dateRangeLabel} · Inventory synced hourly</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FilterStack label="Category" options={categoryFilters} activeOption={activeCategory} onSelect={setActiveCategory} />
          <FilterStack label="Region" options={regionFilters} activeOption={activeRegion} onSelect={setActiveRegion} />
        </div>
      </div>

      <div className="animate-dashboard-kpi">
        <KPIBand metrics={metrics} accentToken={accent} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7 border border-[var(--surface-border)]" role="region" aria-label="Top products">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Top products</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Revenue, conversion, stock status</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Top products table">
              <thead className="bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {data.topProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-[rgba(16,185,129,0.08)]">
                    <td className="px-4 py-[11px] font-semibold text-[var(--neutral-900,#0b0d12)]">{product.name}</td>
                    <td className="px-4 py-[11px] text-[var(--neutral-600,#5e6673)]">{product.category}</td>
                    <td className="px-4 py-[11px] text-right text-[var(--neutral-600,#5e6673)]">{product.revenue}</td>
                    <td className="px-4 py-[11px] text-right text-[var(--neutral-600,#5e6673)]">{product.conversionRate}</td>
                    <td className="px-4 py-[11px] text-right text-[var(--neutral-600,#5e6673)]">{product.inventory}</td>
                    <td className="px-4 py-[11px] text-right text-[var(--neutral-600,#5e6673)]" aria-label={product.trend}>
                      {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5 border border-[var(--surface-border)]" role="region" aria-label="Sales trend">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Sales trend</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Weekly GMV with forecast band</p>
            </div>
            <Activity className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesTrend} margin={{ right: 40 }}>
                <CartesianGrid strokeDasharray="3 8" stroke="rgba(94, 102, 115, 0.18)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--vertical-commerce)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={420}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]" role="region" aria-label="Channel mix">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Channel mix</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Share of GMV by acquisition channel</p>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
            <div className="h-[260px] w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelMix} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={2}>
                    {channelMix.map((segment) => (
                      <Cell key={segment.id} fill={segment.color} stroke="var(--surface-s0)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, entry) => [
                      `${Math.round(((entry?.payload?.value ?? 0) / channelTotal) * 100)}%`,
                      name,
                    ]}
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {channelMix.map((segment) => (
                <div key={segment.id} className="flex items-center justify-between text-[13px] text-[var(--neutral-700,#384150)]">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-6 rounded-full"
                      style={{ background: segment.color }}
                      aria-hidden
                    />
                    <span>{segment.label}</span>
                  </div>
                  <span className="font-semibold text-[var(--neutral-900,#0b0d12)]">
                    {Math.round((segment.value / channelTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]" role="region" aria-label="Region performance">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Region performance</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Quarter-to-date GMV by region</p>
            </div>
            <Earth className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionPerformance}>
                <CartesianGrid strokeDasharray="3 8" stroke="rgba(94, 102, 115, 0.18)" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)' }} />
                <Bar
                  dataKey="revenue"
                  radius={[10, 10, 0, 0]}
                  fill="var(--vertical-commerce)"
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={380}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {data.automation.map((automation) => (
          <Card
            key={automation.id}
            className="col-span-12 lg:col-span-4 flex h-full flex-col gap-3 border border-[var(--surface-border)]"
            role="region"
            aria-label={automation.title}
          >
            <h3 className="text-[16px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</h3>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">{automation.action}</p>
            <div className="mt-1 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">
              <AutomationPill label={`Trigger | ${automation.trigger}`} />
              <AutomationPill label={`Channel | ${automation.channel}`} />
              <AutomationPill label={`Cadence | ${automation.cadence}`} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CorporateModule({
  data,
  accent,
  metrics,
  filters,
}: {
  data: PortfolioDashboardResponse['corporate'];
  accent: string;
  metrics: PortfolioDashboardResponse['corporate']['metrics'];
} & ModuleFilters) {
  const accentColor = `var(${accent})`;
  const dateRangeLabel =
    dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Last 30 days';
  const funnelPalette = [
    'rgba(29, 78, 216, 0.88)',
    'rgba(29, 78, 216, 0.72)',
    'rgba(29, 78, 216, 0.56)',
    'rgba(29, 78, 216, 0.4)',
    'rgba(29, 78, 216, 0.26)',
  ];
  const funnelRows = data.funnel.map((stage) => ({
    stage: stage.stage,
    count: stage.count.toLocaleString(),
    conversion: stage.conversion,
    delta: `${stage.delta.toFixed(1)}%`,
  }));
  const funnelDetails = data.funnel.map((stage) => {
    const deltaTone = stage.delta >= 0 ? 'text-[var(--success-600)]' : 'text-[var(--danger-600)]';
    const DeltaIcon = stage.delta >= 0 ? ArrowUpRight : ArrowDownRight;
    return {
      ...stage,
      formattedCount: stage.count.toLocaleString(),
      deltaTone,
      DeltaIcon,
    };
  });

  const velocityTrend = data.funnel.map((stage, index) => {
    const previous = data.funnel[index - 1]?.count ?? stage.count;
    const velocity = previous === 0 ? 0 : Number(((stage.count / previous) * 100).toFixed(1));
    const conversion = getPercentValue(stage.conversion);
    return { week: `W${index + 1}`, velocity, conversion, delta: stage.delta };
  });
  const velocityRows = velocityTrend.map((point) => ({
    week: point.week,
    velocity: `${point.velocity.toFixed(1)}%`,
    conversion: `${point.conversion.toFixed(1)}%`,
    delta: `${point.delta.toFixed(1)}%`,
  }));

  const pipelineMetric = metrics.find((metric) => metric.id === 'pipeline');
  const salesCycleMetric = metrics.find((metric) => metric.id === 'cycle');
  const pipelineValue = pipelineMetric ? parseCurrencyValue(pipelineMetric.value) : 0;
  const closedWon = data.funnel[data.funnel.length - 1]?.count ?? 0;
  const cacValue = closedWon === 0 ? 0 : pipelineValue / closedWon;
  const paybackDays = salesCycleMetric ? Number(salesCycleMetric.value.replace(/[^0-9]/g, '')) : 0;
  const paybackMonths = paybackDays ? Number((paybackDays / 30).toFixed(1)) : 0;

  const sourceRows = data.leadSources.map((source) => ({
    source: source.label,
    share: `${source.value}%`,
  }));

  return (
    <section className="space-y-8" id="corporate-panel" role="tabpanel" aria-labelledby="corporate">
      <Card padding="md" className="motion-section border border-[var(--surface-border)] bg-[var(--surface-s1)]">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-4 space-y-1">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              Corporate Analytics
            </p>
            <h2 className="text-[28px] font-semibold text-[var(--neutral-900,#0b0d12)]">
              Growth marketing & pipeline intelligence
            </h2>
            <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">
              Align demand, revenue, and automation insights in a single command center.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                Source
              </span>
              <span className="filter-token">{filters.channel ? filters.channel.toUpperCase() : 'GLOBAL'}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                Segment
              </span>
              <span className="filter-token">{filters.segment ? filters.segment.toUpperCase() : 'ALL SEGMENTS'}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--neutral-600,#5e6673)]">
              <Calendar className="h-4 w-4 text-[var(--neutral-500,#5e6673)]" aria-hidden />
              {dateRangeLabel}
            </span>
          </div>
        </div>
        <div className="mt-5 h-px bg-[var(--surface-border)]" aria-hidden />
      </Card>

      <div className="motion-section" aria-live="polite">
        <KPIBand metrics={metrics} accentToken={accent} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="motion-section col-span-12 xl:col-span-7 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
          role="region"
          aria-label="Conversion funnel"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Conversion funnel</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Visitors → MQL → SQL → Opportunities → Closed won</p>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="h-[320px]">
              <ResponsiveContainer>
                <BarChart data={data.funnel} layout="vertical" margin={{ left: 40, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(148, 163, 184, 0.24)" />
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={140}
                    tick={{ fontSize: 12, fill: '#475569' }}
                  />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                  <Bar dataKey="count" radius={[12, 12, 12, 12]}>
                    {data.funnel.map((stage, index) => (
                      <Cell key={stage.id} fill={funnelPalette[index % funnelPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3" aria-label="Funnel stage breakdown">
              {funnelDetails.map((stage) => (
                <li key={stage.id} className="rounded-[14px] border border-dashed border-[var(--surface-border)] bg-white/80 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{stage.stage}</span>
                    <span className="text-xs text-slate-500">{stage.conversion}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--neutral-600,#5e6673)]">
                    <span>{stage.formattedCount}</span>
                    <span className={cn('inline-flex items-center gap-1 font-medium', stage.deltaTone)}>
                      <stage.DeltaIcon className="h-3.5 w-3.5" aria-hidden />
                      {stage.delta.toFixed(1)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="sr-only" id="corporate-funnel-desc">
            Funnel table summarises volume, conversion, and deltas for each lifecycle stage.
          </div>
          <div className="rounded-[16px] border border-dashed border-[var(--surface-border)]">
            <table className="min-w-full" aria-describedby="corporate-funnel-desc">
              <thead className="sticky top-0 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Stage</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                  <th className="px-4 py-3 text-right">Δ</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {funnelRows.map((row, index) => (
                  <tr key={`${row.stage}-${index}`} className="motion-table-row">
                    <td className="px-4 py-[11px]">{row.stage}</td>
                    <td className="px-4 py-[11px] text-right">{row.count}</td>
                    <td className="px-4 py-[11px] text-right">{row.conversion}</td>
                    <td className="px-4 py-[11px] text-right">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          padding="md"
          className="motion-section col-span-12 xl:col-span-5 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
          role="region"
          aria-label="Lead source mix"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Lead source mix</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Single accent palette with accessible legend</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px]">
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={data.leadSources} innerRadius={70} outerRadius={110} paddingAngle={2}>
                    {data.leadSources.map((source) => (
                      <Cell key={source.id} fill={source.color} stroke="#0f172a" strokeWidth={1.2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <dl className="space-y-3" aria-label="Lead source legend">
              {data.leadSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between gap-3 whitespace-nowrap rounded-[14px] border border-dashed border-[var(--surface-border)] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} aria-hidden />
                    <dt className="text-sm font-medium text-slate-900">{source.label}</dt>
                  </div>
                  <dd className="text-sm font-semibold text-slate-700">{source.value}%</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[16px] border border-dashed border-[var(--surface-border)]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {sourceRows.map((row, index) => (
                  <tr key={`${row.source}-${index}`} className="motion-table-row">
                    <td className="px-4 py-[11px]">{row.source}</td>
                    <td className="px-4 py-[11px] text-right">{row.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <ChartCard
          id="pipeline-velocity"
          title="Pipeline velocity"
          description="Weekly acceleration"
          rows={velocityRows}
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'velocity', label: 'Velocity', align: 'right' },
            { key: 'conversion', label: 'Conversion', align: 'right' },
            { key: 'delta', label: 'Δ', align: 'right' },
          ]}
          className="col-span-12 lg:col-span-7 motion-section"
        >
          <ResponsiveContainer height={280}>
            <ComposedChart data={velocityTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.26)" strokeDasharray="4 6" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#475569' }}
                domain={[0, 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#475569' }}
                domain={[0, 'auto']}
              />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="velocity"
                stroke={accentColor}
                fill={accentColor}
                fillOpacity={0.18}
                strokeWidth={2}
              />
              <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="rgba(29, 78, 216, 0.8)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card
          padding="md"
          className="motion-section col-span-12 lg:col-span-5 flex flex-col gap-5 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
          role="region"
          aria-label="CAC and payback snapshot"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">CAC &amp; payback snapshot</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Benchmarks recalculated from funnel performance</p>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] border border-dashed border-[var(--surface-border)] bg-white/80 p-4">
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--neutral-500,#5e6673)]">
                Customer acquisition cost
              </dt>
              <dd className="kpi-value mt-2 text-[26px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                {formatCurrencyCompact(cacValue)}
              </dd>
              <p className="mt-1 text-[12px] text-[var(--neutral-600,#5e6673)]">
                Derived from qualified pipeline ÷ closed won volume
              </p>
            </div>
            <div className="rounded-[16px] border border-dashed border-[var(--surface-border)] bg-white/80 p-4">
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--neutral-500,#5e6673)]">
                Payback period
              </dt>
              <dd className="kpi-value mt-2 text-[26px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                {paybackMonths ? `${paybackMonths} mo` : '—'}
              </dd>
              <p className="mt-1 text-[12px] text-[var(--neutral-600,#5e6673)]">
                Based on current sales cycle ({salesCycleMetric?.value ?? '—'})
              </p>
            </div>
          </dl>
          <div className="rounded-[16px] border border-dashed border-[var(--surface-border)] bg-white/60 p-4">
            <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">
              CAC includes paid media and programmatic spend indexed to SQL conversions. Payback reflects weighted pipeline velocity.
            </p>
          </div>
        </Card>
      </div>

      <div
        className="motion-section rounded-[24px] border border-dashed border-[var(--surface-border)] p-6"
        style={{ background: `color-mix(in srgb, ${accentColor} 12%, white)` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Executive insights</h3>
            <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">One-line highlights ready for board reviews</p>
          </div>
          <Check className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {data.insights.map((insight, index) => (
            <article
              key={insight.id}
              className="insight-card rounded-[18px] border border-[var(--surface-border)] bg-white/85 p-4 shadow-sm"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-sm font-semibold text-slate-900">{insight.headline}</p>
              <p className="mt-1 text-xs text-slate-600">{insight.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <AutomationSummaryGrid items={data.automation.slice(0, 4)} />
    </section>
  );
}
function CustomAppModule({
  data,
  accent,
  metrics,
  filters,
}: {
  data: PortfolioDashboardResponse['customApp'];
  accent: string;
  metrics: MetricCard[];
} & ModuleFilters) {
  const accentColor = `var(${accent})`;
  const dateRangeLabel =
    dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Last 30 days';
  const backlogLane = data.kanban.find((lane) => lane.id === 'backlog');
  const backlogTasks = backlogLane?.tasks ?? [];
  const backlogEntries = [
    ...backlogTasks.map((task) => ({
      id: task.id,
      idea: task.title,
      owner: task.owner,
      priority: task.priority,
      due: task.due,
    })),
    ...data.backlogIdeas.map((idea, index) => ({
      id: `idea-${index}`,
      idea,
      owner: backlogTasks[index % Math.max(1, backlogTasks.length)]?.owner ?? 'PM operations',
      priority: backlogTasks[index % Math.max(1, backlogTasks.length)]?.priority ?? 'medium',
      due: 'Triage pending',
    })),
  ];

  const workloadRows = data.workloadDistribution.map((point) => ({
    owner: point.label,
    tasks: point.value,
    capacity: point.secondary,
  }));

  const throughputTrend = data.workloadDistribution.slice(0, 6).map((point, index) => ({
    week: `W${index + 1}`,
    completed: point.value,
    target: point.secondary,
  }));
  const throughputRows = throughputTrend.map((point) => ({
    week: point.week,
    completed: point.completed,
    target: point.target,
  }));

  return (
    <section className="space-y-8" id="customApp-panel" role="tabpanel" aria-labelledby="customApp">
      <Card padding="md" className="motion-section border border-[var(--surface-border)] bg-[var(--surface-s1)]">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-4 space-y-1">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              Custom web app
            </p>
            <h2 className="text-[28px] font-semibold text-[var(--neutral-900,#0b0d12)]">
              Delivery operations & automation workspace
            </h2>
            <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">
              Monitor throughput, unblock teams, and orchestrate rituals from one command surface.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                Team
              </span>
              <span className="filter-token">{filters.segment ? filters.segment.toUpperCase() : 'CORE PLATFORM'}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                Project
              </span>
              <span className="filter-token">{filters.channel ? filters.channel.toUpperCase() : 'SPRINT 24C'}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--neutral-600,#5e6673)]">
              <Calendar className="h-4 w-4 text-[var(--neutral-500,#5e6673)]" aria-hidden />
              {dateRangeLabel}
            </span>
          </div>
        </div>
        <div className="mt-5 h-px bg-[var(--surface-border)]" aria-hidden />
      </Card>

      <div className="motion-section" aria-live="polite">
        <KPIBand metrics={metrics} accentToken={accent} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="motion-section col-span-12 xl:col-span-7 flex flex-col gap-5 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
          role="region"
          aria-label="Kanban delivery board"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Kanban delivery board</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">
                Backlog → In progress → Review → Shipped. Drag with spacebar + arrows, drop with enter.
              </p>
            </div>
          </div>
          <div className="grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 xl:grid-cols-4">
            {data.kanban.map((lane, laneIndex) => (
              <div
                key={lane.id}
                className="rounded-[18px] border border-[var(--surface-border)] bg-white/85 p-4 shadow-sm"
                style={{ animationDelay: `${laneIndex * 60}ms` }}
              >
                <div
                  className="flex items-center justify-between rounded-[12px] px-3 py-2"
                  style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 16%, white)` }}
                >
                  <h4 className="text-sm font-semibold text-slate-900">{lane.title}</h4>
                  <StatusChip label={lane.badge} tone="info" />
                </div>
                <ul className="mt-4 space-y-3">
                  {lane.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="kanban-card group rounded-[16px] border border-[var(--surface-border)] bg-white/90 p-3 shadow-sm transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                        <span className="rounded-full bg-[var(--surface-s1)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                          {task.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Owner: {task.owner}</p>
                      <p className="text-xs text-slate-500">Due {task.due}</p>
                      {task.automation ? (
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                          {task.automation}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard
          id="workload-distribution"
          title="Workload distribution"
          description="Tasks vs. capacity by owner"
          rows={workloadRows}
          columns={[
            { key: 'owner', label: 'Owner' },
            { key: 'tasks', label: 'Tasks', align: 'right' },
            { key: 'capacity', label: 'Capacity', align: 'right' },
          ]}
          className="col-span-12 xl:col-span-5 motion-section"
        >
          <ResponsiveContainer height={260}>
            <BarChart data={data.workloadDistribution}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.26)" strokeDasharray="4 6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="secondary" stackId="a" fill="rgba(148, 163, 184, 0.18)" radius={[12, 12, 12, 12]} />
              <Bar dataKey="value" stackId="a" fill={accentColor} radius={[12, 12, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="motion-section col-span-12 lg:col-span-6 flex flex-col gap-4 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
          role="region"
          aria-label="Idea backlog intake"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Idea backlog intake</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Auto-tagged, triaged, and routed in realtime.</p>
            </div>
          </div>
          <div className="rounded-[16px] border border-dashed border-[var(--surface-border)]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-4 py-3 text-left">Idea</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-right">Priority</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {backlogEntries.slice(0, 8).map((entry, index) => (
                  <tr key={entry.id} className="motion-table-row">
                    <td className="px-4 py-[11px]">{entry.idea}</td>
                    <td className="px-4 py-[11px]">{entry.owner}</td>
                    <td className="px-4 py-[11px] text-right">{entry.priority}</td>
                    <td className="px-4 py-[11px] text-right">{index < backlogTasks.length ? 'Active' : 'Queued'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <ChartCard
          id="throughput-trend"
          title="Throughput trend"
          description="Completed vs. target throughput"
          rows={throughputRows}
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'completed', label: 'Completed', align: 'right' },
            { key: 'target', label: 'Target', align: 'right' },
          ]}
          className="col-span-12 lg:col-span-6 motion-section"
        >
          <ResponsiveContainer height={260}>
            <ComposedChart data={throughputTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.26)" strokeDasharray="4 6" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#475569' }} domain={[0, 'auto']} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area type="monotone" dataKey="target" stroke="rgba(148, 163, 184, 0.4)" fill="rgba(148, 163, 184, 0.18)" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke={accentColor} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="motion-section">
        <AutomationBuilder
          verticalAccent={accent}
          onCreate={async () => {
            await new Promise((resolve) => setTimeout(resolve, 700));
          }}
        />
      </div>

      <AutomationSummaryGrid items={data.automation.slice(0, 3)} columns={3} />
    </section>
  );
}
function ContentModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['content'];
  accent: string;
}) {
  const engagementRows = data.engagementTrend.map((point) => ({ period: point.label, score: point.value }));

  return (
    <div className="grid grid-cols-12 gap-6" id="content-panel" role="tabpanel" aria-labelledby="content">
      <div className="col-span-12">
        <SectionHeader
          title="Publishing workflow & engagement"
          subtitle="Content & media"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7 space-y-6">
        <ChartCard
          id="content-engagement"
          title="Engagement trend"
          description="Plays, reads, and watch time"
          rows={engagementRows}
          columns={[
            { key: 'period', label: 'Period' },
            { key: 'score', label: 'Engagement', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={280}>
            <LineChart data={data.engagementTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(251, 146, 60, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--vertical-content)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Publishing queue">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Publishing queue</h3>
              <p className="text-xs text-slate-600">Ready, review, and blocked statuses with guardrails.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {data.publishingQueue.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.topic}</p>
                    <p className="text-xs text-slate-500">Slot {item.slot} • Editor {item.editor}</p>
                  </div>
                  <StatusChip
                    label={item.status}
                    tone={
                      item.status === 'ready'
                        ? 'success'
                        : item.status === 'blocked'
                        ? 'danger'
                        : 'info'
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Top performing stories">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Top performing stories</h3>
              <p className="text-xs text-slate-600">Format, window, engagement, status.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Stories table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Format</th>
                  <th className="px-4 py-3 text-left">Window</th>
                  <th className="px-4 py-3 text-right">Engagement</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm">
                {data.topStories.map((story) => (
                  <tr key={story.id}>
                    <td className="px-4 py-[11px] font-semibold text-slate-900">{story.title}</td>
                    <td className="px-4 py-[11px] text-slate-600">{story.format}</td>
                    <td className="px-4 py-[11px] text-slate-600">{story.publishedAt}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{story.engagement}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{story.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AutomationList items={data.automation} />
      </div>
    </div>
  );
}

function EdTechModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['edtech'];
  accent: string;
}) {
  const heatmapMax = Math.max(...data.activityHeatmap.values.map((entry) => entry.score));

  return (
    <div className="grid grid-cols-12 gap-6" id="edtech-panel" role="tabpanel" aria-labelledby="edtech">
      <div className="col-span-12">
        <SectionHeader
          title="Learning analytics & student success"
          subtitle="EdTech"
          accent={accent}
        />
      </div>

      <div className="col-span-12 xl:col-span-6 space-y-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Program performance">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Program performance</h3>
              <p className="text-xs text-slate-600">Enrollment, completion, average scores.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Program performance table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-right">Enrollment</th>
                  <th className="px-4 py-3 text-right">Completion</th>
                  <th className="px-4 py-3 text-right">Avg score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm">
                {data.courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-[11px] font-semibold text-slate-900">{course.title}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.enrollment.toLocaleString()}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.completion}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{course.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AutomationList items={data.automation} />
      </div>

      <div className="col-span-12 xl:col-span-6 space-y-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Student activity heatmap">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Student activity heatmap</h3>
              <p className="text-xs text-slate-600">Keyboard navigation supported — use arrow keys to traverse.</p>
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
                      return (
                        <td
                          key={`${week}-${day}`}
                          className="px-2 py-2 text-xs font-semibold text-slate-700"
                          style={{
                            background: `rgba(107, 70, 193, ${0.2 + intensity * 0.5})`,
                            borderRadius: 12,
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

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Alerts">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Alerts</h3>
              <p className="text-xs text-slate-600">FERPA-ready alerts with remediation guidance.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {data.alerts.map((alert) => (
              <li key={alert.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <StatusChip
                  label={alert.severity}
                  tone={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}
                />
                <p className="mt-2 text-sm text-slate-700">{alert.message}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function SpecializedModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['specialized'];
  accent: string;
}) {
  const momentumRows = data.realEstate.trend.map((point) => ({ month: point.label, momentum: point.value }));
  const expenseRows = data.finance.expenses.map((point) => ({ week: point.label, actual: point.value, budget: point.secondary }));
  const roiRows = data.finance.roiBreakdown.map((item) => ({ channel: item.label, share: `${item.value}%` }));

  return (
    <div className="grid grid-cols-12 gap-6" id="specialized-panel" role="tabpanel" aria-labelledby="specialized">
      <div className="col-span-12">
        <SectionHeader
          title="Specialized niches"
          subtitle="Real estate, finance, healthcare"
          accent={accent}
        />
      </div>

      <div className="col-span-12 xl:col-span-6 space-y-6">
        <ChartCard
          id="specialized-momentum"
          title="Market momentum"
          description="Real estate listings velocity"
          rows={momentumRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'momentum', label: 'Momentum', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={220}>
            <AreaChart data={data.realEstate.trend}>
              <defs>
                <linearGradient id="momentumGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--vertical-specialized)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--vertical-specialized)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--vertical-specialized)" fill="url(#momentumGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Listings & inquiries">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Listings & inquiries</h3>
              <p className="text-xs text-slate-600">Key real estate pipeline with agent accountability.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {data.realEstate.pipeline.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{item.address}</p>
                <p className="text-xs text-slate-500">Stage: {item.stage}</p>
                <p className="text-xs text-slate-500">Inquiries: {item.inquiries}</p>
                <p className="text-xs text-slate-500">Agent: {item.agent}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-6 space-y-6">
        <ChartCard
          id="specialized-expenses"
          title="Expense vs budget"
          description="Finance automation keeps spend in check"
          rows={expenseRows}
          columns={[
            { key: 'week', label: 'Week' },
            { key: 'actual', label: 'Actual ($K)', align: 'right' },
            { key: 'budget', label: 'Budget ($K)', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={220}>
            <LineChart data={data.finance.expenses}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary-500)" strokeWidth={3} dot={false} name="Actual" />
              <Line type="monotone" dataKey="secondary" stroke="#10b981" strokeWidth={3} dot={false} name="Budget" />
              <Legend verticalAlign="bottom" height={36} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          id="specialized-roi"
          title="ROI breakdown"
          description="Attribution-safe ROI mix"
          rows={roiRows}
          columns={[
            { key: 'channel', label: 'Channel' },
            { key: 'share', label: 'Share', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={220}>
            <PieChart>
              <Pie dataKey="value" data={data.finance.roiBreakdown} innerRadius={70} outerRadius={110} paddingAngle={2}>
                {data.finance.roiBreakdown.map((segment) => (
                  <Cell key={segment.id} fill={segment.color} stroke="#1f2937" strokeWidth={1.4} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={50} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Healthcare appointments">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Healthcare appointments</h3>
              <p className="text-xs text-slate-600">Omni-channel reminders, smart rescheduling, PHI-safe.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Appointments table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Clinician</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm">
                {data.healthcare.appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="px-4 py-[11px] text-slate-700">{appt.patient}</td>
                    <td className="px-4 py-[11px] text-slate-700">{appt.clinician}</td>
                    <td className="px-4 py-[11px] text-slate-700">{appt.start}</td>
                    <td className="px-4 py-[11px] text-slate-700">{appt.channel}</td>
                    <td className="px-4 py-[11px] text-right text-slate-700">{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-6">
        <AutomationList items={data.realEstate.automation} />
        <AutomationList items={data.finance.automation} />
        <AutomationList items={data.healthcare.automation} />
      </div>
    </div>
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

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { theme, toggleTheme, direction, setDirection } = useThemeContext();
  const { selectedModule, setModule, filters, setFilters } = useDashboardStore();
  const { push } = useToast();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const { data } = useQuery({
    queryKey: ['portfolio-dashboard'],
    queryFn: fetchPortfolioDashboard,
    initialData,
  });

  useLiveMetrics();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

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

  const accent = accentTokens[selectedModule];
  const moduleMetrics = useMemo(
    () => (data ? getModuleMetrics(selectedModule, data) : []),
    [data, selectedModule],
  );
  const isPrimaryDashboard = selectedModule === 'saas' || selectedModule === 'commerce';
  const showGlobalKPIBand =
    !isPrimaryDashboard && selectedModule !== 'corporate' && selectedModule !== 'customApp';

  const moduleContent = useMemo(() => {
    if (!data) return null;
    switch (selectedModule) {
      case 'saas':
        return <SaaSModule data={data.saas} accent={accent} metrics={data.saas.metrics} filters={filters} />;
      case 'commerce':
        return (
          <CommerceModule data={data.commerce} accent={accent} metrics={data.commerce.metrics} filters={filters} />
        );
      case 'corporate':
        return <CorporateModule data={data.corporate} accent={accent} metrics={data.corporate.metrics} filters={filters} />;
      case 'customApp':
        return (
          <CustomAppModule
            data={data.customApp}
            accent={accent}
            metrics={moduleMetrics}
            filters={filters}
          />
        );
      case 'content':
        return <ContentModule data={data.content} accent={accent} />;
      case 'edtech':
        return <EdTechModule data={data.edtech} accent={accent} />;
      case 'specialized':
        return <SpecializedModule data={data.specialized} accent={accent} />;
      default:
        return null;
    }
  }, [accent, data, filters, moduleMetrics, selectedModule]);

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-s0)] pb-16 text-[var(--neutral-900,#0b0d12)]">
      <header className="border-b border-[var(--surface-border)] bg-[var(--surface-s0)]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className={cn('grid grid-cols-12 gap-6', isReady && 'animate-dashboard-header')}>
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">
                  Portfolio-grade product operations
                </p>
                <h1 className="text-[32px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                  {data.hero.title}
                </h1>
                <p className="mt-2 max-w-3xl text-[14px] text-[var(--neutral-600,#5e6673)]">{data.hero.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SegmentedTabs tabs={data.tabs} activeId={selectedModule} onChange={setModule} />
                <div className="h-px flex-1 self-center border-t border-dashed border-[var(--surface-border)]" aria-hidden />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
                  onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
                >
                  <Earth className="h-4 w-4" aria-hidden />
                  {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
                </button>
              </div>
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                onClick={() => push({ title: 'Capability deck requested', description: 'We will send the full portfolio within 5 minutes.', tone: 'info' })}
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                {data.hero.cta}
              </button>
              <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 text-[12px] text-[var(--neutral-600,#5e6673)]">
                Generated at {new Date(data.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {dateRangeOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={filters.dateRange === option.id}
                onClick={() => setFilters({ dateRange: option.id as typeof filters.dateRange })}
                icon={filters.dateRange === option.id ? <Check className="h-4 w-4" aria-hidden /> : undefined}
              />
            ))}
            {segmentOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={(filters.segment ?? 'all') === option.id}
                onClick={() => setFilters({ segment: option.id === 'all' ? null : option.id })}
              />
            ))}
            {channelOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={(filters.channel ?? 'global') === option.id}
                onClick={() => setFilters({ channel: option.id === 'global' ? null : option.id })}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {showGlobalKPIBand ? <KPIBand metrics={moduleMetrics} accentToken={accent} /> : null}
        <div className="rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] px-6 py-4 text-[12px] text-[var(--neutral-600,#5e6673)]">
          Global filters persist via query params. React Query hydrates instantly, while Zustand keeps inter-module state fast.
        </div>
        {moduleContent}
      </main>
    </div>
  );
}
