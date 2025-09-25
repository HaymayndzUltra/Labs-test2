'use client';

import {
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
  AlertTriangle,
  BarChart3,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  CreditCard,
  Cpu,
  Database,
  Globe,
  GraduationCap,
  LineChart as LineChartIcon,
  ListTodo,
  Mail,
  Pill,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Target,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ComponentType, FormEvent } from 'react';
import type {
  AutomationWorkflow,
  ChartDefinition,
  IconName,
  MetricCard,
  PortfolioCategory,
  PortfolioDashboardResponse,
  QuickAction,
  TableDefinition,
  TrendDirection,
} from './types';

const ICON_MAP: Record<IconName, ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  users: Users,
  'credit-card': CreditCard,
  cpu: Cpu,
  'bar-chart': BarChart3,
  'shopping-cart': ShoppingCart,
  target: Target,
  'chart-line': LineChartIcon,
  clock: Clock,
  mail: Mail,
  alert: AlertTriangle,
  sparkles: Sparkles,
  shield: ShieldCheck,
  bookmark: Bookmark,
  video: Video,
  graduation: GraduationCap,
  pill: Pill,
  building: Building2,
  briefcase: BriefcaseBusiness,
  database: Database,
  stethoscope: Stethoscope,
  calendar: CalendarDays,
  zap: Zap,
  list: ListTodo,
  globe: Globe,
  clipboard: ClipboardList,
};

