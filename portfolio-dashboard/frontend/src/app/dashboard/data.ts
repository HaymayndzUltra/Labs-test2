import { cache } from 'react';
import {
  Activity,
  BarChart3,
  Building2,
  CloudCog,
  GraduationCap,
  KanbanSquare,
  LineChart,
  PlayCircle,
  ShoppingBag,
} from 'lucide-react';
import type {
  AutomationPlay,
  ChartBlock,
  PortfolioCategory,
  PortfolioDashboardResponse,
} from './types';
import { chartPalette } from './constants';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const saasAutomations: AutomationPlay[] = [
  {
    id: 'billing-cycle',
    name: 'Billing cycle roll-up',
    trigger: '1st business day',
    action: 'Generate invoices and sync to Stripe',
    channel: 'Finance queue',
    cadence: 'Monthly',
  },
  {
    id: 'churn-alerts',
    name: 'At-risk accounts',
    trigger: 'Usage drops below 40%',
    action: 'Notify CSM and launch retention playbook',
    channel: 'Slack + email',
    cadence: 'Daily scan',
  },
  {
    id: 'api-threshold',
    name: 'API limit safeguard',
    trigger: 'Requests > 80% plan limit',
    action: 'Throttle burst + send upgrade offer',
    channel: 'Webhook + email',
    cadence: 'Real-time',
  },
];

const ecommerceAutomations: AutomationPlay[] = [
  {
    id: 'abandoned-cart',
    name: 'Abandoned cart rescue',
    trigger: 'Cart idle for 2 hours',
    action: 'Send 3-touch email + SMS reminder',
    channel: 'Email & SMS',
    cadence: 'Every 2 hours',
  },
  {
    id: 'inventory-guard',
    name: 'Inventory guardrail',
    trigger: 'Stock < safety threshold',
    action: 'Auto-create supplier PO & pause ads',
    channel: 'ERP integration',
    cadence: 'Hourly',
  },
  {
    id: 'vip-segment',
    name: 'VIP replenishment',
    trigger: 'VIP segment 30-day lapse',
    action: 'Launch personalised retargeting ads',
    channel: 'Meta + email',
    cadence: 'Daily',
  },
];

const analyticsAutomations: AutomationPlay[] = [
  {
    id: 'lead-scoring',
    name: 'Lead score recalibration',
    trigger: 'New activity event',
    action: 'Recalculate score & push to CRM',
    channel: 'Salesforce API',
    cadence: 'Streaming',
  },
  {
    id: 'page-spike',
    name: 'Landing page anomaly',
    trigger: 'Traffic spike > 50%',
    action: 'Alert growth squad + launch heatmap recording',
    channel: 'Ops war-room',
    cadence: 'Instant',
  },
  {
    id: 'conversion-drift',
    name: 'Conversion drift watchdog',
    trigger: 'CR drops 10% week-over-week',
    action: 'Schedule root cause review + send deck',
    channel: 'Email digest',
    cadence: 'Weekly',
  },
];

const kanbanAutomations: AutomationPlay[] = [
  {
    id: 'recurring-tasks',
    name: 'Recurring tasks generator',
    trigger: 'Sprint kickoff',
    action: 'Clone templates for compliance rituals',
    channel: 'Task queue',
    cadence: 'Bi-weekly',
  },
  {
    id: 'sla-watch',
    name: 'SLA watcher',
    trigger: 'Task > 72 hours in review',
    action: 'Escalate to squad lead + attach blocker log',
    channel: 'Slack DM',
    cadence: 'Hourly',
  },
  {
    id: 'auto-reminder',
    name: 'Auto reminder bundler',
    trigger: 'Task due within 24 hours',
    action: 'Send digest with dependencies',
    channel: 'Email + mobile push',
    cadence: 'Daily',
  },
];

