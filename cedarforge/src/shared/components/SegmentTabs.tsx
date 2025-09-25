import { ReactNode, useId } from 'react';
import clsx from 'clsx';

export type SegmentTab = {
  id: string;
  label: string;
  description?: string;
};

type SegmentTabsProps = {
  value: string;
  tabs: SegmentTab[];
  onChange: (id: string) => void;
  className?: string;
};

export function SegmentTabs({ value, tabs, onChange, className }: SegmentTabsProps) {
  const tablistId = useId();
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div role="tablist" aria-labelledby={`${tablistId}-label`} className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              id={`${tablistId}-${tab.id}`}
              aria-controls={`${tablistId}-${tab.id}-panel`}
              type="button"
              className={clsx(
                'flex h-11 items-center gap-2 rounded-[16px] border-[1.5px] px-4 text-sm font-semibold transition duration-200 ease-cedar focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]',
                selected
                  ? 'border-[color:var(--accent-finops)] bg-[color:var(--accent-finops)]/10 text-[color:var(--accent-finops)]'
                  : 'border-[color:var(--line-soft)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-finops)]'
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          aria-labelledby={`${tablistId}-${tab.id}`}
          id={`${tablistId}-${tab.id}-panel`}
          hidden={tab.id !== value}
          className="rounded-[16px] border-[1.5px] border-dashed border-[color:var(--line-soft)] p-4 text-[12px] text-[color:var(--text-secondary)]"
        >
          {tab.description ?? `${tab.label} panel`}
        </div>
      ))}
    </div>
  );
}
