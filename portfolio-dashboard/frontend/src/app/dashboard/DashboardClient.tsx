'use client';

import { type FormEvent, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BellRing,
  Cable,
  CheckCheck,
  ClipboardCheck,
  CreditCard,
  Film,
  Globe,
  GraduationCap,
  Handshake,
  Home,
  Layers,
  LucideIcon,
  Medal,
  Minus,
  Newspaper,
  Package,
  PiggyBank,
  Rocket,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Target,
  Timeline,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Workflow,
  X,
} from 'lucide-react';
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
import type {
  AutomationJob,
  ChartConfig,
  DonutChartConfig,
  FunnelStage,
  HeatmapConfig,
  LeaderboardConfig,
  PortfolioCategory,
  PortfolioDashboard,
  PortfolioMetric,
  TableDefinition,
  WorkflowBlueprint,
} from './types';

const iconMap: Record<string, LucideIcon> = {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BellRing,
  Cable,
  CheckCheck,
  ClipboardCheck,
  CreditCard,
  Film,
  Globe,
  GraduationCap,
  Handshake,
  Home,
  Layers,
  Medal,
  Minus,
  Newspaper,
  Package,
  PiggyBank,
  Rocket,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Target,
  Timeline,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Workflow,
  X,
};

const chartCardClass =
  'rounded-3xl border border-indigo-100/60 bg-white/80 shadow-[0_18px_48px_rgba(79,70,229,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,70,229,0.12)]';

const badgeClass =
  'inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1 text-sm font-medium text-indigo-600';

type DashboardClientProps = {
  initialData: PortfolioDashboard;
};

type SelectedWorkflow = {
  category: PortfolioCategory;
  workflow: WorkflowBlueprint;
};

type TrendPalette = {
  text: string;
  bg: string;
  icon: LucideIcon;
};

const TREND_VARIANTS: Record<'up' | 'down' | 'steady', TrendPalette> = {
  up: { text: 'text-emerald-600', bg: 'bg-emerald-50', icon: ArrowUpRight },
  down: { text: 'text-rose-600', bg: 'bg-rose-50', icon: ArrowDownRight },
  steady: { text: 'text-slate-600', bg: 'bg-slate-100', icon: Minus },
};

function formatTick(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return value;
}

