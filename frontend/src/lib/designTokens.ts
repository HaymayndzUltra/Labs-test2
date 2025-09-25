export type ColorToken = {
  name: string;
  light: string;
  dark: string;
  description: string;
};

export type TypographyToken = {
  name: string;
  size: number;
  lineHeight: number;
  weight: 400 | 500 | 600;
  usage: string;
};

export type SpacingToken = {
  name: string;
  value: number;
  usage: string;
};

export type MotionToken = {
  name: string;
  duration: number;
  easing: string;
  usage: string;
};

export interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  elevation: { name: string; value: string; usage: string }[];
  motion: MotionToken[];
}

export const designTokens: DesignTokens = {
  colors: [
    {
      name: 'canvas',
      light: '#f5f5fb',
      dark: '#0f0b1d',
      description: 'Neutral background framing the dashboard surface.',
    },
    {
      name: 'surface',
      light: '#ffffff',
      dark: '#161029',
      description: 'Primary card and panel surfaces.',
    },
    {
      name: 'primary-500',
      light: '#6f4df6',
      dark: '#9f8bff',
      description: 'Primary action and focus states.',
    },
    {
      name: 'primary-600',
      light: '#5431e8',
      dark: '#8a70ff',
      description: 'Hover state for primary actions.',
    },
    {
      name: 'text-strong',
      light: '#1e1633',
      dark: '#f4f2fb',
      description: 'Headlines and key KPIs.',
    },
    {
      name: 'text-default',
      light: '#3d3454',
      dark: '#d5cff1',
      description: 'Body copy, table content, automation descriptions.',
    },
    {
      name: 'text-muted',
      light: '#6b6284',
      dark: '#b4add4',
      description: 'Captions, helper text, chart axis labels.',
    },
    {
      name: 'border',
      light: '#dcd6f0',
      dark: '#3c2f55',
      description: 'Card outlines, divider strokes, gridlines.',
    },
    {
      name: 'success',
      light: '#0f9d58',
      dark: '#5ad49d',
      description: 'Positive KPIs, automation success logs.',
    },
    {
      name: 'warning',
      light: '#f5a524',
      dark: '#f8cf6b',
      description: 'Upcoming risk, attention states, backlog thresholds.',
    },
    {
      name: 'error',
      light: '#d93025',
      dark: '#ff9086',
      description: 'Critical alerts, failed automations.',
    },
    {
      name: 'info',
      light: '#1d6ef2',
      dark: '#6aa8ff',
      description: 'Informational callouts, neutral statuses.',
    },
  ],
  typography: [
    { name: 'display', size: 32, lineHeight: 40, weight: 600, usage: 'Dashboard headers, module titles.' },
    { name: 'headline', size: 24, lineHeight: 32, weight: 600, usage: 'Card titles, automation sections.' },
    { name: 'subhead', size: 18, lineHeight: 28, weight: 500, usage: 'Section subtitles, metric annotations.' },
    { name: 'body', size: 14, lineHeight: 22, weight: 400, usage: 'Table copy, descriptions, axis labels.' },
  ],
  spacing: [
    { name: 'space-8', value: 8, usage: 'Compact gaps, chip padding, icon spacing.' },
    { name: 'space-16', value: 16, usage: 'Card vertical rhythm, control groups.' },
    { name: 'space-24', value: 24, usage: 'Grid gutters, between stacked cards.' },
    { name: 'space-32', value: 32, usage: 'Page padding, module separation.' },
  ],
  elevation: [
    {
      name: 'base',
      value: '0 0 0 rgba(0,0,0,0)',
      usage: 'Flat tiles and inset controls.',
    },
    {
      name: 'raised',
      value: '0 12px 32px rgba(40, 25, 65, 0.08)',
      usage: 'Primary cards, automation builder, modals.',
    },
    {
      name: 'focus',
      value: '0 0 0 3px rgba(113, 71, 255, 0.35)',
      usage: 'Accessible focus indicators with animated glow.',
    },
  ],
  motion: [
    {
      name: 'micro',
      duration: 110,
      easing: 'cubic-bezier(0.17, 0.84, 0.44, 1)',
      usage: 'Hover lifts, focus ring bloom.',
    },
    {
      name: 'standard',
      duration: 200,
      easing: 'cubic-bezier(0.2, 0.6, 0, 0.99)',
      usage: 'Tabs, filters, state transitions.',
    },
    {
      name: 'narrative',
      duration: 320,
      easing: 'cubic-bezier(0.12, 0.72, 0.18, 1)',
      usage: 'Page entrance choreography, toast stack.',
    },
  ],
};

export type ModuleKey =
  | 'saas'
  | 'ecommerce'
  | 'corporate'
  | 'custom-app'
  | 'media'
  | 'edtech'
  | 'specialized';

export const moduleLabels: Record<ModuleKey, string> = {
  saas: 'SaaS Ops & Growth',
  ecommerce: 'E-commerce Performance',
  corporate: 'Corporate Analytics',
  'custom-app': 'Custom Productivity App',
  media: 'Content & Media Intelligence',
  edtech: 'EdTech Learning Pulse',
  specialized: 'Specialized Niches',
};

export const moduleThemes: Record<ModuleKey, { icon: string; description: string }> = {
  saas: {
    icon: '🚀',
    description: 'Retention, expansion, API health, plan governance.',
  },
  ecommerce: {
    icon: '🛍️',
    description: 'Conversion performance, fulfillment health, loyalty.',
  },
  corporate: {
    icon: '🏢',
    description: 'Executive KPIs, revenue funnels, pipeline pulse.',
  },
  'custom-app': {
    icon: '🧩',
    description: 'Productivity rituals, backlog flow, workload balance.',
  },
  media: {
    icon: '📺',
    description: 'Publishing control, storytelling insights, distribution.',
  },
  edtech: {
    icon: '🎓',
    description: 'Engagement, mastery, cohort progression, credentialing.',
  },
  specialized: {
    icon: '🌐',
    description: 'Healthcare, finance, real estate automation orchestration.',
  },
};
