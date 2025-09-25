import { useMemo } from 'react';
import { Filter } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const DATE_RANGE_OPTIONS = [
  { id: 'last-30-days', label: 'Last 30 days' },
  { id: 'last-90-days', label: 'Last 90 days' },
  { id: 'year-to-date', label: 'Year to date' },
];

const SEGMENT_OPTIONS = [
  { id: 'all-customers', label: 'All customers' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'mid-market', label: 'Mid-market' },
  { id: 'smb', label: 'SMB' },
];

const CHANNEL_OPTIONS = [
  { id: 'omni', label: 'Omni-channel' },
  { id: 'self-serve', label: 'Self-serve' },
  { id: 'partner', label: 'Partner' },
  { id: 'field', label: 'Field' },
];

export function GlobalFilters() {
  const { filters, setFilter } = useDashboardStore((state) => ({
    filters: state.filters,
    setFilter: state.setFilter,
  }));

  const filterGroups = useMemo(
    () => [
      { label: 'Date range', options: DATE_RANGE_OPTIONS, value: filters.dateRange, key: 'dateRange' as const },
      { label: 'Segment', options: SEGMENT_OPTIONS, value: filters.segment, key: 'segment' as const },
      { label: 'Channel', options: CHANNEL_OPTIONS, value: filters.channel, key: 'channel' as const },
    ],
    [filters]
  );

  return (
    <section
      aria-label="Global filters"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-2)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-s2)',
        border: '1px solid var(--surface-border)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--neutral-600)' }}>
        <Filter size={16} />
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>Global filters</p>
          <p style={{ margin: 0, fontSize: 12 }}>Persist in URL query and cascade across modules</p>
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {filterGroups.map((group) => (
          <div key={group.label}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--neutral-500)' }}>{group.label}</p>
            <div className="filter-chip-row" role="list">
              {group.options.map((option) => (
                <button
                  key={option.id}
                  role="switch"
                  type="button"
                  className="filter-chip"
                  data-active={group.value === option.id}
                  aria-checked={group.value === option.id}
                  onClick={() => setFilter(group.key, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
