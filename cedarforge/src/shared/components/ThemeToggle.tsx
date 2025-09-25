import { useSyncExternalStore } from 'react';
import { SunMedium, Moon } from 'lucide-react';
import { useThemeStore } from '../state/theme-store';

export function ThemeToggle() {
  const store = useThemeStore();
  const mode = useSyncExternalStore(store.subscribe, () => store.getState().mode);
  return (
    <button
      type="button"
      onClick={() => store.getState().toggle()}
      className="flex h-11 w-11 items-center justify-center rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] text-[color:var(--text-primary)] shadow-sm transition duration-200 ease-cedar hover:border-[color:var(--accent-finops)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {mode === 'dark' ? <SunMedium size={20} /> : <Moon size={20} />}
    </button>
  );
}
