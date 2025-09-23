'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  LayoutDashboard,
  Layers,
  ListChecks,
  MessageCircle,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type Trend = 'up' | 'down' | 'steady';

type KPIDelta = {
  value: number;
  trend: Trend;
  description: string;
};

type KPIResponse = {
  total: number;
  completed: number;
  active: number;
  pending: number;
  deltas: Record<string, KPIDelta>;
  progress: {
    percentage: number;
    status: string;
    goal: string;
    updated_at: string;
  };
  highlights: Array<{
    id: string;
    label: string;
    value: string;
    context: string;
  }>;
};

type WeeklyAnalyticsResponse = {
  days: Array<{
    date: string;
    label: string;
    projects: number;
    completed: number;
    change: number;
  }>;
  summary: string;
};

type Reminder = {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'alert' | 'task';
  due_date: string;
  description: string;
  cta_label?: string;
  cta_link?: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: string;
  focus: string;
  avatar_color: string;
  productivity: number;
  tasks_completed: number;
  tasks_total: number;
};

type Task = {
  id: string;
  title: string;
  project: string;
  due_date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  assignee: string;
};

const navigationPrimary = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: true },
  { label: 'Calendar', href: '#calendar', icon: Calendar },
  { label: 'Analytics', href: '#analytics', icon: BarChart3 },
  { label: 'Team', href: '#team', icon: Users },
  { label: 'Projects', href: '#projects', icon: Layers },
];

const navigationSecondary = [
  { label: 'Messaging', href: '#messaging', icon: MessageCircle },
  { label: 'Integrations', href: '#integrations', icon: Activity },
  { label: 'Automation', href: '#automation', icon: PieChart },
  { label: 'Task Board', href: '#tasks', icon: ListChecks },
  { label: 'Reports', href: '#reports', icon: CheckCircle2 },
];

const priorityStyles: Record<Task['priority'], string> = {
  High: 'bg-rose-50 text-rose-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-sky-50 text-sky-600',
};

const trendStyles: Record<
  Trend,
  { text: string; bg: string; Icon: typeof ArrowUpRight | typeof ArrowDownRight | typeof ArrowRight }
