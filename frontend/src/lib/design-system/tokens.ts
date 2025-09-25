export type ThemeMode = 'light' | 'dark';
export type DirectionMode = 'ltr' | 'rtl';
export type MotionMode = 'full' | 'reduce';

export const designTokens = {
  typography: {
    scale: {
      display: 32,
      title: 24,
      subtitle: 18,
      body: 14,
    },
    weight: {
      bold: 600,
      medium: 500,
      regular: 400,
    },
    fontFamily: `'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
    tabularNumeric: `'Inter Tight', 'Roboto Mono', 'SFMono-Regular', Menlo, monospace`,
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  elevation: {
    base: '0 1px 2px rgba(17, 24, 39, 0.04)',
    raised: '0 8px 24px rgba(17, 24, 39, 0.08)',
    overlay: '0 12px 32px rgba(17, 24, 39, 0.16)',
  },
  motion: {
    durations: {
      micro: 110,
      standard: 200,
      narrative: 320,
    },
    stagger: {
      min: 40,
      max: 60,
    },
    springs: {
      drag: { stiffness: 360, damping: 36 },
      snap: { stiffness: 400, damping: 34 },
    },
    easings: {
      smooth: 'cubic-bezier(0.17, 0.84, 0.44, 1)',
      crisp: 'cubic-bezier(0.2, 0.6, 0, 0.99)',
      emphasis: 'cubic-bezier(0.12, 0.72, 0.18, 1)',
    },
  },
  color: {
    light: {
      canvas: '#F7F7FB',
      surface: '#FFFFFF',
      surfaceSubtle: '#F1F2F6',
      foreground: '#1F1B2C',
      foregroundMuted: '#4C4A5E',
      border: '#D7D8E5',
      borderStrong: '#A2A5C1',
      primary: '#6C4DD9',
      primarySoft: '#E8E0FF',
      success: '#1E9F6E',
      successSoft: '#D9F3E9',
      warning: '#D88500',
      warningSoft: '#FFF1D6',
      error: '#C53A3A',
      errorSoft: '#FCE4E4',
      info: '#2D6CDF',
      infoSoft: '#E0EBFF',
      chartPalette: ['#6C4DD9', '#2D6CDF', '#1E9F6E', '#D88500', '#C53A3A', '#6A5ACD'],
    },
    dark: {
      canvas: '#0D0C12',
      surface: '#171628',
      surfaceSubtle: '#1F1E32',
      foreground: '#FAFAFF',
      foregroundMuted: '#B1B0C6',
      border: '#343254',
      borderStrong: '#59577A',
      primary: '#B79BFF',
      primarySoft: '#3A2A6B',
      success: '#3FD6A0',
      successSoft: '#123C2C',
      warning: '#FFB547',
      warningSoft: '#4A3510',
      error: '#FF6A6A',
      errorSoft: '#47161D',
      info: '#77A8FF',
      infoSoft: '#1C2D59',
      chartPalette: ['#B79BFF', '#77A8FF', '#3FD6A0', '#FFB547', '#FF6A6A', '#9C8FFF'],
    },
  },
} as const;

export const automationTemplates = {
  saas: [
    'Churn probability alerts routed to success managers',
    'Automated billing retry & dunning cadence with escalation',
    'API usage anomaly throttle + notification',
    'Plan-limit upsell prompts in-app & email',
    'Nightly cohort hygiene jobs for metrics parity',
    'Natural language workflow generator draft review',
  ],
  ecommerce: [
    'Abandoned cart cascade: email → SMS → WhatsApp with exit checks',
    'Low-stock vendor replenishment workflow with supplier SLAs',
    'Fraud risk hold & manual review queue handoff',
    'Returns optimization decision tree with RMA automation',
    'VIP perks campaigns synchronized with loyalty tiering',
    'Shopify/Magento + Klaviyo & WhatsApp bidirectional sync',
  ],
  corporate: [
    'ML lead scoring updates CRM fields & notify owners',
    'Pipeline velocity stall alerts escalate to sales leadership',
    'Intent surge triggers revenue operations playbooks',
    'Lifecycle nurture drips adapt to account persona',
    'Weekly C-suite digest with auto commentary & insights',
  ],
  productivity: [
    'Sprint rituals orchestration across agile ceremonies',
    'Stale task nudges with owner reassignment rules',
    'NLP idea triage for backlog grooming',
    'Capacity balancing heuristics across squads',
    'Two-way sync with Jira, Trello, Asana boards',
  ],
  media: [
    'Publishing control tower with embargo enforcement',
    'Semantic auto-tagging of assets & editorial review',
    'Highlight clip generator for social distribution',
    'Blocked queue alerts for legal/compliance follow-up',
    'CMS/DAM and YouTube/TikTok integration pipelines',
  ],
  edtech: [
    'Auto certificate issuance post competency completion',
    'Inactivity nudges to learners + mentors',
    'Adaptive remediation content assignment',
    'Mentor rotation scheduling automation',
    'LMS synchronization with Credly badge issuance',
  ],
  niches: [
    'Healthcare: appointment reminders, no-show prediction escalation',
    'Finance: expense routing, anomaly detection, period close checklist',
    'Real Estate: lead assignment, listing nurture, multi-channel reminders',
    'Shared: digital intake assistants triaging to task queues',
  ],
} as const;

export type ModuleKey = keyof typeof automationTemplates;

export const moduleMotionMap: Record<ModuleKey, {
  entry: string;
  details: string;
  reduceMotion: string;
}> = {
  saas: {
    entry: 'Page enter 0–600ms with filter fade-in followed by KPI count-up at 160ms stagger',
    details:
      'Primary charts slide + fade on emphasis easing (260–520ms); automation builder cards rise 2px with smooth easing.',
    reduceMotion: 'Filters and charts fade sequentially with opacity-only transitions (200ms).',
  },
  ecommerce: {
    entry: 'Inventory KPIs count-up then trend chart draws horizontal stroke (smooth easing).',
    details:
      'Table rows stagger 40ms with crisp easing; fraud alerts pulse success state at 200ms.',
    reduceMotion: 'Table rows appear with 120ms fade; alerts maintain color emphasis only.',
  },
  corporate: {
    entry: 'Funnel compresses from baseline using emphasis easing, exec insights cards slide-up.',
    details:
      'Donut segments animate delta update only; logs timeline cascades 3 items per 60ms.',
    reduceMotion: 'Funnel and cards fade; timeline shows sequential opacity changes.',
  },
  productivity: {
    entry: 'Kanban columns snap with spring stiffness 380; backlog list crossfades at 200ms.',
    details:
      'Drag interactions use snap spring (stiffness 400, damping 34); modals scale 0.98→1.0 on success pulses.',
    reduceMotion: 'Kanban updates fade highlight only; modals remove scale transitions.',
  },
  media: {
    entry: 'Queue timeline slides from baseline with emphasis easing; charts cascade 60ms.',
    details:
      'READY/REVIEW/BLOCKED badges lift -2px on hover with smooth easing and icon emphasis.',
    reduceMotion: 'Queues fade in; badges highlight border contrast without translation.',
  },
  edtech: {
    entry: 'Heatmap cells rise from opacity 0 to 1 with crisp easing over 320ms.',
    details:
      'Alert stack pulses subtle border; tables slide from 8px offset with smooth easing.',
    reduceMotion: 'Heatmap reveals via color only; tables fade with no translation.',
  },
  niches: {
    entry: 'Segmented tabs crossfade 200ms; appointment cards scale 0.98→1.0 on success pulses.',
    details:
      'Automation logs timeline grows vertically with 40ms stagger; status badges animate icon fill only.',
    reduceMotion: 'Tabs fade with no motion; badges rely on contrast + icon without animation.',
  },
};

export const headerConfig = {
  title: 'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches',
  generatedAt: '09/26/2025, 4:14:00 AM',
};
