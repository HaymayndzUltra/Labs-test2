'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Globe,
  Layers,
  LineChart as LineChartIcon,
  Mail,
  PlayCircle,
  Send,
  Sparkles,
  TabletSmartphone,
  Users,
  Workflow,
  X,
} from 'lucide-react';
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
import type {
  AutomationWorkflow,
  ChartPoint,
  CorporateSection,
  MetricCard,
  PieSegment,
  PortfolioDashboardResponse,
  TabDefinition,
} from './data';

const cardClass =
  'rounded-3xl border border-indigo-100/60 bg-white/90 p-6 shadow-lg ring-1 ring-indigo-100/40 backdrop-blur';
const sectionTitleClass = 'text-lg font-semibold text-slate-900';
const subTitleClass = 'text-sm text-slate-500';

function TrendBadge({ change, trend }: { change?: number; trend?: MetricCard['trend'] }) {
  if (change == null || trend == null) return null;

  const isPositive = trend === 'up';
  const isNeutral = trend === 'steady';
  const tone = isNeutral
    ? 'bg-slate-100 text-slate-600'
    : isPositive
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-rose-100 text-rose-700';
  const Icon = isNeutral ? Activity : isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {change > 0 ? '+' : ''}
      {change.toFixed(1)}%
    </span>
  );
}

