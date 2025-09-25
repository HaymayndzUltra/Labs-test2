export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export interface SemanticPalette {
  primary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
  neutral: ColorScale;
}

export interface SurfaceTokens {
  s0: string;
  s1: string;
  s2: string;
  s3: string;
  border: string;
  shadow: string;
  textPrimary: string;
  textSecondary: string;
  focus: string;
}

export interface ThemeDefinition {
  id: "light" | "dark";
  name: string;
  palette: SemanticPalette;
  surfaces: SurfaceTokens;
  chartPalettes: Record<string, string[]>;
  verticalAccents: Record<string, string>;
}

export const spacing = (factor: number) => `${factor * 8}px`;

export const typographyScale = {
  h1: { fontSize: "32px", lineHeight: "36px", fontWeight: 700 },
  h2: { fontSize: "22px", lineHeight: "28px", fontWeight: 600 },
  h3: { fontSize: "16px", lineHeight: "24px", fontWeight: 600 },
  body: { fontSize: "14px", lineHeight: "20px", fontWeight: 400 },
  caption: { fontSize: "12px", lineHeight: "16px", fontWeight: 500 }
};

const primaryScale: ColorScale = {
  50: "#edf5ff",
  100: "#d1e2ff",
  200: "#a6c7ff",
  300: "#7caaff",
  400: "#528bff",
  500: "#2a6bff",
  600: "#1f53d6",
  700: "#153daf",
  800: "#0d2a87",
  900: "#06195f"
};

const successScale: ColorScale = {
  50: "#e7f8f2",
  100: "#c1eddc",
  200: "#8fdcbf",
  300: "#5dcaa3",
  400: "#2bb886",
  500: "#0b9e6a",
  600: "#067c53",
  700: "#035a3c",
  800: "#013924",
  900: "#001e12"
};

const warningScale: ColorScale = {
  50: "#fff6e5",
  100: "#ffe4b8",
  200: "#ffc985",
  300: "#ffae52",
  400: "#ff9221",
  500: "#ed7700",
  600: "#bb5b00",
  700: "#883f00",
  800: "#562500",
  900: "#2c1200"
};

const dangerScale: ColorScale = {
  50: "#ffecef",
  100: "#ffd0d5",
  200: "#ff9fa8",
  300: "#ff6e7d",
  400: "#ff3b51",
  500: "#e3122f",
  600: "#b40d24",
  700: "#830818",
  800: "#53040e",
  900: "#290206"
};

const infoScale: ColorScale = {
  50: "#e7f5ff",
  100: "#c0e5ff",
  200: "#8cd0ff",
  300: "#59bbff",
  400: "#24a5ff",
  500: "#008be6",
  600: "#006db4",
  700: "#004f82",
  800: "#003251",
  900: "#001621"
};

const neutralScale: ColorScale = {
  50: "#f5f7fa",
  100: "#e6e9ef",
  200: "#cfd5df",
  300: "#b7bece",
  400: "#9ea5b6",
  500: "#828a9e",
  600: "#666e84",
  700: "#4b5268",
  800: "#313748",
  900: "#1b202e"
};

export const lightTheme: ThemeDefinition = {
  id: "light",
  name: "Daybreak",
  palette: {
    primary: primaryScale,
    success: successScale,
    warning: warningScale,
    danger: dangerScale,
    info: infoScale,
    neutral: neutralScale
  },
  surfaces: {
    s0: "#f8f9fb",
    s1: "#ffffff",
    s2: "rgba(255, 255, 255, 0.75)",
    s3: "rgba(13, 29, 58, 0.2)",
    border: "rgba(49, 55, 72, 0.12)",
    shadow: "0 12px 32px rgba(10, 32, 70, 0.12)",
    textPrimary: neutralScale[900],
    textSecondary: neutralScale[600],
    focus: infoScale[400]
  },
  chartPalettes: {
    default: [primaryScale[500], infoScale[400], successScale[400], warningScale[400], dangerScale[400]],
    colorblind: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
    qualitative: ["#2a6bff", "#ff8a50", "#56c271", "#f9c846", "#8b6bff", "#ff4d6d"]
  },
  verticalAccents: {
    saas: "#4b8bff",
    ecommerce: "#ff8a50",
    analytics: "#8b6bff",
    customapp: "#56c271",
    media: "#f5a524",
    edtech: "#9d5cf3",
    realestate: "#2aa39f",
    finance: "#1f7a8c",
    healthcare: "#f04f5a"
  }
};

export const darkTheme: ThemeDefinition = {
  id: "dark",
  name: "Midnight",
  palette: {
    primary: primaryScale,
    success: successScale,
    warning: warningScale,
    danger: dangerScale,
    info: infoScale,
    neutral: neutralScale
  },
  surfaces: {
    s0: "#0f172a",
    s1: "#111c32",
    s2: "rgba(17, 28, 50, 0.8)",
    s3: "rgba(4, 9, 20, 0.7)",
    border: "rgba(130, 138, 158, 0.24)",
    shadow: "0 16px 32px rgba(0, 0, 0, 0.4)",
    textPrimary: "#eff3ff",
    textSecondary: "#c7cde0",
    focus: infoScale[300]
  },
  chartPalettes: {
    default: ["#88a9ff", "#ffd166", "#4ad6a7", "#ff8a50", "#ff708d"],
    colorblind: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
    qualitative: ["#5da0ff", "#ffa56a", "#6ee7b7", "#facc15", "#a78bfa", "#fb7185"]
  },
  verticalAccents: lightTheme.verticalAccents
};

export const themes = [lightTheme, darkTheme];

export const typographyVariableNames = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  numericFontFeature: "'tnum' 1, 'lnum' 1"
};
