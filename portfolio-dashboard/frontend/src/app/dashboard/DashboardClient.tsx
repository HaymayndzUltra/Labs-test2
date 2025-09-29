'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
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
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Check,
  ClipboardList,
  Earth,
  Minus,
  Moon,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Timer,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchPortfolioDashboard,
  type PortfolioDashboardResponse,
  type TabDefinition,
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
      className="automation-pill dashboard-pill inline-flex items-center rounded-full border border-[var(--surface-border)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--neutral-600,#5e6673)]"
      title={label}
    >
      {label}
    </span>
  );
}

function AnimatedCounter({
  id,
  value,
  formatter,
  duration = 320,
  delay = 0,
}: {
  id: string;
  value: number;
  formatter: (value: number) => string;
  duration?: number;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const previousValue = useRef<number>(value);
  const [display, setDisplay] = useState(() => formatter(value));

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(formatter(value));
      previousValue.current = value;
      return;
    }

    const start = previousValue.current;
    const target = value;
    previousValue.current = target;

    if (start === target) {
      setDisplay(formatter(target));
      return;
    }

    let animationFrame: number;
    let timeoutId: number;
    const totalDuration = duration;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

    const beginAnimation = () => {
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / totalDuration);
        const eased = easeOut(progress);
        const current = start + (target - start) * eased;
        setDisplay(formatter(current));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };
      animationFrame = requestAnimationFrame(step);
    };

    timeoutId = window.setTimeout(beginAnimation, delay);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, duration, formatter, prefersReducedMotion, value]);

  return (
    <span
      className="tabular-nums font-semibold text-[var(--neutral-900,#0b0d12)]"
      aria-live="polite"
      data-counter-id={id}
    >
      {display}
    </span>
  );
}