> = {
  up: { text: 'text-emerald-600', bg: 'bg-emerald-50', Icon: ArrowUpRight },
  down: { text: 'text-rose-600', bg: 'bg-rose-50', Icon: ArrowDownRight },
  steady: { text: 'text-slate-500', bg: 'bg-slate-100', Icon: ArrowRight },
};

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(date);
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIResponse | null>(null);
  const [analytics, setAnalytics] = useState<WeeklyAnalyticsResponse | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [kpiRes, analyticsRes, remindersRes, teamRes, tasksRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/kpis`).then((res) => {
          if (!res.ok) throw new Error('Failed to load KPIs');
          return res.json();
        }),
        fetch(`${API_BASE_URL}/api/v1/weekly-analytics`).then((res) => {
          if (!res.ok) throw new Error('Failed to load weekly analytics');
          return res.json();
        }),
        fetch(`${API_BASE_URL}/api/v1/reminders`).then((res) => {
          if (!res.ok) throw new Error('Failed to load reminders');
          return res.json();
        }),
        fetch(`${API_BASE_URL}/api/v1/team`).then((res) => {
          if (!res.ok) throw new Error('Failed to load team');
          return res.json();
        }),
        fetch(`${API_BASE_URL}/api/v1/tasks`).then((res) => {
          if (!res.ok) throw new Error('Failed to load tasks');
          return res.json();
        }),
      ]);

      setKpis(kpiRes as KPIResponse);
      setAnalytics(analyticsRes as WeeklyAnalyticsResponse);
      setReminders((remindersRes.reminders ?? []) as Reminder[]);
      setTeam((teamRes.members ?? []) as TeamMember[]);
      setTasks((tasksRes.tasks ?? []) as Task[]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const summaryCards = useMemo(
    () => [
      {
        id: 'total',
        label: 'Total Projects',
        value: kpis?.total ?? 0,
        delta: kpis?.deltas?.total,
      },
      {
        id: 'completed',
        label: 'Ended Projects',
        value: kpis?.completed ?? 0,
        delta: kpis?.deltas?.completed,
      },
      {
        id: 'active',
        label: 'Running Projects',
        value: kpis?.active ?? 0,
        delta: kpis?.deltas?.active,
      },
      {
        id: 'pending',
        label: 'Pending Projects',
        value: kpis?.pending ?? 0,
        delta: kpis?.deltas?.pending,
      },
    ],
    [kpis],
  );

  const chartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.days.map((day) => ({
      name: day.label,
      projects: day.projects,
      completed: day.completed,
    }));
  }, [analytics]);

  const progressChartData = useMemo(() => {
    const percentage = kpis?.progress?.percentage ?? 0;
    return [
      { name: 'Progress', value: percentage, fill: '#1BC58D' },
      { name: 'Remaining', value: Math.max(0, 100 - percentage), fill: '#E8EEF5' },
    ];
  }, [kpis?.progress?.percentage]);

  return (
    <div className="min-h-screen text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white xl:flex">
          <div className="flex items-center gap-3 px-8 py-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-semibold text-emerald-600">
              D
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Donezo</p>
              <p className="text-sm text-slate-500">Productivity Suite</p>
            </div>
          </div>
          <nav className="flex-1 space-y-8 overflow-y-auto px-6 pb-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Overview</p>
              <ul className="space-y-1">
                {navigationPrimary.map(({ label, href, icon: Icon, active }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
              <ul className="space-y-1">
                {navigationSecondary.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="mx-6 mb-8 mt-auto rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 p-6 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-emerald-100">Mobile App</p>
                <p className="mt-1 text-lg font-semibold">Download our mobile app</p>
                <p className="mt-2 text-sm text-emerald-50">
                  Keep projects synced and manage updates wherever you are.
                </p>
              </div>
              <Smartphone className="h-10 w-10 text-emerald-100" />
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="px-5 py-8 sm:px-8 lg:px-12">
            <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Portfolio Overview</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Plan, prioritize, and accomplish your tasks with ease. Track KPIs, collaborate with your team, and stay ahead of upcoming milestones.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search tasks"
                    className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-emerald-600">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-emerald-600">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-emerald-600">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                    RQ
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">Ray Quizon</p>
                    <p className="text-xs text-slate-500">reyde@gmail.com</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Updated {kpis ? formatDate(kpis.progress.updated_at) : 'today'}
                </span>
                <span>Workspace sync is on</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
                  <ListChecks className="h-4 w-4" /> Import Data
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600">
                  <Plus className="h-4 w-4" /> Add Project
                </button>
              </div>
            </div>

            {error ? (
              <div className="mt-10 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
                <p className="text-sm font-semibold">{error}</p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  onClick={fetchDashboard}
                >
                  <RefreshCw className="h-4 w-4" /> Retry
                </button>
              </div>
            ) : (
              <div className="mt-10 space-y-8">
                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map((card) => {
                    const delta = card.delta;
                    const trend = delta?.trend ?? 'steady';
                    const { text, bg, Icon } = trendStyles[trend];
                    return (
                      <div
                        key={card.id}
                        className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 opacity-0 transition group-hover:opacity-100" />
                        <p className="text-sm font-medium text-slate-500">{card.label}</p>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
                            {delta ? (
                              <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${bg}`}>
                                <Icon className={`${text} h-4 w-4`} />
                                <span className={`${text}`}>{Math.abs(delta.value)}%</span>
                              </div>
                            ) : (
                              <div className="mt-3 h-6 w-24 rounded-full bg-slate-100" />
                            )}
                          </div>
                          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
                            <Activity className="h-6 w-6" />
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">{delta?.description ?? 'Awaiting insights'}</p>
                      </div>
                    );
                  })}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-2 space-y-6">
                    <div id="analytics" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Project Analytics</h2>
                          <p className="text-sm text-slate-500">Weekly overview of project throughput and completions</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600">
                          <ChevronRight className="h-4 w-4" /> View report
                        </button>
                      </div>
                      <div className="mt-6 h-64 w-full">
                        {loading && !chartData.length ? (
                          <div className="flex h-full items-center justify-center">
                            <div className="h-24 w-24 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barCategoryGap={16}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                              <Tooltip
                                cursor={{ fill: 'rgba(15, 118, 110, 0.08)' }}
                                contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 20px 50px -20px rgba(15, 23, 42, 0.25)' }}
                              />
                              <Bar dataKey="projects" fill="#22C55E" radius={[12, 12, 12, 12]} maxBarSize={40} />
                              <Bar dataKey="completed" fill="#0EA5E9" radius={[12, 12, 12, 12]} maxBarSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {kpis?.highlights.map((highlight) => (
                          <div key={highlight.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{highlight.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{highlight.value}</p>
                            <p className="mt-2 text-xs text-slate-500">{highlight.context}</p>
                          </div>
                        ))}
                      </div>
                      {analytics?.summary ? (
                        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{analytics.summary}</p>
                      ) : null}
                    </div>

                    <div id="team" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Team Collaboration</h2>
                          <p className="text-sm text-slate-500">Monitor workload, progress, and focus areas for each collaborator</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100">
                          <Plus className="h-4 w-4" /> Add member
                        </button>
                      </div>
                      <ul className="mt-6 space-y-4">
                        {(loading && !team.length ? Array.from({ length: 4 }) : team).map((member, index) => (
                          <li
                            key={typeof member === 'object' ? member.id : index}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"
                          >
                            {typeof member === 'object' ? (
                              <>
                                <div className="flex items-center gap-4">
                                  <div
                                    className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
                                    style={{ backgroundColor: member.avatar_color }}
                                  >
                                    {getInitials(member.name)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                                    <p className="text-xs text-slate-500">{member.role}</p>
                                  </div>
                                </div>
                                <div className="hidden items-center gap-3 text-sm text-slate-500 md:flex">
                                  <span className="font-medium text-slate-900">{member.tasks_completed}</span>
                                  <span className="text-xs uppercase tracking-wide text-slate-400">/</span>
                                  <span>{member.tasks_total} tasks</span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {member.status}
                                  </span>
                                  <p className="text-xs text-slate-500">{member.focus}</p>
                                  <div className="flex h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full"
                                      style={{ width: `${Math.min(100, (member.tasks_completed / member.tasks_total) * 100)}%`, backgroundColor: member.avatar_color }}
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="h-10 w-full animate-pulse rounded-full bg-slate-100" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div id="tasks" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Project Tasks</h2>
                          <p className="text-sm text-slate-500">Stay ahead of deadlines with clear priorities and owners</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600">
                          <ChevronRight className="h-4 w-4" /> View all tasks
                        </button>
                      </div>
                      <div className="mt-5 space-y-4">
                        {(loading && !tasks.length ? Array.from({ length: 4 }) : tasks).map((task, index) => (
                          <div
                            key={typeof task === 'object' ? task.id : index}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-emerald-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                          >
                            {typeof task === 'object' ? (
                              <>
                                <div className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </span>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                                    <p className="text-xs text-slate-500">{task.project}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[(task as Task).priority]}`}>
                                    {task.priority} priority
                                  </span>
                                  <span>{formatDate(task.due_date)}</span>
                                  <span>•</span>
                                  <span>{task.assignee}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                  <ChevronRight className="h-4 w-4" /> Update status
                                </div>
                              </>
                            ) : (
                              <div className="h-8 w-full animate-pulse rounded-full bg-slate-100" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div id="reminders" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Reminders</h2>
                          <p className="text-sm text-slate-500">Upcoming meetings, deadlines, and alerts</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600">
                          <Calendar className="h-4 w-4" /> View calendar
                        </button>
                      </div>
                      <div className="mt-5 space-y-4">
                        {(loading && !reminders.length ? Array.from({ length: 3 }) : reminders).map((reminder, index) => (
                          <div
                            key={typeof reminder === 'object' ? reminder.id : index}
                            className="rounded-2xl border border-slate-100 p-4"
                          >
                            {typeof reminder === 'object' ? (
                              <>
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{reminder.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{reminder.description}</p>
                                  </div>
                                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-600">
                                    {reminder.type}
                                  </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                  <span>
                                    {formatDate(reminder.due_date)} • {formatTime(reminder.due_date)}
                                  </span>
                                  {reminder.cta_label ? (
                                    <a
                                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                                      href={reminder.cta_link ?? '#'}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {reminder.cta_label}
                                      <ChevronRight className="h-4 w-4" />
                                    </a>
                                  ) : null}
                                </div>
                              </>
                            ) : (
                              <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-100" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Project Progress</h2>
                          <p className="text-sm text-slate-500">Live status of current delivery goals</p>
                        </div>
                        <RefreshCw className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="relative mt-6 flex h-56 w-full items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            innerRadius="60%"
                            outerRadius="95%"
                            data={progressChartData}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar dataKey="value" cornerRadius={40} background fill="#E2E8F0" />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                          <p className="text-4xl font-semibold text-slate-900">{kpis?.progress?.percentage ?? 0}%</p>
                          <p className="text-xs uppercase tracking-wide text-emerald-600">Complete</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-500">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span>Current status</span>
                          <span className="font-semibold text-emerald-600">{kpis?.progress?.status ?? 'Tracking'}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span>Goal</span>
                          <span className="font-semibold text-slate-900">{kpis?.progress?.goal ?? 'Q2 Milestones'}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span>Last updated</span>
                          <span>{kpis ? formatDate(kpis.progress.updated_at) : 'Today'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
