import { cn } from '@/lib/utils';
import type { TabDefinition } from '@/app/dashboard/data';

type SegmentedTabsProps = {
  tabs: TabDefinition[];
  activeId: TabDefinition['id'];
  onChange: (id: TabDefinition['id']) => void;
};

export function SegmentedTabs({ tabs, activeId, onChange }: SegmentedTabsProps) {
  return (
    <div
      className="flex w-full flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-s1)] p-2"
      role="tablist"
      aria-label="Dashboard modules"
    >
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
              'flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition focus-visible:focus-ring',
              isActive
                ? 'bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100/80'
            )}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
