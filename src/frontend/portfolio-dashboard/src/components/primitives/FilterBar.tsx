import { clsx } from 'clsx';
import { FilterState } from '../../state/filtersStore';

interface FilterBarProps {
  filters: FilterState;
  options: Record<keyof FilterState, string[]>;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function FilterBar({ filters, options, onFilterChange, onReset, onSave, isSaving }: FilterBarProps) {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Dashboard filters">
      {(Object.keys(options) as (keyof FilterState)[]).map((key) => (
        <label key={key} className="filter-bar__field">
          <span className="filter-bar__label">{formatLabel(key)}</span>
          <select
            value={filters[key]}
            onChange={(event) => onFilterChange(key, event.target.value)}
            className="filter-bar__select"
          >
            {options[key].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className="filter-bar__actions" role="group" aria-label="Filter actions">
        <button type="button" className="ghost-button" onClick={onReset}>
          Reset
        </button>
        <span aria-hidden="true" className="filter-bar__divider">
          •
        </span>
        <button
          type="button"
          className={clsx('button-primary', isSaving && 'is-loading')}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function formatLabel(value: keyof FilterState) {
  if (value === 'dateRange') {
    return 'Date range';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}
