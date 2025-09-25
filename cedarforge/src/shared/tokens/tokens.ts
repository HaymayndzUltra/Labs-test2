import tokensJson from './tokens.json';

type ThemeName = keyof typeof tokensJson.themes;

type ThemeDefinition = {
  className: string;
  tokens: Record<string, string>;
};

function toCssVariables(theme: ThemeDefinition) {
  const entries = Object.entries(theme.tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  return `${theme.className} { ${entries} }`;
}

if (typeof document !== 'undefined') {
  const styles = document.createElement('style');
  styles.dataset.source = 'cedarforge-theme-tokens';
  styles.innerHTML = Object.values(tokensJson.themes)
    .map((theme) => toCssVariables(theme))
    .join('\n');
  if (!document.head.querySelector('[data-source="cedarforge-theme-tokens"]')) {
    document.head.appendChild(styles);
  }
}

export const tokens = tokensJson.themes;
export type Palette = typeof tokensJson.palette;
export type CedarTheme = (typeof tokens)[ThemeName];
