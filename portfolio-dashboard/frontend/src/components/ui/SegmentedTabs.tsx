'use client';

import { cn } from '@/lib/utils';
import type { TabDefinition } from '@/app/dashboard/data';

type SegmentedTabsProps = {
  tabs: TabDefinition[];
  activeId: TabDefinition['id'];
  onChange: (id: TabDefinition['id']) => void;
  className?: string;
  density?: 'default' | 'compact';
  ariaLabel?: string;
};

export function SegmentedTabs({
  tabs,
  activeId,
  onChange,
  className,
  density = 'default',
  ariaLabel = 'Dashboard modules',
}: SegmentedTabsProps) {
  const containerClass = cn(
    'flex w-full flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-s1)] p-2',
    density === 'compact' && 'gap-2 rounded-[20px] p-1.5',
    className,
  );
  const buttonBase =
    'flex flex-1 items-center justify-center gap-2 rounded-[18px] text-sm font-semibold transition focus-visible:focus-ring';
  const buttonSizing =
    density === 'compact'
      ? 'min-w-[140px] px-3 py-2 text-[13px]'
      : 'min-w-[160px] px-4 py-3';

  return (
    <div className={containerClass} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            onClick={() => onChange(tab.id)}
            className={cn(
              buttonBase,
              buttonSizing,
              isActive
                ? 'bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100/80 dark:text-[rgba(226,232,240,0.92)] dark:hover:bg-[rgba(148,163,184,0.12)]'
            )}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedTabs;
