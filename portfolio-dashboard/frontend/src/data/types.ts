export type MetricTrend = 'up' | 'down' | 'steady';

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: MetricTrend;
  description?: string;
};

export type PieSegment = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type ChartPoint = {
  label: string;
  value: number;
  secondary?: number;
  tertiary?: number;
};

export type AutomationWorkflow = {
  id: string;
  title: string;
  trigger: string;
  action: string;
  owner: string;
  channel: string;
  cadence: string;
  active: boolean;
};

export type TabDefinition = {
  id: 'saas' | 'commerce' | 'corporate' | 'customApp' | 'content' | 'edtech' | 'specialized';
  label: string;
  description: string;
  accent: string;
};

export type SaaSSection = {
  metrics: MetricCard[];
  subscriptionPlans: Array<{
    id: string;
    name: string;
    price: string;
    activeUsers: number;
    activationRate: string;
    apiAllocation: string;
    churn: string;
    badge?: string;
  }>;
  churnSegments: PieSegment[];
  growthTrend: ChartPoint[];
  apiUsageTrend: ChartPoint[];
  automation: AutomationWorkflow[];
  billingCycles: Array<{
    id: string;
    label: string;
    nextRun: string;
    owners: string[];
    status: 'scheduled' | 'processing' | 'completed';
  }>;
};

export type CommerceSection = {
  metrics: MetricCard[];
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    revenue: string;
    conversionRate: string;
    inventory: number;
    trend: MetricTrend;
  }>;
  salesTrend: ChartPoint[];
  automation: AutomationWorkflow[];
  operations: Array<{
    id: string;
    title: string;
    description: string;
    status: 'healthy' | 'attention' | 'delayed';
  }>;
};

export type CorporateSection = {
  metrics: MetricCard[];
  funnel: Array<{
    id: string;
    stage: string;
    count: number;
    conversion: string;
    delta: number;
  }>;
  leadSources: PieSegment[];
  automation: AutomationWorkflow[];
  insights: Array<{
    id: string;
    headline: string;
    detail: string;
  }>;
};

export type CustomAppSection = {
  kanban: Array<{
    id: string;
    title: string;
    badge: string;
    tasks: Array<{
      id: string;
      title: string;
      owner: string;
      due: string;
      priority: 'low' | 'medium' | 'high';
      automation?: string;
    }>;
  }>;
  workloadDistribution: ChartPoint[];
  automation: AutomationWorkflow[];
  backlogIdeas: string[];
};

export type ContentSection = {
  metrics: MetricCard[];
  topStories: Array<{
    id: string;
    title: string;
    format: 'Article' | 'Video' | 'Podcast';
    publishedAt: string;
    engagement: string;
    status: 'Live' | 'Scheduled' | 'Draft';
  }>;
  engagementTrend: ChartPoint[];
  automation: AutomationWorkflow[];
  publishingQueue: Array<{
    id: string;
    slot: string;
    topic: string;
    editor: string;
    status: 'ready' | 'in-review' | 'blocked';
  }>;
};

export type EdTechSection = {
  metrics: MetricCard[];
  courses: Array<{
    id: string;
    title: string;
    enrollment: number;
    completion: string;
    avgScore: string;
  }>;
  activityHeatmap: {
    weeks: string[];
    days: string[];
    values: Array<{
      week: string;
      day: string;
      score: number;
    }>;
  };
  automation: AutomationWorkflow[];
  alerts: Array<{
    id: string;
    message: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
};

export type SpecializedSection = {
  realEstate: {
    metrics: MetricCard[];
    pipeline: Array<{
      id: string;
      address: string;
      stage: string;
      inquiries: number;
      agent: string;
    }>;
    automation: AutomationWorkflow[];
    trend: ChartPoint[];
  };
  finance: {
    metrics: MetricCard[];
    expenses: ChartPoint[];
    roiBreakdown: PieSegment[];
    automation: AutomationWorkflow[];
  };
  healthcare: {
    metrics: MetricCard[];
    appointments: Array<{
      id: string;
      patient: string;
      clinician: string;
      start: string;
      channel: 'In-person' | 'Virtual';
      status: 'Confirmed' | 'Awaiting Intake' | 'Completed';
    }>;
    automation: AutomationWorkflow[];
  };
};

export type PortfolioDashboardResponse = {
  generatedAt: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  tabs: TabDefinition[];
  saas: SaaSSection;
  commerce: CommerceSection;
  corporate: CorporateSection;
  customApp: CustomAppSection;
  content: ContentSection;
  edtech: EdTechSection;
  specialized: SpecializedSection;
};
