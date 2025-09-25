import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState } from '../components/primitives/FilterChips';

interface FilterStore {
  filters: FilterState;
  setFilter: (key: string, value: string) => void;
}

const defaultFilters: FilterState = {
  dateRange: 'Last 30 days',
  segment: 'All segments',
  channel: 'All channels'
};

export const useGlobalFilters = create<FilterStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        }))
    }),
    {
      name: 'portfolio-global-filters'
    }
  )
);
