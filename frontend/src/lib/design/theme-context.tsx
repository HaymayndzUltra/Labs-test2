'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ACCESSIBILITY_TOKENS, COLOR_TOKENS, type Direction, type ThemeName } from './tokens';

interface ThemeContextValue {
  theme: ThemeName;
  direction: Direction;
  reduceMotion: boolean;
  setTheme: (value: ThemeName) => void;
  toggleTheme: () => void;
  setDirection: (value: Direction) => void;
  toggleDirection: () => void;
  setReduceMotion: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  initialTheme?: ThemeName;
  initialDirection?: Direction;
  children: ReactNode;
}

export function ThemeProvider({
  initialTheme = 'light',
  initialDirection = 'ltr',
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);
  const [direction, setDirectionState] = useState<Direction>(initialDirection);
  const [reduceMotion, setReduceMotionState] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduceMotionState(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dir = direction;
    root.style.setProperty('--tooltip-delay', `${ACCESSIBILITY_TOKENS.tooltipDelay}ms`);

    const palette = COLOR_TOKENS[theme];
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, value);
    });
  }, [theme, direction]);

  const setTheme = useCallback((value: ThemeName) => {
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setDirection = useCallback((value: Direction) => {
    setDirectionState(value);
  }, []);

  const toggleDirection = useCallback(() => {
    setDirectionState((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  const value = useMemo(
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

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
