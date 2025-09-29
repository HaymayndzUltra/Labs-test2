import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/components/theme/ThemeProvider';

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
};

export function FilterChip({ label, active = false, onClick, icon }: FilterChipProps) {
  const { direction } = useThemeContext();
  const isRtl = direction === 'rtl';

  const renderedIcon =
    icon && isValidElement(icon)
      ? cloneElement(icon, {
          className: cn(icon.props.className, isRtl && 'scale-x-[-1]'),
        })
      : icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:focus-ring',
        isRtl && 'flex-row-reverse text-right',
        active
          ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-600)]'
          : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/60'
      )}
      aria-pressed={active}
    >
      {renderedIcon}
      {label}
    </button>
  );
}
