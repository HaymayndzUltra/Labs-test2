import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface FilterState {
  dateRange: string;
  channel: string;
  source: string;
}

interface FilterStore {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
}

export const defaultFilters: FilterState = {
  dateRange: 'Last 30 days',
  channel: 'All channels',
  source: 'All sources'
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
        })),
      resetFilters: () =>
        set(() => ({
          filters: { ...defaultFilters }
        }))
    }),
    {
      name: 'portfolio-global-filters'
    }
  )
);