const mediaAutomations: AutomationPlay[] = [
  {
    id: 'publishing',
    name: 'Publishing queue',
    trigger: 'Scheduled publish time',
    action: 'Deploy content, syndicate to socials',
    channel: 'CMS + API webhook',
    cadence: 'Hourly',
  },
  {
    id: 'auto-tagging',
    name: 'Auto-tagging pipeline',
    trigger: 'New video upload',
    action: 'Run ML topic detection + update SEO tags',
    channel: 'Background worker',
    cadence: 'Real-time',
  },
  {
    id: 'engagement-nudges',
    name: 'Engagement nudges',
    trigger: 'Engagement dip < 2%',
    action: 'Launch spotlight campaign',
    channel: 'Email + in-app',
    cadence: 'Weekly',
  },
];

const edtechAutomations: AutomationPlay[] = [
  {
    id: 'certificate',
    name: 'Certificate automation',
    trigger: 'Course completion 100%',
    action: 'Issue certificate + notify instructor',
    channel: 'Email + LMS API',
    cadence: 'Instant',
  },
  {
    id: 'inactivity',
    name: 'Inactivity alerts',
    trigger: 'No login for 5 days',
    action: 'Send re-engagement drip',
    channel: 'Email + push',
    cadence: 'Daily sweep',
  },
  {
    id: 'quiz-analysis',
    name: 'Quiz variance analyzer',
    trigger: 'Quiz average < 70%',
    action: 'Alert curriculum team with flagged questions',
    channel: 'Slack',
    cadence: 'Weekly',
  },
];

const specialtyAutomations: Record<string, AutomationPlay[]> = {
  realEstate: [
    {
      id: 'listing-refresh',
      name: 'Listing refresh',
      trigger: 'Listing idle 14 days',
      action: 'Auto-rotate hero media + ping agent',
      channel: 'Email',
      cadence: 'Daily',
    },
    {
      id: 'hot-buyer',
      name: 'Hot buyer routing',
      trigger: 'Lead score > 80',
      action: 'Instantly assign to on-call agent',
      channel: 'SMS + CRM',
      cadence: 'Real-time',
    },
  ],
  finance: [
    {
      id: 'expense-ingest',
      name: 'Expense ingestion',
      trigger: 'New bank transaction',
      action: 'Auto-categorise & flag anomalies',
      channel: 'Ledger API',
      cadence: 'Streaming',
    },
    {
      id: 'roi-drift',
      name: 'ROI drift alert',
      trigger: 'ROI variance +/-5%',
      action: 'Notify finance ops with scenario planner',
      channel: 'Email',
      cadence: 'Daily',
    },
  ],
  healthcare: [
    {
      id: 'appointment-reminders',
      name: 'Appointment reminders',
      trigger: '24h before visit',
      action: 'Send SMS/email with pre-visit intake',
      channel: 'SMS + email',
      cadence: 'Hourly',
    },
    {
      id: 'no-show-recovery',
      name: 'No-show recovery',
      trigger: 'Patient misses appointment',
      action: 'Auto-reschedule and notify care team',
      channel: 'Patient portal',
      cadence: 'Real-time',
    },
  ],
};

