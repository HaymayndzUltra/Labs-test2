import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { moduleFilters } from '../../utils/module-metadata';
import { RangeOption, rangeOptions } from '../../utils/range-options';

export type GlobalFilters = {
  range: RangeOption['id'];
  segment: string;
  environment: string;
};

type Props = {
  filters: GlobalFilters;
  onChange: (next: GlobalFilters) => void;
  module: string;
};

export function FilterBar({ filters, onChange, module }: Props) {
  const moduleFilterChips = useMemo(() => moduleFilters[module] ?? [], [module]);

  const handleUpdate = (key: keyof GlobalFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="border-t-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-0)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">Range</span>
          <DropdownButton
            label={rangeOptions.find((option) => option.id === filters.range)?.label ?? 'Custom'}
            onSelect={(id) => handleUpdate('range', id)}
            options={rangeOptions}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">Segment</span>
          <DropdownButton
            label={filters.segment === 'all' ? 'All segments' : filters.segment}
            onSelect={(value) => handleUpdate('segment', value)}
            options={moduleFilterChips}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">Environment</span>
          <DropdownButton
            label={filters.environment}
            onSelect={(value) => handleUpdate('environment', value)}
            options={[
              { id: 'production', label: 'Production' },
              { id: 'staging', label: 'Staging' },
              { id: 'sandbox', label: 'Sandbox' }
            ]}
          />
        </div>
        <div className="ml-auto flex gap-2" role="group" aria-label="Module specific filters">
          {moduleFilterChips
            .filter((option) => option.group === 'chips')
            .map((option) => {
              const active = filters.segment === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`flex h-11 items-center gap-2 rounded-[16px] border-[1.5px] px-4 text-sm transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)] ${
                    active
                      ? 'border-[color:var(--accent-' + module + ')] bg-[color:var(--accent-' + module + ')]/10 text-[color:var(--accent-' +
                        module +
                        ')]'
                      : 'border-[color:var(--line-soft)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-' +
                        module +
                        ')]'
                  }`}
                  onClick={() => handleUpdate('segment', option.id)}
                >
                  {option.label}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

type DropdownOption = {
  id: string;
  label: string;
  group?: 'chips' | 'dropdown';
};

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  onSelect: (id: string) => void;
};

function DropdownButton({ label, options, onSelect }: DropdownProps) {
  return (
    <div className="relative inline-flex h-11 items-center rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-3 text-sm font-medium text-[color:var(--text-primary)] shadow-sm">
      <span>{label}</span>
      <ChevronDown className="ml-2 h-4 w-4" aria-hidden />
      <select
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[16px] border-none bg-transparent opacity-0"
        aria-label={label}
        onChange={(event) => onSelect(event.target.value)}
        value={options.find((option) => option.label === label)?.id ?? options[0]?.id}
      >
        {options
          .filter((option) => option.group !== 'chips')
          .map((option) => (
            <option value={option.id} key={option.id}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}
