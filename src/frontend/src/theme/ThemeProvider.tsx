import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeDefinition } from "./tokens";
import { darkTheme, lightTheme, themes } from "./tokens";

interface ThemeContextValue {
  theme: ThemeDefinition;
  toggleTheme: () => void;
  setThemeId: (id: ThemeDefinition["id"]) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "pgpo_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeDefinition["id"]>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeDefinition["id"] | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  }, [themeId]);

  const theme = useMemo(() => (themeId === "light" ? lightTheme : darkTheme), [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme.id);
    root.style.setProperty("color-scheme", theme.id);
    root.style.background = theme.surfaces.s0;
    Object.entries(theme.palette).forEach(([role, scale]) => {
      Object.entries(scale).forEach(([step, value]) => {
        root.style.setProperty(`--${role}-${step}`, value);
      });
    });
    root.style.setProperty("--surface-s0", theme.surfaces.s0);
    root.style.setProperty("--surface-s1", theme.surfaces.s1);
    root.style.setProperty("--surface-s2", theme.surfaces.s2);
    root.style.setProperty("--surface-s3", theme.surfaces.s3);
    root.style.setProperty("--border-color", theme.surfaces.border);
    root.style.setProperty("--shadow-elevation", theme.surfaces.shadow);
    root.style.setProperty("--text-primary", theme.surfaces.textPrimary);
    root.style.setProperty("--text-secondary", theme.surfaces.textSecondary);
    root.style.setProperty("--focus-ring", theme.surfaces.focus);
    Object.entries(theme.verticalAccents).forEach(([key, value]) => {
      root.style.setProperty(`--vertical-${key}`, value);
    });
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setThemeId((current) => (current === "light" ? "dark" : "light")),
      setThemeId
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const availableThemes = themes;
