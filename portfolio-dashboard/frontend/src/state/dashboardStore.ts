'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TabDefinition } from '@/app/dashboard/data';

export type DateRange = 'last_7' | 'last_30' | 'quarter' | 'year';

export type Filters = {
  dateRange: DateRange;
  segment: string | null;
  channel: string | null;
};

type DashboardState = {
  selectedModule: TabDefinition['id'];
  filters: Filters;
  featureFlags: Record<string, boolean>;
  setModule: (id: TabDefinition['id']) => void;
  setFilters: (filters: Partial<Filters>) => void;
  toggleFeatureFlag: (flag: string) => void;
};

const storage = createJSONStorage<DashboardState>(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }
  return window.localStorage;
});

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      selectedModule: 'saas',
      filters: {
        dateRange: 'last_30',
        segment: null,
        channel: null,
      },
      featureFlags: {},
      setModule: (id) => set({ selectedModule: id }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      toggleFeatureFlag: (flag) =>
        set((state) => ({
          featureFlags: {
            ...state.featureFlags,
            [flag]: !state.featureFlags[flag],
          },
        })),
    }),
    {
      name: 'pg-dashboard-store',
      storage,
      partialize: (state) => ({
        selectedModule: state.selectedModule,
        filters: state.filters,
        featureFlags: state.featureFlags,
      }),
    }
  )
);
