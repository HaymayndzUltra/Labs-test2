import { useMemo } from 'react';
import { useFilterStore } from '../state/filterStore';

const datePresets = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'fytd', label: 'FY to date' }
] as const;

const segments = ['all', 'enterprise', 'mid-market', 'smb'] as const;
const regions = ['global', 'amer', 'emea', 'apac'] as const;
const verticals = [
  { value: 'all', label: 'All verticals' },
  { value: 'saas', label: 'SaaS' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'customapp', label: 'Custom App' },
  { value: 'media', label: 'Content & Media' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'niches', label: 'Specialized Niches' }
] as const;

export const FilterBar = () => {
  const { filters, setFilters } = useFilterStore((state) => ({
    filters: state.filters,
    setFilters: state.setFilters
  }));

  const segmentOptions = useMemo(
    () =>
      segments.map((segment) => ({
        value: segment,
        label: segment === 'all' ? 'All segments' : segment.toUpperCase()
      })),
    []
  );

  return (
    <section
      aria-label="Global filters"
      className="card-surface flex flex-wrap items-center gap-3 bg-[var(--surface-1)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Date Range
          </span>
          <select
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2 text-[14px] text-[var(--color-text-primary)]"
            value={filters.dateRange}
            onChange={(event) => setFilters({ dateRange: event.target.value as typeof filters.dateRange })}
          >
            {datePresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Segment
          </span>
          <select
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2 text-[14px] text-[var(--color-text-primary)]"
            value={filters.segment}
            onChange={(event) => setFilters({ segment: event.target.value })}
          >
            {segmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Region
          </span>
          <select
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2 text-[14px] text-[var(--color-text-primary)]"
            value={filters.region}
            onChange={(event) => setFilters({ region: event.target.value })}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === 'global' ? 'Global' : region.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Vertical
          </span>
          <select
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2 text-[14px] text-[var(--color-text-primary)]"
            value={filters.vertical}
            onChange={(event) => setFilters({ vertical: event.target.value })}
          >
            {verticals.map((vertical) => (
              <option key={vertical.value} value={vertical.value}>
                {vertical.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};
