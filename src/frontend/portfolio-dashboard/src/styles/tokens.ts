export interface ColorScale {
  [shade: number]: string;
}

export interface SemanticPalette {
  primary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
}

export interface SurfaceTokens {
  S0: string;
  S1: string;
  S2: string;
  S3: string;
  border: string;
  shadow: string;
}

export interface DesignTokens {
  typography: {
    fontFamily: string;
    headline1: string;
    headline2: string;
    headline3: string;
    body: string;
    caption: string;
  };
  spacingScale: number[];
  palette: SemanticPalette;
  verticalAccents: Record<string, string>;
  surfaces: {
    light: SurfaceTokens;
    dark: SurfaceTokens;
  };
  transitions: {
    duration: string;
    timing: string;
  };
}

export const designTokens: DesignTokens = {
  typography: {
    fontFamily: "'InterVariable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headline1: '700 32px/36px var(--font-family)',
    headline2: '600 22px/28px var(--font-family)',
    headline3: '600 16px/24px var(--font-family)',
    body: '400 14px/20px var(--font-family)',
    caption: '500 12px/16px var(--font-family)'
  },
  spacingScale: Array.from({ length: 16 }, (_, index) => index * 8),
  palette: {
    primary: {
      50: '#F2F6FF',
      100: '#D9E3FF',
      200: '#B0C4FF',
      300: '#809EFF',
      400: '#5A80FF',
      500: '#3C66F5',
      600: '#2A4CD6',
      700: '#1C3AB0',
      800: '#122780',
      900: '#0A1A59'
    },
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B'
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F'
    },
    danger: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D'
    },
    info: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63'
    }
  },
  verticalAccents: {
    saas: '#5A80FF',
    commerce: '#E45A3F',
    corporate: '#6E59D9',
    custom: '#409C8C',
    media: '#FF8A4C',
    edtech: '#6F4CBB',
    specialized: '#4C86B7'
  },
  surfaces: {
    light: {
      S0: '#0B0E1A',
      S1: '#FFFFFF',
      S2: '#F5F7FB',
      S3: 'rgba(12, 28, 64, 0.08)',
      border: 'rgba(13, 36, 64, 0.12)',
      shadow: '0px 12px 32px rgba(12, 28, 64, 0.08)'
    },
    dark: {
      S0: '#F8FBFF',
      S1: '#0F172A',
      S2: '#121C33',
      S3: 'rgba(4, 12, 26, 0.64)',
      border: 'rgba(148, 163, 184, 0.24)',
      shadow: '0px 16px 40px rgba(2, 6, 23, 0.6)'
    }
  },
  transitions: {
    duration: '200ms',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

function tokenCSS(customTokens: DesignTokens) {
  const { typography, palette, verticalAccents, surfaces, transitions } = customTokens;
  return `:root {
    --font-family: ${typography.fontFamily};
    --font-h1: ${typography.headline1};
    --font-h2: ${typography.headline2};
    --font-h3: ${typography.headline3};
    --font-body: ${typography.body};
    --font-caption: ${typography.caption};
    --transition-duration: ${transitions.duration};
    --transition-ease: ${transitions.timing};
    --surface-S1: ${surfaces.light.S1};
    --surface-S2: ${surfaces.light.S2};
    --surface-S3: ${surfaces.light.S3};
    --surface-border: ${surfaces.light.border};
    --surface-shadow: ${surfaces.light.shadow};
    --color-primary-500: ${palette.primary[500]};
    --color-success-500: ${palette.success[500]};
    --color-warning-500: ${palette.warning[500]};
    --color-danger-500: ${palette.danger[500]};
    --color-info-500: ${palette.info[500]};
    --vertical-saas: ${verticalAccents.saas};
    --vertical-commerce: ${verticalAccents.commerce};
    --vertical-corporate: ${verticalAccents.corporate};
    --vertical-custom: ${verticalAccents.custom};
    --vertical-media: ${verticalAccents.media};
    --vertical-edtech: ${verticalAccents.edtech};
    --vertical-specialized: ${verticalAccents.specialized};
  }
  [data-theme="dark"] {
    color-scheme: dark;
    --surface-S1: ${surfaces.dark.S1};
    --surface-S2: ${surfaces.dark.S2};
    --surface-S3: ${surfaces.dark.S3};
    --surface-border: ${surfaces.dark.border};
    --surface-shadow: ${surfaces.dark.shadow};
  }`;
}

let injected = false;

export function injectTheme(tokens: DesignTokens) {
  if (injected) return;
  const style = document.createElement('style');
  style.id = 'portfolio-design-tokens';
  style.textContent = tokenCSS(tokens);
  document.head.appendChild(style);
  injected = true;
}
