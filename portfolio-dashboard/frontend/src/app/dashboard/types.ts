export type TrendDirection = 'up' | 'down' | 'steady';

export type IconName =
  | 'rocket'
  | 'users'
  | 'credit-card'
  | 'cpu'
  | 'bar-chart'
  | 'shopping-cart'
  | 'target'
  | 'chart-line'
  | 'clock'
  | 'mail'
  | 'alert'
  | 'sparkles'
  | 'shield'
  | 'bookmark'
  | 'video'
  | 'graduation'
  | 'pill'
  | 'building'
  | 'briefcase'
  | 'database'
  | 'stethoscope'
  | 'calendar'
  | 'zap'
  | 'list'
  | 'globe'
  | 'clipboard';

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: TrendDirection;
  caption?: string;
  icon: IconName;
};

export type LineSeries = {
  key: string;
  label: string;
  color: string;
};

export type LineChartDefinition = {
  id: string;
  type: 'line';
  title: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  series: LineSeries[];
  valuePrefix?: string;
  valueSuffix?: string;
};

export type BarSeries = {
  key: string;
  label: string;
  color: string;
};

export type BarChartDefinition = {
  id: string;
  type: 'bar';
  title: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  series: BarSeries[];
  valuePrefix?: string;
  valueSuffix?: string;
};

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export type DonutChartDefinition = {
  id: string;
  type: 'donut';
  title: string;
  description?: string;
  segments: DonutSegment[];
  centerLabel?: string;
};

export type FunnelStep = {
  label: string;
  value: number;
  annotation?: string;
};

export type FunnelChartDefinition = {
  id: string;
  type: 'funnel';
  title: string;
  description?: string;
  steps: FunnelStep[];
};

export type HeatmapCell = {
  label: string;
  value: number;
};

export type HeatmapRow = {
  label: string;
  values: HeatmapCell[];
};

export type HeatmapDefinition = {
  id: string;
  type: 'heatmap';
  title: string;
  description?: string;
  rows: HeatmapRow[];
  valueRange: [number, number];
  legend: string[];
};

export type ChartDefinition =
  | LineChartDefinition
  | BarChartDefinition
  | DonutChartDefinition
  | FunnelChartDefinition
  | HeatmapDefinition;

export type TableRow = {
  id: string;
  cells: (string | number)[];
  status?: TrendDirection;
  note?: string;
};

export type TableDefinition = {
  id: string;
  title: string;
  description?: string;
  columns: string[];
  rows: TableRow[];
};

export type AutomationWorkflow = {
  id: string;
  title: string;
  description: string;
  trigger: string;
  actions: string[];
  cadence: string;
  owner: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  nextRun: string;
};

export type KanbanItem = {
  id: string;
  title: string;
  assignee: string;
  badge: string;
  dueDate: string;
  effort: number;
};

export type KanbanColumn = {
  id: string;
  title: string;
  items: KanbanItem[];
};

export type WorkloadDistribution = {
  team: {
    name: string;
    role: string;
    allocation: number;
    capacity: number;
  }[];
};

export type CategoryExtras = {
  kanban?: {
    columns: KanbanColumn[];
    workload: WorkloadDistribution;
    summary: string;
  };
  highlights?: {
    title: string;
    items: { label: string; value: string }[];
  }[];
};

export type PortfolioCategory = {
  id: string;
  name: string;
  badge: string;
  description: string;
  summary: string;
  metrics: MetricCard[];
  charts: ChartDefinition[];
  tables: TableDefinition[];
  automations: AutomationWorkflow[];
  extras?: CategoryExtras;
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: IconName;
  badge?: string;
};

export type PortfolioDashboardResponse = {
  generatedAt: string;
  headline: string;
  intro: string;
  portfolioHighlights: MetricCard[];
  quickActions: QuickAction[];
  categories: PortfolioCategory[];
};
