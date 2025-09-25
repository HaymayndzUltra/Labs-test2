import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DatePreset = '7d' | '30d' | '90d' | 'fytd';

export interface GlobalFilters {
  dateRange: DatePreset;
  segment: string;
  region: string;
  vertical: string;
}

interface FilterStore {
  filters: GlobalFilters;
  setFilters: (partial: Partial<GlobalFilters>) => void;
  hydrate: (filters: Partial<GlobalFilters>) => void;
}

const defaultFilters: GlobalFilters = {
  dateRange: '30d',
  segment: 'all',
  region: 'global',
  vertical: 'all'
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (partial) =>
        set((state) => ({
          filters: { ...state.filters, ...partial }
        })),
      hydrate: (filters) =>
        set(() => ({
          filters: { ...defaultFilters, ...filters }
        }))
    }),
    {
      name: 'portfolio-global-filters'
    }
  )
);

export const filterToQuery = (filters: GlobalFilters): URLSearchParams => {
  const params = new URLSearchParams();
  params.set('dateRange', filters.dateRange);
  params.set('segment', filters.segment);
  params.set('region', filters.region);
  params.set('vertical', filters.vertical);
  return params;
};

export const queryToFilter = (params: URLSearchParams): Partial<GlobalFilters> => {
  const dateRange = params.get('dateRange') as DatePreset | null;
  const segment = params.get('segment');
  const region = params.get('region');
  const vertical = params.get('vertical');
  const result: Partial<GlobalFilters> = {};
  if (dateRange) {
    result.dateRange = dateRange;
  }
  if (segment) {
    result.segment = segment;
  }
  if (region) {
    result.region = region;
  }
  if (vertical) {
    result.vertical = vertical;
  }
  return result;
};

export const getDefaultFilters = () => ({ ...defaultFilters });
