import { formatCurrency, formatNumber, formatPercent, formatDuration } from '../lib/format';

export interface KpiDatum {
  title: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' | 'flat'; label: string };
  timeBasis?: string;
}

export interface ChartDatum {
  label: string;
  value: number;
  secondary?: number;
  segment?: string;
}

export interface SeriesPoint {
  date: string;
  value: number;
  comparison?: number;
}

export interface TableDatum extends Record<string, string | number> {}

export interface AutomationPreset {
  name: string;
  description: string;
}

export interface ModuleFixture {
  id: string;
  label: string;
  description: string;
  kpis: KpiDatum[];
  charts: Record<string, unknown>;
  tables: Record<string, TableDatum[]>;
  automations: AutomationPreset[];
}

const formatChurnDelta = (value: number) => `${value > 0 ? '+' : ''}${formatPercent(value)}`;

export const fixtures: ModuleFixture[] = [
  {
    id: 'saas',
    label: 'SaaS — Subscription Intelligence',
    description: 'MRR, churn defense, API reliability, and billing controls for subscription platforms.',
    kpis: [
      {
        title: 'Monthly Recurring Revenue',
        value: formatCurrency(1280000),
        delta: { value: '+4.2%', trend: 'up', label: 'vs prior 30d' },
        timeBasis: 'Live'
      },
      {
        title: 'Active Organizations',
        value: formatNumber(872),
        delta: { value: '+2.1%', trend: 'up', label: 'QoQ' }
      },
      {
        title: 'API Calls (30d)',
        value: formatNumber(482000000),
        delta: { value: '+12.4%', trend: 'up', label: 'vs target' }
      },
      {
        title: 'Net Revenue Retention',
        value: formatPercent(1.23),
        delta: { value: formatChurnDelta(-0.012), trend: 'down', label: 'vs goal' }
      }
    ],
    charts: {
      arrGrowth: Array.from({ length: 12 }).map((_, index) => ({
        date: `FY24-${index + 1}`,
        value: 980000 + index * 42000,
        comparison: 880000 + index * 38000
      })),
      churnComposition: [
        { label: 'Involuntary', value: 18 },
        { label: 'Voluntary downgrade', value: 32 },
        { label: 'Product fit', value: 21 },
        { label: 'Migration', value: 11 },
        { label: 'Other', value: 8 }
      ],
      billingOrchestration: [
        { label: 'Dunning success', value: 92 },
        { label: 'Retries running', value: 6 },
        { label: 'Escalated', value: 2 }
      ]
    },
    tables: {
      planUsage: [
        { plan: 'Starter', price: formatCurrency(49), seats: 5000, allocation: '78%', churn: '2.1%' },
        { plan: 'Growth', price: formatCurrency(199), seats: 8200, allocation: '91%', churn: '1.6%' },
        { plan: 'Scale', price: formatCurrency(699), seats: 5600, allocation: '105%', churn: '0.9%' }
      ],
      churnPlaybooks: [
        { name: 'Enterprise Rescue', owner: 'CS Ops', target: 'ARR > $50k', sla: '4h follow-up' },
        { name: 'Usage Dip Pulse', owner: 'Growth', target: 'API drop > 30%', sla: 'Instant digest' }
      ]
    },
    automations: [
      {
        name: 'Churn risk mesh',
        description: 'API drop %, seat underuse, and NPS dips trigger CSM + in-app rescue workflows.'
      },
      { name: 'Billing intelligence', description: 'Card expiring + anomaly guardrails + monthly close automation.' },
      { name: 'Usage → plan upsell', description: 'Quota saturation prompts upgrade flows with proration + guardrails.' },
      { name: 'Burst protection', description: 'Priority webhook lanes with temporary lifts for mission-critical tenants.' }
    ]
  },
  {
    id: 'ecommerce',
    label: 'E-commerce — Merchandising & Fulfillment',
    description: 'Unify GMV, retention tiers, fulfillment health, and automation ladders for digital retail.',
    kpis: [
      { title: 'Gross Merchandise Value', value: formatCurrency(74200000), delta: { value: '+6.8%', trend: 'up', label: 'MoM' } },
      { title: 'Orders (7d)', value: formatNumber(184200), delta: { value: '+3.4%', trend: 'up', label: 'vs forecast' } },
      { title: 'Average Order Value', value: formatCurrency(186), delta: { value: '+1.2%', trend: 'up', label: 'QoQ' } },
      { title: 'Return Rate', value: formatPercent(0.078), delta: { value: '-0.6 pts', trend: 'up', label: 'Improvement' } }
    ],
    charts: {
      weeklySales: Array.from({ length: 12 }).map((_, index) => ({
        label: `W${index + 1}`,
        value: 4800000 + index * 120000
      })),
      retentionTiers: [
        { label: '1x buyers', value: 38 },
        { label: '2-3x', value: 26 },
        { label: '4-6x', value: 21 },
        { label: 'VIP', value: 15 }
      ],
      opsHealth: [
        { label: 'Fulfillment SLA', value: 97 },
        { label: 'Payment health', value: 95 },
        { label: 'Support backlog cleared', value: 91 }
      ]
    },
    tables: {
      topProducts: [
        { sku: 'ALPHA-01', revenue: formatCurrency(4200000), conversion: '7.8%', inventory: '21 days', trend: '▲ 3.4%' },
        { sku: 'NOVA-16', revenue: formatCurrency(3180000), conversion: '6.2%', inventory: '14 days', trend: '▲ 5.2%' },
        { sku: 'KILO-04', revenue: formatCurrency(2720000), conversion: '5.8%', inventory: '9 days', trend: '▼ 1.2%' }
      ],
      promotionBuilder: [
        { name: 'Spring Ladder', stage: 'SMS live', cap: '12% max', holdout: '5%' },
        { name: 'VIP replenishment', stage: 'Email testing', cap: '15% max', holdout: '10%' }
      ]
    },
    automations: [
      { name: 'Abandoned cart rescue', description: 'Email → SMS → WhatsApp ladder with discount caps & hold-outs.' },
      { name: 'Inventory guardrail', description: 'Days-of-cover → PO + pause ads for OOS SKUs + PDP badge update.' },
      { name: 'VIP replenishment', description: '30-day VIP lapse triggers personalized bundle offer and concierge ping.' },
      { name: 'Payment health', description: 'Soft-decline recovery with PSP failover and anomaly alerts.' }
    ]
  },
  {
    id: 'corporate',
    label: 'Corporate Analytics — Pipeline Velocity',
    description: 'Marketing-to-revenue visibility, conversion funnels, and lifecycle SLA monitoring.',
    kpis: [
      { title: 'New Net Leads', value: formatNumber(2842), delta: { value: '+9.2%', trend: 'up', label: 'vs prior period' } },
      { title: 'Page Views', value: formatNumber(1284200), delta: { value: '+4.8%', trend: 'up', label: 'QoQ' } },
      {
        title: 'Opportunity Conversion',
        value: formatPercent(0.184),
        delta: { value: '-0.8 pts', trend: 'down', label: 'Needs attention' }
      },
      { title: 'Pipeline Velocity', value: '32 days', delta: { value: '-2.1 days', trend: 'up', label: 'Acceleration' } }
    ],
    charts: {
      funnel: [
        { label: 'Visitors', value: 1480000 },
        { label: 'MQL', value: 92000 },
        { label: 'SQL', value: 31200 },
        { label: 'Opportunities', value: 5800 },
        { label: 'Closed Won', value: 1080 }
      ],
      leadSources: [
        { label: 'Organic', value: 28 },
        { label: 'Paid search', value: 24 },
        { label: 'Paid social', value: 18 },
        { label: 'Events', value: 11 },
        { label: 'Partners', value: 9 },
        { label: 'Other', value: 10 }
      ]
    },
    tables: {
      demandPlaybook: [
        { motion: 'Webinar surge', owner: 'Demand Gen', status: 'Iterate', next: 'Add lifecycle SLAs' },
        { motion: 'ABM cluster', owner: 'Sales Ops', status: 'Scaling', next: 'Expand to LATAM' },
        { motion: 'Partner pods', owner: 'Alliances', status: 'In discovery', next: 'Model influence %' }
      ],
      automationPlays: [
        { name: 'Lead score recalibration', cad: 'Weekly', status: 'Live' },
        { name: 'Landing page anomaly', cad: 'Real-time', status: 'Live' },
        { name: 'Conversion drift watchdog', cad: 'Hourly', status: 'Tuning' }
      ]
    },
    automations: [
      { name: 'Lead score recalibration', description: 'Model drift detection → CRM sync → owner notification.' },
      { name: 'Landing page anomaly', description: 'Spike/bounce detection with heatmap snapshots and task routing.' },
      { name: 'Conversion drift watchdog', description: 'CR drops trigger RCA checklist & creative throttles.' },
      { name: 'Lifecycle SLA escalations', description: 'MQL→SQL > SLA triggers routed tasks + alerts.' }
    ]
  },
  {
    id: 'customapp',
    label: 'Custom Web App — Productivity & Rituals',
    description: 'Kanban, workload balancing, and automation rituals for product & ops teams.',
    kpis: [
      { title: 'Tasks in Flight', value: formatNumber(482), delta: { value: '+3.1%', trend: 'up', label: 'vs goal' } },
      { title: 'Completion Rate', value: formatPercent(0.872), delta: { value: '+1.8 pts', trend: 'up', label: 'QoQ' } },
      { title: 'SLA Adherence', value: formatPercent(0.934), delta: { value: '-0.6 pts', trend: 'down', label: 'Watchlist' } },
      { title: 'Automation Saves', value: formatNumber(1824), delta: { value: '+12.4%', trend: 'up', label: 'YoY' } }
    ],
    charts: {
      workloadDistribution: [
        { label: 'Design', value: 48, secondary: 52 },
        { label: 'Engineering', value: 72, secondary: 68 },
        { label: 'Product', value: 36, secondary: 32 },
        { label: 'QA', value: 22, secondary: 28 }
      ],
      automationPlays: [
        { label: 'Ritual generator', value: 36 },
        { label: 'SLA watcher', value: 28 },
        { label: 'Due-soon digest', value: 22 },
        { label: 'Workload balancer', value: 14 }
      ]
    },
    tables: {
      kanban: [
        { lane: 'Backlog', count: 126, focus: 'Groom weekly' },
        { lane: 'In Progress', count: 198, focus: 'Pair load balance' },
        { lane: 'Review', count: 84, focus: 'QA automation' },
        { lane: 'Done', count: 302, focus: 'Archive monthly' }
      ],
      recurringTasks: [
        { ritual: 'Sprint kickoff', owner: 'PM', cadence: 'Weekly Mon 09:00', checklist: 'Goals, blockers, DORA' },
        { ritual: 'Incident review', owner: 'SRE', cadence: 'Weekly Thu 13:00', checklist: 'MTTR, follow-ups, RCA' }
      ]
    },
    automations: [
      { name: 'Ritual generator', description: 'Kickoff/retro/standup templates with auto invites & docs.' },
      { name: 'SLA watcher & escalation', description: 'Breach detection → DM + auto reassign + timeline note.' },
      { name: 'Due-soon digests', description: 'Cross-project rollups with action buttons + snooze.' },
      { name: 'Workload balancer', description: 'Auto reassign tasks when utilization crosses thresholds.' }
    ]
  },
  {
    id: 'media',
    label: 'Content & Media — Engagement Ops',
    description: 'Publishing queue, engagement analytics, and semantic automation for media networks.',
    kpis: [
      { title: 'Plays / Reads', value: formatNumber(9420000), delta: { value: '+5.4%', trend: 'up', label: 'MoM' } },
      { title: 'Avg Watch Time', value: formatDuration(38), delta: { value: '+1:12', trend: 'up', label: 'vs target' } },
      { title: 'Subscriber Growth', value: formatPercent(0.124), delta: { value: '+3.2 pts', trend: 'up', label: 'QoQ' } },
      { title: 'Engagement Score', value: formatNumber(86), delta: { value: '+4', trend: 'up', label: 'Composite' } }
    ],
    charts: {
      engagementTrend: Array.from({ length: 10 }).map((_, index) => ({
        date: `W${index + 1}`,
        value: 640000 + index * 32000,
        comparison: 580000 + index * 28000
      })),
      automationMix: [
        { label: 'Auto-tagging', value: 31 },
        { label: 'Highlights', value: 28 },
        { label: 'SEO guardrails', value: 24 },
        { label: 'Cross-post', value: 17 }
      ]
    },
    tables: {
      topStories: [
        { title: 'AI + Climate', format: 'Interactive', window: '7d', engagement: '98', status: 'Ready' },
        { title: 'Space insights', format: 'Video', window: '14d', engagement: '87', status: 'In review' },
        { title: 'Policy weekly', format: 'Podcast', window: '30d', engagement: '76', status: 'Blocked' }
      ],
      publishingQueue: [
        { slot: '08:00', title: 'Morning briefing', status: 'Ready', owner: 'Editorial' },
        { slot: '11:30', title: 'Data viz drop', status: 'In review', owner: 'Design' },
        { slot: '16:45', title: 'Compliance update', status: 'Blocked', owner: 'Legal' }
      ]
    },
    automations: [
      { name: 'Editorial control tower', description: 'Auto-advance, schedule, cross-post, retire underperformers.' },
      { name: 'Semantic auto-tagging', description: 'Taxonomy enforcement with DAM sync & AI assist.' },
      { name: 'Highlights generator', description: 'Clips, covers, captions, and social derivatives.' },
      { name: 'SEO/compliance guardrails', description: 'Headline scoring, link health, and rights expiry alerts.' }
    ]
  },
  {
    id: 'edtech',
    label: 'EdTech — Learning Analytics',
    description: 'Adaptive student success analytics with FERPA/COPPA overlays.',
    kpis: [
      { title: 'Active Learners', value: formatNumber(18240), delta: { value: '+8.4%', trend: 'up', label: 'vs prior term' } },
      { title: 'Completion Rate', value: formatPercent(0.786), delta: { value: '+2.1 pts', trend: 'up', label: 'QoQ' } },
      { title: 'Avg Quiz Score', value: formatPercent(0.842), delta: { value: '+0.8 pts', trend: 'up', label: 'Rolling' } },
      { title: 'Certificates Issued', value: formatNumber(3640), delta: { value: '+9.8%', trend: 'up', label: 'vs YTD' } }
    ],
    charts: {
      programPerformance: [
        { course: 'Data Science', enrollment: 3200, completion: '82%', score: '88', certs: 980 },
        { course: 'Product Strategy', enrollment: 2140, completion: '78%', score: '84', certs: 640 },
        { course: 'AI Ethics', enrollment: 1680, completion: '74%', score: '86', certs: 520 }
      ],
      studentActivity: Array.from({ length: 7 }).map((_, index) => ({
        label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
        value: [42, 48, 51, 46, 38, 27, 23][index]
      }))
    },
    tables: {
      automation: [
        { name: 'Inactivity nudges', cadence: 'Daily', status: 'Live' },
        { name: 'Auto-credentialing', cadence: 'Instant', status: 'Live' },
        { name: 'Mentor load balancing', cadence: 'Hourly', status: 'Pilot' }
      ],
      alerts: [
        { alert: 'Mastery dip — Stats 201', severity: 'High', owner: 'Coach pod 3' },
        { alert: 'Integrity flag — Exam 4', severity: 'Medium', owner: 'Academic ops' }
      ]
    },
    automations: [
      { name: 'Inactivity nudges', description: 'Recap + study plans with guardian CC and Slack sync.' },
      { name: 'Auto-credentialing', description: 'Open Badges + LinkedIn sync with FERPA-compliant logs.' },
      { name: 'Mentor load balancing', description: 'Automated rotations based on caseload & mastery needs.' },
      { name: 'Adaptive review queues', description: 'Mastery dips trigger targeted assignments + proctoring checks.' }
    ]
  },
  {
    id: 'niches',
    label: 'Specialized Niches — Real Estate • Finance • Healthcare',
    description: 'Verticalized dashboards with regulatory overlays (PCI, HIPAA, FERPA).',
    kpis: [
      { title: 'Active Listings', value: formatNumber(684), delta: { value: '+3.8%', trend: 'up', label: 'Real estate' } },
      { title: 'Qualified Inquiries', value: formatNumber(2480), delta: { value: '+5.2%', trend: 'up', label: 'Finance' } },
      { title: 'Avg Response', value: '01:42', delta: { value: '-0:18', trend: 'up', label: 'Healthcare scheduling' } },
      { title: 'Patient Satisfaction', value: formatPercent(0.914), delta: { value: '+1.2 pts', trend: 'up', label: 'Press-Ganey' } }
    ],
    charts: {
      marketMomentum: Array.from({ length: 8 }).map((_, index) => ({
        date: `Q${index + 1}`,
        value: 82 + index * 4,
        comparison: 76 + index * 3
      })),
      expenseVsBudget: Array.from({ length: 12 }).map((_, index) => ({
        date: `M${index + 1}`,
        value: 1.8 + index * 0.04,
        comparison: 1.6 + index * 0.035
      })),
      roiUtilization: [
        { label: 'ROI realized', value: 56 },
        { label: 'Budget in-flight', value: 28 },
        { label: 'Pipeline', value: 16 }
      ],
      listings: [
        { property: 'Hudson Tower', status: 'Active', leads: 48, csat: '4.7★' },
        { property: 'Bayfront East', status: 'Hot', leads: 32, csat: '4.4★' }
      ],
      appointments: [
        { clinic: 'Downtown Care', sla: '92%', satisfaction: '4.6★', audits: 'HIPAA compliant' },
        { clinic: 'Northside', sla: '88%', satisfaction: '4.2★', audits: 'HIPAA compliant' }
      ]
    },
    tables: {
      listings: [
        { asset: 'Hudson Tower', owner: 'Alicia', stage: 'Market watch', compliance: 'PCI / SOC-2' },
        { asset: 'Bayfront East', owner: 'Marco', stage: 'Hot lead', compliance: 'PCI / SOC-2' }
      ],
      finance: [
        { process: 'Month-end close', owner: 'Controller', status: 'In flight', compliance: 'PCI / SOC-2' },
        { process: 'Expense routing', owner: 'AP', status: 'Stable', compliance: 'PCI / SOC-2' }
      ],
      healthcare: [
        { workflow: 'No-show reduction', owner: 'Clinic ops', status: 'Active', compliance: 'HIPAA / BAA' },
        { workflow: 'Digital intake', owner: 'Front desk', status: 'Rolling out', compliance: 'HIPAA / BAA' }
      ]
    },
    automations: [
      { name: 'Hot lead accelerator', description: 'Instant agent alerts + nurture for high-intent prospects.' },
      { name: 'Month-end close runbook', description: 'Finance checklists, OCR → GL, idempotent postings.' },
      { name: 'No-show reduction', description: 'Smart reschedule, eligibility checks, CSAT recovery loops.' },
      { name: 'Compliance overlays', description: 'PCI, HIPAA, FERPA guardrails with audit logging.' }
    ]
  }
];
