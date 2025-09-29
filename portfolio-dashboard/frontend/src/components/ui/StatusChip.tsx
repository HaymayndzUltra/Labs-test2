import { cn } from '@/lib/utils';

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<StatusTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-[var(--success-50)] text-[var(--success-600)] border-[var(--success-500)]/40',
  warning: 'bg-[var(--warning-50)] text-[var(--warning-600)] border-[var(--warning-500)]/40',
  danger: 'bg-[var(--danger-50)] text-[var(--danger-600)] border-[var(--danger-500)]/40',
  info: 'bg-[var(--info-50)] text-[var(--info-600)] border-[var(--info-500)]/40',
};

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusChip({ label, tone = 'neutral' }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]',
        toneStyles[tone]
      )}
    >
      {label}
    </span>
  );
}
