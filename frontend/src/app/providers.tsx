'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type DashboardTheme = 'light' | 'dark';
export type DashboardDirection = 'ltr' | 'rtl';

interface ThemeContextValue {
  theme: DashboardTheme;
  direction: DashboardDirection;
  reduceMotion: boolean;
  setTheme: (theme: DashboardTheme) => void;
  toggleTheme: () => void;
  setDirection: (dir: DashboardDirection) => void;
  toggleDirection: () => void;
  setReduceMotion: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'premium-dashboard-theme';
const DIR_STORAGE_KEY = 'premium-dashboard-direction';
const MOTION_STORAGE_KEY = 'premium-dashboard-motion';

function getInitialTheme(): DashboardTheme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as DashboardTheme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const prefersDark =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function getInitialDirection(): DashboardDirection {
  if (typeof window === 'undefined') return 'ltr';
  const stored = window.localStorage.getItem(DIR_STORAGE_KEY) as DashboardDirection | null;
  return stored === 'rtl' ? 'rtl' : 'ltr';
}

function getInitialMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(MOTION_STORAGE_KEY);
  if (stored === 'true' || stored === 'false') {
    return stored === 'true';
  }
  return (
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [theme, setThemeState] = useState<DashboardTheme>(getInitialTheme);
  const [direction, setDirectionState] = useState<DashboardDirection>(getInitialDirection);
  const [reduceMotion, setReduceMotionState] = useState<boolean>(getInitialMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DIR_STORAGE_KEY, direction);
  }, [direction]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MOTION_STORAGE_KEY, String(reduceMotion));
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-dir', direction);
    root.setAttribute('dir', direction);
    root.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false');
  }, [theme, direction, reduceMotion]);

  const setTheme = useCallback((value: DashboardTheme) => {
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setDirection = useCallback((value: DashboardDirection) => {
    setDirectionState(value);
  }, []);

  const toggleDirection = useCallback(() => {
    setDirectionState((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      direction,
      reduceMotion,
      setTheme,
      toggleTheme,
      setDirection,
      toggleDirection,
      setReduceMotion,
    }),
    [theme, direction, reduceMotion, setTheme, toggleTheme, setDirection, toggleDirection, setReduceMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeControls(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeControls must be used within Providers');
  }
  return context;
}
