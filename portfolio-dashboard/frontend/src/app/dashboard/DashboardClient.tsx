'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock3,
  Dot,
  Layers,
  MailCheck,
  PlayCircle,
  SlidersHorizontal,
  Sparkle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  type AutomationPlay,
  type CategorySubsection,
  type ChartBlock,
  type MetricCard,
  type PortfolioCategory,
  type PortfolioDashboardResponse,
  type TableBlock,
} from './types';
import { chartPalette, weekdayOrder } from './constants';

const trendIconMap = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  steady: CircleDashed,
} as const;

type TrendKey = keyof typeof trendIconMap;

const chartCardBase = 'rounded-3xl border border-indigo-100/40 bg-white/70 p-6 shadow-soft backdrop-blur-sm';

function formatChange(change: number) {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function formatValue(value: number, format: ChartBlock['format']) {
  switch (format) {
    case 'currency':
      return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString('en-US', {
        maximumFractionDigits: 1,
      });
  }
}

function MetricGrid({ metrics }: { metrics: MetricCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = trendIconMap[metric.trend as TrendKey];
        const tone =
          metric.trend === 'up'
            ? 'text-emerald-600 bg-emerald-50/80'
            : metric.trend === 'down'
              ? 'text-rose-600 bg-rose-50/80'
              : 'text-slate-600 bg-slate-100/80';

        return (
          <div
            key={metric.id}
            className="group relative overflow-hidden rounded-3xl border border-indigo-100/60 bg-white/70 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
              </div>
              <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${tone}`}>
                <Icon className="h-4 w-4" aria-hidden />
                {formatChange(metric.change)}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{metric.helper}</p>
          </div>
        );
      })}
    </div>
  );
}

function AutomationCard({ automation }: { automation: AutomationPlay }) {
  return (
    <div className="group rounded-3xl border border-indigo-100/50 bg-white/70 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-100/80 p-2 text-indigo-600">
          <Clock3 className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{automation.name}</p>
          <p className="text-xs text-slate-500">{automation.cadence}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-700">Trigger:</span> {automation.trigger}
        </p>
        <p>
          <span className="font-semibold text-slate-700">Action:</span> {automation.action}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-600">
          <MailCheck className="h-4 w-4" aria-hidden />
          {automation.channel}
        </div>
      </div>
    </div>
  );
}

function renderLineChart(chart: ChartBlock & { type: 'line' }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
        <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickFormatter={(value) => formatValue(value as number, chart.format ?? 'numeric')}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
          formatter={(value: number) => formatValue(value, chart.format ?? 'numeric')}
        />
        <Line type="monotone" dataKey={chart.valueKey as string} stroke={chartPalette.indigo[0]} strokeWidth={3} dot={false} />
        {chart.secondaryKey ? (
          <Line type="monotone" dataKey={chart.secondaryKey as string} stroke={chartPalette.emerald[0]} strokeWidth={3} dot={false} strokeDasharray="6 4" />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}

function renderBarChart(chart: ChartBlock & { type: 'bar' }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatValue(value as number, chart.format ?? 'numeric')}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
          formatter={(value: number) => formatValue(value, chart.format ?? 'numeric')}
        />
        <Bar dataKey="value" radius={[14, 14, 14, 14]} fill={chartPalette.indigo[0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function renderDonutChart(chart: ChartBlock & { type: 'donut' }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
          formatter={(value: number) => formatValue(value, chart.format ?? 'percent')}
        />
        <Pie data={chart.segments} innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name">
          {chart.segments.map((segment, index) => (
            <Cell key={segment.name} fill={segment.color ?? chartPalette.indigo[index % chartPalette.indigo.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

function renderFunnelChart(chart: ChartBlock & { type: 'funnel' }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              formatter={(value: number, _name, entry) => `${entry?.payload?.label ?? ''}: ${value.toLocaleString()}`}
              contentStyle={{
                borderRadius: 16,
                border: '1px solid rgba(99,102,241,0.1)',
                boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
              }}
            />
            <Funnel dataKey="value" data={chart.steps} isAnimationActive fill={chartPalette.indigo[0]} stroke="none">
              <LabelList position="inside" fill="#fff" stroke="none" dataKey="label" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3">
        {chart.steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between rounded-2xl border border-indigo-100/60 bg-indigo-50/70 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-600 shadow-sm">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="text-xs text-slate-500">{step.value.toLocaleString()} records</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-indigo-600">{step.conversion.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHeatmap(chart: ChartBlock & { type: 'heatmap' }) {
  // Safely calculate max value with validation
  const allValues = chart.weeks.flatMap((week) => week.days.map((day) => day.value));
  const numericValues = allValues.filter((value) => typeof value === 'number' && !isNaN(value));
  const max = numericValues.length > 0 ? Math.max(...numericValues) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
        <Dot className="h-4 w-4 text-indigo-400" />
        Activity pulses mapped against weekly rhythm
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-slate-500">Week</th>
              {weekdayOrder.map((day) => (
                <th key={day} className="px-2 py-2 text-xs font-semibold text-slate-500">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.weeks.map((week) => (
              <tr key={week.week}>
                <td className="px-2 py-2 text-xs font-semibold text-slate-600">{week.week}</td>
                {week.days.map((day) => {
                  const safeValue = typeof day.value === 'number' && !isNaN(day.value) ? day.value : 0;
                  const intensity = max > 0 ? safeValue / max : 0;
                  const bg = `rgba(99,102,241,${0.15 + intensity * 0.7})`;
                  return (
                    <td key={`${week.week}-${day.day}`} className="px-2 py-2">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold text-indigo-900"
                        style={{ background: bg }}
                      >
                        {safeValue}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold uppercase tracking-wide">Legend</span>
        {chart.legend.map((bucket) => (
          <span key={bucket} className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 px-3 py-1">
            <span className="h-2.5 w-6 rounded-full bg-indigo-400/70" />
            {bucket}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderWorkloadChart(chart: ChartBlock & { type: 'workload' }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="member" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
        />
        <Bar dataKey="backlog" stackId="stack" fill={chartPalette.indigo[1]} radius={[12, 12, 0, 0]} />
        <Bar dataKey="inProgress" stackId="stack" fill={chartPalette.indigo[0]} radius={[12, 12, 0, 0]} />
        <Bar dataKey="completed" stackId="stack" fill={chartPalette.emerald[0]} radius={[12, 12, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function renderRadialChart(chart: ChartBlock & { type: 'radial' }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={100}
        barSize={18}
        data={chart.segments.map((segment) => ({ ...segment, full: 100 }))}
      >
        <PolarAngleAxis type="number" domain={[0, chart.total]} tick={false} />
        <RadialBar background dataKey="value">
          {chart.segments.map((segment, index) => (
            <Cell key={segment.name} fill={segment.fill ?? chartPalette.indigo[index % chartPalette.indigo.length]} />
          ))}
        </RadialBar>
        <Tooltip
          formatter={(value: number, _name, entry) => `${entry?.payload?.name}: ${value}%`}
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.1)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

function ChartRenderer({ chart }: { chart: ChartBlock }) {
  switch (chart.type) {
    case 'line':
      return renderLineChart(chart);
    case 'bar':
      return renderBarChart(chart);
    case 'donut':
      return renderDonutChart(chart);
    case 'funnel':
      return renderFunnelChart(chart);
    case 'heatmap':
      return renderHeatmap(chart);
    case 'workload':
      return renderWorkloadChart(chart);
    case 'radial':
      return renderRadialChart(chart);
    default:
      return null;
  }
}

function TablePanel({ table }: { table: TableBlock }) {
  return (
    <div className={`${chartCardBase} overflow-hidden`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{table.title}</h3>
          <p className="text-sm text-slate-500">{table.description}</p>
        </div>
        <Layers className="h-5 w-5 text-indigo-400" aria-hidden />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              {table.columns.map((column) => (
                <th key={column.id} className={`px-3 pb-3 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100/60">
            {table.rows.map((row, index) => (
              <tr key={`${table.id}-${index}`} className="text-slate-700">
                {table.columns.map((column) => (
                  <td
                    key={`${table.id}-${index}-${column.id}`}
                    className={`px-3 py-3 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {row[column.id]}
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

function WorkflowPanel({
  title,
  steps,
}: {
  title: string;
  steps: { id: string; title: string; description: string }[];
}) {
  return (
    <div className="rounded-3xl border border-indigo-100/60 bg-white/70 p-6 shadow-soft">
      <div className="mb-6 flex items-center gap-3">
        <Sparkle className="h-5 w-5 text-indigo-500" aria-hidden />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4 rounded-2xl bg-indigo-50/70 p-4">
            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-600 shadow-sm">
              {index + 1}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{step.title}</p>
              <p className="mt-1 text-sm text-slate-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanBoard({ columns }: { columns: PortfolioCategory['kanban']['columns'] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {columns.map((column) => (
        <div key={column.id} className="rounded-3xl border border-indigo-100/60 bg-white/70 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">{column.name}</h4>
            <span className="rounded-full bg-indigo-50/90 px-2 py-0.5 text-xs font-semibold text-indigo-600">{column.count}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">SLA: {column.sla}</p>
          <div className="mt-4 space-y-3">
            {column.tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-indigo-100/60 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-700">{task.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{task.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SubsectionTabs({ sections }: { sections: CategorySubsection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const activeSection = sections.find((section) => section.id === active) ?? sections[0];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActive(section.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${section.id === active ? 'border-indigo-400 bg-indigo-500/90 text-white shadow-md' : 'border-indigo-100/70 bg-white/70 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
          >
            {section.name}
          </button>
        ))}
      </div>
      {activeSection ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="space-y-4">
            <MetricGrid metrics={activeSection.metrics} />
            <p className="text-sm text-slate-600">{activeSection.summary}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {activeSection.automations.map((automation) => (
                <AutomationCard key={automation.id} automation={automation} />
              ))}
            </div>
          </div>
          <div className={`${chartCardBase}`}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{activeSection.chart.title}</h3>
                <p className="text-sm text-slate-500">{activeSection.chart.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-indigo-400" aria-hidden />
            </div>
            <ChartRenderer chart={activeSection.chart} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AutomationGrid({ automations }: { automations: AutomationPlay[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {automations.map((automation) => (
        <AutomationCard key={automation.id} automation={automation} />
      ))}
    </div>
  );
}

function CategoryView({ category }: { category: PortfolioCategory }) {
  return (
    <div className="space-y-10">
      <section
        className={`overflow-hidden rounded-4xl border ${category.surface.accent} bg-gradient-to-br ${category.surface.from} ${category.surface.to} p-8 shadow-soft`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
              <PlayCircle className="h-4 w-4" aria-hidden />
              Portfolio module
            </div>
            <h2 className="text-3xl font-semibold drop-shadow-sm lg:text-4xl">{category.name}</h2>
            <p className="text-lg text-white/80">{category.tagline}</p>
            <p className="text-sm text-white/70">{category.description}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 text-white shadow-inner backdrop-blur">
            <p className="text-sm uppercase tracking-wide text-white/70">{category.spotlight.label}</p>
            <p className="mt-2 text-3xl font-semibold">{category.spotlight.value}</p>
            <p className="mt-2 text-sm text-white/80">{category.spotlight.helper}</p>
          </div>
        </div>
      </section>

      <MetricGrid metrics={category.metrics} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {category.charts.map((chart) => (
          <div key={chart.id} className={chartCardBase}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{chart.title}</h3>
                <p className="text-sm text-slate-500">{chart.description}</p>
              </div>
              <SlidersHorizontal className="h-5 w-5 text-indigo-400" aria-hidden />
            </div>
            <ChartRenderer chart={chart} />
          </div>
        ))}
      </section>

      {category.tables && category.tables.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {category.tables.map((table) => (
            <TablePanel key={table.id} table={table} />
          ))}
        </section>
      ) : null}

      {category.kanban ? (
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Kanban heartbeat</h3>
          <KanbanBoard columns={category.kanban.columns} />
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Automation plays</h3>
          <span className="text-sm text-slate-500">Background jobs & triggers mapped in plain view</span>
        </div>
        <AutomationGrid automations={category.automations} />
      </section>

      {category.workflows && category.workflows.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.workflows.map((workflow) => (
            <WorkflowPanel key={workflow.id} title={workflow.title} steps={workflow.steps} />
          ))}
        </section>
      ) : null}

      {category.subsections && category.subsections.length > 0 ? (
        <section>
          <h3 className="text-lg font-semibold text-slate-900">Industry-specific spotlights</h3>
          <SubsectionTabs sections={category.subsections} />
        </section>
      ) : null}
    </div>
  );
}

type DashboardClientProps = {
  initialData: PortfolioDashboardResponse;
};

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialData.categories[0]?.id ?? '');

  const categoriesById = useMemo(() =>
    initialData.categories.reduce<Record<string, PortfolioCategory>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {}),
  [initialData.categories]);

  const activeCategory = categoriesById[activeCategoryId] ?? initialData.categories[0];

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-indigo-100/60 bg-white/70 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Portfolio showcase</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 lg:text-4xl">Unified multi-domain command centre</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Explore production-ready dashboard modules across SaaS, commerce, analytics, productivity, media, education, and regulated industries.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-indigo-100/80 bg-indigo-50/60 px-5 py-3 text-sm text-indigo-600 shadow-soft">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
            Generated {new Date(initialData.generatedAt).toLocaleString()}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-6">
          <div className="flex flex-wrap gap-3">
            {initialData.categories.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${isActive ? 'border-indigo-400 bg-indigo-500/95 text-white shadow-md' : 'border-indigo-100/70 bg-white/70 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {activeCategory ? <CategoryView category={activeCategory} /> : null}
      </main>
    </div>
  );
}
