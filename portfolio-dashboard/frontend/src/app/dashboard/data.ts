import { cache } from 'react';

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
  id:
    | 'saas'
    | 'commerce'
    | 'corporate'
    | 'customApp'
    | 'content'
    | 'edtech'
    | 'specialized';
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

const portfolioDashboard: PortfolioDashboardResponse = {
  generatedAt: '2024-11-18T08:00:00.000Z',
  hero: {
    title: 'Portfolio-grade product operations',
    subtitle: 'Multi-domain dashboards built with enterprise rigor',
    description:
      'A curated showcase of SaaS, commerce, corporate, custom app, media, education, and niche solutions — all sharing one premium design system.',
    cta: 'Request full capability deck',
  },
  tabs: [
    {
      id: 'saas',
      label: 'SaaS Platform',
      description: 'Subscription intelligence & API operations',
      accent: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'commerce',
      label: 'E-Commerce',
      description: 'Merchandising, orders & fulfillment',
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'corporate',
      label: 'Corporate Analytics',
      description: 'Growth marketing & pipeline analytics',
      accent: 'from-sky-500 to-indigo-500',
    },
    {
      id: 'customApp',
      label: 'Custom Web App',
      description: 'Productivity suite & automation',
      accent: 'from-purple-500 to-fuchsia-500',
    },
    {
      id: 'content',
      label: 'Content & Media',
      description: 'Publishing workflow & engagement',
      accent: 'from-amber-500 to-orange-500',
    },
    {
      id: 'edtech',
      label: 'EdTech',
      description: 'Learning analytics & student success',
      accent: 'from-rose-500 to-pink-500',
    },
    {
      id: 'specialized',
      label: 'Specialized Niches',
      description: 'Real estate, finance & healthcare',
      accent: 'from-slate-500 to-slate-700',
    },
  ],
  saas: {
    metrics: [
      {
        id: 'mrr',
        label: 'Monthly Recurring Revenue',
        value: '$248K',
        change: 12.6,
        trend: 'up',
        description: 'vs last quarter',
      },
      {
        id: 'active-users',
        label: 'Active Workspaces',
        value: '8,942',
        change: 4.2,
        trend: 'up',
        description: 'Weekly active organizations',
      },
      {
        id: 'api-usage',
        label: 'API Consumption',
        value: '182M calls',
        change: 8.1,
        trend: 'up',
        description: '30 day rolling window',
      },
      {
        id: 'churn',
        label: 'Net Revenue Retention',
        value: '108%',
        change: 2.4,
        trend: 'up',
        description: 'Cohort-adjusted',
      },
    ],
    subscriptionPlans: [
      {
        id: 'starter',
        name: 'Starter',
        price: '$49 / seat',
        activeUsers: 1228,
        activationRate: '82%',
        apiAllocation: '250K calls / mo',
        churn: '1.2%',
      },
      {
        id: 'scale',
        name: 'Scale',
        price: '$189 / seat',
        activeUsers: 3124,
        activationRate: '91%',
        apiAllocation: '2M calls / mo',
        churn: '0.7%',
        badge: 'Most popular',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        activeUsers: 3590,
        activationRate: '96%',
        apiAllocation: 'Unlimited with SLA',
        churn: '0.3%',
        badge: 'SAML + SOC2',
      },
    ],
    churnSegments: [
      { id: 'healthy', label: 'Healthy renewals', value: 68, color: '#4f46e5' },
      { id: 'expansion', label: 'Expansion upgrades', value: 22, color: '#6366f1' },
      { id: 'at-risk', label: 'At-risk accounts', value: 7, color: '#f59e0b' },
      { id: 'churned', label: 'Churned', value: 3, color: '#f87171' },
    ],
    growthTrend: [
      { label: 'Jan', value: 182 },
      { label: 'Feb', value: 188 },
      { label: 'Mar', value: 196 },
      { label: 'Apr', value: 205 },
      { label: 'May', value: 212 },
      { label: 'Jun', value: 224 },
      { label: 'Jul', value: 233 },
      { label: 'Aug', value: 241 },
      { label: 'Sep', value: 248 },
      { label: 'Oct', value: 258 },
      { label: 'Nov', value: 268 },
      { label: 'Dec', value: 276 },
    ],
    apiUsageTrend: [
      { label: 'Week 1', value: 118 },
      { label: 'Week 2', value: 124 },
      { label: 'Week 3', value: 132 },
      { label: 'Week 4', value: 146 },
      { label: 'Week 5', value: 151 },
      { label: 'Week 6', value: 160 },
      { label: 'Week 7', value: 172 },
      { label: 'Week 8', value: 182 },
    ],
    automation: [
      {
        id: 'billing-cycle',
        title: 'Billing cycle reconciliation',
        trigger: 'First business day 02:00 UTC',
        action: 'Sync invoices to ERP, post revenue recognition entries',
        owner: 'Finance Ops',
        channel: 'Webhook + Slack digest',
        cadence: 'Monthly',
        active: true,
      },
      {
        id: 'churn-alerts',
        title: 'Churn signal outreach',
        trigger: 'Usage drops below 40% baseline',
        action: 'Open Gainsight CTA & email CSM playbook',
        owner: 'Lifecycle Team',
        channel: 'Email + CRM task',
        cadence: 'Real-time',
        active: true,
      },
      {
        id: 'api-burst',
        title: 'API burst protection',
        trigger: 'Threshold > 90% allocation',
        action: 'Scale rate limits and notify platform pager',
        owner: 'SRE',
        channel: 'PagerDuty + Slack',
        cadence: 'Real-time',
        active: true,
      },
    ],
    billingCycles: [
      {
        id: 'cycle-jan',
        label: 'January close',
        nextRun: '2024-12-02',
        owners: ['Finance Ops', 'Revenue'],
        status: 'completed',
      },
      {
        id: 'cycle-feb',
        label: 'February close',
        nextRun: '2025-01-02',
        owners: ['Finance Ops', 'RevOps'],
        status: 'scheduled',
      },
      {
        id: 'cycle-mid',
        label: 'Mid-cycle true-up',
        nextRun: '2024-12-15',
        owners: ['Billing'],
        status: 'processing',
      },
    ],
  },
  commerce: {
    metrics: [
      {
        id: 'gmv',
        label: 'Gross Merchandise Volume',
        value: '$3.8M',
        change: 9.4,
        trend: 'up',
        description: 'Rolling 30 days',
      },
      {
        id: 'orders',
        label: 'Orders fulfilled',
        value: '48,920',
        change: 5.1,
        trend: 'up',
        description: '7 day trend',
      },
      {
        id: 'aov',
        label: 'Average order value',
        value: '$78.40',
        change: 2.3,
        trend: 'up',
        description: 'vs last cycle',
      },
      {
        id: 'returns',
        label: 'Return rate',
        value: '2.1%',
        change: -0.6,
        trend: 'down',
        description: 'Month over month',
      },
    ],
    topProducts: [
      {
        id: 'prod-1',
        name: 'Luxe All-Weather Jacket',
        category: 'Outerwear',
        revenue: '$482K',
        conversionRate: '6.4%',
        inventory: 432,
        trend: 'up',
      },
      {
        id: 'prod-2',
        name: 'Minimalist Trainer',
        category: 'Footwear',
        revenue: '$408K',
        conversionRate: '5.8%',
        inventory: 286,
        trend: 'up',
      },
      {
        id: 'prod-3',
        name: 'Studio Performance Set',
        category: 'Activewear',
        revenue: '$365K',
        conversionRate: '4.9%',
        inventory: 189,
        trend: 'steady',
      },
      {
        id: 'prod-4',
        name: 'Smart Hydration Bottle',
        category: 'Accessories',
        revenue: '$298K',
        conversionRate: '7.2%',
        inventory: 520,
        trend: 'up',
      },
    ],
    salesTrend: [
      { label: 'Mar', value: 210 },
      { label: 'Apr', value: 245 },
      { label: 'May', value: 262 },
      { label: 'Jun', value: 280 },
      { label: 'Jul', value: 295 },
      { label: 'Aug', value: 318 },
      { label: 'Sep', value: 344 },
      { label: 'Oct', value: 366 },
      { label: 'Nov', value: 398 },
      { label: 'Dec', value: 436 },
    ],
    automation: [
      {
        id: 'abandoned-cart',
        title: 'Abandoned cart sequence',
        trigger: 'Cart inactive for 2 hours',
        action: 'Send multi-step SMS + email incentive',
        owner: 'Lifecycle',
        channel: 'Klaviyo + WhatsApp',
        cadence: 'Rolling',
        active: true,
      },
      {
        id: 'inventory-sync',
        title: 'Inventory auto-replenish',
        trigger: 'SKU < 15% safety stock',
        action: 'Create PO draft & alert vendor portal',
        owner: 'Merchandising',
        channel: 'ERP webhook + Slack',
        cadence: 'Hourly',
        active: true,
      },
      {
        id: 'vip-segment',
        title: 'VIP surprise & delight',
        trigger: 'CLV percentile > 92%',
        action: 'Generate loyalty gift & auto-ship notice',
        owner: 'CX Team',
        channel: 'Email + Fulfillment',
        cadence: 'Weekly',
        active: true,
      },
    ],
    operations: [
      {
        id: 'slas',
        title: 'Fulfillment SLAs',
        description: '98.2% of orders shipped within 24h. Carrier hand-offs auto-escalated at 30m delay.',
        status: 'healthy',
      },
      {
        id: 'payments',
        title: 'Payment health',
        description: 'Auto-retry recovering 74% of soft declines. PSP drift monitoring active.',
        status: 'healthy',
      },
      {
        id: 'support',
        title: 'Support backlog',
        description: 'High seasonality window predicted. Chatbot deflecting 61% of tier-1 inquiries.',
        status: 'attention',
      },
    ],
  },
  corporate: {
    metrics: [
      {
        id: 'pipeline',
        label: 'Qualified pipeline',
        value: '$12.4M',
        change: 14.1,
        trend: 'up',
        description: 'SQL forecast next 90 days',
      },
      {
        id: 'visits',
        label: 'Monthly unique visitors',
        value: '642K',
        change: 6.8,
        trend: 'up',
        description: 'Omni-channel',
      },
      {
        id: 'conversion',
        label: 'Marketing to SQL conversion',
        value: '3.7%',
        change: 0.5,
        trend: 'up',
        description: 'Attribution weighted',
      },
      {
        id: 'cycle',
        label: 'Sales cycle length',
        value: '41 days',
        change: -3.2,
        trend: 'down',
        description: 'vs prior quarter',
      },
    ],
    funnel: [
      { id: 'stage1', stage: 'Website visitors', count: 642000, conversion: '100%', delta: 6.8 },
      { id: 'stage2', stage: 'Marketing qualified', count: 88400, conversion: '13.7%', delta: 2.1 },
      { id: 'stage3', stage: 'Sales qualified', count: 32870, conversion: '37.2%', delta: 1.6 },
      { id: 'stage4', stage: 'Opportunities', count: 9870, conversion: '30.0%', delta: 0.9 },
      { id: 'stage5', stage: 'Closed won', count: 3620, conversion: '36.6%', delta: 0.7 },
    ],
    leadSources: [
      { id: 'organic', label: 'Organic search', value: 32, color: '#2563eb' },
      { id: 'paid', label: 'Paid media', value: 27, color: '#7c3aed' },
      { id: 'events', label: 'Events & webinars', value: 18, color: '#06b6d4' },
      { id: 'partners', label: 'Partner referrals', value: 14, color: '#f97316' },
      { id: 'direct', label: 'Direct & outbound', value: 9, color: '#10b981' },
    ],
    automation: [
      {
        id: 'lead-scoring',
        title: 'Predictive lead scoring',
        trigger: 'Lead created or enriched',
        action: 'Score with RevAI model & sync to CRM owner',
        owner: 'Growth Ops',
        channel: 'Salesforce + Slack',
        cadence: 'Continuous',
        active: true,
      },
      {
        id: 'intent-sync',
        title: 'Intent surge sync',
        trigger: '6sense surge tier ≥ 3',
        action: 'Notify AE pod & launch playbook ads',
        owner: 'ABM Team',
        channel: 'Slack + LinkedIn ads',
        cadence: 'Daily',
        active: true,
      },
      {
        id: 'nurture',
        title: 'Lifecycle nurture',
        trigger: 'Stage stagnation > 14 days',
        action: 'Auto-schedule enablement webinar & send recap kit',
        owner: 'Marketing Ops',
        channel: 'HubSpot + Outreach',
        cadence: 'Weekly',
        active: true,
      },
    ],
    insights: [
      {
        id: 'insight-1',
        headline: 'C-suite demo conversions up 41%',
        detail: 'Executive persona nurture tracks now include ROI model calculators with Salesforce sync.',
      },
      {
        id: 'insight-2',
        headline: 'Paid social CAC stabilized',
        detail: 'Creative variant testing automatically pauses under-performing ads after 4 hours.',
      },
      {
        id: 'insight-3',
        headline: 'Field events driving pipeline velocity',
        detail: 'On-site QR capture flows push leads directly into lead scoring queue with SLA monitors.',
      },
    ],
  },
  customApp: {
    kanban: [
      {
        id: 'backlog',
        title: 'Backlog',
        badge: '9 ideas',
        tasks: [
          {
            id: 'task-101',
            title: 'AI summary widget',
            owner: 'Priya Patel',
            due: 'Dec 22',
            priority: 'medium',
            automation: 'Draft PRD via spec generator',
          },
          {
            id: 'task-102',
            title: 'Workspace theming engine',
            owner: 'Diego Suarez',
            due: 'Jan 5',
            priority: 'high',
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'In progress',
        badge: '4 active',
        tasks: [
          {
            id: 'task-201',
            title: 'Cross-team automation hub',
            owner: 'Leah Armstrong',
            due: 'Dec 12',
            priority: 'high',
            automation: 'Sync with Ops API nightly',
          },
          {
            id: 'task-202',
            title: 'Mobile offline sync',
            owner: 'Jamal Jones',
            due: 'Dec 18',
            priority: 'medium',
          },
        ],
      },
      {
        id: 'review',
        title: 'In review',
        badge: '2 awaiting QA',
        tasks: [
          {
            id: 'task-301',
            title: 'Timeline collaboration mode',
            owner: 'Mei Chen',
            due: 'Dec 9',
            priority: 'medium',
          },
          {
            id: 'task-302',
            title: 'Accessibility audit fixes',
            owner: 'Alex Rivera',
            due: 'Dec 7',
            priority: 'high',
          },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        badge: '7 shipped',
        tasks: [
          {
            id: 'task-401',
            title: 'Insights email digest',
            owner: 'Tina Nguyen',
            due: 'Nov 28',
            priority: 'low',
            automation: 'Sent weekly via marketing cloud',
          },
        ],
      },
    ],
    workloadDistribution: [
      { label: 'Priya', value: 6, secondary: 8 },
      { label: 'Diego', value: 5, secondary: 7 },
      { label: 'Leah', value: 8, secondary: 9 },
      { label: 'Jamal', value: 4, secondary: 8 },
      { label: 'Mei', value: 5, secondary: 6 },
      { label: 'Alex', value: 7, secondary: 7 },
      { label: 'Tina', value: 3, secondary: 6 },
    ],
    automation: [
      {
        id: 'recurring-tasks',
        title: 'Recurring sprint rituals',
        trigger: 'Sprint kickoff Monday 09:00',
        action: 'Clone retro template, assign owners, schedule Slack reminders',
        owner: 'Product Ops',
        channel: 'Slack + Calendar',
        cadence: 'Bi-weekly',
        active: true,
      },
      {
        id: 'task-reminders',
        title: 'Task nudges',
        trigger: 'Due date within 48h & status != done',
        action: 'Send digest to assignee & manager summary',
        owner: 'Automation Bot',
        channel: 'Email + In-app',
        cadence: 'Daily',
        active: true,
      },
      {
        id: 'intake',
        title: 'Idea intake triage',
        trigger: 'New idea submitted via form',
        action: 'Auto-label, estimate complexity, route to PM group',
        owner: 'PMO',
        channel: 'Notion + Jira',
        cadence: 'Real-time',
        active: true,
      },
    ],
    backlogIdeas: [
      'Security policy automation for SOC2 evidence',
      'AI co-pilot for white-glove onboarding tasks',
      'Revenue workspace with finance system sync',
      'Customer health scoring scenario planner',
    ],
  },
  content: {
    metrics: [
      {
        id: 'plays',
        label: 'Monthly plays & reads',
        value: '2.3M',
        change: 18.2,
        trend: 'up',
        description: 'Cross-channel reach',
      },
      {
        id: 'watch',
        label: 'Avg. watch time',
        value: '7m 42s',
        change: 1.5,
        trend: 'up',
        description: 'Video content',
      },
      {
        id: 'subs',
        label: 'Subscriber growth',
        value: '+18,420',
        change: 11.4,
        trend: 'up',
        description: 'Net new month-to-date',
      },
      {
        id: 'engagement',
        label: 'Engagement score',
        value: '87 / 100',
        change: 3.8,
        trend: 'up',
        description: 'Behavioral weighted',
      },
    ],
    topStories: [
      {
        id: 'story-1',
        title: 'Scaling editorial workflows with automation',
        format: 'Article',
        publishedAt: 'Nov 21 • 9:00 AM',
        engagement: '246K views',
        status: 'Live',
      },
      {
        id: 'story-2',
        title: 'Creator economy outlook 2025',
        format: 'Video',
        publishedAt: 'Nov 23 • 2:30 PM',
        engagement: '183K plays',
        status: 'Live',
      },
      {
        id: 'story-3',
        title: 'Audience growth operating system demo',
        format: 'Video',
        publishedAt: 'Nov 25 • 11:00 AM',
        engagement: 'Scheduled',
        status: 'Scheduled',
      },
      {
        id: 'story-4',
        title: 'Creative briefs that convert (template kit)',
        format: 'Article',
        publishedAt: 'Nov 27 • 4:00 PM',
        engagement: 'In review',
        status: 'Draft',
      },
    ],
    engagementTrend: [
      { label: 'Week 1', value: 312 },
      { label: 'Week 2', value: 354 },
      { label: 'Week 3', value: 372 },
      { label: 'Week 4', value: 418 },
      { label: 'Week 5', value: 446 },
      { label: 'Week 6', value: 488 },
      { label: 'Week 7', value: 525 },
      { label: 'Week 8', value: 572 },
    ],
    automation: [
      {
        id: 'scheduled-publishing',
        title: 'Scheduled publishing control tower',
        trigger: 'Content status = Approved & slot available',
        action: 'Publish, notify social distribution, archive briefs',
        owner: 'Managing Editor',
        channel: 'CMS webhook + Slack',
        cadence: 'Hourly',
        active: true,
      },
      {
        id: 'auto-tagging',
        title: 'Semantic auto-tagging',
        trigger: 'Asset uploaded to media library',
        action: 'Enrich taxonomy, push SEO metadata suggestions',
        owner: 'Growth Studio',
        channel: 'CMS + Notion wiki',
        cadence: 'Real-time',
        active: true,
      },
      {
        id: 'highlight-reel',
        title: 'Highlights reel generator',
        trigger: 'Video crosses 65% engagement threshold',
        action: 'Compile clips and distribute to short-form channels',
        owner: 'Audience Team',
        channel: 'Premiere Pro API + Dropbox',
        cadence: 'Daily',
        active: true,
      },
    ],
    publishingQueue: [
      {
        id: 'slot-1',
        slot: 'Mon • 8:00 AM',
        topic: 'CMO roundtable recap',
        editor: 'Jordan Blake',
        status: 'ready',
      },
      {
        id: 'slot-2',
        slot: 'Tue • 12:30 PM',
        topic: 'Product design AMA',
        editor: 'Renee Park',
        status: 'in-review',
      },
      {
        id: 'slot-3',
        slot: 'Thu • 5:00 PM',
        topic: 'Audience segmentation deep dive',
        editor: 'Miles Chan',
        status: 'ready',
      },
      {
        id: 'slot-4',
        slot: 'Fri • 9:30 AM',
        topic: 'Studio build walk-through',
        editor: 'Riya Kapoor',
        status: 'blocked',
      },
    ],
  },
  edtech: {
    metrics: [
      {
        id: 'enrollment',
        label: 'Active learners',
        value: '42,318',
        change: 7.5,
        trend: 'up',
        description: 'Across all cohorts',
      },
      {
        id: 'completion',
        label: 'Completion rate',
        value: '78%',
        change: 3.1,
        trend: 'up',
        description: '12-week trailing',
      },
      {
        id: 'quiz',
        label: 'Avg quiz score',
        value: '86%',
        change: 1.9,
        trend: 'up',
        description: 'Adaptive assessments',
      },
      {
        id: 'cert',
        label: 'Certificates issued',
        value: '5,842',
        change: 11.7,
        trend: 'up',
        description: 'Auto-generated',
      },
    ],
    courses: [
      {
        id: 'course-1',
        title: 'AI Product Strategy',
        enrollment: 12890,
        completion: '82%',
        avgScore: '88%',
      },
      {
        id: 'course-2',
        title: 'Full-stack Engineering Lab',
        enrollment: 9734,
        completion: '76%',
        avgScore: '84%',
      },
      {
        id: 'course-3',
        title: 'Design Systems Mastery',
        enrollment: 6821,
        completion: '88%',
        avgScore: '91%',
      },
      {
        id: 'course-4',
        title: 'Data Storytelling Studio',
        enrollment: 4873,
        completion: '71%',
        avgScore: '79%',
      },
    ],
    activityHeatmap: {
      weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [
        { week: 'Week 1', day: 'Mon', score: 42 },
        { week: 'Week 1', day: 'Tue', score: 55 },
        { week: 'Week 1', day: 'Wed', score: 62 },
        { week: 'Week 1', day: 'Thu', score: 48 },
        { week: 'Week 1', day: 'Fri', score: 58 },
        { week: 'Week 1', day: 'Sat', score: 33 },
        { week: 'Week 1', day: 'Sun', score: 28 },
        { week: 'Week 2', day: 'Mon', score: 64 },
        { week: 'Week 2', day: 'Tue', score: 71 },
        { week: 'Week 2', day: 'Wed', score: 78 },
        { week: 'Week 2', day: 'Thu', score: 66 },
        { week: 'Week 2', day: 'Fri', score: 72 },
        { week: 'Week 2', day: 'Sat', score: 45 },
        { week: 'Week 2', day: 'Sun', score: 39 },
        { week: 'Week 3', day: 'Mon', score: 58 },
        { week: 'Week 3', day: 'Tue', score: 63 },
        { week: 'Week 3', day: 'Wed', score: 69 },
        { week: 'Week 3', day: 'Thu', score: 61 },
        { week: 'Week 3', day: 'Fri', score: 64 },
        { week: 'Week 3', day: 'Sat', score: 36 },
        { week: 'Week 3', day: 'Sun', score: 31 },
        { week: 'Week 4', day: 'Mon', score: 72 },
        { week: 'Week 4', day: 'Tue', score: 79 },
        { week: 'Week 4', day: 'Wed', score: 85 },
        { week: 'Week 4', day: 'Thu', score: 80 },
        { week: 'Week 4', day: 'Fri', score: 82 },
        { week: 'Week 4', day: 'Sat', score: 51 },
        { week: 'Week 4', day: 'Sun', score: 44 },
        { week: 'Week 5', day: 'Mon', score: 68 },
        { week: 'Week 5', day: 'Tue', score: 74 },
        { week: 'Week 5', day: 'Wed', score: 81 },
        { week: 'Week 5', day: 'Thu', score: 77 },
        { week: 'Week 5', day: 'Fri', score: 79 },
        { week: 'Week 5', day: 'Sat', score: 48 },
        { week: 'Week 5', day: 'Sun', score: 41 },
      ],
    },
    automation: [
      {
        id: 'certificate-automation',
        title: 'Auto certificate issuance',
        trigger: 'Learner completes ≥ 80% modules & final score ≥ 70%',
        action: 'Generate certificate PDF, update CRM, notify mentor',
        owner: 'Student Success',
        channel: 'Email + LMS inbox',
        cadence: 'Real-time',
        active: true,
      },
      {
        id: 'inactivity-alerts',
        title: 'Inactivity nudges',
        trigger: 'No session activity in 7 days',
        action: 'Send personalized study plan & schedule reminder',
        owner: 'Retention Pod',
        channel: 'SMS + Push',
        cadence: 'Daily',
        active: true,
      },
      {
        id: 'mentor-rotation',
        title: 'Mentor rotation workflow',
        trigger: 'Cohort capacity > 95%',
        action: 'Auto-assign mentors & sync meeting slots',
        owner: 'Academic Ops',
        channel: 'Calendly + Slack',
        cadence: 'Weekly',
        active: true,
      },
    ],
    alerts: [
      {
        id: 'alert-1',
        message: 'Cohort D3 shows drop in quiz mastery. Adaptive review module deployed automatically.',
        severity: 'warning',
      },
      {
        id: 'alert-2',
        message: 'New accessibility badges issued for 3 STEM programs.',
        severity: 'info',
      },
      {
        id: 'alert-3',
        message: 'Mentor office hours capacity at 92% for Data Storytelling Studio.',
        severity: 'info',
      },
    ],
  },
  specialized: {
    realEstate: {
      metrics: [
        {
          id: 'inventory',
          label: 'Active listings',
          value: '318',
          change: 4.6,
          trend: 'up',
          description: 'Cross-market feed',
        },
        {
          id: 'inquiries',
          label: 'Qualified inquiries',
          value: '1,284',
          change: 8.3,
          trend: 'up',
          description: 'Last 30 days',
        },
        {
          id: 'response',
          label: 'Avg response time',
          value: '11m',
          change: -2.1,
          trend: 'down',
          description: 'Automation assisted',
        },
      ],
      pipeline: [
        {
          id: 'listing-1',
          address: '184 Hudson Loft, NY',
          stage: 'Tour scheduled',
          inquiries: 18,
          agent: 'Taylor Reed',
        },
        {
          id: 'listing-2',
          address: '51 Marina Vista, SF',
          stage: 'Offer negotiation',
          inquiries: 11,
          agent: 'Morgan Lee',
        },
        {
          id: 'listing-3',
          address: '98 Canyon Ridge, CO',
          stage: 'Newly listed',
          inquiries: 27,
          agent: 'Drew Carter',
        },
      ],
      automation: [
        {
          id: 'agent-alerts',
          title: 'Agent notification loop',
          trigger: 'Lead engages with listing twice in 24h',
          action: 'Send personalized follow-up script & schedule showing',
          owner: 'Broker Ops',
          channel: 'SMS + CRM task',
          cadence: 'Instant',
          active: true,
        },
        {
          id: 'listing-drip',
          title: 'Listing nurture drip',
          trigger: 'Lead source = Relocation & stage = Discovery',
          action: 'Trigger 4-step concierge email with area guide',
          owner: 'Marketing Concierge',
          channel: 'Email',
          cadence: 'Rolling',
          active: true,
        },
      ],
      trend: [
        { label: 'Jul', value: 214 },
        { label: 'Aug', value: 228 },
        { label: 'Sep', value: 236 },
        { label: 'Oct', value: 248 },
        { label: 'Nov', value: 259 },
        { label: 'Dec', value: 271 },
      ],
    },
    finance: {
      metrics: [
        {
          id: 'burn',
          label: 'Monthly burn',
          value: '$184K',
          change: -6.1,
          trend: 'down',
          description: 'Improved from automation',
        },
        {
          id: 'roi',
          label: 'Marketing ROI',
          value: '162%',
          change: 12.4,
          trend: 'up',
          description: 'Attribution adjusted',
        },
        {
          id: 'automation',
          label: 'Automated categorization',
          value: '93%',
          change: 4.2,
          trend: 'up',
          description: 'Transactions auto-tagged',
        },
      ],
      expenses: [
        { label: 'Week 1', value: 142, secondary: 118 },
        { label: 'Week 2', value: 158, secondary: 121 },
        { label: 'Week 3', value: 136, secondary: 112 },
        { label: 'Week 4', value: 149, secondary: 119 },
        { label: 'Week 5', value: 131, secondary: 108 },
        { label: 'Week 6', value: 124, secondary: 102 },
      ],
      roiBreakdown: [
        { id: 'paid', label: 'Paid media', value: 28, color: '#f97316' },
        { id: 'lifecycle', label: 'Lifecycle & CRM', value: 24, color: '#14b8a6' },
        { id: 'product', label: 'Product-led growth', value: 19, color: '#6366f1' },
        { id: 'events', label: 'Field & events', value: 17, color: '#0ea5e9' },
        { id: 'community', label: 'Community', value: 12, color: '#facc15' },
      ],
      automation: [
        {
          id: 'close-management',
          title: 'Close management',
          trigger: 'Month-end close window opens',
          action: 'Lock ledgers, auto-generate variance analysis, notify FP&A',
          owner: 'Finance Systems',
          channel: 'Email + Slack',
          cadence: 'Monthly',
          active: true,
        },
        {
          id: 'expense-routing',
          title: 'Expense routing bot',
          trigger: 'New expense entry detected',
          action: 'Auto-categorize, match receipt, request approval if > $5K',
          owner: 'Accounts Payable',
          channel: 'Procurement suite',
          cadence: 'Continuous',
          active: true,
        },
      ],
    },
    healthcare: {
      metrics: [
        {
          id: 'appointments',
          label: 'Appointments this week',
          value: '612',
          change: 5.4,
          trend: 'up',
          description: 'Omni-channel',
        },
        {
          id: 'show-rate',
          label: 'Show rate',
          value: '92%',
          change: 2.2,
          trend: 'up',
          description: 'Reminder automation',
        },
        {
          id: 'satisfaction',
          label: 'Patient satisfaction',
          value: '4.8 / 5',
          change: 0.6,
          trend: 'up',
          description: 'Post-visit surveys',
        },
      ],
      appointments: [
        {
          id: 'appt-1',
          patient: 'Jordan Matthews',
          clinician: 'Dr. Priyanka Desai',
          start: 'Dec 9 • 09:30',
          channel: 'Virtual',
          status: 'Confirmed',
        },
        {
          id: 'appt-2',
          patient: 'Sasha Ortiz',
          clinician: 'Dr. Anthony Li',
          start: 'Dec 9 • 11:15',
          channel: 'In-person',
          status: 'Awaiting Intake',
        },
        {
          id: 'appt-3',
          patient: 'Lena Fischer',
          clinician: 'Dr. Amara Blake',
          start: 'Dec 10 • 14:45',
          channel: 'Virtual',
          status: 'Confirmed',
        },
      ],
      automation: [
        {
          id: 'reminder-suite',
          title: 'Omni-channel reminders',
          trigger: 'Appointment scheduled or status change',
          action: 'Send SMS, email, voice reminders with prep checklist',
          owner: 'Patient Ops',
          channel: 'Twilio + EHR',
          cadence: 'Timed',
          active: true,
        },
        {
          id: 'intake-automation',
          title: 'Digital intake assistant',
          trigger: 'New patient created',
          action: 'Send secure form, validate insurance, sync to visit note',
          owner: 'Clinical Admin',
          channel: 'Portal + Email',
          cadence: 'Real-time',
          active: true,
        },
      ],
    },
  },
};

export const getPortfolioDashboard = cache(async () => portfolioDashboard);

export async function fetchPortfolioDashboard() {
  return portfolioDashboard;
}
