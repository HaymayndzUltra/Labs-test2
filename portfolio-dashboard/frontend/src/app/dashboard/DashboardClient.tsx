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
  ClipboardList,
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

type LegendPayload = { value?: string; color?: string };

function InlineLegend({ payload }: { payload?: LegendPayload[] }) {
  if (!payload?.length) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-600">
      {payload.map((entry, index) => (
        <li key={entry?.value ?? index} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry?.color ?? 'var(--surface-border)' }}
            aria-hidden
          />
          <span className="font-semibold text-slate-700">{entry?.value}</span>
        </li>
      ))}
    </ul>
  );
}

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
  const churnLegend = data.churnSegments.map((segment) => ({
    value: segment.label,
    color: segment.color,
  }));

  const growthRowsChrono = data.growthTrend.map((point, index) => {
    const prevValue = index > 0 ? data.growthTrend[index - 1].value : null;
    const net = prevValue == null ? null : point.value - prevValue;
    return {
      month: point.label,
      mrr: point.value,
      net,
    };
  });
  const growthRows = [...growthRowsChrono].reverse().map((row) => ({
    month: row.month,
    mrr: row.mrr.toLocaleString(),
    net: row.net == null ? '—' : `${row.net > 0 ? '+' : ''}${row.net.toLocaleString()}`,
  }));
  const growthLegend = [{ value: 'MRR growth', color: 'var(--primary-500)' }];

  return (
    <div className="grid grid-cols-12 gap-6" id="saas-panel" role="tabpanel" aria-labelledby="saas">
      <div className="col-span-12">
        <SectionHeader
          title="Subscription intelligence & API operations"
          subtitle="SaaS platform"
          accent={accent}
        />
      </div>

      {/* PRIMARY BLOCK 1: PLANS + CHURN */}
      <div className="col-span-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Subscription table - dominant width */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="border border-[var(--surface-border)] h-[400px]" role="region" aria-label="Subscription plans">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Subscription plans</h3>
                  <p className="text-xs text-slate-600">
                    Plan, Price/Seat, Active subs, Allocated API, Overages, Churn %, Net expansion %
                  </p>
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

          {/* Churn donut - compact width */}
          <div className="col-span-12 lg:col-span-3">
            <ChartCard
              id="saas-churn"
              title="Churn health distribution"
              description="Healthy renewals, Expansion upgrades, In-risk, Churned"
              rows={churnRows}
              columns={[
                { key: 'segment', label: 'Segment' },
                { key: 'share', label: 'Share', align: 'right' },
              ]}
              className="h-[400px]"
            >
              <div className="flex h-full flex-col items-center justify-between">
                <ResponsiveContainer height={220} width="100%">
                  <PieChart>
                    <Pie dataKey="value" data={data.churnSegments} innerRadius={60} outerRadius={98} paddingAngle={3}>
                      {data.churnSegments.map((segment) => (
                        <Cell key={segment.id} fill={segment.color} stroke="#1f2937" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: '1px solid var(--surface-border)',
                        background: 'var(--surface-s1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <InlineLegend payload={churnLegend} />
              </div>
            </ChartCard>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
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

      {/* PRIMARY BLOCK 2: MRR GROWTH (KING SECTION) */}
      <div className="col-span-12">
        <ChartCard
          id="saas-growth"
          title="MRR growth"
          description="Pre-aggregated monthly recurring revenue"
          rows={growthRows}
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'mrr', label: 'MRR ($K)', align: 'right' },
            { key: 'net', label: 'Net new ($K)', align: 'right' },
          ]}
          maxDisplayRows={6}
          className="min-h-[520px]"
          toolbar={(
            <button
              type="button"
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
            >
              View full history
            </button>
          )}
        >
          <div className="flex flex-col gap-6">
            <ResponsiveContainer height={380}>
              <LineChart
                data={data.growthTrend}
                margin={{ top: 24, right: 32, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.3)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
                />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--surface-border)' }} />
                <Line type="monotone" dataKey="value" stroke="var(--primary-500)" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <InlineLegend payload={growthLegend} />
          </div>
        </ChartCard>
      </div>


      {/* SECONDARY INSIGHTS: GROWTH DRIVERS */}
      <div className="col-span-12">
        <div className="mb-4">
          <h2 className="text-title-lg text-slate-900">Growth Drivers</h2>
          <p className="text-sm text-slate-600">Key metrics driving MRR growth</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          {/* Affiliates growth (left) */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="border border-[var(--surface-border)] h-[320px]" role="region" aria-label="Affiliates growth">
              <div className="flex items-center justify-between gap-4 mb-4">
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

          {/* Top sellers (right) */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="border border-[var(--surface-border)] h-[320px]" role="region" aria-label="Top sellers">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Top sellers</h3>
                  <p className="text-xs text-slate-600">Item/SKU/Plan, Sales/Revenue, Share %</p>
                </div>
                <Sparkles className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full" aria-label="Top sellers table">
                  <thead className="sticky top-0 z-10 bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
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
              <div className="flex justify-end px-4 py-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-[var(--primary-600)] transition hover:text-[var(--primary-700)]"
                >
                  View all sellers
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* SECONDARY INSIGHTS: API HEALTH */}
      <div className="col-span-12">
        <div className="mb-4">
          <h2 className="text-title-lg text-slate-900">API Health</h2>
          <p className="text-sm text-slate-600">Monitor API performance and endpoint health</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          {/* API usage (left) */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="border border-[var(--surface-border)] h-[320px]" role="region" aria-label="API usage">
              <div className="flex items-center justify-between gap-4 mb-4">
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

          {/* Top endpoints (right) */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="border border-[var(--surface-border)] h-[320px]" role="region" aria-label="Top endpoints">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-title-sm text-slate-900">Top endpoints</h3>
                  <p className="text-xs text-slate-600">Endpoint, Calls, Errors %, Latency p95</p>
                </div>
                <Workflow className="h-5 w-5 text-[var(--primary-500)]" aria-hidden />
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full" aria-label="Top endpoints table">
                  <thead className="sticky top-0 z-10 bg-white text-xs uppercase tracking-[0.08em] text-slate-500">
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
              <div className="flex justify-end px-4 py-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-[var(--primary-600)] transition hover:text-[var(--primary-700)]"
                >
                  View all endpoints
                </button>
              </div>
            </Card>
          </div>
        </div>
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

      <div className="col-span-12 lg:col-span-6">
        <AutomationList items={data.automation} />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <AutomationBuilder
          verticalAccent={accent}
          onCreate={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        />
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

        <AutomationList items={data.automation} />
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

      <div className="col-span-12 lg:col-span-6">
        <AutomationBuilder
          verticalAccent={accent}
          onCreate={async () => {
            await new Promise((resolve) => setTimeout(resolve, 700));
          }}
        />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <AutomationList items={data.automation} />
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
      <header className="border-b border-[var(--surface-border)] bg-white/95 shadow-xl shadow-purple-500/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Premium Multi-Category Dashboard</p>
              <h1 className="text-display-lg text-slate-900">{data.hero.title}</h1>
              <p className="max-w-3xl text-sm text-slate-600">{data.hero.description}</p>
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:focus-ring"
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

      <main className="mx-auto max-w-7xl space-y-8 rounded-[32px] bg-white/95 px-8 py-10 shadow-xl shadow-purple-500/10 backdrop-blur">
        <KPIBand metrics={moduleMetrics} accentToken={accent} />
        <div className="rounded-[24px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-s1)] px-6 py-4 text-xs text-slate-500">
          Global filters persist via query params. React Query hydrates instantly, while Zustand keeps inter-module state fast.
        </div>
        
        {/* Main content with right rail */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main content area */}
          <div className="flex-1">
            {moduleContent}
          </div>
          
          {/* RIGHT RAIL: AUTOMATION WORKBENCH */}
          <div className="sticky top-[140px] w-full space-y-6 lg:w-[320px] lg:flex-shrink-0">
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
              <div className="flex items-center justify-between gap-4 mb-4">
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
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--primary-600)] transition hover:text-[var(--primary-700)]"
                      >
                        {automation.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Efficiency showcases (bottom) */}
            <Card className="border border-[var(--surface-border)]" role="region" aria-label="Efficiency showcases">
              <div className="flex items-center justify-between gap-4 mb-4">
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
          </div>
        </div>
      </main>
    </div>
  );
}