const TREND_CONFIG: Record<TrendDirection, { label: string; tone: string; chip: string }> = {
  up: { label: 'Trending up', tone: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700' },
  down: { label: 'Trending down', tone: 'text-rose-600', chip: 'bg-rose-50 text-rose-700' },
  steady: { label: 'Steady', tone: 'text-slate-500', chip: 'bg-slate-100 text-slate-600' },
};

const formatChange = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return null;
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(Math.abs(value) < 10 ? 1 : 0)}%`;
};

type DashboardClientProps = {
  initialData: PortfolioDashboardResponse;
};

type ActionModalState = {
  isOpen: boolean;
  action?: QuickAction;
  submitted?: boolean;
};

const cardBaseClass = 'rounded-3xl border border-indigo-100/60 bg-white/80 shadow-[0_20px_50px_-25px_rgba(79,70,229,0.35)] backdrop-blur-sm';

function MetricCardView({ metric }: { metric: MetricCard }) {
  const Icon = ICON_MAP[metric.icon];
  const trend = metric.trend ? TREND_CONFIG[metric.trend] : undefined;
  const changeLabel = formatChange(metric.change);

  return (
    <div
      className={`${cardBaseClass} flex flex-col gap-4 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-indigo-50 p-3">
          {Icon ? <Icon className="h-6 w-6 text-indigo-500" /> : null}
        </div>
        {trend && changeLabel ? (
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${trend.chip}`}>
            <Check className="h-3.5 w-3.5" />
            {changeLabel}
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-sm font-medium text-indigo-500/80">{metric.label}</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
        {metric.caption ? <p className="mt-1 text-sm text-slate-500">{metric.caption}</p> : null}
      </div>
    </div>
  );
}

function ChartCard({ chart }: { chart: ChartDefinition }) {
  const height = chart.type === 'heatmap' ? 320 : 260;

  return (
    <div className={`${cardBaseClass} flex flex-col gap-4 p-6`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{chart.title}</h3>
          {chart.description ? <p className="mt-1 text-sm text-slate-500">{chart.description}</p> : null}
        </div>
      </div>
      <div style={{ height }} className="relative w-full">
        <ChartRenderer chart={chart} height={height - 20} />
      </div>
    </div>
  );
}

function ChartRenderer({ chart, height = 240 }: { chart: ChartDefinition; height?: number }) {
  switch (chart.type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chart.data as Array<Record<string, number | string>>}>
            <CartesianGrid stroke="rgba(99,102,241,0.08)" strokeDasharray="4 8" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 16, borderColor: '#c7d2fe', boxShadow: '0 12px 40px rgba(79,70,229,0.08)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {chart.series.map((serie) => (
              <Line
                key={serie.key}
                type="monotone"
                dataKey={serie.key}
                stroke={serie.color}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chart.data as Array<Record<string, number | string>>}>
            <CartesianGrid stroke="rgba(99,102,241,0.08)" strokeDasharray="4 8" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 16, borderColor: '#c7d2fe', boxShadow: '0 12px 40px rgba(79,70,229,0.08)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {chart.series.map((serie) => (
              <Bar key={serie.key} dataKey={serie.key} radius={[12, 12, 0, 0]} fill={serie.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case 'donut':
      return (
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie data={chart.segments} innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                {chart.segments.map((segment) => (
                  <Cell key={segment.label} fill={segment.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={{ borderRadius: 16, borderColor: '#c7d2fe', boxShadow: '0 12px 40px rgba(79,70,229,0.08)' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          {chart.centerLabel ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm font-semibold text-indigo-500">
              {chart.centerLabel}
            </div>
          ) : null}
        </div>
      );
    case 'funnel':
      return <FunnelView steps={chart.steps} />;
    case 'heatmap':
      return <HeatmapView chart={chart} height={height} />;
    default:
      return null;
  }
}

function FunnelView({
  steps,
}: {
  steps: Array<{ label: string; value: number; annotation?: string }>;
}) {
  const maxValue = Math.max(...steps.map((step) => step.value));

  return (
    <div className="flex h-full flex-col justify-between gap-3">
      {steps.map((step, index) => {
        const percentage = Math.max(12, Math.round((step.value / maxValue) * 100));
        return (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>{step.label}</span>
              <span>{step.value.toLocaleString()}</span>
            </div>
            <div className="h-12 w-full rounded-full bg-indigo-50/70">
              <div
                className="flex h-full items-center justify-between rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 px-4 text-xs font-semibold text-white"
                style={{ width: `${percentage}%` }}
              >
                <span>{Math.round((step.value / maxValue) * 100)}%</span>
                {step.annotation ? <span>{step.annotation}</span> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeatmapView({
  chart,
  height,
}: {
  chart: Extract<ChartDefinition, { type: 'heatmap' }>;
  height?: number;
}) {
  const [min, max] = chart.valueRange;
  const span = Math.max(max - min, 1);

  return (
    <div className="flex h-full flex-col gap-4" style={height ? { height } : undefined}>
      <div className="grid flex-1 grid-cols-[auto,1fr] gap-4 overflow-hidden">
        {chart.rows.map((row) => (
          <div key={row.label} className="contents">
            <div className="pt-3 text-sm font-medium text-slate-500">{row.label}</div>
            <div className="grid grid-cols-7 gap-3">
              {row.values.map((cell) => {
                const intensity = Math.max(0.15, (cell.value - min) / span);
                const color = `rgba(79,70,229,${0.15 + intensity * 0.65})`;
                return (
                  <div key={`${row.label}-${cell.label}`} className="flex flex-col items-center gap-1 text-xs text-slate-500">
                    <div className="w-full rounded-xl border border-indigo-100/50 bg-white/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <div
                        className="h-16 w-full rounded-lg transition duration-300"
                        style={{ background: `linear-gradient(135deg, rgba(79,70,229,0.2), ${color})` }}
                      />
                    </div>
                    <span>{cell.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {chart.legend.map((item, index) => (
          <div key={item} className="flex items-center gap-1">
            <span
              className="h-2 w-6 rounded-full"
              style={{
                background: `rgba(79,70,229,${0.2 + index * 0.2})`,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableCard({ table }: { table: TableDefinition }) {
  return (
    <div className={`${cardBaseClass} overflow-hidden`}>`
      <div className="flex items-start justify-between gap-3 border-b border-indigo-100/60 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{table.title}</h3>
          {table.description ? <p className="mt-1 text-sm text-slate-500">{table.description}</p> : null}
        </div>
      </div>
      <div className="overflow-x-auto px-6 pb-6 pt-3">
        <table className="min-w-full divide-y divide-indigo-100/60 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              {table.columns.map((column) => (
                <th key={column} className="pb-3 pr-6">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/80">
            {table.rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-indigo-50/40">
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`} className="whitespace-nowrap py-3 pr-6 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AutomationCard({ automation }: { automation: AutomationWorkflow }) {
  return (
    <div className={`${cardBaseClass} flex flex-col gap-4 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Automation</p>
          <h3 className="text-lg font-semibold text-slate-900">{automation.title}</h3>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">{automation.status}</span>
      </div>
      <p className="text-sm text-slate-500">{automation.description}</p>
      <div className="rounded-2xl bg-indigo-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Trigger</p>
        <p className="mt-1 text-sm text-indigo-700">{automation.trigger}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Actions</p>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          {automation.actions.map((action, idx) => (
            <li key={`${automation.id}-action-${idx}`} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {action}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-600">Cadence</p>
          <p>{automation.cadence}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-600">Owner</p>
          <p>{automation.owner}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-600">Last run</p>
          <p>{automation.lastRun}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-600">Next run</p>
          <p>{automation.nextRun}</p>
        </div>
      </div>
    </div>
  );
}

function HighlightsCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className={`${cardBaseClass} flex flex-col gap-4 p-6`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">{title}</h3>
      <ul className="space-y-3 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-500">{item.label}</span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KanbanBoard({ category }: { category: PortfolioCategory }) {
  const kanban = category.extras?.kanban;
  if (!kanban) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Sprint Kanban</h3>
          <p className="text-sm text-slate-500">{kanban.summary}</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium text-indigo-600">Automation Coverage {category.metrics.find((metric) => metric.id === 'automation-coverage')?.value ?? ''}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {kanban.columns.map((column) => (
          <div key={column.id} className={`${cardBaseClass} flex h-full flex-col gap-4 p-4`}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">{column.title}</h4>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">{column.items.length}</span>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              {column.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-indigo-100/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-indigo-500">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold">{item.badge}</span>
                    <span>{item.dueDate}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{item.title}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.assignee}</span>
                    <span>{item.effort} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`${cardBaseClass} grid grid-cols-1 gap-4 p-6 md:grid-cols-5`}>
        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Workload Summary</h4>
          <p className="mt-2 text-sm text-slate-500">Balancing squad capacity across the sprint timeline.</p>
        </div>
        <div className="md:col-span-3 space-y-4">
          {kanban.workload.team.map((member) => {
            const loadRatio = Math.min(1, member.allocation / member.capacity);
            return (
              <div key={member.name}>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="font-medium text-slate-700">{member.name}</span>
                  <span>{member.allocation}% / {member.capacity}%</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-indigo-100/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                    style={{ width: `${loadRatio * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{member.role}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AutomationsGrid({ automations }: { automations: AutomationWorkflow[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {automations.map((automation) => (
        <AutomationCard key={automation.id} automation={automation} />
      ))}
    </div>
  );
}

function QuickActions({ actions, onSelect }: { actions: QuickAction[]; onSelect: (action: QuickAction) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {actions.map((action) => {
        const Icon = ICON_MAP[action.icon];
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            className={`${cardBaseClass} group flex h-full flex-col items-start gap-4 p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="rounded-2xl bg-indigo-50 p-3">
                {Icon ? <Icon className="h-5 w-5 text-indigo-500" /> : null}
              </div>
              {action.badge ? (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">{action.badge}</span>
              ) : null}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">{action.title}</h3>
              <p className="text-sm text-slate-500">{action.description}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              {action.ctaLabel}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ActionModal({ state, onClose }: { state: ActionModalState; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!state.isOpen || !state.action) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-indigo-100/80 bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Action Preview</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{state.action.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{state.action.description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Full Name
              <input
                required
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-indigo-100/80 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-400 focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Work Email
              <input
                required
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="mt-1 w-full rounded-2xl border border-indigo-100/80 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-400 focus:outline-none"
              />
            </label>
          </div>
          <label className="text-sm font-medium text-slate-600">
            Context & Goals
            <textarea
              value={formData.notes}
              onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-indigo-100/80 bg-white px-4 py-3 text-sm shadow-inner focus:border-indigo-400 focus:outline-none"
              placeholder="Share timelines, success metrics, or systems we should prepare."
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            {submitted ? 'Request Sent ✓' : state.action.ctaLabel}
          </button>
        </form>
        {submitted ? (
          <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Automation scheduled. A strategist will respond within 1 business day with a tailored playbook.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialData.categories[0]?.id ?? '');
  const [modalState, setModalState] = useState<ActionModalState>({ isOpen: false });

  const activeCategory = useMemo<PortfolioCategory | undefined>(
    () => initialData.categories.find((category) => category.id === activeCategoryId),
    [activeCategoryId, initialData.categories],
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="border-b border-indigo-100/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Portfolio Showcase</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {initialData.headline}
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">{initialData.intro}</p>
            <p className="text-xs text-indigo-500/80">Generated {new Date(initialData.generatedAt).toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {initialData.portfolioHighlights.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-indigo-100/80 bg-white/80 p-4 text-left shadow-inner">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{metric.value}</p>
                <p className="text-xs text-slate-500">{metric.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        <QuickActions
          actions={initialData.quickActions}
          onSelect={(action) => setModalState({ isOpen: true, action })}
        />

        <div className={`${cardBaseClass} border-none bg-gradient-to-r from-indigo-500/5 via-white to-sky-50 p-4`}>
          <div className="flex overflow-x-auto whitespace-nowrap text-sm font-medium text-slate-500">
            {initialData.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`relative rounded-2xl px-4 py-2 transition ${
                  activeCategoryId === category.id
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-slate-500 hover:text-indigo-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {activeCategory ? (
          <div className="space-y-10">
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-6">
                <div className={`${cardBaseClass} flex flex-col gap-4 p-6`}>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {activeCategory.badge}
                    </span>
                    <h2 className="text-2xl font-semibold text-slate-900">{activeCategory.name}</h2>
                  </div>
                  <p className="text-sm text-slate-500">{activeCategory.description}</p>
                  <p className="rounded-2xl bg-indigo-50/80 p-4 text-sm text-indigo-700">
                    {activeCategory.summary}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {activeCategory.metrics.map((metric) => (
                    <MetricCardView key={metric.id} metric={metric} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {activeCategory.extras?.highlights?.map((highlight) => (
                  <HighlightsCard key={highlight.title} title={highlight.title} items={highlight.items} />
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {activeCategory.charts.map((chart) => (
                <ChartCard key={chart.id} chart={chart} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {activeCategory.tables.map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
            </section>

            <KanbanBoard category={activeCategory} />

            <section>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Automation Blueprints</h3>
              <AutomationsGrid automations={activeCategory.automations} />
            </section>
          </div>
        ) : null}
      </div>

      <ActionModal state={modalState} onClose={() => setModalState({ isOpen: false })} />
    </div>
  );
}
