import { ReactNode, createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const useThemeStoreInternal = create<ThemeStore>((set) => ({
  mode: 'light',
  setMode: (mode) => set({ mode }),
  toggle: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' }))
}));

const ThemeContext = createContext(useThemeStoreInternal);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const store = useThemeStoreInternal;
  const mode = store.getState().mode;

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>;
}

export function useThemeStore() {
  return useContext(ThemeContext);
}
