export type TrendDirection = 'up' | 'down' | 'steady';

export type PortfolioMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: TrendDirection;
  description: string;
  icon: string;
};

export type ChartSeries = {
  id: string;
  name: string;
  dataKey: string;
  color: string;
  stackId?: string;
};

export type CartesianChartConfig = {
  id: string;
  type: 'line' | 'bar' | 'stacked-bar';
  title: string;
  description: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
};

export type DonutChartConfig = {
  id: string;
  type: 'donut';
  title: string;
  description: string;
  data: { name: string; value: number; color?: string }[];
};

export type ChartConfig = CartesianChartConfig | DonutChartConfig;

export type HeatmapConfig = {
  id: string;
  title: string;
  description: string;
  days: string[];
  hours: string[];
  values: number[][];
};

export type FunnelStage = {
  id: string;
  label: string;
  value: number;
  conversion: string;
};

export type LeaderboardEntry = {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  change?: number;
  trend?: TrendDirection;
};

export type LeaderboardConfig = {
  id: string;
  title: string;
  description: string;
  columns: string[];
  rows: LeaderboardEntry[];
};

export type AutomationJob = {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'draft';
  cadence: string;
  trigger: string;
  actions: string[];
  owner: string;
  workflowId: string;
};

export type WorkflowStep = {
  id: string;
  name: string;
  detail: string;
  owner: string;
};

export type WorkflowBlueprint = {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
};

export type FormField = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'number' | 'datetime-local' | 'toggle';
  placeholder?: string;
  options?: string[];
};

export type FormDefinition = {
  id: string;
  title: string;
  description: string;
  cta: string;
  fields: FormField[];
};

export type TableColumn = {
  id: string;
  label: string;
};

export type TableRow = {
  id: string;
  cells: string[];
};

export type TableDefinition = {
  id: string;
  title: string;
  description: string;
  columns: TableColumn[];
  rows: TableRow[];
};

export type PortfolioCategory = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heroMetric: PortfolioMetric;
  metrics: PortfolioMetric[];
  highlights: string[];
  charts: ChartConfig[];
  heatmap?: HeatmapConfig;
  funnel?: FunnelStage[];
  leaderboards?: LeaderboardConfig[];
  tables: TableDefinition[];
  forms: FormDefinition[];
  automation: {
    summary: string;
    jobs: AutomationJob[];
    workflows: WorkflowBlueprint[];
  };
};

export type PortfolioDashboard = {
  generatedAt: string;
  categories: PortfolioCategory[];
};
