'use client';

import { useEffect, useState } from 'react';
import { useThemeContext } from '../lib/design/theme-context';
import { MOTION_TOKENS } from '../lib/design/tokens';

export function ThemeToolbar() {
  const { theme, toggleTheme, direction, toggleDirection, reduceMotion, setReduceMotion } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-motion', reduceMotion ? 'reduce' : 'full');
  }, [reduceMotion]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap gap-3"
      style={{
        transition: `opacity ${MOTION_TOKENS.duration.standard}ms ${MOTION_TOKENS.easing.smooth}`,
      }}
    >
      <ToggleButton
        label={`Theme: ${theme === 'light' ? 'Light' : 'Dark'}`}
        onClick={toggleTheme}
        icon={theme === 'light' ? '🌞' : '🌚'}
      />
      <ToggleButton
        label={`Layout: ${direction === 'ltr' ? 'LTR' : 'RTL'}`}
        onClick={toggleDirection}
        icon={direction === 'ltr' ? '↔️' : '🔁'}
      />
      <ToggleButton
        label={reduceMotion ? 'Reduced Motion' : 'Motion On'}
        onClick={() => setReduceMotion(!reduceMotion)}
        icon={reduceMotion ? '⏸️' : '🎞️'}
        ariaLabel="Toggle reduced motion mode"
      />
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  ariaLabel?: string;
}

function ToggleButton({ label, icon, onClick, ariaLabel }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
      style={{
        background: 'var(--color-surface-subtle)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
        transition: `background ${MOTION_TOKENS.duration.standard}ms ${MOTION_TOKENS.easing.smooth}`,
      }}
      aria-label={ariaLabel ?? label}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