function buildCategories(): PortfolioCategory[] {
  return [
    {
      id: 'saas',
      name: 'SaaS Growth Command',
      icon: 'CloudCog',
      tagline: 'Subscription intelligence tuned for ARR-heavy scale-ups.',
      description:
        'Monitor product adoption, API consumption, and retention signals through a cohesive growth cockpit.',
      surface: {
        accent: 'border-indigo-300/70',
        from: 'from-indigo-500/20',
        to: 'to-sky-400/20',
      },
      spotlight: {
        label: 'Net Revenue Retention',
        value: '128%',
        helper: 'Cohort weighted trailing 3 months',
      },
      metrics: [
        {
          id: 'mrr',
          label: 'Monthly Recurring Revenue',
          value: '$442K',
          change: 5.6,
          trend: 'up',
          helper: 'vs. last month',
        },
        {
          id: 'active-users',
          label: 'Active Organisations',
          value: '1,842',
          change: 3.1,
          trend: 'up',
          helper: 'Seat utilisation 82%',
        },
        {
          id: 'api-usage',
          label: 'API Calls',
          value: '148M',
          change: 12.4,
          trend: 'up',
          helper: '95th percentile latency 180ms',
        },
        {
          id: 'churn',
          label: 'Gross Churn',
          value: '2.3%',
          change: -0.8,
          trend: 'down',
          helper: 'Downside protected by success pod',
        },
      ],
      charts: [
        {
          id: 'saas-growth',
          type: 'line',
          title: 'ARR Growth Trajectory',
          description: 'Quarterly ARR progression with expansion vs. contraction view.',
          data: months.slice(0, 6).map((month, index) => ({
            period: month,
            value: 360 + index * 12 + (index % 2 === 0 ? 8 : 0),
            secondary: 320 + index * 9,
          })),
          valueKey: 'value',
          secondaryKey: 'secondary',
          format: 'currency',
        },
        {
          id: 'saas-churn',
          type: 'donut',
          title: 'Churn Composition',
          description: 'Breakdown between voluntary churn, downgrades, and active rescues.',
          segments: [
            { name: 'Healthy', value: 86, color: chartPalette.indigo[0] },
            { name: 'Downgrade', value: 8, color: chartPalette.rose[0] },
            { name: 'Voluntary churn', value: 4, color: chartPalette.rose[1] },
            { name: 'Saved accounts', value: 2, color: chartPalette.emerald[0] },
          ],
          format: 'percent',
        },
      ],
      tables: [
        {
          id: 'saas-api-tiers',
          title: 'API Usage by Plan',
          description: 'Guardrails ensure burst protection without throttling mission-critical webhooks.',
          columns: [
            { id: 'plan', label: 'Plan' },
            { id: 'limit', label: 'Quota' },
            { id: 'usage', label: 'Current Usage' },
            { id: 'overage', label: 'Overage Policy', align: 'right' },
          ],
          rows: [
            {
              plan: 'Starter',
              limit: '2M calls',
              usage: '1.4M (70%)',
              overage: 'Soft cap + nurture',
            },
            {
              plan: 'Growth',
              limit: '10M calls',
              usage: '8.1M (81%)',
              overage: 'Burst to 12M then throttle',
            },
            {
              plan: 'Enterprise',
              limit: 'Custom',
              usage: '52M (92%)',
              overage: 'Auto-scale + upsell alert',
            },
          ],
        },
      ],
      automations: saasAutomations,
      workflows: [
        {
          id: 'saas-workflow',
          title: 'Lifecycle automation blueprint',
          steps: [
            {
              id: 'enrich',
              title: 'Usage telemetry ingestion',
              description: 'Stream events into warehouse and normalise with dbt.',
            },
            {
              id: 'score',
              title: 'Churn propensity model',
              description: 'Score accounts nightly using weighted behaviour and support tickets.',
            },
            {
              id: 'orchestrate',
              title: 'Playbook orchestration',
              description: 'Trigger customer success automations with personalised messaging.',
            },
          ],
        },
      ],
    },
    {
      id: 'commerce',
      name: 'E-Commerce Intelligence',
      icon: 'ShoppingBag',
      tagline: 'Merchandising, fulfilment, and lifecycle revenue in one glance.',
      description:
        'Layered analytics highlight SKU velocity, margin guardrails, and customer lifetime value.',
      surface: {
        accent: 'border-emerald-300/70',
        from: 'from-emerald-500/20',
        to: 'to-teal-400/20',
      },
      spotlight: {
        label: 'Seven-day revenue',
        value: '$1.94M',
        helper: '11% lift post automation rollout',
      },
      metrics: [
        {
          id: 'revenue',
          label: 'GMV',
          value: '$6.8M',
          change: 8.4,
          trend: 'up',
          helper: 'Trailing 30 days',
        },
        {
          id: 'aov',
          label: 'Average Order Value',
          value: '$148',
          change: 2.1,
          trend: 'up',
          helper: 'Bundling experiment live',
        },
        {
          id: 'conversion',
          label: 'Conversion Rate',
          value: '3.6%',
          change: 0.4,
          trend: 'up',
          helper: 'Checkout A/B test complete',
        },
        {
          id: 'orders',
          label: 'Orders Fulfilled',
          value: '12,487',
          change: 6.2,
          trend: 'up',
          helper: 'Auto-routing to 3PL active',
        },
      ],
      charts: [
        {
          id: 'commerce-sales',
          type: 'bar',
          title: 'Weekly sales trend',
          description: 'Revenue trend with on-automation markers.',
          data: months.slice(4, 10).map((month, index) => ({
            name: month,
            value: 180 + index * 15 + (index % 2 === 0 ? 10 : 0),
          })),
          format: 'currency',
        },
        {
          id: 'commerce-retention',
          type: 'radial',
          title: 'Customer retention tiers',
          description: 'Breakdown of customers by lifecycle segments.',
          segments: [
            { name: 'Loyalists', value: 42, fill: chartPalette.emerald[0] },
            { name: 'Seasonal', value: 27, fill: chartPalette.indigo[0] },
            { name: 'Churn risk', value: 18, fill: chartPalette.rose[0] },
            { name: 'New', value: 13, fill: chartPalette.amber[0] },
          ],
          total: 100,
        },
      ],
      tables: [
        {
          id: 'commerce-leaderboard',
          title: 'Top-performing products',
          description: 'Leaderboards highlight cross-sell bundles and restock priorities.',
          columns: [
            { id: 'rank', label: '#' },
            { id: 'product', label: 'Product' },
            { id: 'revenue', label: 'Revenue', align: 'right' },
            { id: 'velocity', label: 'Velocity', align: 'right' },
          ],
          rows: [
            { rank: '1', product: 'Aurora running set', revenue: '$218K', velocity: '132% vs target' },
            { rank: '2', product: 'Lift smart band', revenue: '$186K', velocity: '118% vs target' },
            { rank: '3', product: 'Momentum hydration kit', revenue: '$149K', velocity: '101% vs target' },
            { rank: '4', product: 'Pulse HIIT trainer', revenue: '$121K', velocity: '95% vs target' },
          ],
        },
      ],
      automations: ecommerceAutomations,
      workflows: [
        {
          id: 'commerce-workflow',
          title: 'Lifecycle automation',
          steps: [
            {
              id: 'detect',
              title: 'Detect drop-off',
              description: 'Predictive layer surfaces segments trending toward churn.',
            },
            {
              id: 'orchestrate',
              title: 'Omni-channel follow-up',
              description: 'Coordinate email, SMS, and ads with personalised offer sequencing.',
            },
            {
              id: 'measure',
              title: 'Measure and recycle',
              description: 'Closed loop measurement feeds ML uplift modelling.',
            },
          ],
        },
      ],
    },
    {
      id: 'analytics',
      name: 'Corporate Analytics',
      icon: 'BarChart3',
      tagline: 'Marketing-to-revenue visibility with no spreadsheet gymnastics.',
      description:
        'Track lead sources, conversion funnel health, and pipeline velocity with executive-ready visuals.',
      surface: {
        accent: 'border-violet-300/70',
        from: 'from-violet-500/20',
        to: 'to-indigo-500/20',
      },
      spotlight: {
        label: 'Marketing qualified leads',
        value: '1,284',
        helper: 'Up 19% after webinar series',
      },
      metrics: [
        {
          id: 'leads',
          label: 'Net new leads',
          value: '4,982',
          change: 9.4,
          trend: 'up',
          helper: 'Last 30 days',
        },
        {
          id: 'pageviews',
          label: 'Page views',
          value: '612K',
          change: 14.1,
          trend: 'up',
          helper: 'High intent content',
        },
        {
          id: 'conversion',
          label: 'Opportunity conversion',
          value: '18.6%',
          change: 1.2,
          trend: 'up',
          helper: 'Multi-touch modelling',
        },
        {
          id: 'pipeline',
          label: 'Pipeline velocity',
          value: '36 days',
          change: -3.1,
          trend: 'down',
          helper: 'Automation reduces handoffs',
        },
      ],
      charts: [
        {
          id: 'analytics-funnel',
          type: 'funnel',
          title: 'Conversion funnel',
          description: 'Every stage backed by automated scoring and CRM sync.',
          steps: [
            { id: 'visits', label: 'Site visits', value: 280_000, conversion: 100 },
            { id: 'leads', label: 'Qualified leads', value: 18_900, conversion: 6.7 },
            { id: 'opps', label: 'Opportunities', value: 3_420, conversion: 18.1 },
            { id: 'won', label: 'Closed won', value: 628, conversion: 18.4 },
          ],
        },
        {
          id: 'analytics-sources',
          type: 'donut',
          title: 'Lead source mix',
          description: 'Automated budget weighting ensures efficient CAC.',
          segments: [
            { name: 'Webinars', value: 32, color: chartPalette.violet[0] },
            { name: 'Paid search', value: 24, color: chartPalette.indigo[0] },
            { name: 'Organic', value: 21, color: chartPalette.emerald[0] },
            { name: 'Partner', value: 14, color: chartPalette.amber[0] },
            { name: 'Outbound', value: 9, color: chartPalette.rose[0] },
          ],
          format: 'percent',
        },
      ],
      automations: analyticsAutomations,
      tables: [
        {
          id: 'analytics-playbook',
          title: 'Demand playbook',
          description: 'Revenue operations manages scoring and routing with CRM sync jobs.',
          columns: [
            { id: 'play', label: 'Play' },
            { id: 'owner', label: 'Owner' },
            { id: 'goal', label: 'Objective' },
            { id: 'status', label: 'Status', align: 'right' },
          ],
          rows: [
            { play: 'Executive webinar', owner: 'Marketing', goal: 'SQL lift +22%', status: 'Active' },
            { play: 'Account based ads', owner: 'RevOps', goal: 'Expand tier-1 accounts', status: 'Pilot' },
            { play: 'Lead recycling', owner: 'Sales', goal: 'Reheat cold accounts', status: 'Scheduled' },
          ],
        },
      ],
    },
    {
      id: 'productivity',
      name: 'Custom Productivity Suite',
      icon: 'KanbanSquare',
      tagline: 'Kanban, workload analytics, and automation fused together.',
      description:
        'High-velocity teams visualise flow efficiency and stay ahead of SLA breaches.',
      surface: {
        accent: 'border-sky-300/70',
        from: 'from-sky-500/20',
        to: 'to-indigo-400/20',
      },
      spotlight: {
        label: 'Cycle time',
        value: '3.8 days',
        helper: 'Goal under 4 days achieved 6 sprints running',
      },
      metrics: [
        {
          id: 'tasks',
          label: 'Tasks in flight',
          value: '182',
          change: -4.6,
          trend: 'down',
          helper: 'Down from 191 last sprint',
        },
        {
          id: 'completion',
          label: 'Completion rate',
          value: '94%',
          change: 6.2,
          trend: 'up',
          helper: 'Automations closing loops',
        },
        {
          id: 'sla',
          label: 'SLA adherence',
          value: '98%',
          change: 1.4,
          trend: 'up',
          helper: 'Triage reminders running hourly',
        },
        {
          id: 'automation-saves',
          label: 'Automation saves',
          value: '312 hrs',
          change: 12.5,
          trend: 'up',
          helper: 'Time reclaimed last quarter',
        },
      ],
      charts: [
        {
          id: 'productivity-workload',
          type: 'workload',
          title: 'Workload distribution',
          description: 'Balanced backlog ensures no squad is overloaded.',
          data: [
            { member: 'Atlas', backlog: 6, inProgress: 11, completed: 32 },
            { member: 'Orbit', backlog: 8, inProgress: 9, completed: 28 },
            { member: 'Pulse', backlog: 4, inProgress: 12, completed: 35 },
            { member: 'Nova', backlog: 5, inProgress: 8, completed: 31 },
          ],
        },
      ],
      automations: kanbanAutomations,
      kanban: {
        columns: [
          {
            id: 'backlog',
            name: 'Backlog',
            sla: '<24h grooming',
            count: 32,
            tasks: [
              { id: 'BL-92', title: 'Analytics pipeline hardening', assignee: 'Mia' },
              { id: 'BL-93', title: 'Service blueprint refresh', assignee: 'Luis' },
            ],
          },
          {
            id: 'in-progress',
            name: 'In Progress',
            sla: 'Active within 48h',
            count: 44,
            tasks: [
              { id: 'IP-21', title: 'Workflow builder UX', assignee: 'Ravi' },
              { id: 'IP-22', title: 'Billing automation tests', assignee: 'Nia' },
            ],
          },
          {
            id: 'review',
            name: 'Review',
            sla: 'QA < 36h',
            count: 18,
            tasks: [
              { id: 'RV-07', title: 'Heatmap API load test', assignee: 'Ava' },
              { id: 'RV-08', title: 'CRM sync audit', assignee: 'Leo' },
            ],
          },
          {
            id: 'done',
            name: 'Done',
            sla: 'Auto-archive 7d',
            count: 88,
            tasks: [
              { id: 'DN-54', title: 'Access policy as code', assignee: 'Sky' },
              { id: 'DN-55', title: 'Lifecycle messaging revamp', assignee: 'Zoe' },
            ],
          },
        ],
      },
    },
    {
      id: 'media',
      name: 'Content & Media Hub',
      icon: 'PlayCircle',
      tagline: 'Editorial rhythm, engagement, and monetisation in one studio view.',
      description:
        'Blend publishing cadences, campaign performance, and community health for every channel.',
      surface: {
        accent: 'border-rose-300/70',
        from: 'from-rose-500/20',
        to: 'to-orange-400/20',
      },
      spotlight: {
        label: 'Engagement uplift',
        value: '+18%',
        helper: 'After multi-format storytelling sprint',
      },
      metrics: [
        {
          id: 'publishes',
          label: 'Pieces published',
          value: '124',
          change: 11.2,
          trend: 'up',
          helper: 'Multi-channel release cadence',
        },
        {
          id: 'watch-time',
          label: 'Avg. watch time',
          value: '7m 42s',
          change: 2.7,
          trend: 'up',
          helper: 'Long-form docu-series trending',
        },
        {
          id: 'engagement',
          label: 'Engagement rate',
          value: '6.4%',
          change: 0.9,
          trend: 'up',
          helper: 'Community prompts improving replies',
        },
        {
          id: 'subscribers',
          label: 'New subscribers',
          value: '18.2K',
          change: 5.3,
          trend: 'up',
          helper: 'Creator collaborations expansion',
        },
      ],
      charts: [
        {
          id: 'media-engagement',
          type: 'line',
          title: 'Engagement trend',
          description: 'Story format mix vs. engagement rate weekly.',
          data: months.slice(6, 12).map((month, index) => ({
            period: month,
            value: 4.2 + index * 0.4,
            secondary: 3.1 + index * 0.35,
          })),
          valueKey: 'value',
          secondaryKey: 'secondary',
          format: 'percent',
        },
      ],
      tables: [
        {
          id: 'media-calendar',
          title: 'Editorial calendar',
          description: 'Production workflow orchestrates multi-platform releases.',
          columns: [
            { id: 'date', label: 'Release' },
            { id: 'title', label: 'Title' },
            { id: 'format', label: 'Format' },
            { id: 'owner', label: 'Owner' },
            { id: 'status', label: 'Status', align: 'right' },
          ],
          rows: [
            { date: 'Mar 04', title: 'AI in creative ops', format: 'Video', owner: 'Jordan', status: 'Scheduled' },
            { date: 'Mar 07', title: 'Lifecycle storytelling', format: 'Podcast', owner: 'Priya', status: 'Mixing' },
            { date: 'Mar 11', title: 'Creator field guide', format: 'Article', owner: 'Lee', status: 'Editing' },
            { date: 'Mar 15', title: 'Behind the build live', format: 'Livestream', owner: 'Max', status: 'Green room' },
          ],
        },
      ],
      automations: mediaAutomations,
    },
    {
      id: 'edtech',
      name: 'EdTech Learning Fabric',
      icon: 'GraduationCap',
      tagline: 'Student activation, mastery, and credentialing at scale.',
      description:
        'Track mastery signals, prompt interventions, and surface instructor impact across cohorts.',
      surface: {
        accent: 'border-amber-300/70',
        from: 'from-amber-500/20',
        to: 'to-lime-400/20',
      },
      spotlight: {
        label: 'Certificate issuance',
        value: '932',
        helper: 'Automated within 12 hours of completion',
      },
      metrics: [
        {
          id: 'active-learners',
          label: 'Active learners',
          value: '8,412',
          change: 7.6,
          trend: 'up',
          helper: 'New onboarding flows',
        },
        {
          id: 'completion',
          label: 'Course completion',
          value: '82%',
          change: 4.3,
          trend: 'up',
          helper: 'Adaptive nudges',
        },
        {
          id: 'quiz-score',
          label: 'Avg. quiz score',
          value: '78%',
          change: 1.8,
          trend: 'up',
          helper: 'Question bank refresh',
        },
        {
          id: 'inactivity',
          label: 'Dormant learners',
          value: '6%',
          change: -2.4,
          trend: 'down',
          helper: 'Automation recovered 218 students',
        },
      ],
      charts: [
        {
          id: 'edtech-heatmap',
          type: 'heatmap',
          title: 'Student activity heatmap',
          description: 'Evening study sessions spike mid-week; nudges align to behaviour.',
          weeks: Array.from({ length: 6 }).map((_, index) => ({
            week: `W${index + 1}`,
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
              day,
              value: Math.floor(Math.random() * 12) + (day === 'Sat' || day === 'Sun' ? 4 : 0),
            })),
          })),
          legend: ['0-2', '3-5', '6-8', '9-11', '12+ sessions'],
        },
        {
          id: 'edtech-distribution',
          type: 'bar',
          title: 'Mastery distribution',
          description: 'Track learners across mastery bands to focus interventions.',
          data: [
            { name: 'Beginner', value: 18 },
            { name: 'Developing', value: 32 },
            { name: 'Proficient', value: 28 },
            { name: 'Expert', value: 22 },
          ],
          format: 'percent',
        },
      ],
      automations: edtechAutomations,
    },
    {
      id: 'specialised',
      name: 'Specialised Verticals',
      icon: 'Building2',
      tagline: 'Blueprints tailored for regulated, high-touch industries.',
      description:
        'Dedicated mini-dashboards show how automation and analytics flex to unique industry pressures.',
      surface: {
        accent: 'border-slate-300/70',
        from: 'from-slate-500/20',
        to: 'to-indigo-500/20',
      },
      spotlight: {
        label: 'Deployments live',
        value: '3 regions',
        helper: 'Playbooks built for NA, EU, APAC compliance',
      },
      metrics: [
        {
          id: 'industry-reuse',
          label: 'Reusable accelerators',
          value: '27',
          change: 3.2,
          trend: 'up',
          helper: 'Across real estate, finance, healthcare',
        },
        {
          id: 'response-sla',
          label: 'Response SLA',
          value: '12m',
          change: -1.8,
          trend: 'down',
          helper: 'Patient + client comms autopilot',
        },
        {
          id: 'automations-deployed',
          label: 'Automations deployed',
          value: '146',
          change: 8.9,
          trend: 'up',
          helper: 'Audit-friendly blueprints',
        },
        {
          id: 'roi',
          label: 'Average ROI',
          value: '212%',
          change: 12.6,
          trend: 'up',
          helper: 'Based on post-implementation audits',
        },
      ],
      charts: [
        {
          id: 'specialised-utilisation',
          type: 'line',
          title: 'Implementation velocity',
          description: 'Time-to-value shrinking with accelerator catalogue.',
          data: months.slice(0, 6).map((month, index) => ({
            period: month,
            value: 9 - index * 0.6,
            secondary: 12 - index * 0.8,
          })),
          valueKey: 'value',
          secondaryKey: 'secondary',
          format: 'numeric',
        },
      ],
      automations: specialtyAutomations.realEstate,
      subsections: [
        {
          id: 'real-estate',
          name: 'Real Estate',
          metrics: [
            {
              id: 'inventory',
              label: 'Active listings',
              value: '482',
              change: 4.1,
              trend: 'up',
              helper: 'Auto-refresh pipeline',
            },
            {
              id: 'response',
              label: 'Response time',
              value: '6m',
              change: -2.4,
              trend: 'down',
              helper: 'Routing via smart queue',
            },
          ],
          summary: 'Agent network automation keeps enquiry response under SLA while surfacing high intent buyers.',
          chart: {
            id: 'real-estate-heat',
            type: 'bar',
            title: 'Lead status mix',
            description: 'Stacked bars reflect staging pipeline for urban markets.',
            data: [
              { name: 'Qualified', value: 46 },
              { name: 'Tours booked', value: 28 },
              { name: 'Offers out', value: 16 },
              { name: 'Closed', value: 10 },
            ],
            format: 'percent',
          },
          automations: specialtyAutomations.realEstate,
        },
        {
          id: 'finance',
          name: 'Finance / Fintech',
          metrics: [
            {
              id: 'spend-tracked',
              label: 'Spend tracked',
              value: '$42M',
              change: 6.4,
              trend: 'up',
              helper: 'Multi-ledger ingest',
            },
            {
              id: 'anomaly',
              label: 'Anomalies flagged',
              value: '38',
              change: 1.9,
              trend: 'down',
              helper: 'Variance vs budget',
            },
          ],
          summary: 'Expense governance with ROI instrumentation and CFO-ready audit export.',
          chart: {
            id: 'finance-roi',
            type: 'line',
            title: 'ROI tracker',
            description: 'Blended marketing ROI tracked weekly with auto alerts.',
            data: months.slice(0, 8).map((month, index) => ({
              period: month,
              value: 2.1 + index * 0.18,
            })),
            valueKey: 'value',
            format: 'numeric',
          },
          automations: specialtyAutomations.finance,
        },
        {
          id: 'healthcare',
          name: 'Healthcare',
          metrics: [
            {
              id: 'appointments',
              label: 'Appointments managed',
              value: '9,842',
              change: 12.3,
              trend: 'up',
              helper: 'Patient outreach automation',
            },
            {
              id: 'no-show',
              label: 'No-show rate',
              value: '3.1%',
              change: -1.2,
              trend: 'down',
              helper: 'Proactive rescheduling',
            },
          ],
          summary: 'HIPAA-ready workflows reduce no-shows and maintain communication audit logs.',
          chart: {
            id: 'healthcare-capacity',
            type: 'workload',
            title: 'Care team utilisation',
            description: 'Balanced load across physicians, nursing, and admin.',
            data: [
              { member: 'Physicians', backlog: 3, inProgress: 18, completed: 62 },
              { member: 'Nursing', backlog: 4, inProgress: 21, completed: 74 },
              { member: 'Admin', backlog: 2, inProgress: 14, completed: 68 },
            ],
          },
          automations: specialtyAutomations.healthcare,
        },
      ],
    },
  ];
}

const dashboardPayload: PortfolioDashboardResponse = {
  generatedAt: new Date().toISOString(),
  categories: buildCategories(),
};

export const getPortfolioDashboard = cache(async () => dashboardPayload);