function MetricCard({ metric }: { metric: PortfolioMetric }) {
  const Icon = iconMap[metric.icon] ?? Sparkles;
  const palette = TREND_VARIANTS[metric.trend] ?? TREND_VARIANTS.steady;

  return (
    <div className={`${chartCardClass} h-full p-6`}> 
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-500">{metric.label}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</h3>
        </div>
        <span className="rounded-2xl bg-indigo-100/70 p-3 text-indigo-600">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${palette.bg} ${palette.text}`}>
          <palette.icon className="h-3.5 w-3.5" aria-hidden="true" />
          {metric.change > 0 ? `+${metric.change.toFixed(1)}%` : `${metric.change.toFixed(1)}%`}
        </span>
        <span className="text-sm text-slate-500">{metric.description}</span>
      </div>
    </div>
  );
}

function ChartCard({ chart }: { chart: ChartConfig }) {
  const tooltipFormatter = (value: unknown) =>
    typeof value === 'number' ? value.toLocaleString() : value;

  const renderCartesian = () => (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={(chart as Exclude<ChartConfig, DonutChartConfig>).data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-indigo-100/60" />
        <XAxis dataKey={(chart as Exclude<ChartConfig, DonutChartConfig>).xKey} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={formatTick} tickLine={false} axisLine={false} />
        <Tooltip formatter={tooltipFormatter} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
        <Legend wrapperStyle={{ paddingTop: 12 }} />
        {(chart as Exclude<ChartConfig, DonutChartConfig>).series.map((series) => (
          <Bar
            key={series.id}
            dataKey={series.dataKey}
            name={series.name}
            fill={series.color}
            stackId={chart.type === 'stacked-bar' ? series.stackId ?? 'stack' : undefined}
            radius={chart.type === 'bar' || chart.type === 'stacked-bar' ? [12, 12, 12, 12] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLine = () => (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={(chart as Exclude<ChartConfig, DonutChartConfig>).data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-indigo-100/60" />
        <XAxis dataKey={(chart as Exclude<ChartConfig, DonutChartConfig>).xKey} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={formatTick} tickLine={false} axisLine={false} />
        <Tooltip formatter={tooltipFormatter} cursor={{ stroke: 'rgba(79,70,229,0.28)' }} />
        <Legend wrapperStyle={{ paddingTop: 12 }} />
        {(chart as Exclude<ChartConfig, DonutChartConfig>).series.map((series) => (
          <Line
            key={series.id}
            type="monotone"
            dataKey={series.dataKey}
            name={series.name}
            stroke={series.color}
            strokeWidth={2.6}
            dot={{ r: 3.2 }}
            activeDot={{ r: 4.2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderDonut = () => (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip formatter={tooltipFormatter} />
        <Pie
          data={(chart as DonutChartConfig).data}
          innerRadius={70}
          outerRadius={100}
          paddingAngle={6}
          dataKey="value"
        >
          {(chart as DonutChartConfig).data.map((entry) => (
            <Cell key={entry.name} fill={entry.color ?? '#4f46e5'} />
          ))}
        </Pie>
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );

  let visualization: JSX.Element;
  if (chart.type === 'donut') {
    visualization = renderDonut();
  } else if (chart.type === 'line') {
    visualization = renderLine();
  } else {
    visualization = renderCartesian();
  }

  return (
    <section className={`${chartCardClass} p-6`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{chart.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{chart.description}</p>
        </div>
        <span className={badgeClass}>{chart.type === 'donut' ? 'Distribution' : 'Performance'}</span>
      </div>
      <div className="h-64">{visualization}</div>
    </section>
  );
}

function HeatmapCard({ heatmap }: { heatmap: HeatmapConfig }) {
  const flat = heatmap.values.flat();
  const max = Math.max(...flat);

  return (
    <section className={`${chartCardClass} p-6`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{heatmap.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{heatmap.description}</p>
        </div>
        <span className={badgeClass}>Heatmap</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="w-16 text-left text-xs font-medium uppercase tracking-wide text-slate-500">&nbsp;</th>
              {heatmap.hours.map((hour) => (
                <th key={hour} className="text-center text-xs font-semibold text-slate-500">
                  {hour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.days.map((day, rowIndex) => (
              <tr key={day}>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</th>
                {heatmap.values[rowIndex].map((value, columnIndex) => {
                  const intensity = value / max;
                  const background = `rgba(79,70,229,${0.15 + intensity * 0.55})`;
                  return (
                    <td key={`${day}-${columnIndex}`}>
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-semibold text-indigo-900"
                        style={{ background }}
                      >
                        {value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FunnelCard({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((stage) => stage.value));

  return (
    <section className={`${chartCardClass} p-6`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Conversion Funnel</h3>
          <p className="mt-1 text-sm text-slate-500">Track progression from awareness through closed revenue.</p>
        </div>
        <span className={badgeClass}>Funnel</span>
      </div>
      <ol className="space-y-3">
        {stages.map((stage, index) => (
          <li key={stage.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span className="font-medium text-slate-700">{stage.label}</span>
              <span className="text-slate-500">{stage.value.toLocaleString()} · {stage.conversion}</span>
            </div>
            <div className="h-3 rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400"
                style={{ width: `${(stage.value / max) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">Stage {index + 1}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function LeaderboardCard({ board }: { board: LeaderboardConfig }) {
  return (
    <section className={`${chartCardClass} p-6`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{board.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{board.description}</p>
        </div>
        <span className={badgeClass}>Leaderboard</span>
      </div>
      <div className="space-y-4">
        {board.rows.map((row) => {
          const trendPalette = row.trend ? TREND_VARIANTS[row.trend] : undefined;
          return (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-2xl border border-indigo-100/60 bg-indigo-50/40 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                {row.sublabel ? <p className="text-xs text-slate-500">{row.sublabel}</p> : null}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{row.value}</p>
                {trendPalette && typeof row.change === 'number' ? (
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendPalette.text}`}>
                    <trendPalette.icon className="h-3 w-3" />
                    {row.change > 0 ? `+${row.change.toFixed(1)}%` : `${row.change.toFixed(1)}%`}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DataTable({ table }: { table: TableDefinition }) {
  return (
    <section className={`${chartCardClass} overflow-hidden`}>
      <div className="flex items-start justify-between border-b border-indigo-100/60 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{table.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{table.description}</p>
        </div>
        <span className={badgeClass}>Table</span>
      </div>
      <div className="overflow-x-auto px-6 pb-4">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              {table.columns.map((column) => (
                <th key={column.id} className="py-3 pr-4 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`text-sm text-slate-600 ${rowIndex % 2 === 0 ? 'bg-white/80' : 'bg-indigo-50/40'}`}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td key={`${row.id}-${cellIndex}`} className="py-3 pr-4 font-medium text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type FormCardProps = {
  categoryId: string;
  formId: string;
  title: string;
  description: string;
  cta: string;
  fields: PortfolioCategory['forms'][number]['fields'];
  onSubmit: (formId: string) => void;
  submittedAt?: string;
  toggleValues: Record<string, boolean>;
  onToggleChange: (key: string) => void;
};

function FormCard({
  categoryId,
  formId,
  title,
  description,
  cta,
  fields,
  onSubmit,
  submittedAt,
  toggleValues,
  onToggleChange,
}: FormCardProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formId);
  };

  return (
    <section className={`${chartCardClass} p-6`}> 
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <span className={badgeClass}>Automation Form</span>
      </div>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const fieldKey = `${categoryId}-${formId}-${field.id}`;
          if (field.type === 'toggle') {
            const toggled = toggleValues[fieldKey] ?? false;
            return (
              <div key={field.id} className="flex items-center justify-between rounded-2xl bg-indigo-50/60 px-4 py-3">
                <label className="text-sm font-medium text-slate-700" htmlFor={fieldKey}>
                  {field.label}
                </label>
                <button
                  type="button"
                  id={fieldKey}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 ${
                    toggled ? 'bg-indigo-500' : 'bg-slate-300'
                  }`}
                  onClick={() => onToggleChange(fieldKey)}
                  aria-pressed={toggled}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                      toggled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <input type="hidden" name={field.id} value={toggled ? 'on' : 'off'} />
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.id} className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor={fieldKey}>
                  {field.label}
                </label>
                <select
                  id={fieldKey}
                  name={field.id}
                  className="w-full rounded-2xl border border-indigo-100/80 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor={fieldKey}>
                {field.label}
              </label>
              <input
                id={fieldKey}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-indigo-100/80 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required={field.type !== 'datetime-local'}
              />
            </div>
          );
        })}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-600 hover:to-sky-600"
        >
          {cta}
        </button>
        {submittedAt ? (
          <p className="text-xs text-slate-500">Last submitted · {submittedAt}</p>
        ) : (
          <p className="text-xs text-slate-400">Submission saves workflow configuration locally.</p>
        )}
      </form>
    </section>
  );
}

function AutomationJobCard({ job, onOpenWorkflow }: { job: AutomationJob; onOpenWorkflow: () => void }) {
  const statusStyles: Record<AutomationJob['status'], { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
    paused: { label: 'Paused', className: 'bg-amber-50 text-amber-600 border border-amber-100' },
    draft: { label: 'Draft', className: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
  };

  const palette = statusStyles[job.status];

  return (
    <article className={`${chartCardClass} p-5`}> 
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-slate-900">{job.title}</h4>
          <p className="mt-1 text-sm text-slate-500">Owner · {job.owner}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette.className}`}>
          {palette.label}
        </span>
      </div>
      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex gap-2">
          <dt className="w-24 font-medium text-slate-500">Cadence</dt>
          <dd className="flex-1">{job.cadence}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 font-medium text-slate-500">Trigger</dt>
          <dd className="flex-1">{job.trigger}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 font-medium text-slate-500">Actions</dt>
          <dd className="flex-1 space-y-1">
            {job.actions.map((action, index) => (
              <div key={`${job.id}-action-${index}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                {action}
              </div>
            ))}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onOpenWorkflow}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
      >
        View workflow blueprint
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function WorkflowModal({ selection, onClose }: { selection: SelectedWorkflow; onClose: () => void }) {
  const { category, workflow } = selection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-indigo-100/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Workflow Blueprint</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{workflow.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{workflow.description}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-500">{category.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ol className="mt-6 space-y-4">
          {workflow.steps.map((step, index) => (
            <li key={step.id} className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 text-sm font-semibold text-indigo-600">
                {index + 1}
              </div>
              <div className="flex-1 rounded-2xl border border-indigo-100/70 bg-indigo-50/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{step.name}</p>
                  <span className="text-xs font-medium uppercase tracking-wide text-indigo-500">{step.owner}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            Close blueprint
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const categories = initialData.categories;
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [selectedWorkflow, setSelectedWorkflow] = useState<SelectedWorkflow | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<Record<string, string>>({});
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({});

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? categories[0],
    [categories, activeCategoryId],
  );

  const handleFormSubmit = (formId: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFormSubmissions((previous) => ({ ...previous, [formId]: timestamp }));
  };

  const handleToggleChange = (key: string) => {
    setToggleValues((previous) => ({ ...previous, [key]: !(previous[key] ?? false) }));
  };

  const openWorkflow = (workflow: WorkflowBlueprint) => {
    if (activeCategory) {
      setSelectedWorkflow({ category: activeCategory, workflow });
    }
  };

  const generatedAt = useMemo(() => new Date(initialData.generatedAt).toLocaleString(), [initialData.generatedAt]);

  if (!activeCategory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-16">
      <header className="border-b border-indigo-100/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">Portfolio Showcase</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Unified Multi-Product Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Premium SaaS-inspired cockpit demonstrating analytics, automation, and workflow storytelling across seven digital
              product categories.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-500">
            <div className={badgeClass}>Updated · {generatedAt}</div>
            <div className="text-xs text-slate-400">{categories.length} categories, {categories.reduce((sum, cat) => sum + cat.metrics.length, 0)} key KPIs</div>
          </div>
        </div>
      </header>

      <nav className="border-b border-indigo-100/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-3" role="tablist" aria-label="Dashboard categories">
            {categories.map((category) => {
              const isActive = category.id === activeCategory.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-200'
                      : 'border border-indigo-100/70 bg-white/70 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-8 grid max-w-7xl gap-6 px-6 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-3">
          <section className={`${chartCardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">Automation Summary</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{activeCategory.name}</h2>
            <p className="mt-3 text-sm text-slate-600">{activeCategory.automation.summary}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {activeCategory.highlights.map((highlight, index) => (
                <li key={`highlight-${index}`} className="flex gap-2">
                  <span className="h-1.5 w-1.5 translate-y-2 rounded-full bg-indigo-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
          <div className="space-y-4">
            {activeCategory.automation.jobs.map((job) => {
              const workflow = activeCategory.automation.workflows.find((wf) => wf.id === job.workflowId);
              return (
                <AutomationJobCard
                  key={job.id}
                  job={job}
                  onOpenWorkflow={() => workflow && openWorkflow(workflow)}
                />
              );
            })}
          </div>
        </aside>

        <section className="space-y-6 lg:col-span-9">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 p-8 text-white shadow-[0_28px_80px_rgba(79,70,229,0.28)]">
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">{activeCategory.tagline}</p>
                <h2 className="mt-3 text-3xl font-semibold">{activeCategory.name}</h2>
                <p className="mt-3 text-sm text-indigo-100">{activeCategory.description}</p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">
                  <span className="font-medium text-white">Hero metric</span>
                  <span className="text-indigo-100">{activeCategory.heroMetric.label}</span>
                </div>
              </div>
              <div className="rounded-3xl bg-white/15 p-6 text-center">
                <p className="text-sm font-medium text-indigo-100">{activeCategory.heroMetric.label}</p>
                <p className="mt-2 text-4xl font-semibold">{activeCategory.heroMetric.value}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {activeCategory.heroMetric.change > 0
                    ? `+${activeCategory.heroMetric.change.toFixed(1)}%`
                    : `${activeCategory.heroMetric.change.toFixed(1)}%`}
                </div>
                <p className="mt-3 text-xs text-indigo-100">{activeCategory.heroMetric.description}</p>
              </div>
            </div>
            <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
          </section>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeCategory.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {activeCategory.charts.map((chart) => (
              <ChartCard key={chart.id} chart={chart} />
            ))}
            {activeCategory.heatmap ? <HeatmapCard heatmap={activeCategory.heatmap} /> : null}
            {activeCategory.funnel ? <FunnelCard stages={activeCategory.funnel} /> : null}
          </div>

          {activeCategory.leaderboards?.length ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {activeCategory.leaderboards.map((board) => (
                <LeaderboardCard key={board.id} board={board} />
              ))}
            </div>
          ) : null}

          {activeCategory.tables.length ? (
            <div className="grid grid-cols-1 gap-5">
              {activeCategory.tables.map((table) => (
                <DataTable key={table.id} table={table} />
              ))}
            </div>
          ) : null}

          {activeCategory.forms.length ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {activeCategory.forms.map((form) => (
                <FormCard
                  key={form.id}
                  categoryId={activeCategory.id}
                  formId={form.id}
                  title={form.title}
                  description={form.description}
                  cta={form.cta}
                  fields={form.fields}
                  onSubmit={handleFormSubmit}
                  submittedAt={formSubmissions[form.id]}
                  toggleValues={toggleValues}
                  onToggleChange={handleToggleChange}
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      {selectedWorkflow ? <WorkflowModal selection={selectedWorkflow} onClose={() => setSelectedWorkflow(null)} /> : null}
    </div>
  );
}
