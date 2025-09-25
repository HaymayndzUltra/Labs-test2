export const colorTokens = {
  canvas: { light: '#f5f6fb', dark: '#101321' },
  surface: { light: '#ffffff', dark: '#181c2d' },
  surfaceSubtle: { light: '#f8f8fe', dark: '#1f2438' },
  surfaceStrong: { light: '#edeaf9', dark: '#2a3050' },
  border: { light: '#d9d6eb', dark: '#343b5d' },
  borderStrong: { light: '#bab4da', dark: '#4b5380' },
  textStrong: { light: '#1f1a35', dark: '#f5f3ff' },
  textSubtle: { light: '#4b4662', dark: '#d3cff6' },
  textMuted: { light: '#6f6a89', dark: '#a3a6c7' },
  primary: { light: '#6b4eff', dark: '#9f87ff' },
  primaryAlt: { light: '#5336e2', dark: '#c0afff' },
  success: { light: '#2f9d69', dark: '#4ccf92' },
  warning: { light: '#d0971a', dark: '#f7c548' },
  error: { light: '#d6455d', dark: '#ff728a' },
  info: { light: '#2f7fde', dark: '#6db7ff' },
} as const;

export const typographyScale = {
  display: { size: 32, weight: 600 },
  heading: { size: 24, weight: 600 },
  subheading: { size: 18, weight: 500 },
  body: { size: 14, weight: 400 },
} as const;

export const spacingTokens = {
  xxs: 8,
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const elevationTokens = {
  sm: '0 1px 2px rgba(16, 11, 36, 0.08)',
  md: '0 10px 30px rgba(31, 26, 53, 0.08)',
  lg: '0 28px 50px rgba(31, 26, 53, 0.12)',
} as const;

export const motionTokens = {
  durations: {
    micro: 110,
    standard: 200,
    narrative: 320,
  },
  easing: {
    smooth: 'cubic-bezier(0.17, 0.84, 0.44, 1)',
    crisp: 'cubic-bezier(0.2, 0.6, 0, 0.99)',
    emphasis: 'cubic-bezier(0.12, 0.72, 0.18, 1)',
  },
  spring: {
    stiffness: 360,
    damping: 36,
  },
} as const;

export const motionChoreography = [
  { phase: 'Page enter', window: '0–600ms', notes: 'Staggered cascade from filters to secondary panels' },
  { phase: 'Filters', window: '0–120ms', notes: 'Slide + fade from top with smooth easing' },
  { phase: 'KPIs', window: '120–260ms', notes: 'Count-up animation, emphasis easing' },
  { phase: 'Primary charts', window: '260–520ms', notes: 'Scale + fade, crisp easing' },
  { phase: 'Secondary panels', window: '520–600ms', notes: 'Subtle fade-in' },
] as const;

export type ThemeTokenGroup = {
  name: string;
  description: string;
  tokens: Record<string, string | number | { light: string; dark: string }>;
};

export const tokenGroups: ThemeTokenGroup[] = [
  { name: 'Color', description: 'Light and dark values for surfaces and semantic states.', tokens: colorTokens },
  { name: 'Typography', description: 'Unified typographic scale across modules.', tokens: typographyScale },
  { name: 'Spacing', description: '8pt grid-aligned spacing tokens.', tokens: spacingTokens },
  { name: 'Elevation', description: 'Shadow tokens for depth hierarchy.', tokens: elevationTokens },
  { name: 'Motion', description: 'Durations, easing curves, and spring constants.', tokens: motionTokens },
];