function AutomationSummaryGrid({
  items,
  accentToken,
  layout = 'two-column',
}: {
  items: PortfolioDashboardResponse['saas']['automation'];
  accentToken: string;
  layout?: 'two-column' | 'three-column';
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const gridClass = layout === 'three-column' ? 'lg:grid-cols-3' : 'md:grid-cols-2';
  const sliceCount = layout === 'three-column' ? 3 : 4;

  return (
    <div className={cn('grid grid-cols-1 gap-6', gridClass)}>
      {items.slice(0, sliceCount).map((automation, index) => (
        <Card
          key={automation.id}
          padding="md"
          className="automation-card flex h-full flex-col justify-between gap-4 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          style={{
            '--automation-accent': `var(${accentToken})`,
            animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms`,
          } as CSSProperties}
          data-active={automation.active}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                {automation.title}
              </p>
              <p className="text-[12px] leading-snug text-[var(--neutral-600,#5e6673)]">
                {automation.action}
              </p>
            </div>
            <span
              className="automation-toggle relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--surface-border)] bg-white/80"
              data-state={automation.active ? 'active' : 'inactive'}
              aria-label={automation.active ? 'Automation active' : 'Automation paused'}
            >
              <svg
                className="automation-check h-5 w-5 text-[var(--neutral-600,#5e6673)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="5 12 10 17 19 8" />
              </svg>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--neutral-500,#5e6673)]">
            <span className="font-medium">Owner: {automation.owner}</span>
            <StatusChip label={automation.active ? 'Live' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
            <AutomationPill label={`Trigger | ${automation.trigger}`} />
            <AutomationPill label={`Channel | ${automation.channel}`} />
            <AutomationPill label={`Cadence | ${automation.cadence}`} />
          </div>
        </Card>
      ))}
    </div>
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
}: {
  data: PortfolioDashboardResponse['corporate'];
  accent: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sourceFilters = ['All sources', 'Owned', 'Paid', 'Partner'];
  const segmentFilters = ['All segments', 'Enterprise', 'Growth', 'Expansion'];
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  const velocityGradientId = useId();

  const maxFunnelVolume = data.funnel[0]?.count ?? 1;
  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);
  const countFormatter = useCallback((value: number) => numberFormatter.format(Math.round(value)), [numberFormatter]);
  const conversionFormatter = useCallback((value: number) => `${value.toFixed(1)}%`, []);
  const funnelShades = useMemo(
    () => data.funnel.map((_, index) => `color-mix(in srgb, var(${accent}) ${78 - index * 10}%, white)`),
    [accent, data.funnel]
  );
  const leadTotal = data.leadSources.reduce((sum, segment) => sum + segment.value, 0) || 1;

  const renderDelta = (delta: number) => {
    const isPositive = delta > 0;
    const isNegative = delta < 0;
    const tone = isPositive
      ? 'text-[var(--success-600)]'
      : isNegative
      ? 'text-[var(--danger-600)]'
      : 'text-[var(--neutral-600,#5e6673)]';
    const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;
    const label = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
    return (
      <span className={cn('inline-flex items-center gap-1 text-[12px] font-semibold', tone)}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </span>
    );
  };

  return (
    <section className="space-y-8" id="corporate-panel" role="tabpanel" aria-labelledby="corporate">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] p-6 shadow-sm">
        <div className="grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-1">
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">Corporate Analytics</h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">Growth marketing & pipeline analytics</p>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-wrap items-center justify-center gap-2">
            <FilterChip
              label={`Source • ${sourceFilters[activeSourceIndex]}`}
              active
              icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />}
              onClick={() =>
                setActiveSourceIndex((index) => (index + 1) % sourceFilters.length)
              }
            />
            <FilterChip
              label={`Segment • ${segmentFilters[activeSegmentIndex]}`}
              active
              onClick={() =>
                setActiveSegmentIndex((index) => (index + 1) % segmentFilters.length)
              }
            />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
            >
              <CalendarRange className="h-4 w-4" aria-hidden />
              Last 8 weeks
            </button>
          </div>
        </div>
        <div
          className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--surface-border)] to-transparent"
          aria-hidden
        />
      </div>

      <KPIBand metrics={data.metrics} accentToken={accent} />

      <div className="grid grid-cols-12 gap-6">
        <Card
          className="col-span-12 xl:col-span-7 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Conversion funnel"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Visitors → MQL → SQL → Opportunities → Closed
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Conversion funnel</h3>
            </div>
            <Check className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <div className="space-y-4">
            {data.funnel.map((stage, index) => (
              <div
                key={stage.id}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-[18px] border border-[var(--surface-border)] bg-white/75 p-4"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 text-[13px] font-medium text-[var(--neutral-700,#384150)]">
                    {stage.stage}
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-[rgba(148,163,184,0.16)]">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${(stage.count / maxFunnelVolume) * 100}%`,
                        background: funnelShades[index] ?? `var(${accent})`,
                        transition: prefersReducedMotion ? undefined : 'width 0.32s cubic-bezier(0.2,0.8,0.2,1)',
                      }}
                    />
                  </div>
                </div>
                <div className="text-right text-[16px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                  <AnimatedCounter
                    id={`${stage.id}-volume`}
                    value={stage.count}
                    formatter={countFormatter}
                    delay={index * 240}
                  />
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <AnimatedCounter
                    id={`${stage.id}-conversion`}
                    value={stage.conversionRate}
                    formatter={conversionFormatter}
                    delay={index * 240}
                  />
                  {renderDelta(stage.delta)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="col-span-12 xl:col-span-5 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Lead source mix"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Channel performance snapshot
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Lead source mix</h3>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="mx-auto h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.leadSources}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    isAnimationActive={!prefersReducedMotion}
                    animationDuration={320}
                  >
                    {data.leadSources.map((source) => (
                      <Cell key={source.id} fill={source.color} stroke="var(--surface-s0)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${Math.round(((value as number) / leadTotal) * 100)}%`,
                      name,
                    ]}
                    contentStyle={{ borderRadius: 14, border: '1px solid var(--surface-border)' }}
                    animationDuration={prefersReducedMotion ? 0 : 120}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {data.leadSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between gap-4 whitespace-nowrap text-[13px] text-[var(--neutral-700,#384150)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-8 rounded-full"
                      style={{ background: source.color }}
                      aria-hidden
                    />
                    <span>{source.label}</span>
                  </div>
                  <span className="font-semibold text-[var(--neutral-900,#0b0d12)]">
                    {Math.round((source.value / leadTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          className="col-span-12 xl:col-span-7 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Pipeline velocity"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Weekly conversion pace
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Pipeline velocity</h3>
            </div>
            <TrendingUp className="h-5 w-5 text-[var(--neutral-500,#5e6673)]" aria-hidden />
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.velocityTrend} margin={{ left: 0, right: 20 }}>
                <defs>
                  <linearGradient id={`${velocityGradientId}-fill`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={`var(${accent})`} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={`var(${accent})`} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(94,102,115,0.18)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number, name: string) => [
                    `${Math.round(value as number)} deals`,
                    name === 'value' ? 'Velocity' : 'Target',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={`var(${accent})`}
                  strokeWidth={2}
                  fill={`url(#${velocityGradientId}-fill)`}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                />
                <Line
                  type="monotone"
                  dataKey="secondary"
                  stroke="rgba(94,102,115,0.6)"
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          className="col-span-12 xl:col-span-5 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="CAC and payback snapshot"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Efficiency highlights
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                CAC & payback snapshot
              </h3>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.cacSnapshot.map((metric) => {
              const Icon = metric.trend === 'down' ? ArrowDownRight : metric.trend === 'up' ? ArrowUpRight : Minus;
              const tone =
                metric.trend === 'down'
                  ? 'text-[var(--success-600)]'
                  : metric.trend === 'up'
                  ? 'text-[var(--danger-600)]'
                  : 'text-[var(--neutral-600,#5e6673)]';
              return (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-[var(--surface-border)] bg-white/80 p-4"
                >
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-[20px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                    {metric.value}
                  </p>
                  <div className={cn('mt-2 inline-flex items-center gap-1 text-[12px] font-semibold', tone)}>
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {metric.change != null
                      ? `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%`
                      : 'Stable'}
                  </div>
                  {metric.description ? (
                    <p className="mt-1 text-[12px] text-[var(--neutral-600,#5e6673)]">{metric.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div
        className="rounded-2xl border border-[color-mix(in srgb,var(--surface-border) 70%,transparent)] bg-[color-mix(in srgb,var(--surface-s1) 70%,var(--surface-s0))] p-6"
        role="region"
        aria-label="Executive insights"
      >
        <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-600,#5e6673)]">
          <Check className="h-4 w-4 text-[var(--success-600)]" aria-hidden /> Executive insights
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {data.insights.map((insight, index) => (
            <article
              key={insight.id}
              className="rounded-2xl border border-[var(--surface-border)] p-4 shadow-sm"
              style={{ background: `color-mix(in srgb, var(${accent}) ${10 + index * 4}%, white)` }}
            >
              <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{insight.headline}</p>
              <p className="mt-1 text-[12px] text-[var(--neutral-700,#384150)]">{insight.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <AutomationSummaryGrid items={data.automation} accentToken={accent} layout="two-column" />
    </section>
  );
}

function CustomAppModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['customApp'];
  accent: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const teamFilters = ['All teams', 'Platform', 'Growth', 'Enablement'];
  const projectFilters = ['All projects', 'Automation hub', 'AI workspace'];
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const throughputGradientId = useId();

  return (
    <section className="space-y-8" id="customApp-panel" role="tabpanel" aria-labelledby="customApp">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-s1)] p-6 shadow-sm">
        <div className="grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-1">
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">Custom Web App</h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">Productivity suite & automation</p>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-wrap items-center justify-center gap-2">
            <FilterChip
              label={`Team • ${teamFilters[activeTeamIndex]}`}
              active
              icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />}
              onClick={() =>
                setActiveTeamIndex((index) => (index + 1) % teamFilters.length)
              }
            />
            <FilterChip
              label={`Project • ${projectFilters[activeProjectIndex]}`}
              active
              onClick={() =>
                setActiveProjectIndex((index) => (index + 1) % projectFilters.length)
              }
            />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
            >
              <CalendarRange className="h-4 w-4" aria-hidden />
              Current sprint
            </button>
          </div>
        </div>
        <div
          className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--surface-border)] to-transparent"
          aria-hidden
        />
      </div>

      <KPIBand metrics={data.metrics} accentToken={accent} />

      <div className="grid grid-cols-12 gap-6">
        <Card
          className="col-span-12 xl:col-span-7 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Kanban delivery board"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Backlog → In progress → Review → Shipped
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Kanban delivery board</h3>
            </div>
          </div>
          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="flex min-w-[720px] gap-4 px-1">
              {data.kanban.map((lane, laneIndex) => (
                <div
                  key={lane.id}
                  className="kanban-column flex w-full max-w-[260px] flex-col rounded-2xl border border-[var(--surface-border)] bg-white/80"
                  style={{ background: `color-mix(in srgb, var(${accent}) ${6 + laneIndex * 4}%, white)` }}
                >
                  <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-white/70 px-4 py-3">
                    <h4 className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{lane.title}</h4>
                    <StatusChip label={lane.badge} tone="info" />
                  </div>
                  <ul className="flex flex-1 flex-col gap-3 px-4 py-4">
                    {lane.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="kanban-card rounded-2xl border border-[var(--surface-border)] bg-white/95 p-4 shadow-sm transition"
                      >
                        <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{task.title}</p>
                        <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--neutral-600,#5e6673)]">
                          <span>Owner: {task.owner}</span>
                          <span>{task.due}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                          <span>Priority: {task.priority}</span>
                          {task.automation ? (
                            <span className="text-[var(--primary-600)]">{task.automation}</span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          className="col-span-12 xl:col-span-5 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Workload distribution"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Owners vs capacity
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Workload distribution</h3>
            </div>
            <BarChart3 className="h-5 w-5 text-[var(--neutral-500,#5e6673)]" aria-hidden />
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.workloadDistribution}>
                <CartesianGrid stroke="rgba(94,102,115,0.18)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number, name: string) => [
                    `${Math.round(value as number)} tasks`,
                    name === 'value' ? 'Load' : 'Capacity',
                  ]}
                />
                <Bar
                  dataKey="secondary"
                  barSize={20}
                  radius={[10, 10, 10, 10]}
                  fill="rgba(148,163,184,0.35)"
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={320}
                />
                <Bar
                  dataKey="value"
                  barSize={20}
                  radius={[10, 10, 10, 10]}
                  fill={`var(${accent})`}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                  animationEasing="cubic-bezier(0.2,0.8,0.2,1)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          className="col-span-12 xl:col-span-7 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Idea backlog intake"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Intake triage queue
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Idea backlog intake</h3>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--surface-border)]">
            <div className="max-h-[320px] overflow-auto">
              <table className="min-w-full" aria-label="Idea backlog table">
                <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                  <tr>
                    <th className="px-4 py-3 text-left">Idea</th>
                    <th className="px-4 py-3 text-left">Owner</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                  {data.backlog.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="data-row transition"
                      style={{ '--row-accent': `var(${accent})` } as CSSProperties}
                    >
                      <td className={cn('px-4 py-[11px]', index % 2 === 0 ? 'bg-white/90' : 'bg-[var(--surface-s1)]/90')}>
                        {entry.idea}
                      </td>
                      <td className={cn('px-4 py-[11px]', index % 2 === 0 ? 'bg-white/90' : 'bg-[var(--surface-s1)]/90')}>
                        {entry.owner}
                      </td>
                      <td className={cn('px-4 py-[11px]', index % 2 === 0 ? 'bg-white/90' : 'bg-[var(--surface-s1)]/90')}>
                        {entry.status}
                      </td>
                      <td
                        className={cn(
                          'px-4 py-[11px] text-right font-semibold',
                          index % 2 === 0 ? 'bg-white/90' : 'bg-[var(--surface-s1)]/90'
                        )}
                      >
                        {entry.priority}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-right text-[11px] uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              Scroll for more
            </div>
          </div>
        </Card>

        <Card
          className="col-span-12 xl:col-span-5 flex flex-col gap-6 border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-sm"
          padding="lg"
          role="region"
          aria-label="Throughput trend"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Weekly completion trend
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Throughput trend</h3>
            </div>
            <Timer className="h-5 w-5 text-[var(--neutral-500,#5e6673)]" aria-hidden />
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.throughputTrend}>
                <defs>
                  <linearGradient id={`${throughputGradientId}-area`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={`var(${accent})`} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={`var(${accent})`} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(94,102,115,0.18)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number) => [`${Math.round(value as number)} story points`, 'Throughput']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={`var(${accent})`}
                  strokeWidth={2}
                  fill={`url(#${throughputGradientId}-area)`}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                />
                <Line
                  type="monotone"
                  dataKey="secondary"
                  stroke="rgba(94,102,115,0.6)"
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <AutomationSummaryGrid items={data.automation} accentToken={accent} layout="three-column" />

      <AutomationBuilder
        verticalAccent={accent}
        onCreate={async () => {
          await new Promise((resolve) => setTimeout(resolve, 700));
        }}
      />
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const channelFilters = ['All channels', 'Owned', 'Paid', 'Earned'];
  const formatFilters = useMemo(
    () => {
      const formats = Array.from(new Set(data.topStories.map((story) => story.format)));
      return ['All types', ...formats];
    },
    [data.topStories]
  );

  const channelMix = useMemo(() => {
    const counts = data.topStories.reduce<Record<string, number>>((accum, story) => {
      accum[story.format] = (accum[story.format] ?? 0) + 1;
      return accum;
    }, {});
    const palette = ['#fb923c', '#f97316', '#fbbf24', '#fed7aa'];
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    return Object.entries(counts).map(([label, value], index) => ({
      id: `${label}-${index}`,
      label,
      value,
      percent: total === 0 ? 0 : Math.round((value / total) * 100),
      color: palette[index % palette.length] ?? '#fb923c',
    }));
  }, [data.topStories]);

  const cadenceData = useMemo(
    () =>
      data.engagementTrend.map((point, index) => {
        const posts = Math.max(3, Math.round(point.value / 75));
        return {
          period: point.label,
          posts,
          engagement: point.value,
          sentiment: index % 3 === 0 ? '↑' : '→',
        };
      }),
    [data.engagementTrend]
  );

  const latestEngagement = data.engagementTrend[data.engagementTrend.length - 1]?.value ?? 0;

  const queueStatusMeta: Record<
    PortfolioDashboardResponse['content']['publishingQueue'][number]['status'],
    {
      label: string;
      tone: 'success' | 'info' | 'danger';
      icon: ReactNode;
      accent: string;
    }
  > = {
    ready: {
      label: 'Ready',
      tone: 'success',
      icon: <Check className="h-3.5 w-3.5" aria-hidden />,
      accent: 'var(--success-600)',
    },
    'in-review': {
      label: 'In review',
      tone: 'info',
      icon: <Timer className="h-3.5 w-3.5" aria-hidden />,
      accent: 'var(--info-600)',
    },
    blocked: {
      label: 'Blocked',
      tone: 'danger',
      icon: <Minus className="h-3.5 w-3.5" aria-hidden />,
      accent: 'var(--danger-600)',
    },
  };

  return (
    <section className="space-y-8" id="content-panel" role="tabpanel" aria-labelledby="content">
      <Card
        as="header"
        padding="md"
        className="animate-dashboard-panel border border-[var(--surface-border)]"
        role="region"
        aria-label="Content and media overview"
      >
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-5 space-y-2">
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">Content &amp; Media</h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">
              Orchestrate storytelling velocity with unified filters cascading through trendlines, tables, and automations.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Channel
                </span>
                <div className="flex flex-wrap gap-2">
                  {channelFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Type
                </span>
                <div className="flex flex-wrap gap-2">
                  {formatFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 flex flex-col items-start gap-3 lg:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/90 px-3 py-2">
              <CalendarRange className="h-4 w-4 text-[var(--vertical-content)]" aria-hidden />
              <span className="text-[13px] font-semibold text-[var(--neutral-900,#0b0d12)]">Last 30 days</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--surface-border)] px-3 py-2 text-[12px] text-[var(--neutral-600,#5e6673)]">
              <SlidersHorizontal className="h-4 w-4 text-[var(--vertical-content)]" aria-hidden />
              <span>Workspace filters pinned</span>
            </div>
          </div>
          <div className="col-span-12 h-px border-t border-dashed border-[var(--surface-border)]" aria-hidden />
        </div>
      </Card>

      <KPIBand metrics={data.metrics} accentToken={accent} />

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 xl:col-span-7 border border-[var(--surface-border)]"
          role="region"
          aria-label="Engagement trend"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                Engagement trend
              </p>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Multi-channel resonance</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Streams, reads, and watch time aggregated weekly.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">
                Latest pulse
              </span>
              <AnimatedCounter
                id="content-latest-engagement"
                value={latestEngagement}
                formatter={(value) => `${Math.round(value).toLocaleString()} interactions`}
                duration={400}
              />
            </div>
          </div>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.engagementTrend} margin={{ left: 12, right: 12, top: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="contentEngagement" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--vertical-content)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--vertical-content)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(249, 115, 22, 0.2)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} interactions`, 'Engagement']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--vertical-content)"
                  strokeWidth={2}
                  fill="url(#contentEngagement)"
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={400}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          padding="md"
          className="col-span-12 xl:col-span-5 border border-[var(--surface-border)]"
          role="region"
          aria-label="Top performing stories"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Top performing stories</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Thumbnails, window, engagement delta.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <div className="max-h-[340px] overflow-auto">
              <table className="min-w-full" aria-label="Top stories table">
                <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                  <tr>
                    <th className="px-4 py-3 text-left">Story</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Window</th>
                    <th className="px-4 py-3 text-right">Engagement</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                  {data.topStories.map((story, index) => (
                    <tr
                      key={story.id}
                      className={cn(
                        'data-row group transition hover:bg-[rgba(249,115,22,0.06)] focus-within:bg-[rgba(249,115,22,0.06)]',
                        index % 2 === 0 ? 'bg-white' : 'bg-[rgba(249,115,22,0.04)]'
                      )}
                      style={{
                        '--row-accent': 'var(--vertical-content)',
                        '--row-accent-width': '3px',
                        animationDelay: prefersReducedMotion ? undefined : `${index * 60}ms`,
                      } as CSSProperties}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(249,115,22,0.18)] to-[rgba(251,191,36,0.4)] text-[14px] font-semibold text-[var(--vertical-content)]"
                            aria-hidden
                          >
                            {story.format.slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[var(--neutral-900,#0b0d12)]" title={story.title}>
                              {story.title}
                            </p>
                            <span className="text-[12px] text-[var(--neutral-500,#5e6673)]">Status: {story.status}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--neutral-600,#5e6673)]">{story.format}</td>
                      <td className="px-4 py-3 text-[var(--neutral-600,#5e6673)]">{story.publishedAt}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--neutral-900,#0b0d12)]">
                        {story.engagement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]"
          role="region"
          aria-label="Channel mix"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Channel mix</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Share of top-performing formats.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(220px,240px)_1fr]">
            <div className="mx-auto h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelMix}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={105}
                    startAngle={90}
                    endAngle={-270}
                    stroke="#f8fafc"
                    strokeWidth={2}
                    isAnimationActive={!prefersReducedMotion}
                    animationDuration={240}
                  >
                    {channelMix.map((segment) => (
                      <Cell key={segment.id} fill={segment.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-col gap-3" aria-label="Channel mix legend">
              {channelMix.map((segment, index) => (
                <li
                  key={segment.id}
                  className="legend-chip flex items-center justify-between gap-4 rounded-xl border border-[var(--surface-border)] bg-white/85 px-3 py-2"
                  style={{ animationDelay: prefersReducedMotion ? undefined : `${index * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                      aria-hidden
                    />
                    <span className="text-[13px] text-[var(--neutral-600,#5e6673)]">{segment.label}</span>
                  </div>
                  <span className="tabular-nums text-[13px] font-semibold text-[var(--neutral-900,#0b0d12)]">
                    {segment.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card
          padding="md"
          className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]"
          role="region"
          aria-label="Content cadence versus performance"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Cadence vs. performance</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Posts published versus average engagement.</p>
            </div>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cadenceData} margin={{ left: 12, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="posts"
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  yAxisId="engagement"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number, key) =>
                    key === 'posts' ? [`${value} posts`, 'Posts'] : [`${Math.round(value)} engagement`, 'Avg engagement']
                  }
                />
                <Bar
                  yAxisId="posts"
                  dataKey="posts"
                  radius={[6, 6, 0, 0]}
                  fill="rgba(251, 146, 60, 0.45)"
                  stroke="rgba(249, 115, 22, 0.65)"
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={280}
                />
                <Line
                  yAxisId="engagement"
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--vertical-content)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={320}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 xl:col-span-7 border border-[var(--surface-border)]"
          role="region"
          aria-label="Publishing queue"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Publishing queue</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Status-aware slots sequenced by editor readiness.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {data.publishingQueue.map((item, index) => {
              const meta = queueStatusMeta[item.status];
              return (
                <li
                  key={item.id}
                  className="queue-row group relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-white/90 px-4 py-3"
                  style={{
                    animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms`,
                    '--queue-accent': meta.accent,
                  } as CSSProperties}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{item.topic}</p>
                      <p className="text-[12px] text-[var(--neutral-500,#5e6673)]">
                        Slot {item.slot} • Editor {item.editor}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'queue-status inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition',
                        meta.tone === 'success'
                          ? 'border-[var(--success-500)]/40 bg-[var(--success-50)] text-[var(--success-600)]'
                          : meta.tone === 'danger'
                          ? 'border-[var(--danger-500)]/45 bg-[var(--danger-50)] text-[var(--danger-600)]'
                          : 'border-[var(--info-500)]/40 bg-[var(--info-50)] text-[var(--info-600)]'
                      )}
                    >
                      {meta.icon}
                      {meta.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          padding="md"
          className="col-span-12 xl:col-span-5 border border-[var(--surface-border)]"
          role="region"
          aria-label="Automations"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Automation control tower</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Trigger | Channel | Cadence</p>
            </div>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {data.automation.map((automation, index) => (
              <div
                key={automation.id}
                className="automation-spotlight flex h-full flex-col justify-between rounded-xl border border-[var(--surface-border)] bg-white/90 px-4 py-3"
                style={{ animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms` }}
              >
                <div className="space-y-2">
                  <p className="text-[13px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</p>
                </div>
                <div className="mt-3 grid gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.trigger}
                  >
                    Trigger · {automation.trigger}
                  </span>
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.channel}
                  >
                    Channel · {automation.channel}
                  </span>
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.cadence}
                  >
                    Cadence · {automation.cadence}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--neutral-500,#5e6673)]">
                  <span>{automation.owner}</span>
                  <StatusChip label={automation.active ? 'Active' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function EdTechModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['edtech'];
  accent: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heatmapValues = data.activityHeatmap.values;
  const heatmapMax = useMemo(
    () => Math.max(...heatmapValues.map((entry) => entry.score), 1),
    [heatmapValues]
  );
  const peakCell = useMemo(() => {
    if (heatmapValues.length === 0) {
      return { week: '', day: '', score: 0 };
    }
    return heatmapValues.reduce((best, entry) => (entry.score > best.score ? entry : best), heatmapValues[0]);
  }, [heatmapValues]);
  const [waveComplete, setWaveComplete] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeout = window.setTimeout(() => setWaveComplete(true), 420);
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const courseFilters = useMemo(
    () => ['All courses', ...data.courses.slice(0, 3).map((course) => course.title)],
    [data.courses]
  );

  const gradeDistribution = useMemo(() => {
    const bands = [
      { id: 'a', label: 'A (90-100)', min: 90, max: 100 },
      { id: 'b', label: 'B (80-89)', min: 80, max: 89 },
      { id: 'c', label: 'C (70-79)', min: 70, max: 79 },
      { id: 'd', label: 'D (60-69)', min: 60, max: 69 },
      { id: 'e', label: 'E (<60)', min: 0, max: 59 },
    ];
    const buckets = bands.map((band) => ({ ...band, count: 0 }));
    data.courses.forEach((course) => {
      const numeric = Number.parseFloat(course.avgScore.replace('%', ''));
      const bucket = buckets.find((band) => numeric >= band.min && numeric <= band.max);
      if (bucket) {
        bucket.count += 1;
      }
    });
    const total = buckets.reduce((sum, band) => sum + band.count, 0) || 1;
    return buckets.map((band) => ({
      id: band.id,
      label: band.label,
      share: Math.round((band.count / total) * 100),
    }));
  }, [data.courses]);

  const retentionCurve = useMemo(() => {
    const totals = data.activityHeatmap.weeks.map((week) =>
      heatmapValues
        .filter((entry) => entry.week === week)
        .reduce((sum, entry) => sum + entry.score, 0)
    );
    const baseline = totals[0] || 1;
    return totals.map((value, index) => ({
      week: data.activityHeatmap.weeks[index],
      retention: Math.min(120, Math.round((value / baseline) * 100)),
    }));
  }, [data.activityHeatmap.weeks, heatmapValues]);

  const cohortFilters = ['All cohorts', 'Cohort D3', 'Cohort E7'];
  const rangeFilters = ['Last 5 weeks', 'Quarter to date'];

  return (
    <section className="space-y-8" id="edtech-panel" role="tabpanel" aria-labelledby="edtech">
      <Card
        as="header"
        padding="md"
        className="animate-dashboard-panel border border-[var(--surface-border)]"
        role="region"
        aria-label="EdTech overview"
      >
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-5 space-y-2">
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">EdTech</h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">
              Monitor cohorts, mastery, and retention readiness across the programme lifecycle.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Cohort
                </span>
                <div className="flex flex-wrap gap-2">
                  {cohortFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Course
                </span>
                <div className="flex flex-wrap gap-2">
                  {courseFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 flex flex-col items-start gap-3 lg:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/90 px-3 py-2">
              <CalendarRange className="h-4 w-4 text-[var(--vertical-edtech,#6366f1)]" aria-hidden />
              <span className="text-[13px] font-semibold text-[var(--neutral-900,#0b0d12)]">Last 5 weeks</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--surface-border)] px-3 py-2 text-[12px] text-[var(--neutral-600,#5e6673)]">
              <Sparkles className="h-4 w-4 text-[var(--vertical-edtech,#6366f1)]" aria-hidden />
              <span>Adaptive insights enabled</span>
            </div>
          </div>
          <div className="col-span-12 h-px border-t border-dashed border-[var(--surface-border)]" aria-hidden />
        </div>
      </Card>

      <KPIBand metrics={data.metrics} accentToken={accent} />

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 xl:col-span-7 border border-[var(--surface-border)]"
          role="region"
          aria-label="Program performance"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Program performance</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Enrollment, completion, average scores.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <div className="max-h-[320px] overflow-auto">
              <table className="min-w-full" aria-label="Program performance table">
                <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                  <tr>
                    <th className="px-4 py-3 text-left">Course</th>
                    <th className="px-4 py-3 text-right">Enrollment</th>
                    <th className="px-4 py-3 text-right">Completion</th>
                    <th className="px-4 py-3 text-right">Avg score</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                  {data.courses.map((course, index) => (
                    <tr
                      key={course.id}
                      className={cn(
                        'transition hover:bg-[rgba(99,102,241,0.06)] focus-within:bg-[rgba(99,102,241,0.06)]',
                        index % 2 === 0 ? 'bg-white' : 'bg-[rgba(99,102,241,0.04)]'
                      )}
                    >
                      <td className="px-4 py-2 font-semibold text-[var(--neutral-900,#0b0d12)]">{course.title}</td>
                      <td className="px-4 py-2 text-right">{course.enrollment.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{course.completion}</td>
                      <td className="px-4 py-2 text-right">{course.avgScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card
          padding="md"
          className="col-span-12 xl:col-span-5 border border-[var(--surface-border)]"
          role="region"
          aria-label="Student activity heatmap"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Student activity heatmap</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Weeks versus days with accessible ramp.</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-center" aria-label="Student activity heatmap table">
              <thead className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  <th className="px-2 py-2 text-left">Week</th>
                  {data.activityHeatmap.days.map((day) => (
                    <th key={day} className="px-2 py-2 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {data.activityHeatmap.weeks.map((week, weekIndex) => (
                  <tr key={week}>
                    <th scope="row" className="px-2 py-2 text-left font-semibold text-[var(--neutral-900,#0b0d12)]">
                      {week}
                    </th>
                    {data.activityHeatmap.days.map((day, dayIndex) => {
                      const cell = heatmapValues.find((value) => value.week === week && value.day === day);
                      const score = cell?.score ?? 0;
                      const intensity = heatmapMax === 0 ? 0 : score / heatmapMax;
                      const isPeak = peakCell.week === week && peakCell.day === day;
                      return (
                        <td
                          key={`${week}-${day}`}
                          className={cn(
                            'heatmap-cell text-[11px] font-semibold text-white',
                            !prefersReducedMotion && 'animate-heatmap',
                            isPeak && waveComplete && 'heatmap-cell-peak'
                          )}
                          style={{
                            backgroundColor: `rgba(99, 102, 241, ${(0.16 + intensity * 0.6).toFixed(2)})`,
                            animationDelay: prefersReducedMotion
                              ? undefined
                              : `${(weekIndex * data.activityHeatmap.days.length + dayIndex) * 60}ms`,
                          }}
                          tabIndex={0}
                          aria-label={`${week} ${day}: ${score} active learners`}
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
          <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-[var(--neutral-500,#5e6673)]">
            <span className="inline-flex h-3 w-8 rounded-full bg-[rgba(99,102,241,0.2)]" aria-hidden /> Low
            <span className="inline-flex h-3 w-8 rounded-full bg-[rgba(99,102,241,0.7)]" aria-hidden /> High
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]"
          role="region"
          aria-label="Assessment outcomes"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Assessment outcomes</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Grade distribution across cohorts.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {gradeDistribution.map((band) => (
              <li key={band.id} className="flex items-center gap-4">
                <span className="w-28 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  {band.label}
                </span>
                <div className="relative h-3 flex-1 rounded-full bg-[rgba(99,102,241,0.1)]">
                  <div
                    className="assessment-bar absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${band.share}%` }}
                    aria-hidden
                  />
                </div>
                <span className="tabular-nums text-[12px] font-semibold text-[var(--neutral-900,#0b0d12)]">{band.share}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          padding="md"
          className="col-span-12 lg:col-span-6 border border-[var(--surface-border)]"
          role="region"
          aria-label="Cohort retention curve"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Cohort retention curve</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Week-over-week active learner retention.</p>
            </div>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionCurve} margin={{ left: 12, right: 16, top: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(99, 102, 241, 0.18)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} domain={[0, 120]} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                  formatter={(value: number) => [`${value}%`, 'Retention']}
                />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="var(--vertical-edtech,#6366f1)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {data.automation.map((automation, index) => (
          <Card
            key={automation.id}
            padding="md"
            className="intervention-card flex h-full flex-col justify-between border border-[var(--surface-border)]"
            data-active={automation.active}
            style={{ animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</h3>
              <StatusChip label={automation.active ? 'Active' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
            </div>
            <div className="mt-3 grid gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.trigger}
              >
                Trigger · {automation.trigger}
              </span>
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.channel}
              >
                Channel · {automation.channel}
              </span>
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.cadence}
              >
                Cadence · {automation.cadence}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SpecializedModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['specialized'];
  accent: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const momentumData = data.realEstate.trend;
  const expenseData = data.finance.expenses;
  const latestExpense = expenseData[expenseData.length - 1] ?? { value: 0, secondary: 0 };
  const lifecycleAutomations = useMemo(
    () =>
      [
        ...data.realEstate.automation,
        ...data.finance.automation,
        ...data.healthcare.automation,
      ].slice(0, 3),
    [data.finance.automation, data.healthcare.automation, data.realEstate.automation]
  );
  const automationSpotlights = useMemo(
    () =>
      [
        data.realEstate.automation.find((item) => item.id === 'agent-alerts'),
        data.realEstate.automation.find((item) => item.id === 'listing-drip'),
        data.healthcare.automation.find((item) => item.id === 'intake-automation'),
      ].filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [data.healthcare.automation, data.realEstate.automation]
  );

  const specializedMetrics = useMemo(
    () =>
      [
        data.realEstate.metrics.find((metric) => metric.id === 'inventory'),
        data.finance.metrics.find((metric) => metric.id === 'burn'),
        data.healthcare.metrics.find((metric) => metric.id === 'appointments'),
        data.healthcare.metrics.find((metric) => metric.id === 'show-rate'),
      ].filter((metric): metric is NonNullable<(typeof data.realEstate.metrics)[number]> => Boolean(metric)),
    [data]
  );

  const industryFilters = ['All verticals', 'Real estate', 'Finance', 'Healthcare'];
  const rangeFilters = ['Last 6 months', 'Year to date'];

  const statusTone: Record<string, 'success' | 'info' | 'warning'> = {
    Confirmed: 'success',
    'Awaiting Intake': 'warning',
    Rescheduled: 'info',
  };

  return (
    <section className="space-y-8" id="specialized-panel" role="tabpanel" aria-labelledby="specialized">
      <Card
        as="header"
        padding="md"
        className="animate-dashboard-panel border border-[var(--surface-border)]"
        role="region"
        aria-label="Specialized niches overview"
      >
        <div className="grid grid-cols-12 items-start gap-6">
          <div className="col-span-12 lg:col-span-5 space-y-2">
            <h2 className="text-[24px] font-semibold text-[var(--neutral-900,#0b0d12)]">Specialized Niches</h2>
            <p className="text-[13px] text-[var(--neutral-600,#5e6673)]">
              Synchronise market momentum, financial guardrails, and patient access workflows.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Industry
                </span>
                <div className="flex flex-wrap gap-2">
                  {industryFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  Date range
                </span>
                <div className="flex flex-wrap gap-2">
                  {rangeFilters.map((label, index) => (
                    <FilterChip key={label} label={label} active={index === 0} onClick={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 flex flex-col items-start gap-3 lg:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/90 px-3 py-2">
              <CalendarRange className="h-4 w-4 text-[var(--vertical-specialized,#0f766e)]" aria-hidden />
              <span className="text-[13px] font-semibold text-[var(--neutral-900,#0b0d12)]">Last 6 months</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--surface-border)] px-3 py-2 text-[12px] text-[var(--neutral-600,#5e6673)]">
              <Workflow className="h-4 w-4 text-[var(--vertical-specialized,#0f766e)]" aria-hidden />
              <span>Automation sync on</span>
            </div>
          </div>
          <div className="col-span-12 h-px border-t border-dashed border-[var(--surface-border)]" aria-hidden />
        </div>
      </Card>

      <KPIBand metrics={specializedMetrics} accentToken={accent} />

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 xl:col-span-7 border border-[var(--surface-border)]"
          role="region"
          aria-label="Market momentum"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Market momentum</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Listing velocity and demand signals.</p>
            </div>
          </div>
          <div className="mt-4 grid h-full gap-5" style={{ gridTemplateRows: '3fr 2fr' }}>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={momentumData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(15, 118, 110, 0.18)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                    formatter={(value: number) => [`${value}`, 'Momentum']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--vertical-specialized,#0f766e)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    isAnimationActive={!prefersReducedMotion}
                    animationDuration={360}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-hidden rounded-xl border border-[var(--surface-border)] bg-white/90">
              <table className="min-w-full" aria-label="Momentum by month">
                <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Momentum</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                  {momentumData.map((point, index) => (
                    <tr
                      key={point.label}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[rgba(15,118,110,0.04)]'}
                    >
                      <td className="px-4 py-2.5 font-semibold text-[var(--neutral-900,#0b0d12)]">{point.label}</td>
                      <td className="px-4 py-2.5 text-right">
                        <AnimatedCounter
                          id={`momentum-${point.label}`}
                          value={point.value}
                          formatter={(value) => `${Math.round(value).toLocaleString()}`}
                          duration={320}
                          delay={prefersReducedMotion ? 0 : index * 40}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card
          padding="md"
          className="col-span-12 xl:col-span-5 border border-[var(--surface-border)]"
          role="region"
          aria-label="Expense versus budget"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Expense vs. budget</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Actual spend against guardrail budgets.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px]">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={expenseData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(148, 163, 184, 0.25)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                    formatter={(value: number, key) =>
                      key === 'value' ? [`$${value}K`, 'Actual'] : [`$${value}K`, 'Budget']
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Actual"
                    stroke="var(--vertical-specialized,#0f766e)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    isAnimationActive={!prefersReducedMotion}
                    animationDuration={360}
                    animationEasing="ease-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="secondary"
                    name="Budget"
                    stroke="#1f2937"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={{ r: 3 }}
                    isAnimationActive={!prefersReducedMotion}
                    animationDuration={360}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-col gap-3 text-[13px] text-[var(--neutral-600,#5e6673)]">
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex h-3 w-3 rounded-full bg-[var(--vertical-specialized,#0f766e)]" aria-hidden />
                <span className="flex-1">Actual spend</span>
                <span className="tabular-nums font-semibold text-[var(--neutral-900,#0b0d12)]">{`${latestExpense.value.toLocaleString()}K`}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#1f2937]" aria-hidden />
                <span className="flex-1">Budget guardrail</span>
                <span className="tabular-nums font-semibold text-[var(--neutral-900,#0b0d12)]">{`${latestExpense.secondary.toLocaleString()}K`}</span>
              </li>
              <li className="flex items-start gap-3 text-[11px] text-[var(--neutral-500,#5e6673)]">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 text-[var(--vertical-specialized,#0f766e)]" aria-hidden />
                Automation flags variance &gt; 8% and dispatches alerts to FP&amp;A.
              </li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card
          padding="md"
          className="col-span-12 xl:col-span-7 border border-[var(--surface-border)]"
          role="region"
          aria-label="Appointments"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Appointments</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Patient access across omni-channel touchpoints.</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--surface-border)]">
            <div className="max-h-[320px] overflow-auto">
              <table className="min-w-full" aria-label="Appointments table">
                <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                  <tr>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Clinician</th>
                    <th className="px-4 py-3 text-left">Start</th>
                    <th className="px-4 py-3 text-left">Channel</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                  {data.healthcare.appointments.map((appointment, index) => (
                    <tr
                      key={appointment.id}
                      className={cn(
                        'transition hover:bg-[rgba(14,116,144,0.08)] focus-within:bg-[rgba(14,116,144,0.08)]',
                        index % 2 === 0 ? 'bg-white' : 'bg-[rgba(14,116,144,0.05)]'
                      )}
                    >
                      <td className="px-4 py-2.5 font-semibold text-[var(--neutral-900,#0b0d12)]">{appointment.patient}</td>
                      <td className="px-4 py-2.5">{appointment.clinician}</td>
                      <td className="px-4 py-2.5">{appointment.start}</td>
                      <td className="px-4 py-2.5">{appointment.channel}</td>
                      <td className="px-4 py-2.5 text-right">
                        <StatusChip
                          label={appointment.status}
                          tone={statusTone[appointment.status] ?? 'info'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card
          padding="md"
          className="col-span-12 xl:col-span-5 border border-[var(--surface-border)]"
          role="region"
          aria-label="Lifecycle and CRM automations"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">Lifecycle &amp; CRM automations</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">Top-running flows with trigger context.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {lifecycleAutomations.map((automation, index) => (
              <div
                key={automation.id}
                className="rounded-xl border border-[var(--surface-border)] bg-white/90 px-4 py-3"
                style={{ animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</p>
                  <StatusChip label={automation.active ? 'Active' : 'Paused'} tone={automation.active ? 'success' : 'warning'} />
                </div>
                <div className="mt-3 grid gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.trigger}
                  >
                    Trigger · {automation.trigger}
                  </span>
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.channel}
                  >
                    Channel · {automation.channel}
                  </span>
                  <span
                    className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                    title={automation.cadence}
                  >
                    Cadence · {automation.cadence}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-[12px] font-semibold text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
            >
              View all automations
            </button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {automationSpotlights.map((automation, index) => (
          <Card
            key={automation.id}
            padding="md"
            className="automation-spotlight-card flex h-full flex-col justify-between border border-[var(--surface-border)]"
            style={{ animationDelay: prefersReducedMotion ? undefined : `${index * 80}ms` }}
          >
            <div className="space-y-2">
              <h3 className="text-[16px] font-semibold text-[var(--neutral-900,#0b0d12)]">{automation.title}</h3>
              <p className="text-[12px] text-[var(--neutral-600,#5e6673)]">{automation.action}</p>
            </div>
            <div className="mt-3 grid gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--neutral-500,#5e6673)]">
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.trigger}
              >
                Trigger · {automation.trigger}
              </span>
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.channel}
              >
                Channel · {automation.channel}
              </span>
              <span
                className="automation-pill max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--surface-border)] bg-white/70 px-2 py-1"
                title={automation.cadence}
              >
                Cadence · {automation.cadence}
              </span>
            </div>
            <div className="mt-3 text-[11px] text-[var(--neutral-500,#5e6673)]">Owner: {automation.owner}</div>
          </Card>
        ))}
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
      return data.customApp.metrics;
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
  const moduleMetrics = data ? getModuleMetrics(selectedModule, data) : [];
  const isPrimaryDashboard = selectedModule === 'saas' || selectedModule === 'commerce';
  const usesInPanelKpis =
    selectedModule === 'content' || selectedModule === 'edtech' || selectedModule === 'specialized';
  const showGlobalModuleKpis =
    !isPrimaryDashboard && selectedModule !== 'corporate' && selectedModule !== 'customApp' && !usesInPanelKpis;

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
        return <CorporateModule data={data.corporate} accent={accent} />;
      case 'customApp':
        return <CustomAppModule data={data.customApp} accent={accent} />;
      case 'content':
        return <ContentModule data={data.content} accent={accent} />;
      case 'edtech':
        return <EdTechModule data={data.edtech} accent={accent} />;
      case 'specialized':
        return <SpecializedModule data={data.specialized} accent={accent} />;
      default:
        return null;
    }
  }, [accent, data, filters, selectedModule]);

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
        {showGlobalModuleKpis ? <KPIBand metrics={moduleMetrics} accentToken={accent} /> : null}
        <div className="rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] px-6 py-4 text-[12px] text-[var(--neutral-600,#5e6673)]">
          Global filters persist via query params. React Query hydrates instantly, while Zustand keeps inter-module state fast.
        </div>
        {moduleContent}
      </main>
    </div>
  );
}
