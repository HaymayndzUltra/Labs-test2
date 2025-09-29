import { cn } from '@/lib/utils';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
};

export function FilterChip({ label, active = false, onClick, icon }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:focus-ring',
        active
          ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-600)] dark:border-[rgba(99,102,241,0.6)] dark:bg-[rgba(99,102,241,0.18)] dark:text-[rgba(226,232,240,0.92)]'
          : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/60 dark:text-[rgba(226,232,240,0.82)] dark:hover:bg-[rgba(148,163,184,0.12)]'
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
