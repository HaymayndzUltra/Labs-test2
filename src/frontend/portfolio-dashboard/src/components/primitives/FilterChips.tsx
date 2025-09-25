import { clsx } from 'clsx';

export interface FilterState {
  [key: string]: string;
}

interface FilterChipsProps {
  filters: FilterState;
  options: Record<string, string[]>;
  onFilterChange: (key: string, value: string) => void;
}

export function FilterChips({ filters, options, onFilterChange }: FilterChipsProps) {
  return (
    <div className="chip-rail" role="group" aria-label="Filters">
      {Object.entries(options).map(([filterKey, values]) => (
        <div key={filterKey} className="chip-group">
          <span className="chip-label" id={`chip-${filterKey}`}>
            {startCase(filterKey)}
          </span>
          <div className="chip-options" role="radiogroup" aria-labelledby={`chip-${filterKey}`}>
            {values.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={filters[filterKey] === value}
                className={clsx('chip', filters[filterKey] === value && 'is-active')}
                onClick={() => onFilterChange(filterKey, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function startCase(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (str) => str.toUpperCase());
}
