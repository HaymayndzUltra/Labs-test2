export type ThemeName = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';

export const COLOR_TOKENS = {
  light: {
    canvas: '#f7f7fb',
    surface: '#ffffff',
    surfaceSubtle: '#f0eefc',
    surfaceStrong: '#e7e4fa',
    textPrimary: '#1c1233',
    textSecondary: '#5a5078',
    textMuted: '#7f7697',
    border: '#d7d2ef',
    borderStrong: '#b1a7d8',
    primary: '#6f4df6',
    primaryStrong: '#5b39e8',
    primaryMuted: '#cfc4ff',
    success: '#1f8a6f',
    successSurface: '#dff5ed',
    warning: '#b17b00',
    warningSurface: '#fff4d6',
    error: '#c73a3a',
    errorSurface: '#ffe2e2',
    info: '#2563eb',
    infoSurface: '#e4edff',
    focus: '#8b6dfa',
    elevationShadow: '0 24px 40px -20px rgba(64, 44, 150, 0.18)',
  },
  dark: {
    canvas: '#090815',
    surface: '#141126',
    surfaceSubtle: '#1c1733',
    surfaceStrong: '#2a2149',
    textPrimary: '#f6f1ff',
    textSecondary: '#bfb7d9',
    textMuted: '#9488b4',
    border: '#2f264b',
    borderStrong: '#413360',
    primary: '#9f8dff',
    primaryStrong: '#c4b7ff',
    primaryMuted: '#4c3aa8',
    success: '#4fd5aa',
    successSurface: '#11352d',
    warning: '#ffd166',
    warningSurface: '#2f2507',
    error: '#ff7a7a',
    errorSurface: '#3b1111',
    info: '#74a2ff',
    infoSurface: '#132346',
    focus: '#b39aff',
    elevationShadow: '0 24px 48px -24px rgba(0, 0, 0, 0.6)',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  scale: {
    display: { size: '32px', lineHeight: '40px', weight: 600, letterSpacing: '-0.01em' },
    heading: { size: '24px', lineHeight: '32px', weight: 600, letterSpacing: '-0.005em' },
    title: { size: '18px', lineHeight: '26px', weight: 500 },
    body: { size: '14px', lineHeight: '20px', weight: 400 },
    metric: { size: '24px', lineHeight: '28px', weight: 600, fontFeatureSettings: 'tnum on, lnum on' },
    metricSm: { size: '18px', lineHeight: '22px', weight: 600, fontFeatureSettings: 'tnum on, lnum on' },
    caption: { size: '12px', lineHeight: '16px', weight: 400 },
  },
} as const;

export const SPACING_SCALE = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const ELEVATION_TOKENS = {
  base: '0 2px 8px rgba(29, 20, 62, 0.08)',
  raised: '0 12px 24px -12px rgba(29, 20, 62, 0.2)',
  overlay: '0 20px 48px -24px rgba(16, 11, 35, 0.32)',
} as const;

export const MOTION_TOKENS = {
  duration: {
    micro: 110,
    standard: 200,
    narrative: 320,
    entrance: 600,
  },
  easing: {
    smooth: 'cubic-bezier(0.17, 0.84, 0.44, 1)',
    crisp: 'cubic-bezier(0.2, 0.6, 0, 0.99)',
    emphasis: 'cubic-bezier(0.12, 0.72, 0.18, 1)',
  },
  spring: {
    drag: { stiffness: 360, damping: 36 },
    snap: { stiffness: 420, damping: 32 },
  },
  states: {
    hoverTranslateY: '-2px',
    pressScale: 0.98,
    successPulseFrom: 0.96,
    successPulseTo: 1,
  },
} as const;

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1280,
} as const;

export const GRID_SETTINGS = {
  desktopColumns: 12,
  tabletColumns: 10,
  mobileColumns: 4,
  gutter: {
    desktop: 32,
    tablet: 24,
    mobile: 16,
  },
} as const;

export interface ExportRecord {
  id: string;
  module: string;
  format: 'csv' | 'json';
  url: string;
  createdAt: string;
  expiresAt: string;
}

export const ACCESSIBILITY_TOKENS = {
  focusRing: {
    width: '2px',
    colorVar: '--color-focus',
    offset: '3px',
  },
  tooltipDelay: 140,
} as const;
