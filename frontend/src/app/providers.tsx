'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type DirectionMode = 'ltr' | 'rtl';

interface ExperienceContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  direction: DirectionMode;
  setDirection: (dir: DirectionMode) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [direction, setDirection] = useState<DirectionMode>('ltr');
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false');
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setReduceMotion(true);
    }
    const listener = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, direction, setDirection, reduceMotion, setReduceMotion }),
    [theme, direction, reduceMotion]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperienceContext() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperienceContext must be used within Providers');
  }
  return context;
}
