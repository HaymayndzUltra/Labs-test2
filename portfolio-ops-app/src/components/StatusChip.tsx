import clsx from 'clsx';

interface StatusChipProps {
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
}

export const StatusChip = ({ tone, label }: StatusChipProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-wide',
      tone === 'success' && 'border-success-300 bg-success-50 text-success-700',
      tone === 'warning' && 'border-warning-300 bg-warning-50 text-warning-700',
      tone === 'danger' && 'border-danger-300 bg-danger-50 text-danger-700',
      tone === 'info' && 'border-info-300 bg-info-50 text-info-700',
      tone === 'neutral' && 'border-[var(--border-subtle)] bg-[var(--surface-0)] text-[var(--color-text-secondary)]'
    )}
  >
    <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
    {label}
  </span>
);
