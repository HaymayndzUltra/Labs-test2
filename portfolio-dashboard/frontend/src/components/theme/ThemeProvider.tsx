'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

type ThemeContextValue = {
  theme: ThemeMode;
  direction: Direction;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setDirection: (dir: Direction) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('pg-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialDirection(): Direction {
  if (typeof window === 'undefined') return 'ltr';
  const stored = window.localStorage.getItem('pg-direction');
  return stored === 'rtl' ? 'rtl' : 'ltr';
}

export function ThemeProvider({
  children,
  defaultTheme,
  defaultDirection,
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultDirection?: Direction;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme ?? getInitialTheme());
  const [direction, setDirectionState] = useState<Direction>(defaultDirection ?? getInitialDirection());

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem('pg-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dir = direction;
    window.localStorage.setItem('pg-direction', direction);
  }, [direction]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setDirection = useCallback((dir: Direction) => {
    setDirectionState(dir);
  }, []);

  const value = useMemo(
    () => ({ theme, direction, setTheme, toggleTheme, setDirection }),
    [theme, direction, setTheme, toggleTheme, setDirection]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
