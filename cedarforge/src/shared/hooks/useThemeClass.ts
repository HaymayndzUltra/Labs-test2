import { useSyncExternalStore } from 'react';
import { useThemeStore } from '../state/theme-store';
import { tokens } from '../tokens/tokens';

export function useThemeClass() {
  const store = useThemeStore();
  const mode = useSyncExternalStore(store.subscribe, () => store.getState().mode);

  return mode === 'dark' ? tokens.dark.className : tokens.light.className;
}
