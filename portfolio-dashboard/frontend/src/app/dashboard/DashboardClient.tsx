'use client';

import { useEffect, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  LayoutGrid,
  Target,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  fetchPortfolioDashboard,
  type PortfolioDashboardResponse,
  type TabDefinition,
  type AutomationWorkflow,
} from './data';
import { useDashboardStore, type DateRange, type Filters } from '@/state/dashboardStore';
import { useThemeContext } from '@/components/theme/ThemeProvider';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { KPIBand } from '@/components/ui/KPIBand';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterChip } from '@/components/ui/FilterChip';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/ui/ChartCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { useToast } from '@/components/ui/ToastProvider';
import { AutomationOrchestrator, type AggregatedAutomation, type BillingRun } from '@/components/dashboard/AutomationOrchestrator';
import { ActionHub, type ExportRecord } from '@/components/dashboard/ActionHub';
import { trackAnalyticsEvent } from '@/lib/analytics';

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

function AutomationCallout({ module }: { module: string }) {
  return (
    <Card className="border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)]" padding="md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-title-sm text-slate-900">Automation managed centrally</h3>
          <p className="text-xs text-slate-600">
            {module} actions are now orchestrated through the unified automation hub. Review runs, recipes, and billing in the
            control center.
          </p>
        </div>
        <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
      </div>
      <a
        href="#automation-orchestrator"
        className="mt-4 inline-flex min-h-[32px] items-center gap-2 text-xs font-semibold text-[var(--primary-600)] underline"
      >
        Jump to automation orchestrator
      </a>
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

function SaaSModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['saas'];
  accent: string;
}) {
  const churnRows = data.churnSegments.map((segment) => ({
    segment: segment.label,
    share: `${segment.value}%`,
  }));

  const growthRows = data.growthTrend.map((point) => ({ month: point.label, mrr: point.value }));
  const apiRows = data.apiUsageTrend.map((point) => ({ week: point.label, usage: point.value }));

  return (
    <div className="grid grid-cols-12 gap-6" id="saas-panel" role="tabpanel" aria-labelledby="saas">
      <div className="col-span-12">
        <SectionHeader
          title="Subscription intelligence & API operations"
          subtitle="SaaS platform"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Subscription plans">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-title-sm text-slate-900">Subscription plans</h3>
              <p className="text-xs text-slate-600">
                Tiered pricing, seat allocation, and churn performance with activation benchmarks.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Subscription plans table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
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
                {data.subscriptionPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-4 py-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{plan.name}</span>
                        {plan.badge ? (
                          <span className="rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary-600)]">
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
        <ChartCard
          id="saas-churn"
          title="Churn health distribution"
          description="Colorblind-safe donut with renewal segments"
          rows={churnRows}
          columns={[
            { key: 'segment', label: 'Segment' },
            { key: 'share', label: 'Share', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={260}>
            <PieChart>
              <Pie dataKey="value" data={data.churnSegments} innerRadius={70} outerRadius={110} paddingAngle={3}>
                {data.churnSegments.map((segment) => (
                  <Cell key={segment.id} fill={segment.color} stroke="#1f2937" strokeWidth={1.5} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)', background: 'var(--surface-s1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Billing cycles">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Billing cycle orchestration</h3>
              <p className="text-xs text-slate-600">Real-time close management with owner accountability.</p>
            </div>
            <ClipboardList className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <ul className="mt-4 space-y-3">
            {data.billingCycles.map((cycle) => (
              <li key={cycle.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{cycle.label}</span>
                  <StatusChip
                    label={cycle.status}
                    tone={cycle.status === 'completed' ? 'success' : cycle.status === 'processing' ? 'info' : 'warning'}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Next run {cycle.nextRun}</p>
                <p className="text-xs text-slate-500">Owners: {cycle.owners.join(', ')}</p>
              </li>
            ))}
          </ul>
        </Card>
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
        >
          <ResponsiveContainer height={280}>
            <LineChart data={data.growthTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary-500)" strokeWidth={3} dot={{ r: 5 }} />
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
        >
          <ResponsiveContainer height={280}>
            <AreaChart data={data.apiUsageTrend}>
              <defs>
                <linearGradient id="apiGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--primary-500)" fill="url(#apiGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="col-span-12">
        <AutomationCallout module="SaaS platform" />
      </div>
    </div>
  );
}

function CommerceModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['commerce'];
  accent: string;
}) {
  const salesRows = data.salesTrend.map((point) => ({ month: point.label, revenue: point.value }));

  return (
    <div className="grid grid-cols-12 gap-6" id="commerce-panel" role="tabpanel" aria-labelledby="commerce">
      <div className="col-span-12">
        <SectionHeader
          title="Merchandising, orders & fulfillment"
          subtitle="E-commerce"
          accent={accent}
        />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Top products leaderboard">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Top products leaderboard</h3>
              <p className="text-xs text-slate-600">Revenue, conversion, inventory, and trend for hero SKUs.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Product leaderboard table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Conversion</th>
                  <th className="px-4 py-3 text-right">Inventory</th>
                  <th className="px-4 py-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm">
                {data.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-[11px] font-semibold text-slate-900">{product.name}</td>
                    <td className="px-4 py-[11px] text-slate-600">{product.category}</td>
                    <td className="px-4 py-[11px] text-slate-600">{product.revenue}</td>
                    <td className="px-4 py-[11px] text-slate-600">{product.conversionRate}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">{product.inventory}</td>
                    <td className="px-4 py-[11px] text-right text-slate-600">
                      {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-6 space-y-6">
        <ChartCard
          id="commerce-sales"
          title="Sales trends"
          description="Seasonally-adjusted GMV"
          rows={salesRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'revenue', label: 'GMV ($M)', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={260}>
            <BarChart data={data.salesTrend}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="value" radius={[12, 12, 12, 12]} fill="var(--vertical-commerce)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Operational health">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Operational health</h3>
              <p className="text-xs text-slate-600">Fulfillment SLAs, payment resilience, and support load.</p>
            </div>
            <Activity className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <ul className="mt-4 space-y-3">
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
        </Card>
      </div>

      <div className="col-span-12">
        <AutomationCallout module="E-commerce" />
      </div>
    </div>
  );
}

function CorporateModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['corporate'];
  accent: string;
}) {
  const funnelRows = data.funnel.map((stage) => ({
    stage: stage.stage,
    count: stage.count.toLocaleString(),
    conversion: stage.conversion,
    delta: `${stage.delta.toFixed(1)}%`,
  }));

  const sourceRows = data.leadSources.map((source) => ({ source: source.label, share: `${source.value}%` }));

  return (
    <div className="grid grid-cols-12 gap-6" id="corporate-panel" role="tabpanel" aria-labelledby="corporate">
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
          tone="accent"
        >
          <ResponsiveContainer height={320}>
            <BarChart data={data.funnel} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid horizontal={false} stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis type="number" hide />
              <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} width={200} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="count" fill="var(--vertical-corporate)" radius={[12, 12, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Executive insights">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Executive insights</h3>
              <p className="text-xs text-slate-600">Board-ready bullets with context tags.</p>
            </div>
            <Check className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <ul className="mt-4 space-y-3">
            {data.insights.map((insight) => (
              <li key={insight.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{insight.headline}</p>
                <p className="mt-1 text-xs text-slate-600">{insight.detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="col-span-12 lg:col-span-5 space-y-6">
        <ChartCard
          id="corporate-leads"
          title="Lead source mix"
          description="Colorblind-safe mix with accessible legend"
          rows={sourceRows}
          columns={[
            { key: 'source', label: 'Source' },
            { key: 'share', label: 'Share', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={260}>
            <PieChart>
              <Pie dataKey="value" data={data.leadSources} innerRadius={70} outerRadius={110} paddingAngle={2}>
                {data.leadSources.map((source) => (
                  <Cell key={source.id} fill={source.color} stroke="#1f2937" strokeWidth={1.4} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={60} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <AutomationCallout module="Corporate analytics" />
      </div>
    </div>
  );
}

function CustomAppModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['customApp'];
  accent: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-6" id="customApp-panel" role="tabpanel" aria-labelledby="customApp">
      <div className="col-span-12">
        <SectionHeader
          title="Productivity suite & automation"
          subtitle="Custom web app"
          accent={accent}
        />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Kanban delivery board">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Kanban delivery board</h3>
              <p className="text-xs text-slate-600">
                Keyboard accessible DnD — Space to lift, arrows to move, Enter to drop.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 overflow-x-auto pb-2 sm:grid-cols-2 xl:grid-cols-4">
            {data.kanban.map((lane) => (
              <div key={lane.id} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">{lane.title}</h4>
                  <StatusChip label={lane.badge} tone="info" />
                </div>
                <ul className="mt-3 space-y-3">
                  {lane.tasks.map((task) => (
                    <li key={task.id} className="rounded-[16px] border border-[var(--surface-border)] bg-white/80 p-3 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">Owner: {task.owner}</p>
                      <p className="text-xs text-slate-500">Due {task.due}</p>
                      {task.automation ? (
                        <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--primary-600)]">
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
      </div>

      <div className="col-span-12 xl:col-span-5 space-y-6">
        <Card className="border border-[var(--surface-border)]" role="region" aria-label="Idea backlog">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Idea backlog intake</h3>
              <p className="text-xs text-slate-600">Routing rules auto-tag and assign backlog ideas.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {data.backlogIdeas.map((idea) => (
              <li key={idea} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3 text-sm text-slate-700">
                {idea}
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard
          id="custom-workload"
          title="Workload distribution"
          description="Task load vs capacity"
          rows={data.workloadDistribution.map((point) => ({ owner: point.label, tasks: point.value, capacity: point.secondary }))}
          columns={[
            { key: 'owner', label: 'Owner' },
            { key: 'tasks', label: 'Tasks', align: 'right' },
            { key: 'capacity', label: 'Capacity', align: 'right' },
          ]}
        >
          <ResponsiveContainer height={220}>
            <BarChart data={data.workloadDistribution}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="secondary" stackId="a" fill="rgba(148, 163, 184, 0.2)" radius={[12, 12, 12, 12]} />
              <Bar dataKey="value" stackId="a" fill="var(--vertical-custom)" radius={[12, 12, 12, 12]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="col-span-12">
        <AutomationCallout module="Custom app" />
      </div>
    </div>
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

        <AutomationCallout module="Content & media" />
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

        <AutomationCallout module="EdTech" />
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

      <div className="col-span-12">
        <AutomationCallout module="Specialized niches" />
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

function buildAutomationIndex(data: PortfolioDashboardResponse): AggregatedAutomation[] {
  const moduleLabel = new Map(data.tabs.map((tab) => [tab.id, tab.label]));
  const now = Date.now();

  const automationSources: Array<{ id: TabDefinition['id']; automations: AutomationWorkflow[] }> = [
    { id: 'saas', automations: data.saas.automation },
    { id: 'commerce', automations: data.commerce.automation },
    { id: 'corporate', automations: data.corporate.automation },
    { id: 'customApp', automations: data.customApp.automation },
    { id: 'content', automations: data.content.automation },
    { id: 'edtech', automations: data.edtech.automation },
    {
      id: 'specialized',
      automations: [
        ...data.specialized.realEstate.automation,
        ...data.specialized.finance.automation,
        ...data.specialized.healthcare.automation,
      ],
    },
  ];

  return automationSources.flatMap((source, sourceIndex) => {
    const moduleName = moduleLabel.get(source.id) ?? source.id;
    return source.automations.map((automation, automationIndex) => {
      const offset = (sourceIndex + 1) * (automationIndex + 1);
      const lastRun = new Date(now - offset * 60 * 60 * 1000).toISOString();
      const nextRunDate = new Date(now + (automationIndex + 2) * 60 * 60 * 1000);
      let status: AggregatedAutomation['status'] = 'healthy';
      if (!automation.active) {
        status = 'attention';
      }
      if ((automationIndex + sourceIndex) % 7 === 0) {
        status = 'failed';
      } else if ((automationIndex + sourceIndex) % 5 === 0) {
        status = 'attention';
      }

      return {
        ...automation,
        moduleId: source.id,
        moduleLabel: moduleName,
        lastRun,
        nextRun: nextRunDate.toLocaleString(),
        status,
      } satisfies AggregatedAutomation;
    });
  });
}

function buildBillingRuns(data: PortfolioDashboardResponse): BillingRun[] {
  return data.saas.billingCycles.map((cycle) => ({
    id: cycle.id,
    label: cycle.label,
    nextRun: cycle.nextRun,
    owners: cycle.owners,
    status: cycle.status,
  }));
}

function buildExportRecords(data: PortfolioDashboardResponse): ExportRecord[] {
  const updatedAt = data.generatedAt;
  return [
    {
      id: 'portfolio-summary',
      label: 'Portfolio KPI bundle',
      description: 'Exports SaaS, Commerce, and Corporate KPIs with benchmarks.',
      updatedAt,
      status: 'ready',
    },
    {
      id: 'engagement-deep-dive',
      label: 'Engagement deep dive',
      description: 'Content, EdTech, and Specialized engagement metrics.',
      updatedAt,
      status: 'queued',
    },
    {
      id: 'automation-audit',
      label: 'Automation audit trail',
      description: 'Full automation run history with correlation IDs.',
      updatedAt,
      status: 'ready',
    },
    {
      id: 'billing-ledger',
      label: 'Billing ledger export',
      description: 'Next-cycle billing schedules with owners.',
      updatedAt,
      status: 'failed',
    },
  ];
}

function buildAlertRecords(data: PortfolioDashboardResponse) {
  return [
    ...data.edtech.alerts.map((alert) => ({
      id: alert.id,
      message: alert.message,
      severity: alert.severity,
      module: 'EdTech',
    })),
    {
      id: 'commerce-sla',
      message: 'Fulfillment SLA breached in AMER region — investigate order routing.',
      severity: 'warning',
      module: 'E-commerce',
    },
    {
      id: 'saas-credits',
      message: 'Enterprise credits dropping below safety threshold for Q4 renewals.',
      severity: 'critical',
      module: 'SaaS Platform',
    },
  ];
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { theme, toggleTheme, direction, setDirection } = useThemeContext();
  const { selectedModule, setModule, filters, setFilters } = useDashboardStore();
  const { push } = useToast();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['portfolio-dashboard'],
    queryFn: fetchPortfolioDashboard,
    initialData,
  });

  useLiveMetrics();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get('module') as TabDefinition['id'] | null;
    const dateRangeParam = params.get('dateRange') as DateRange | null;
    const segmentParam = params.get('segment');
    const channelParam = params.get('channel');
    const scopeParam = params.get('scope');
    if (moduleParam) setModule(moduleParam);
    if (dateRangeParam) setFilters({ dateRange: dateRangeParam });
    if (segmentParam) setFilters({ segment: segmentParam });
    if (channelParam) setFilters({ channel: channelParam });
    if (scopeParam === 'global' || data?.tabs.some((tab) => tab.id === scopeParam)) {
      setFilters({ scope: scopeParam as Filters['scope'] });
    }
  }, [data?.tabs, setFilters, setModule]);

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
    params.set('scope', filters.scope);
    if (filters.channel) {
      params.set('channel', filters.channel);
    } else {
      params.delete('channel');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, selectedModule, router]);

  const accent = accentTokens[selectedModule];
  const moduleMetrics = data ? getModuleMetrics(selectedModule, data) : [];
  const moduleLabels = useMemo(() => {
    if (!data) return new Map<TabDefinition['id'], string>();
    return new Map(data.tabs.map((tab) => [tab.id, tab.label]));
  }, [data]);
  const orchestratorAutomations = useMemo(() => (data ? buildAutomationIndex(data) : []), [data]);
  const billingRuns = useMemo(() => (data ? buildBillingRuns(data) : []), [data]);
  const exportRecords = useMemo(() => (data ? buildExportRecords(data) : []), [data]);
  const alertRecords = useMemo(() => (data ? buildAlertRecords(data) : []), [data]);
  const actionHubAutomations = useMemo(
    () =>
      orchestratorAutomations.slice(0, 6).map((automation) => ({
        id: automation.id,
        title: automation.title,
        status: automation.status,
        lastRun: automation.lastRun,
      })),
    [orchestratorAutomations]
  );
  const activeModule = data?.tabs.find((tab) => tab.id === selectedModule);

  const filterSummary = useMemo(() => {
    const dateLabel = dateRangeOptions.find((option) => option.id === filters.dateRange)?.label ?? 'Last 30 days';
    const segmentLabel = filters.segment
      ? segmentOptions.find((option) => option.id === filters.segment)?.label ?? filters.segment
      : 'All segments';
    const channelLabel = filters.channel
      ? channelOptions.find((option) => option.id === filters.channel)?.label ?? filters.channel
      : 'Global';
    return `${dateLabel} • ${segmentLabel} • ${channelLabel}`;
  }, [filters.channel, filters.dateRange, filters.segment]);

  const scopeTargets = useMemo(() => {
    if (!data) return [] as string[];
    if (filters.scope === 'global') {
      return data.tabs.map((tab) => tab.label);
    }
    const label = moduleLabels.get(filters.scope);
    return label ? [label] : [];
  }, [data, filters.scope, moduleLabels]);

  const moduleContent = useMemo(() => {
    if (!data) return null;
    switch (selectedModule) {
      case 'saas':
        return <SaaSModule data={data.saas} accent={accent} />;
      case 'commerce':
        return <CommerceModule data={data.commerce} accent={accent} />;
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
  }, [accent, data, selectedModule]);

  const handleModuleChange = (id: TabDefinition['id']) => {
    setModule(id);
    trackAnalyticsEvent('drill_down', { module: id, source: 'product_switcher' });
  };

  const applyFilterChange = (changes: Partial<Filters>, metadata: { name: string; value: string | null }) => {
    const scope = changes.scope ?? filters.scope;
    setFilters(changes);
    trackAnalyticsEvent('filter_change', { ...metadata, scope });
  };

  const handleDateRangeChange = (id: DateRange) => {
    applyFilterChange({ dateRange: id }, { name: 'dateRange', value: id });
  };

  const handleSegmentChange = (segmentId: string) => {
    applyFilterChange(
      { segment: segmentId === 'all' ? null : segmentId },
      { name: 'segment', value: segmentId === 'all' ? null : segmentId }
    );
  };

  const handleChannelChange = (channelId: string) => {
    applyFilterChange(
      { channel: channelId === 'global' ? null : channelId },
      { name: 'channel', value: channelId === 'global' ? null : channelId }
    );
  };

  const handleScopeChange = (scope: Filters['scope']) => {
    applyFilterChange({ scope }, { name: 'scope', value: scope });
  };

  const clearFilters = () => {
    setFilters({ dateRange: 'last_30', segment: null, channel: null, scope: 'global' });
    trackAnalyticsEvent('filter_change', { name: 'clear_all', value: 'reset', scope: 'global' });
  };

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-s0)] pb-16 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-[var(--surface-border)] bg-[var(--surface-s1)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-4">
              <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href="#insights" className="font-semibold text-[var(--primary-600)] hover:underline">
                      Portfolio
                    </a>
                  </li>
                  <li aria-hidden className="text-slate-400">
                    ›
                  </li>
                  <li aria-current="page" className="font-semibold text-slate-600">
                    {activeModule?.label ?? 'Module'}
                  </li>
                </ol>
              </nav>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Portfolio-grade product operations</p>
                <h1 className="text-display-lg text-slate-900">{data.hero.title}</h1>
                <p className="max-w-3xl text-sm text-slate-600">{data.hero.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                  onClick={() => push({ title: 'Capability deck requested', description: 'We will send the full portfolio within 5 minutes.', tone: 'info' })}
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {data.hero.cta}
                </button>
                <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-slate-600">
                  <Sun className="h-4 w-4" aria-hidden />
                  Global freshness {new Date(data.generatedAt).toLocaleString()}
                </span>
                <span className="inline-flex min-h-[32px] items-center gap-2 rounded-full bg-[var(--primary-50)] px-3 py-1 text-xs font-semibold text-[var(--primary-700)]">
                  <Target className="h-4 w-4" aria-hidden />
                  {filterSummary}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <label htmlFor="product-switcher" className="text-xs font-semibold text-slate-600">
                  Product switcher
                </label>
                <select
                  id="product-switcher"
                  className="min-h-[44px] rounded-full border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-sm text-slate-700 focus-visible:focus-ring"
                  value={selectedModule}
                  onChange={(event) => handleModuleChange(event.target.value as TabDefinition['id'])}
                >
                  {data.tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LayoutGrid className="h-4 w-4 text-[var(--primary-500)]" aria-hidden />
                <span>
                  Filter scope: {filters.scope === 'global' ? 'All modules' : moduleLabels.get(filters.scope)}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600" aria-label="In-page navigation">
            <a href="#insights" className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 hover:bg-slate-100/80 focus-visible:focus-ring">
              Insights
            </a>
            <a href="#details" className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 hover:bg-slate-100/80 focus-visible:focus-ring">
              Details
            </a>
            <a href="#actions" className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 hover:bg-slate-100/80 focus-visible:focus-ring">
              Actions
            </a>
          </nav>

          <SegmentedTabs tabs={data.tabs} activeId={selectedModule} onChange={handleModuleChange} />

          <div className="flex flex-wrap items-center gap-3" aria-label="Global filters">
            {dateRangeOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={filters.dateRange === option.id}
                onClick={() => handleDateRangeChange(option.id as DateRange)}
                icon={filters.dateRange === option.id ? <Check className="h-4 w-4" aria-hidden /> : undefined}
              />
            ))}
            {segmentOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={(filters.segment ?? 'all') === option.id}
                onClick={() => handleSegmentChange(option.id)}
              />
            ))}
            {channelOptions.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                active={(filters.channel ?? 'global') === option.id}
                onClick={() => handleChannelChange(option.id)}
              />
            ))}
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/80 focus-visible:focus-ring"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3" aria-label="Filter scope controls">
            <FilterChip
              label="Global scope"
              active={filters.scope === 'global'}
              onClick={() => handleScopeChange('global')}
            />
            {data.tabs.map((tab) => (
              <FilterChip
                key={`scope-${tab.id}`}
                label={`Scope: ${tab.label}`}
                active={filters.scope === tab.id}
                onClick={() => handleScopeChange(tab.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Filter propagation badges">
            <span className="font-semibold uppercase tracking-[0.14em] text-slate-400">Propagation</span>
            {scopeTargets.map((target) => (
              <span key={target} className="inline-flex min-h-[28px] items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {target}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section id="insights" className="space-y-6">
          <KPIBand metrics={moduleMetrics} accentToken={accent} />
          <div className="rounded-[24px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] px-6 py-4 text-xs text-slate-500">
            Global filters persist via query params. React Query hydrates instantly, while Zustand keeps inter-module state fast.
          </div>
        </section>

        <section id="details" className="mt-8 space-y-8">
          <AutomationOrchestrator automations={orchestratorAutomations} billingRuns={billingRuns} />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8 space-y-6">{moduleContent}</div>
            <aside className="col-span-12 xl:col-span-4 space-y-6" id="actions">
              <ActionHub exports={exportRecords} automations={actionHubAutomations} alerts={alertRecords} />
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
