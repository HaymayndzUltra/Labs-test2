'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Sparkles,
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
import { StickyFilterBar } from '@/components/ui/StickyFilterBar';
import { Card } from '@/components/ui/Card';
import { ChartCard } from '@/components/ui/ChartCard';
import { AutomationBuilder } from '@/components/ui/AutomationBuilder';
import { StatusChip } from '@/components/ui/StatusChip';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';

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
          <h3 className="text-title-sm text-slate-900">Automation backlog</h3>
          <p className="text-xs text-slate-600">
            Active workflows with quick actions and health monitoring.
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
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                <p className="text-xs text-slate-500">Trigger: {automation.trigger}</p>
                <p className="mt-1 text-xs text-slate-600">Action: {automation.action}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">Owner: {automation.owner}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Channel: {automation.channel}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Cadence: {automation.cadence}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusChip
                  label={automation.active ? 'Active' : 'Paused'}
                  tone={automation.active ? 'success' : 'warning'}
                />
                <button
                  type="button"
                  className="inline-flex min-h-[32px] items-center gap-1 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                  aria-label={`Quick action for ${automation.title}`}
                >
                  {automation.active ? 'Pause' : 'Resume'}
                </button>
              </div>
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
  const monthlyBreakdown = data.growthTrend.slice(0, 6).map((point) => ({
    month: point.label,
    net: point.value * 0.32,
  }));
  const thousandFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });

  return (
    <div className="space-y-6" id="saas-panel" role="tabpanel" aria-labelledby="saas">
      <SectionHeader
        title="Subscription intelligence & API operations"
        subtitle="SaaS platform"
        accent={accent}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <Card
            className="flex h-full h-[400px] flex-col overflow-visible border border-[var(--surface-border)] bg-[var(--surface-s1)]"
            role="region"
            aria-label="Subscription plans"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-title-sm text-slate-900">Subscription plans</h3>
                <p className="text-xs text-slate-600">Plan, Price/Seat, Active subs, Allocated API, Overages, Churn %, Net expansion %</p>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
            </div>
            <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
              <table className="min-w-full" aria-label="Subscription plans table">
                <thead className="sticky top-0 z-10 bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-right">Price/Seat</th>
                    <th className="px-4 py-3 text-right">Active subs</th>
                    <th className="px-4 py-3 text-right">Allocated API</th>
                    <th className="px-4 py-3 text-right">Overages</th>
                    <th className="px-4 py-3 text-right">Churn %</th>
                    <th className="px-4 py-3 text-right">Net expansion %</th>
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
                      <td className="px-4 py-[11px] text-right">{plan.price}</td>
                      <td className="px-4 py-[11px] text-right">{plan.activeUsers.toLocaleString()}</td>
                      <td className="px-4 py-[11px] text-right">{plan.apiAllocation}</td>
                      <td className="px-4 py-[11px] text-right">$0</td>
                      <td className="px-4 py-[11px] text-right">{plan.churn}</td>
                      <td className="px-4 py-[11px] text-right">+12.5%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[var(--surface-s0)] text-xs text-slate-600">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Totals</td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3 text-right">{data.subscriptionPlans.reduce((a, p) => a + p.activeUsers, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3 text-right">—</td>
                    <td className="px-4 py-3 text-right">—</td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="px-4 py-2 text-right">
                      <span className="text-[11px] text-slate-500">Last updated </span>
                      <span className="text-[11px] font-semibold text-slate-800">{new Date().toLocaleDateString()}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <div className="h-full h-[400px]">
            <ChartCard
              id="saas-churn"
              title="Churn health distribution"
              description="Healthy renewals, Expansion upgrades, In-risk, Churned"
              rows={churnRows}
              columns={[
                { key: 'segment', label: 'Segment' },
                { key: 'share', label: 'Share', align: 'right' },
              ]}
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <ResponsiveContainer height={240} width="100%">
                  <PieChart>
                    <Pie dataKey="value" data={data.churnSegments} innerRadius={64} outerRadius={108} paddingAngle={3}>
                      {data.churnSegments.map((segment) => (
                        <Cell key={segment.id} fill={segment.color} stroke="#1f2937" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)', background: 'var(--surface-s1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-nowrap items-center justify-between gap-3 overflow-x-auto pb-1 text-xs font-semibold text-slate-600">
                  {data.churnSegments.map((segment) => (
                    <div key={segment.id} className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 shadow-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} aria-hidden />
                      <span>{segment.label}</span>
                      <span className="font-bold">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
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
            <div className="flex flex-col gap-5">
              <ResponsiveContainer height={320}>
                <LineChart data={data.growthTrend} margin={{ left: 12, right: 12, top: 24, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.18]} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary-500)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary-500)]" aria-hidden />
                  MRR growth (USD)
                </span>
                <span className="text-[11px] font-medium text-slate-500">18% headroom applied to highlight run-rate momentum.</span>
              </div>
            </div>
          </ChartCard>
        </div>
        <div className="col-span-12">
          <Card className="flex flex-col gap-4 border border-[var(--surface-border)] bg-[var(--surface-s1)]" role="region" aria-label="Monthly breakdown">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-title-sm text-slate-900">Monthly breakdown</h3>
                <p className="text-xs text-slate-600">Top six months without additional scrolling</p>
              </div>
              <button
                type="button"
                className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
              >
                View all months
              </button>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-[var(--surface-border)]">
              <table className="min-w-full text-sm text-slate-700" aria-label="Monthly breakdown table">
                <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                  {monthlyBreakdown.map((entry) => (
                    <tr key={entry.month} className="hover:bg-[var(--primary-50)]/40">
                      <td className="px-4 py-[11px] font-semibold text-slate-900">{entry.month}</td>
                      <td className="px-4 py-[11px] text-right">
                        <span
                          className={cn(
                            'text-xs font-semibold',
                            entry.net > 0 ? 'text-[var(--success-600)]' : entry.net < 0 ? 'text-[var(--danger-600)]' : 'text-slate-600'
                          )}
                        >
                          ${thousandFormatter.format(entry.net)}k
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title-lg text-slate-900">Growth drivers</h2>
          <p className="text-sm text-slate-600">Key metrics feeding new MRR</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Card className="flex h-full min-h-[240px] flex-col border border-[var(--surface-border)]" role="region" aria-label="Affiliates growth">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Affiliates growth</h3>
                  <p className="text-xs text-slate-600">Share of total (%)</p>
                </div>
                <Activity className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <ResponsiveContainer height={240}>
                <AreaChart data={data.growthTrend}>
                  <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                  <Area type="monotone" dataKey="value" stroke="var(--primary-500)" fill="var(--primary-500)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Card className="flex h-full min-h-[240px] flex-col border border-[var(--surface-border)]" role="region" aria-label="Top sellers">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Top sellers</h3>
                  <p className="text-xs text-slate-600">Item/SKU/Plan, Sales/Revenue, Share %</p>
                </div>
                <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="flex-1 overflow-hidden">
                <table className="min-w-full" aria-label="Top sellers table">
                  <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Item/SKU/Plan</th>
                      <th className="px-4 py-2 text-right">Sales/Revenue</th>
                      <th className="px-4 py-2 text-right">Share %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-700">
                    {[
                      { item: 'Pro Plan', revenue: '$125k', share: '35.2%' },
                      { item: 'Enterprise', revenue: '$98k', share: '27.6%' },
                      { item: 'API Access', revenue: '$67k', share: '18.9%' },
                      { item: 'Premium Support', revenue: '$45k', share: '12.7%' },
                      { item: 'Custom Integration', revenue: '$20k', share: '5.6%' },
                    ].map((seller, index) => (
                      <tr key={index} className="hover:bg-[var(--primary-50)]/40">
                        <td className="px-4 py-2 font-semibold text-slate-900">{seller.item}</td>
                        <td className="px-4 py-2 text-right">{seller.revenue}</td>
                        <td className="px-4 py-2 text-right">{seller.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                >
                  View all sellers
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title-lg text-slate-900">API health</h2>
          <p className="text-sm text-slate-600">Monitor usage, errors, and latency</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <Card className="flex h-full min-h-[240px] flex-col border border-[var(--surface-border)]" role="region" aria-label="API usage">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">API usage</h3>
                  <p className="text-xs text-slate-600">Rolling avg + peak</p>
                </div>
                <Activity className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <ResponsiveContainer height={240}>
                <LineChart data={data.apiUsageTrend}>
                  <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--primary-500)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Card className="flex h-full min-h-[240px] flex-col border border-[var(--surface-border)]" role="region" aria-label="Top endpoints">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Top endpoints</h3>
                  <p className="text-xs text-slate-600">Endpoint, Calls, Errors %, Latency p95</p>
                </div>
                <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="flex-1 overflow-hidden">
                <table className="min-w-full" aria-label="Top endpoints table">
                  <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Endpoint</th>
                      <th className="px-4 py-2 text-right">Calls</th>
                      <th className="px-4 py-2 text-right">Errors %</th>
                      <th className="px-4 py-2 text-right">Latency p95</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-700">
                    {[
                      { endpoint: '/api/users', calls: '2.1M', errors: '0.2%', latency: '45ms' },
                      { endpoint: '/api/auth', calls: '1.8M', errors: '0.1%', latency: '32ms' },
                      { endpoint: '/api/data', calls: '1.5M', errors: '0.3%', latency: '67ms' },
                      { endpoint: '/api/analytics', calls: '1.2M', errors: '0.4%', latency: '89ms' },
                      { endpoint: '/api/reports', calls: '890k', errors: '0.2%', latency: '156ms' },
                    ].map((endpoint, index) => (
                      <tr key={index} className="hover:bg-[var(--primary-50)]/40">
                        <td className="px-4 py-2 font-semibold text-slate-900">{endpoint.endpoint}</td>
                        <td className="px-4 py-2 text-right">{endpoint.calls}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={cn(
                            'text-xs font-semibold',
                            parseFloat(endpoint.errors) < 0.5 ? 'text-[var(--success-600)]' : 'text-[var(--danger-600)]'
                          )}>
                            {endpoint.errors}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">{endpoint.latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                >
                  View all endpoints
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card padding="sm" className="border border-[var(--surface-border)] bg-[var(--surface-s1)]" role="contentinfo">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span>
            Last refresh:{' '}
            <span className="font-semibold text-slate-800">
              {new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          </span>
          <span>Sources: Billing system • Product analytics • CRM</span>
        </div>
      </Card>
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
  return (
    <section id="commerce-panel" role="tabpanel" aria-labelledby="commerce" className="space-y-6">
      <SectionHeader
        title="Merchandising, orders & fulfillment"
        subtitle="E-commerce"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Top products purchased"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Top products purchased</h3>
              <p className="text-xs text-slate-600">Revenue, conversion, inventory health.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                  <th className="px-3 py-2 text-right">Conversion</th>
                  <th className="px-3 py-2 text-right">Inventory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {data.topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{product.name}</td>
                    <td className="px-3 py-[11px] text-slate-600">{product.category}</td>
                    <td className="px-3 py-[11px] text-right text-slate-600">{product.revenue}</td>
                    <td className="px-3 py-[11px] text-right text-slate-600">{product.conversionRate}</td>
                    <td className="px-3 py-[11px] text-right text-slate-600">{product.inventory.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Sales trends"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Sales trends</h3>
              <p className="text-xs text-slate-600">Seasonally adjusted GMV (USD).</p>
            </div>
          </div>
          <ResponsiveContainer height={150} className="mt-3">
            <LineChart data={data.salesTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.18]} tickFormatter={(value) => `$${value}M`} />
              <Tooltip formatter={(value: number) => [`$${value}M`, 'GMV']} contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--vertical-commerce)" strokeWidth={3} dot={{ r: 3 }} name="GMV" />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Headroom applied for clarity</div>
        </Card>

        <Card
          className="col-span-8 flex h-[220px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Monthly breakdown"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Monthly breakdown</h3>
              <p className="text-xs text-slate-600">Net contribution (USD millions).</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {data.monthlyBreakdown.map((entry) => (
              <li key={entry.month} className="flex items-center justify-between rounded-[14px] border border-[var(--surface-border)] px-3 py-2">
                <span>{entry.month}</span>
                <span className="font-semibold text-slate-900">${entry.net.toFixed(2)}M</span>
              </li>
            ))}
          </ul>
          <div className="text-right text-[11px] text-slate-500">View all in finance workspace</div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Returns and low-stock alerts"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Returns & low-stock alerts</h3>
              <p className="text-xs text-slate-600">Prioritized interventions.</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.inventoryAlerts.map((alert) => (
              <li key={alert.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.impact}</p>
                  </div>
                  <StatusChip
                    label={alert.status}
                    tone={alert.status === 'urgent' ? 'danger' : alert.status === 'monitor' ? 'warning' : 'success'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
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
  const channelRows = data.channelPerformance.map((row) => ({
    channel: row.channel,
    spend: row.spend,
    pipeline: row.pipeline,
    roi: row.roi,
  }));
  const segmentRows = data.segmentImpact.map((row) => ({
    segment: row.segment,
    influence: row.influence,
    winRate: row.winRate,
  }));

  return (
    <section id="corporate-panel" role="tabpanel" aria-labelledby="corporate" className="space-y-6">
      <SectionHeader
        title="Growth marketing & pipeline analytics"
        subtitle="Corporate analytics"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Conversion campaigns"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Conversion campaigns</h3>
              <p className="text-xs text-slate-600">Spend vs pipeline creation (USD, headroom 15%).</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <ResponsiveContainer height={140} className="mt-2">
            <BarChart data={data.conversionCampaigns} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, (dataMax: number) => dataMax * 1.2]}
                tickFormatter={(value) => `${value.toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toFixed(1)}M`, name === 'value' ? 'Spend' : 'Pipeline']}
                contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
              />
              <Bar dataKey="value" fill="var(--vertical-corporate)" radius={[10, 10, 0, 0]} name="Spend" />
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="var(--primary-600)"
                strokeWidth={3}
                dot={{ r: 3 }}
                name="Pipeline"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--vertical-corporate)]" aria-hidden />
              Spend
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary-600)]" aria-hidden />
              Pipeline
            </span>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Lead segments mix"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Lead segments mix</h3>
              <p className="text-xs text-slate-600">Share of qualified pipeline by source.</p>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-3 flex flex-1 flex-col justify-between">
            <ResponsiveContainer height={130}>
              <PieChart>
                <Pie data={data.leadSources} dataKey="value" innerRadius={54} outerRadius={92} paddingAngle={2}>
                  {data.leadSources.map((source) => (
                    <Cell key={source.id} fill={source.color} stroke="#1f2937" strokeWidth={1.2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Contribution']}
                  contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <ol className="mt-3 space-y-1 text-xs text-slate-600">
              {data.leadSources
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((source, index) => (
                  <li key={source.id} className="flex items-center justify-between gap-3 rounded-full bg-white/70 px-3 py-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">#{index + 1}</span>
                      <span className="font-semibold text-slate-900">{source.label}</span>
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{source.value}%</span>
                  </li>
                ))}
            </ol>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Channel performance"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Channel performance</h3>
              <p className="text-xs text-slate-600">Spend, influenced pipeline, ROI.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">Pipeline</th>
                  <th className="px-3 py-2 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {channelRows.map((row) => (
                  <tr key={row.channel} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{row.channel}</td>
                    <td className="px-3 py-[11px] text-right">{row.spend}</td>
                    <td className="px-3 py-[11px] text-right">{row.pipeline}</td>
                    <td className="px-3 py-[11px] text-right">{row.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Segment impact"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Segment impact</h3>
              <p className="text-xs text-slate-600">Influenced pipeline & win rate.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Segment</th>
                  <th className="px-3 py-2 text-right">Influence</th>
                  <th className="px-3 py-2 text-right">Win rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {segmentRows.map((row) => (
                  <tr key={row.segment} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{row.segment}</td>
                    <td className="px-3 py-[11px] text-right">{row.influence}</td>
                    <td className="px-3 py-[11px] text-right">{row.winRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Executive insights"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Executive insights</h3>
              <p className="text-xs text-slate-600">Signals curated for board briefs.</p>
            </div>
            <Check className="h-5 w-5 text-[var(--success-600)]" aria-hidden />
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.insights.map((insight) => (
              <li key={insight.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <p className="font-semibold text-slate-900">{insight.headline}</p>
                <p className="mt-1 text-xs text-slate-600">{insight.detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
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
  const laneSummaries = data.kanban.map((lane) => ({
    id: lane.id,
    title: lane.title,
    badge: lane.badge,
    total: lane.tasks.length,
  }));

  return (
    <section id="customApp-panel" role="tabpanel" aria-labelledby="customApp" className="space-y-6">
      <SectionHeader
        title="Productivity suite & automation"
        subtitle="Custom web app"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Kanban summary board"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Kanban summary board</h3>
              <p className="text-xs text-slate-600">Velocity snapshot across active lanes.</p>
            </div>
            <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
          </div>
          <div className="mt-4 grid flex-1 grid-cols-4 gap-3">
            {laneSummaries.map((lane) => (
              <div
                key={lane.id}
                className="flex flex-col justify-between rounded-[16px] border border-[var(--surface-border)] bg-white/80 px-3 py-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-[0.12em] text-slate-600">{lane.title}</span>
                  <span className="rounded-full bg-[var(--surface-s2)] px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {lane.badge}
                  </span>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-3xl font-semibold text-slate-900">{lane.total}</p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">cards</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Usage tracking metrics"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Usage tracking metrics</h3>
              <p className="text-xs text-slate-600">Active vs engaged seats.</p>
            </div>
          </div>
          <ResponsiveContainer height={140} className="mt-3">
            <AreaChart data={data.usageTracking} margin={{ top: 12, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="usageGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--vertical-custom)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--vertical-custom)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.1]} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--vertical-custom)" fill="url(#usageGradient)" name="Active" />
              <Line type="monotone" dataKey="secondary" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} name="Engaged" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--vertical-custom)]" aria-hidden />
              Active seats
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9]" aria-hidden />
              Engaged seats
            </span>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Quickstart automations"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Quickstart automations</h3>
              <p className="text-xs text-slate-600">Adoption and impact by playbook.</p>
            </div>
          </div>
          <ResponsiveContainer height={120} className="mt-3">
            <BarChart data={data.quickstartAutomations} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip formatter={(value: number) => [`${value}% adoption`, 'Adoption']} contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Bar dataKey="adoption" fill="var(--vertical-custom)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            {data.quickstartAutomations.map((automation) => (
              <li key={automation.id} className="flex items-center justify-between gap-3 rounded-full bg-white/70 px-3 py-1">
                <span className="truncate font-semibold text-slate-900">{automation.name}</span>
                <span className="text-[11px] uppercase tracking-[0.1em] text-slate-500">{automation.impact}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Ops backlog table"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Ops backlog</h3>
              <p className="text-xs text-slate-600">Next five automation requests.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Request</th>
                  <th className="px-3 py-2 text-right">Owner</th>
                  <th className="px-3 py-2 text-right">Status</th>
                  <th className="px-3 py-2 text-right">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {data.opsBacklog.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{item.request}</td>
                    <td className="px-3 py-[11px] text-right">{item.owner}</td>
                    <td className="px-3 py-[11px] text-right">
                      <StatusChip
                        label={item.status.replace('-', ' ')}
                        tone={item.status === 'blocked' ? 'danger' : item.status === 'in-progress' ? 'info' : 'warning'}
                      />
                    </td>
                    <td className="px-3 py-[11px] text-right">{item.eta}</td>
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

function ContentModule({
  data,
  accent,
}: {
  data: PortfolioDashboardResponse['content'];
  accent: string;
}) {
  return (
    <section id="content-panel" role="tabpanel" aria-labelledby="content" className="space-y-6">
      <SectionHeader
        title="Publishing workflow & engagement"
        subtitle="Content & media"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Engagement trend"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Engagement trend</h3>
              <p className="text-xs text-slate-600">Eight-week blended engagement score.</p>
            </div>
          </div>
          <ResponsiveContainer height={150} className="mt-3">
            <LineChart data={data.engagementTrend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(251, 146, 60, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.15]} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--vertical-content)" strokeWidth={3} dot={{ r: 3 }} name="Engagement" />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Blended content engagement</div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Top performing stories"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Top performing stories</h3>
              <p className="text-xs text-slate-600">5 most recent high-signal releases.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Format</th>
                  <th className="px-3 py-2 text-left">Window</th>
                  <th className="px-3 py-2 text-right">Engagement</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {data.topStories.map((story) => (
                  <tr key={story.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{story.title}</td>
                    <td className="px-3 py-[11px] text-slate-600">{story.format}</td>
                    <td className="px-3 py-[11px] text-slate-600">{story.publishedAt}</td>
                    <td className="px-3 py-[11px] text-right text-slate-600">{story.engagement}</td>
                    <td className="px-3 py-[11px] text-right text-slate-600">{story.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Publishing queue"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Publishing queue</h3>
              <p className="text-xs text-slate-600">Next scheduled slots with health checks.</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.publishingQueue.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.topic}</p>
                    <p className="text-xs text-slate-500">{item.slot} • {item.editor}</p>
                  </div>
                  <StatusChip
                    label={item.status}
                    tone={item.status === 'ready' ? 'success' : item.status === 'blocked' ? 'danger' : 'info'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Highlights and approvals"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Highlights & approvals</h3>
              <p className="text-xs text-slate-600">Stakeholder checkpoints this week.</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.highlights.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.timestamp} • {item.owner}</p>
                  </div>
                  <StatusChip
                    label={item.status.replace('-', ' ')}
                    tone={item.status === 'approved' ? 'success' : item.status === 'needs-review' ? 'warning' : 'info'}
                  />
                </div>
              </li>
            ))}
          </ul>
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
  const heatmapMax = Math.max(...data.activityHeatmap.values.map((entry) => entry.score));

  return (
    <section id="edtech-panel" role="tabpanel" aria-labelledby="edtech" className="space-y-6">
      <SectionHeader
        title="Learning analytics & student success"
        subtitle="EdTech"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Course performance"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Course performance</h3>
              <p className="text-xs text-slate-600">Enrollment, completion, average scores.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Course</th>
                  <th className="px-3 py-2 text-right">Enrollment</th>
                  <th className="px-3 py-2 text-right">Completion</th>
                  <th className="px-3 py-2 text-right">Avg score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {data.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] font-semibold text-slate-900">{course.title}</td>
                    <td className="px-3 py-[11px] text-right">{course.enrollment.toLocaleString()}</td>
                    <td className="px-3 py-[11px] text-right">{course.completion}</td>
                    <td className="px-3 py-[11px] text-right">{course.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Student activity heatmap"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Student activity heatmap</h3>
              <p className="text-xs text-slate-600">Peak engagement by day and cohort week.</p>
            </div>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left text-slate-500">Week</th>
                  {data.activityHeatmap.days.map((day) => (
                    <th key={day} className="px-2 py-1 text-left text-slate-500">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center text-slate-700">
                {data.activityHeatmap.weeks.map((week) => (
                  <tr key={week}>
                    <th scope="row" className="px-2 py-2 text-left text-slate-500">{week}</th>
                    {data.activityHeatmap.days.map((day) => {
                      const value = data.activityHeatmap.values.find((entry) => entry.week === week && entry.day === day)?.score ?? 0;
                      const intensity = value / heatmapMax;
                      return (
                        <td
                          key={`${week}-${day}`}
                          className="px-2 py-2 font-semibold text-slate-700"
                          style={{
                            background: `rgba(244, 114, 182, ${0.18 + intensity * 0.55})`,
                            borderRadius: 12,
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Alerts"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Alerts</h3>
              <p className="text-xs text-slate-600">Student success signals without scroll.</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.alerts.map((alert) => (
              <li key={alert.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1">{alert.message}</p>
                  <StatusChip
                    label={alert.severity}
                    tone={alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Student success uplift"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Student success uplift</h3>
              <p className="text-xs text-slate-600">Graduation impact by program interventions.</p>
            </div>
          </div>
          <div className="mt-3 space-y-3">
            <p className="text-3xl font-semibold text-slate-900">{data.successSummary.uplift}</p>
            <p className="text-sm text-slate-600">{data.successSummary.narrative}</p>
            <ul className="space-y-2 text-sm text-slate-700">
              {data.successSummary.breakdown.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-[14px] border border-[var(--surface-border)] px-3 py-2">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
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
  return (
    <section id="specialized-panel" role="tabpanel" aria-labelledby="specialized" className="space-y-6">
      <SectionHeader
        title="Specialized niches"
        subtitle="Real estate, finance, healthcare"
        accent={accent}
      />

      <div className="grid grid-cols-8 gap-x-10 gap-y-6">
        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Market movements"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Market movements</h3>
              <p className="text-xs text-slate-600">Real estate listings velocity (index).</p>
            </div>
          </div>
          <ResponsiveContainer height={150} className="mt-3">
            <AreaChart data={data.realEstate.trend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="momentumGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="var(--vertical-specialized)" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="var(--vertical-specialized)" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.15]} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Area type="monotone" dataKey="value" stroke="var(--vertical-specialized)" strokeWidth={3} fill="url(#momentumGradient)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Listings momentum</div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Spend vs budget"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Spend vs budget</h3>
              <p className="text-xs text-slate-600">Finance automation keeps spend in range.</p>
            </div>
          </div>
          <ResponsiveContainer height={150} className="mt-3">
            <LineChart data={data.finance.expenses} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, (dataMax: number) => dataMax * 1.15]} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--vertical-specialized)" strokeWidth={3} dot={{ r: 3 }} name="Actual" />
              <Line type="monotone" dataKey="secondary" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} name="Budget" />
              <Legend verticalAlign="bottom" height={32} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Healthcare opportunities"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Healthcare opportunities</h3>
              <p className="text-xs text-slate-600">Multi-channel appointment readiness.</p>
            </div>
          </div>
          <div className="mt-3 flex-1 overflow-hidden rounded-[16px] border border-[var(--surface-border)]">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Patient</th>
                  <th className="px-3 py-2 text-left">Clinician</th>
                  <th className="px-3 py-2 text-left">Start</th>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)]">
                {data.healthcare.appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[var(--primary-50)]/40">
                    <td className="px-3 py-[11px] text-slate-700">{appt.patient}</td>
                    <td className="px-3 py-[11px] text-slate-700">{appt.clinician}</td>
                    <td className="px-3 py-[11px] text-slate-700">{appt.start}</td>
                    <td className="px-3 py-[11px] text-slate-700">{appt.channel}</td>
                    <td className="px-3 py-[11px] text-right text-slate-700">{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="col-span-8 flex h-[240px] flex-col justify-between border border-[var(--surface-border)] bg-[var(--surface-s1)] shadow-none xl:col-span-4"
          role="region"
          aria-label="Industry signals"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-sm text-slate-900">Industry signals</h3>
              <p className="text-xs text-slate-600">Cross-vertical strategic trends.</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.industrySignals.map((signal) => (
              <li key={signal.id} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-2.5">
                <p className="font-semibold text-slate-900">{signal.title}</p>
                <p className="text-xs text-slate-500">{signal.detail}</p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Confidence: {signal.confidence}</p>
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

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { theme, toggleTheme, direction, setDirection } = useThemeContext();
  const { selectedModule, setModule, filters, setFilters } = useDashboardStore();
  const { push } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const orgParam = params.get('org');
    const regionParam = params.get('region');
    const planParam = params.get('plan');
    const tierParam = params.get('tier');
    const sourceParam = params.get('source');
    if (moduleParam) setModule(moduleParam);
    if (dateRangeParam) setFilters({ dateRange: dateRangeParam });
    if (segmentParam) setFilters({ segment: segmentParam });
    if (channelParam) setFilters({ channel: channelParam });
    if (orgParam) setFilters({ org: orgParam });
    if (regionParam) setFilters({ region: regionParam });
    if (planParam) setFilters({ plan: planParam });
    if (tierParam) setFilters({ tier: tierParam });
    if (sourceParam) setFilters({ source: sourceParam });
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
    if (filters.org) {
      params.set('org', filters.org);
    } else {
      params.delete('org');
    }
    if (filters.region) {
      params.set('region', filters.region);
    } else {
      params.delete('region');
    }
    if (filters.plan) {
      params.set('plan', filters.plan);
    } else {
      params.delete('plan');
    }
    if (filters.tier) {
      params.set('tier', filters.tier);
    } else {
      params.delete('tier');
    }
    if (filters.source) {
      params.set('source', filters.source);
    } else {
      params.delete('source');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, selectedModule, router]);

  const accent = accentTokens[selectedModule];
  const moduleMetrics = data ? getModuleMetrics(selectedModule, data) : [];

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

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-s0)] pb-16 text-slate-900">
      <header className="border-b border-[var(--surface-border)] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Premium Multi-Category Dashboard</p>
              <h1 className="text-display-lg text-slate-900">{data.hero.title}</h1>
              <p className="max-w-3xl text-sm text-slate-600">{data.hero.description}</p>
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 focus-visible:focus-ring"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
                onClick={() => push({ title: 'Capability deck requested', description: 'We will send the full portfolio within 5 minutes.', tone: 'info' })}
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                {data.hero.cta}
              </button>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                {mounted && (
                  <button
                    type="button"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                    <span className="hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                  onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
                  aria-label={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
                >
                  <Earth className="h-4 w-4" aria-hidden />
                  <span className="hidden sm:inline">{direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}</span>
                </button>
              </div>
              <div className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 text-xs text-slate-500">
                Generated at{' '}
                {new Date(data.generatedAt).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                  timeZone: 'UTC',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <SegmentedTabs tabs={data.tabs} activeId={selectedModule} onChange={setModule} />
            </div>
            <div className="flex shrink-0 items-center gap-2 self-stretch">
              {/* Keep actions baseline with tabs; lower emphasis styles applied above */}
              {mounted && (
                <button
                  type="button"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                </button>
              )}
              <button
                type="button"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
                aria-label={direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
              >
                <Earth className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <StickyFilterBar />
        </div>
      </header>

      <main className="mx-auto max-w-[1660px] space-y-6 px-6 pb-10 pt-4">
        <div>
          <KPIBand metrics={moduleMetrics} accentToken={accent} />
        </div>
        <div className="rounded-[24px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] px-6 py-4 text-xs text-slate-500">
          Global filters persist via query params. React Query hydrates instantly, while Zustand keeps inter-module state fast.
        </div>

        {/* Main content with right rail */}
        <div className="grid gap-10 xl:grid-cols-12">
          {/* Main content area */}
          <div className="xl:col-span-8">
            {moduleContent}
          </div>

          {/* RIGHT RAIL: AUTOMATION WORKBENCH */}
          <aside
            className="space-y-6 xl:col-span-4 xl:sticky"
            style={{ top: 'calc(var(--dashboard-header, 96px) + var(--dashboard-filters, 72px) + 16px)' }}
          >
            <div className="mb-4">
              <h2 className="text-title-lg text-slate-900">Automation Workbench</h2>
              <p className="text-sm text-slate-600">Build and manage automated workflows</p>
            </div>

            {/* Automation builder (top) */}
            <AutomationBuilder 
              onCreate={async (automation) => {
                console.log('Creating automation:', automation);
              }} 
              verticalAccent={accent} 
            />
            
            {/* Automation backlog (middle) */}
            <Card className="border border-[var(--surface-border)]" role="region" aria-label="Automation backlog">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Automation backlog</h3>
                  <p className="text-xs text-slate-600">Status chips, active/paused</p>
                </div>
                <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Churn recovery playbook', metric: '+15% retention', status: 'active' },
                  { title: 'Usage optimization alerts', metric: '-8% support tickets', status: 'active' },
                  { title: 'Onboarding sequence', metric: '+22% activation', status: 'paused' },
                  { title: 'Renewal reminders', metric: '+12% renewals', status: 'active' },
                ].map((automation, index) => (
                  <div key={index} className="rounded-[16px] border border-[var(--surface-border)] px-4 py-3">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{automation.title}</span>
                      <StatusChip
                        label={automation.status}
                        tone={automation.status === 'active' ? 'success' : 'warning'}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{automation.metric}</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs font-semibold text-[var(--primary-600)] transition hover:bg-[var(--primary-50)]/70 focus-visible:focus-ring"
                    >
                      {automation.status === 'active' ? 'Pause automation' : 'Resume automation'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Efficiency showcases (bottom) */}
            <Card className="border border-[var(--surface-border)]" role="region" aria-label="Efficiency showcases">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Efficiency showcases</h3>
                  <p className="text-xs text-slate-600">Recent automation wins</p>
                </div>
                <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="space-y-3">
                <div className="rounded-[16px] bg-[var(--success-50)] px-4 py-3">
                  <div className="text-sm font-semibold text-[var(--success-700)]">+23% faster onboarding</div>
                  <div className="text-xs text-[var(--success-600)]">Automated welcome sequence</div>
                </div>
                <div className="rounded-[16px] bg-[var(--primary-50)] px-4 py-3">
                  <div className="text-sm font-semibold text-[var(--primary-700)]">-45% support load</div>
                  <div className="text-xs text-[var(--primary-600)]">Smart FAQ automation</div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
