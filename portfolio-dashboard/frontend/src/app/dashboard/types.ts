import type { LucideIcon } from 'lucide-react';

export type TrendDirection = 'up' | 'down' | 'steady';

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: TrendDirection;
  helper: string;
};

export type SpotlightStat = {
  label: string;
  value: string;
  helper: string;
};

type BaseChart = {
  id: string;
  title: string;
  description: string;
};

type LineSeries = {
  period: string;
  value: number;
  secondary?: number;
};

type CategoryValue = {
  name: string;
  value: number;
};

type DonutSegment = CategoryValue & {
  color?: string;
};

type FunnelStep = {
  id: string;
  label: string;
  value: number;
  conversion: number;
};

type HeatmapWeek = {
  week: string;
  days: {
    day: string;
    value: number;
  }[];
};

type StackedSlice = {
  name: string;
  value: number;
  fill?: string;
};

type WorkloadEntry = {
  member: string;
  backlog: number;
  inProgress: number;
  completed: number;
};

export type LineChartBlock = BaseChart & {
  type: 'line';
  data: LineSeries[];
  valueKey: keyof LineSeries;
  secondaryKey?: keyof LineSeries;
  format?: 'currency' | 'percent' | 'numeric';
};

export type BarChartBlock = BaseChart & {
  type: 'bar';
  data: CategoryValue[];
  format?: 'currency' | 'percent' | 'numeric';
};

export type DonutChartBlock = BaseChart & {
  type: 'donut';
  segments: DonutSegment[];
  format?: 'percent' | 'numeric';
};

export type FunnelChartBlock = BaseChart & {
  type: 'funnel';
  steps: FunnelStep[];
};

export type HeatmapChartBlock = BaseChart & {
  type: 'heatmap';
  weeks: HeatmapWeek[];
  legend: string[];
};

export type WorkloadChartBlock = BaseChart & {
  type: 'workload';
  data: WorkloadEntry[];
};

export type RadialChartBlock = BaseChart & {
  type: 'radial';
  segments: StackedSlice[];
  total: number;
};

export type ChartBlock =
  | LineChartBlock
  | BarChartBlock
  | DonutChartBlock
  | FunnelChartBlock
  | HeatmapChartBlock
  | WorkloadChartBlock
  | RadialChartBlock;

export type TableColumn = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

export type TableRow = Record<string, string>;

export type TableBlock = {
  id: string;
  title: string;
  description: string;
  columns: TableColumn[];
  rows: TableRow[];
};

export type AutomationPlay = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: string;
  cadence: string;
};

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
};

export type WorkflowDiagram = {
  id: string;
  title: string;
  steps: WorkflowStep[];
};

export type KanbanColumn = {
  id: string;
  name: string;
  sla: string;
  count: number;
  tasks: {
    id: string;
    title: string;
    assignee: string;
  }[];
};

export type CategorySubsection = {
  id: string;
  name: string;
  metrics: MetricCard[];
  summary: string;
  chart: ChartBlock;
  automations: AutomationPlay[];
};

export type PortfolioCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  surface: {
    accent: string;
    from: string;
    to: string;
  };
  spotlight: SpotlightStat;
  metrics: MetricCard[];
  charts: ChartBlock[];
  tables?: TableBlock[];
  automations: AutomationPlay[];
  workflows?: WorkflowDiagram[];
  kanban?: {
    columns: KanbanColumn[];
  };
  subsections?: CategorySubsection[];
};

export type PortfolioDashboardResponse = {
  generatedAt: string;
  categories: PortfolioCategory[];
};