function MetricCardItem({ metric }: { metric: MetricCard }) {
  return (
    <div className={`${cardClass} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
        <TrendBadge change={metric.change} trend={metric.trend} />
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
      {metric.description ? <p className="mt-2 text-sm text-slate-500">{metric.description}</p> : null}
    </div>
  );
}

function MetricsGrid({ metrics }: { metrics: MetricCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCardItem key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

function AutomationList({
  automations,
  onInspect,
}: {
  automations: AutomationWorkflow[];
  onInspect: (workflow: AutomationWorkflow) => void;
}) {
  return (
    <div className={`${cardClass} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={sectionTitleClass}>Automation orchestration</h3>
          <p className="text-sm text-slate-500">Triggers, actions, and cadences that keep this module on autopilot.</p>
        </div>
        <Workflow className="h-5 w-5 text-indigo-500" />
      </div>
      <div className="space-y-3">
        {automations.map((automation) => (
          <button
            key={automation.id}
            type="button"
            onClick={() => onInspect(automation)}
            className="w-full rounded-2xl border border-indigo-100/70 bg-indigo-50/70 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-indigo-200 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{automation.title}</p>
                <p className="mt-1 text-xs text-slate-500">Trigger: {automation.trigger}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  automation.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {automation.active ? 'Active' : 'Paused'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Action: {automation.action}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">Owner: {automation.owner}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">Channel: {automation.channel}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">Cadence: {automation.cadence}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SubscriptionTable({
  rows,
}: {
  rows: PortfolioDashboardResponse['saas']['subscriptionPlans'];
}) {
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <h3 className={sectionTitleClass}>Subscription plans</h3>
        <Sparkles className="h-5 w-5 text-indigo-500" />
      </div>
      <p className="mt-1 text-sm text-slate-500">Tiered packaging with activation, API allocation, and churn performance.</p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Active users</th>
              <th className="px-4 py-3">Activation</th>
              <th className="px-4 py-3">API allocation</th>
              <th className="px-4 py-3">Churn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((plan) => (
              <tr key={plan.id} className="transition hover:bg-indigo-50/40">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {plan.name}
                    {plan.badge ? (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{plan.price}</td>
                <td className="px-4 py-3 text-slate-600">{plan.activeUsers.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600">{plan.activationRate}</td>
                <td className="px-4 py-3 text-slate-600">{plan.apiAllocation}</td>
                <td className="px-4 py-3 text-slate-600">{plan.churn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GradientCard({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: React.ComponentType<any> }) {
  return (
    <div className={`${cardClass} flex flex-col gap-4`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PieLegend({ segments }: { segments: PieSegment[] }) {
  return (
    <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
      {segments.map((segment) => (
        <div key={segment.id} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
          <span className="font-medium text-slate-800">{segment.label}</span>
          <span className="ml-auto text-slate-500">{segment.value}%</span>
        </div>
      ))}
    </div>
  );
}

function AutomationModal({ workflow, onClose }: { workflow: AutomationWorkflow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 pb-10 pt-12 backdrop-blur-sm sm:items-center">
      <div className="max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Workflow detail</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{workflow.title}</h2>
            <p className="mt-1 text-sm text-slate-500">A reusable background job ready for enterprise automation stacks.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-indigo-50/70 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Trigger</dt>
            <dd className="mt-2 text-sm text-slate-700">{workflow.trigger}</dd>
          </div>
          <div className="rounded-2xl bg-emerald-50/70 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Action</dt>
            <dd className="mt-2 text-sm text-slate-700">{workflow.action}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner & channel</dt>
            <dd className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Owner:</span> {workflow.owner}
              <br />
              <span className="font-semibold text-slate-900">Channel:</span> {workflow.channel}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cadence</dt>
            <dd className="mt-2 text-sm text-slate-700">{workflow.cadence}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-2xl border border-indigo-100/70 bg-white/60 p-4 text-sm text-slate-600">
          <p>
            Background jobs are versioned and deployed through our automation mesh. Each workflow exposes health checks, retry
            policies, and observability hooks so you can plug into any enterprise stack without rework.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Sparkles className="h-4 w-4" /> Clone workflow
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function HeatmapCell({ value, max }: { value: number; max: number }) {
  const intensity = value / max;
  const background = `rgba(79, 70, 229, ${0.12 + intensity * 0.6})`;
  return (
    <div className="flex h-10 items-center justify-center rounded-2xl text-xs font-semibold text-slate-700" style={{ background }}>
      {value}
    </div>
  );
}

function WorkloadBar({ point }: { point: ChartPoint }) {
  const capacity = point.secondary ?? point.value;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{point.label}</span>
        <span>
          {point.value}/{capacity} tasks
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, (point.value / capacity) * 100)}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: 'healthy' | 'attention' | 'delayed' }) {
  const tone =
    status === 'healthy'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'attention'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function FunnelStep({
  stage,
  count,
  conversion,
  delta,
  index,
}: CorporateSection['funnel'][number] & { index: number }) {
  const width = 100 - index * 8;
  const trendTone = delta >= 0 ? 'text-emerald-600' : 'text-rose-600';
  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className="mx-auto rounded-2xl border border-indigo-100/70 bg-indigo-50/70 px-4 py-3 shadow-sm"
        style={{ width: `${width}%` }}
      >
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-indigo-600">
          <span>{stage}</span>
          <span>{conversion}</span>
        </div>
        <div className="mt-1 flex items-end justify-between">
          <span className="text-lg font-semibold text-slate-900">{count.toLocaleString()}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendTone}`}>
            {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta >= 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ initialData }: { initialData: PortfolioDashboardResponse }) {
  const [activeTab, setActiveTab] = useState<TabDefinition['id']>('saas');
  const [modalAutomation, setModalAutomation] = useState<AutomationWorkflow | null>(null);

  const activeSection = useMemo(() => initialData.tabs.find((tab) => tab.id === activeTab), [initialData.tabs, activeTab]);

  const openAutomation = (workflow: AutomationWorkflow) => setModalAutomation(workflow);
  const closeAutomation = () => setModalAutomation(null);

  const renderSaaS = () => (
    <div className="space-y-6">
      <MetricsGrid metrics={initialData.saas.metrics} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <SubscriptionTable rows={initialData.saas.subscriptionPlans} />
          <div className="grid gap-6 md:grid-cols-2">
            <GradientCard title="MRR growth" icon={LineChartIcon}>
              <div className="h-56">
                <ResponsiveContainer>
                  <LineChart data={initialData.saas.growthTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value}k`} />
                    <Tooltip contentStyle={{ borderRadius: 16 }} />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>
            <GradientCard title="API usage saturation" icon={BarChart3}>
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={initialData.saas.apiUsageTrend}>
                    <defs>
                      <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${value}M`} />
                    <Tooltip contentStyle={{ borderRadius: 16 }} />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#apiGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <GradientCard title="Churn health" icon={Users}>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={initialData.saas.churnSegments}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {initialData.saas.churnSegments.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ borderRadius: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <PieLegend segments={initialData.saas.churnSegments} />
          </GradientCard>
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Billing cycle orchestration</h3>
            <p className="mt-1 text-sm text-slate-500">
              Background jobs performing ledger sync, revenue recognition, and compliance audit trails.
            </p>
            <div className="mt-4 space-y-3">
              {initialData.saas.billingCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{cycle.label}</p>
                    <p className="text-xs text-slate-500">Owners: {cycle.owners.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">Next run {cycle.nextRun}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        cycle.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : cycle.status === 'processing'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {cycle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AutomationList automations={initialData.saas.automation} onInspect={openAutomation} />
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={sectionTitleClass}>Churn recovery playbook</h3>
          <p className="mt-1 text-sm text-slate-500">Configure real-time outreach without leaving the dashboard.</p>
          <form className="mt-4 grid gap-4 lg:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Contact template
              <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option>Usage drop nurture</option>
                <option>Executive alignment offer</option>
                <option>Migration support</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Trigger threshold
              <input
                type="number"
                className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Usage %"
                defaultValue={40}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Fallback owner
              <input
                className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                defaultValue="Lifecycle team"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Message preview
              <textarea
                className="min-h-[120px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                defaultValue="Hey team, we noticed API usage trending down. Let’s schedule a workflow audit and share upcoming roadmap upgrades."
              />
            </label>
            <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <Send className="h-4 w-4" /> Save workflow preset
              </button>
              <span className="text-xs text-slate-500">The automation mesh will deploy this preset instantly.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCommerce = () => (
    <div className="space-y-6">
      <MetricsGrid metrics={initialData.commerce.metrics} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <h3 className={sectionTitleClass}>Top products leaderboard</h3>
              <TabletSmartphone className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-1 text-sm text-slate-500">Merchandising performance across categories with live conversion rates.</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th className="px-4 py-3">Conversion</th>
                    <th className="px-4 py-3">Inventory</th>
                    <th className="px-4 py-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {initialData.commerce.topProducts.map((product, index) => (
                    <tr key={product.id} className="transition hover:bg-emerald-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-600">
                            #{index + 1}
                          </span>
                          {product.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{product.category}</td>
                      <td className="px-4 py-3 text-slate-600">{product.revenue}</td>
                      <td className="px-4 py-3 text-slate-600">{product.conversionRate}</td>
                      <td className="px-4 py-3 text-slate-600">{product.inventory}</td>
                      <td className="px-4 py-3 text-right">
                        <TrendBadge change={product.trend === 'down' ? -2.1 : 2.6} trend={product.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <h3 className={sectionTitleClass}>Seasonal promotion builder</h3>
              <Mail className="h-5 w-5 text-emerald-500" />
            </div>
            <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Campaign name
                <input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" defaultValue="Holiday VIP drop" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Audience segment
                <select className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                  <option>High intent browsers</option>
                  <option>Repeat purchasers</option>
                  <option>First-time buyers</option>
                </select>
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
                Incentive
                <input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" defaultValue="Free express shipping + early access" />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-700">
                Message
                <textarea className="min-h-[100px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" defaultValue="You left premium picks in your cart. Finish checkout for complimentary express shipping & VIP concierge." />
              </label>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  <Send className="h-4 w-4" /> Activate automation
                </button>
                <span className="text-xs text-slate-500">Abandoned cart triggers will sync this message to SMS and email automatically.</span>
              </div>
            </form>
          </div>
        </div>
        <div className="space-y-6">
          <GradientCard title="Sales trends" icon={BarChart3}>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={initialData.commerce.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}k`} />
                  <Tooltip contentStyle={{ borderRadius: 16 }} />
                  <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GradientCard>
          <AutomationList automations={initialData.commerce.automation} onInspect={openAutomation} />
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Operational health</h3>
            <div className="mt-4 space-y-3">
              {initialData.commerce.operations.map((operation) => (
                <div key={operation.id} className="rounded-2xl bg-emerald-50/50 p-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{operation.title}</p>
                    <StatusPill status={operation.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{operation.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCorporate = () => (
    <div className="space-y-6">
      <MetricsGrid metrics={initialData.corporate.metrics} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <GradientCard title="Conversion funnel" icon={Globe}>
            <div className="space-y-3">
              {initialData.corporate.funnel.map((step, index) => (
                <FunnelStep key={step.id} {...step} index={index} />
              ))}
            </div>
          </GradientCard>
          <AutomationList automations={initialData.corporate.automation} onInspect={openAutomation} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <GradientCard title="Lead source mix" icon={Users}>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={initialData.corporate.leadSources} dataKey="value" cx="50%" cy="50%" outerRadius={110} label>
                    {initialData.corporate.leadSources.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ borderRadius: 16 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GradientCard>
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Executive insights</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {initialData.corporate.insights.map((insight) => (
                <li key={insight.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{insight.headline}</p>
                  <p className="mt-1 text-xs text-slate-500">{insight.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomApp = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <h3 className={sectionTitleClass}>Kanban delivery board</h3>
              <Layers className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {initialData.customApp.kanban.map((column) => (
                <div key={column.id} className="rounded-3xl bg-purple-50/70 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-purple-800">
                    <span>{column.title}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-purple-500">{column.badge}</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {column.tasks.map((task) => (
                      <div key={task.id} className="rounded-2xl bg-white p-3 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500">Owner: {task.owner}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5">Due {task.due}</span>
                          <span className={`rounded-full px-2 py-0.5 ${
                            task.priority === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>Priority {task.priority}</span>
                          {task.automation ? <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-600">{task.automation}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Idea backlog intake</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {initialData.customApp.backlogIdeas.map((idea, index) => (
                <li key={idea} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-600">
                    {index + 1}
                  </span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <GradientCard title="Workload distribution" icon={ClipboardList}>
            <div className="space-y-3">
              {initialData.customApp.workloadDistribution.map((point) => (
                <WorkloadBar key={point.label} point={point} />
              ))}
            </div>
          </GradientCard>
          <AutomationList automations={initialData.customApp.automation} onInspect={openAutomation} />
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Create recurring task</h3>
            <form className="mt-4 space-y-3" onSubmit={(event) => event.preventDefault()}>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Task title
                <input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" placeholder="Weekly release readiness" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Owner
                <input className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" placeholder="Automation bot" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Cadence
                <select className="rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-400">
                <CheckCircle2 className="h-4 w-4" /> Save automation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <MetricsGrid metrics={initialData.content.metrics} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <h3 className={sectionTitleClass}>Engagement trend</h3>
              <PlayCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-4 h-60">
              <ResponsiveContainer>
                <LineChart data={initialData.content.engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" />
                  <XAxis dataKey="label" stroke="#f59e0b" fontSize={12} />
                  <YAxis stroke="#f59e0b" fontSize={12} tickFormatter={(value) => `${value}k`} />
                  <Tooltip contentStyle={{ borderRadius: 16 }} />
                  <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <h3 className={sectionTitleClass}>Top performing stories</h3>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Publish window</th>
                    <th className="px-4 py-3">Engagement</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {initialData.content.topStories.map((story) => (
                    <tr key={story.id} className="transition hover:bg-amber-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{story.title}</td>
                      <td className="px-4 py-3 text-slate-600">{story.format}</td>
                      <td className="px-4 py-3 text-slate-600">{story.publishedAt}</td>
                      <td className="px-4 py-3 text-slate-600">{story.engagement}</td>
                      <td className="px-4 py-3 text-slate-600">{story.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <AutomationList automations={initialData.content.automation} onInspect={openAutomation} />
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Publishing queue</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {initialData.content.publishingQueue.map((slot) => (
                <li key={slot.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{slot.slot}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        slot.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-700'
                          : slot.status === 'in-review'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{slot.topic}</p>
                  <p className="mt-1 text-xs text-slate-400">Editor: {slot.editor}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEdTech = () => {
    const maxHeat = Math.max(...initialData.edtech.activityHeatmap.values.map((item) => item.score));
    return (
      <div className="space-y-6">
        <MetricsGrid metrics={initialData.edtech.metrics} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className={cardClass}>
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>Program performance</h3>
                <BookOpen className="h-5 w-5 text-rose-500" />
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Enrollment</th>
                      <th className="px-4 py-3">Completion</th>
                      <th className="px-4 py-3">Avg score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {initialData.edtech.courses.map((course) => (
                      <tr key={course.id} className="transition hover:bg-rose-50/60">
                        <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
                        <td className="px-4 py-3 text-slate-600">{course.enrollment.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-600">{course.completion}</td>
                        <td className="px-4 py-3 text-slate-600">{course.avgScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={cardClass}>
              <div className="flex items-center justify-between">
                <h3 className={sectionTitleClass}>Student activity heatmap</h3>
                <LineChartIcon className="h-5 w-5 text-rose-500" />
              </div>
              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[640px] space-y-3">
                  <div className="grid grid-cols-8 gap-2 text-xs font-semibold text-slate-500">
                    <span />
                    {initialData.edtech.activityHeatmap.weeks.map((week) => (
                      <span key={week} className="text-center">
                        {week}
                      </span>
                    ))}
                  </div>
                  {initialData.edtech.activityHeatmap.days.map((day) => (
                    <div key={day} className="grid grid-cols-8 gap-2 items-center">
                      <span className="text-xs font-semibold text-slate-500">{day}</span>
                      {initialData.edtech.activityHeatmap.weeks.map((week) => {
                        const value = initialData.edtech.activityHeatmap.values.find(
                          (item) => item.day === day && item.week === week,
                        )?.score;
                        return <HeatmapCell key={`${week}-${day}`} value={value ?? 0} max={maxHeat} />;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <AutomationList automations={initialData.edtech.automation} onInspect={openAutomation} />
            <div className={cardClass}>
              <h3 className={sectionTitleClass}>Intelligence alerts</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {initialData.edtech.alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className={`rounded-2xl p-3 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : alert.severity === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {alert.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpecialized = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Real estate intelligence</h3>
          <MetricsGrid metrics={initialData.specialized.realEstate.metrics} />
          <div className={cardClass}>
            <h4 className={sectionTitleClass}>Listings & inquiries</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {initialData.specialized.realEstate.pipeline.map((item) => (
                <li key={item.id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{item.address}</p>
                  <p className="text-xs text-slate-500">Stage: {item.stage}</p>
                  <p className="text-xs text-slate-400">Inquiries: {item.inquiries} · Agent: {item.agent}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <GradientCard title="Market momentum" icon={LineChartIcon}>
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={initialData.specialized.realEstate.trend}>
                  <defs>
                    <linearGradient id="realEstate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#cbd5f5" />
                  <XAxis dataKey="label" stroke="#6366f1" fontSize={12} />
                  <YAxis stroke="#6366f1" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 16 }} />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#realEstate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GradientCard>
          <AutomationList automations={initialData.specialized.realEstate.automation} onInspect={openAutomation} />
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Finance & healthcare</h3>
          <div className={cardClass}>
            <h4 className={sectionTitleClass}>Expense vs budget</h4>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <LineChart data={initialData.specialized.finance.expenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${value}k`} />
                  <Tooltip contentStyle={{ borderRadius: 16 }} />
                  <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} dot={false} name="Actual" />
                  <Line type="monotone" dataKey="secondary" stroke="#0ea5e9" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Budget" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={cardClass}>
            <h4 className={sectionTitleClass}>ROI breakdown</h4>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={initialData.specialized.finance.roiBreakdown} dataKey="value" innerRadius={60} outerRadius={90}>
                    {initialData.specialized.finance.roiBreakdown.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ borderRadius: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <AutomationList automations={initialData.specialized.finance.automation} onInspect={openAutomation} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className={sectionTitleClass}>Healthcare appointments</h3>
            <CalendarCheck className="h-5 w-5 text-sky-500" />
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Clinician</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {initialData.specialized.healthcare.appointments.map((appointment) => (
                  <tr key={appointment.id} className="transition hover:bg-sky-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{appointment.patient}</td>
                    <td className="px-4 py-3 text-slate-600">{appointment.clinician}</td>
                    <td className="px-4 py-3 text-slate-600">{appointment.start}</td>
                    <td className="px-4 py-3 text-slate-600">{appointment.channel}</td>
                    <td className="px-4 py-3 text-slate-600">{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <MetricsGrid metrics={initialData.specialized.healthcare.metrics} />
          <AutomationList automations={initialData.specialized.healthcare.automation} onInspect={openAutomation} />
        </div>
      </div>
    </div>
  );

  const tabRenderers: Record<TabDefinition['id'], () => JSX.Element> = {
    saas: renderSaaS,
    commerce: renderCommerce,
    corporate: renderCorporate,
    customApp: renderCustomApp,
    content: renderContent,
    edtech: renderEdTech,
    specialized: renderSpecialized,
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-16">
      <header className="border-b border-indigo-100/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" /> Unified portfolio experience
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{initialData.hero.title}</h1>
              <p className="mt-2 text-base text-slate-600 md:text-lg">{initialData.hero.subtitle}</p>
            </div>
            <p className="text-sm text-slate-500 md:text-base">{initialData.hero.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                <FileSpreadsheet className="h-4 w-4" /> {initialData.hero.cta}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                onClick={() => setModalAutomation(initialData.saas.automation[0])}
              >
                <Workflow className="h-4 w-4" /> Explore automation blueprints
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-indigo-100/70 bg-indigo-50/70 p-5 text-sm text-slate-600 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Generated</p>
            <p className="mt-1 font-semibold text-slate-900">{new Date(initialData.generatedAt).toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-500">
              Every module ships with analytics, automation, and visualizations following one cohesive premium SaaS design system.
            </p>
          </div>
        </div>
      </header>
      <nav className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3 px-6">
        {initialData.tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group relative overflow-hidden rounded-full border px-5 py-3 text-left transition-all ${
                isActive
                  ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
                  : 'border-indigo-100 bg-white text-slate-600 hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <p className={`mt-1 text-xs ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{tab.description}</p>
            </button>
          );
        })}
      </nav>
      <main className="mx-auto mt-8 max-w-7xl space-y-6 px-6">
        <div className={`${cardClass} bg-white/70`}> 
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Active module</p>
              <h2 className="text-2xl font-semibold text-slate-900">{activeSection?.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{activeSection?.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Workflow className="h-4 w-4" /> Background jobs synced
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <CheckCircle2 className="h-4 w-4" /> Consistent design language
              </span>
            </div>
          </div>
        </div>
        <section className="space-y-6">{tabRenderers[activeTab]()}</section>
      </main>
      {modalAutomation ? <AutomationModal workflow={modalAutomation} onClose={closeAutomation} /> : null}
    </div>
  );
}
