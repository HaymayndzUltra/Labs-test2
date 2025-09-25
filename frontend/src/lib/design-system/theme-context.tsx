'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { DirectionMode, MotionMode, ThemeMode } from './tokens';

interface ThemeContextValue {
  theme: ThemeMode;
  direction: DirectionMode;
  motion: MotionMode;
  setTheme: (mode: ThemeMode) => void;
  setDirection: (dir: DirectionMode) => void;
  setMotion: (mode: MotionMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => (prefersDark() ? 'dark' : 'light'));
  const [direction, setDirection] = useState<DirectionMode>('ltr');
  const [motion, setMotion] = useState<MotionMode>(() => (prefersReducedMotion() ? 'reduce' : 'full'));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('dir', direction);
    if (motion === 'reduce') {
      root.setAttribute('data-motion', 'reduce');
    } else {
      root.removeAttribute('data-motion');
    }
  }, [theme, direction, motion]);

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (event: MediaQueryListEvent) => setMotion(event.matches ? 'reduce' : 'full');

    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleTheme = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');

    motionMedia.addEventListener('change', handleMotion);
    themeMedia.addEventListener('change', handleTheme);

    return () => {
      motionMedia.removeEventListener('change', handleMotion);
      themeMedia.removeEventListener('change', handleTheme);
    };
  }, []);

  const value = useMemo(
    () => ({ theme, direction, motion, setTheme, setDirection, setMotion }),
    [theme, direction, motion]
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
