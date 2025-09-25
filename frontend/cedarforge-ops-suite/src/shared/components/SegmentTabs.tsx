import { KeyboardEvent } from "react";
import clsx from "classnames";

export interface SegmentTab {
  id: string;
  label: string;
  badge?: string | number;
}

interface SegmentTabsProps {
  tabs: SegmentTab[];
  value: string;
  onChange: (id: string) => void;
}

export const SegmentTabs = ({ tabs, value, onChange }: SegmentTabsProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === value);
    if (currentIndex === -1) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = tabs[(currentIndex + 1) % tabs.length];
      onChange(next.id);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const next = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      onChange(next.id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Segments"
      className="inline-flex items-center rounded-lg border border-line-strong bg-background-raised p-1"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "relative px-4 py-2 rounded-md text-sm leading-5 font-medium transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]",
              isActive
                ? "bg-background-card text-text-primary shadow-elevation1"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-2 rounded-full bg-line-soft px-2 py-0.5 text-xs font-semibold text-text-secondary">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
