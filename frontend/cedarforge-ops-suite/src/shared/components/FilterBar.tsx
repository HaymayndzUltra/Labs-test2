import { useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, Server } from "lucide-react";
import clsx from "classnames";
import { useUIStore } from "@shared/state/uiStore";
import { formatDateRange } from "@shared/utils/format";

const ENVIRONMENTS: { value: "production" | "staging" | "sandbox"; label: string }[] = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "sandbox", label: "Sandbox" },
];

const SEGMENTS = [
  { value: "global", label: "Global" },
  { value: "enterprise", label: "Enterprise" },
  { value: "midmarket", label: "Mid-Market" },
  { value: "smb", label: "SMB" },
];

const MODULES = [
  { value: "finops", label: "FinOps" },
  { value: "logistics", label: "Supply Chain" },
  { value: "energy", label: "Energy" },
  { value: "people", label: "PeopleOps" },
  { value: "iot", label: "IoT" },
  { value: "gaming", label: "Gaming" },
  { value: "hospitality", label: "Hospitality" },
];

interface DateRangeMenuProps {
  value: { from: string; to: string };
  onChange: (next: { from: string; to: string }) => void;
}

const presetRanges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

const DateRangeMenu = ({ value, onChange }: DateRangeMenuProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const applyRange = (days: number) => {
    const now = new Date();
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    onChange({ from: from.toISOString(), to: now.toISOString() });
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        className="flex h-11 items-center gap-2 rounded-md border border-line-strong bg-background-card px-4 text-sm font-semibold text-text-primary transition-colors hover:border-accent-logistics"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Calendar className="h-4 w-4" aria-hidden />
        <span>{formatDateRange(value.from, value.to)}</span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-2 w-64 rounded-md border border-line-soft bg-background-card p-2 shadow-elevation2"
        >
          {presetRanges.map((preset) => (
            <li key={preset.label}>
              <button
                className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-text-secondary hover:bg-line-soft"
                onClick={() => applyRange(preset.days)}
              >
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FilterBar = () => {
  const filters = useUIStore((state) => state.filters);
  const setFilters = useUIStore((state) => state.setFilters);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const moduleAccent = useMemo(() => `var(--accent-${filters.module})`, [filters.module]);

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border border-line-strong bg-background-raised p-4"
      role="toolbar"
      aria-label="Global filters"
    >
      <DateRangeMenu
        value={filters.dateRange}
        onChange={(dateRange) => setFilters({ dateRange })}
      />
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-text-muted" aria-hidden />
        <label className="sr-only" htmlFor="environment-select">
          Environment
        </label>
        <select
          id="environment-select"
          className="h-11 rounded-md border border-line-strong bg-background-card px-3 text-sm font-semibold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
          value={filters.environment}
          onChange={(event) => setFilters({ environment: event.target.value as typeof filters.environment })}
        >
          {ENVIRONMENTS.map((env) => (
            <option key={env.value} value={env.value}>
              {env.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
          Segment
        </label>
        <div role="group" aria-label="Segment selection" className="flex gap-2">
          {SEGMENTS.map((segment) => {
            const active = filters.segment === segment.value;
            return (
              <button
                key={segment.value}
                className={clsx(
                  "flex h-11 min-w-[44px] items-center justify-center rounded-md border px-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-transparent bg-background-card text-text-primary shadow-elevation1"
                    : "border-line-soft text-text-muted hover:text-text-primary"
                )}
                onClick={() => setFilters({ segment: segment.value })}
              >
                {segment.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <label className="sr-only" htmlFor="module-select">
          Module
        </label>
        <select
          id="module-select"
          className="h-11 rounded-md border border-line-strong bg-background-card px-4 text-sm font-semibold text-text-primary"
          value={filters.module}
          onChange={(event) => setFilters({ module: event.target.value as typeof filters.module })}
          style={{ borderColor: moduleAccent }}
        >
          {MODULES.map((module) => (
            <option key={module.value} value={module.value}>
              {module.label}
            </option>
          ))}
        </select>
        <button
          className="h-11 min-w-[44px] rounded-md border border-line-strong bg-background-card px-4 text-sm font-semibold text-text-primary hover:border-accent-energy"
          onClick={toggleTheme}
        >
          Theme
        </button>
      </div>
    </div>
  );
};
