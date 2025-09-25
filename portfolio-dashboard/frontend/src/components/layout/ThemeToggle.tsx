import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        borderRadius: '999px',
        border: '1px solid var(--surface-border)',
        background: 'var(--surface-s1)',
        padding: '6px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--neutral-600)',
        transition: 'var(--transition-medium)',
      }}
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      <span style={{ fontSize: 12, fontWeight: 600 }}>{isDark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
