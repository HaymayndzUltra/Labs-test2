import plugin from 'tailwindcss/plugin';
import tokensJson from './tokens.json';

export const cedarForgeTokenPlugin = plugin(function ({ addBase, addUtilities }) {
  const themeEntries = Object.values(tokensJson.themes).map((theme) => ({
    [`.${theme.className}`]: theme.tokens
  }));
  addBase(Object.assign({}, ...themeEntries));

  const colorUtilities = Object.entries(tokensJson.palette).reduce<Record<string, any>>(
    (acc, [name, scale]) => {
      Object.entries(scale).forEach(([step, value]) => {
        acc[`.bg-${name}-${step}`] = { backgroundColor: value };
        acc[`.text-${name}-${step}`] = { color: value };
        acc[`.border-${name}-${step}`] = { borderColor: value };
      });
      return acc;
    },
    {}
  );

  addUtilities(colorUtilities, ['responsive', 'hover', 'focus']);
});
