import { create } from 'zustand';
import type { TabDefinition } from '../data/types';
import type { AutomationWorkflow } from '../data/types';
import type { LiveMetricEvent } from '../lib/eventStream';

type TabId = TabDefinition['id'];

type Filters = {
  dateRange: string;
  segment: string;
  channel: string;
  vertical: TabId;
};

type FeatureFlag = {
  module: TabId;
  flag: string;
};

type DashboardState = {
  filters: Filters;
  featureFlags: Record<string, boolean>;
  selectedAutomation?: AutomationWorkflow;
  liveEvents: LiveMetricEvent[];
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFiltersFromUrl: (partial: Partial<Filters> & { tab?: string | null }) => void;
  toggleFeatureFlag: (flag: FeatureFlag) => void;
  setSelectedAutomation: (automation?: AutomationWorkflow) => void;
  pushLiveEvent: (event: LiveMetricEvent) => void;
};

const defaultFilters: Filters = {
  dateRange: 'last-90-days',
  segment: 'all-customers',
  channel: 'omni',
  vertical: 'saas',
};

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: defaultFilters,
  featureFlags: {
    'saas.anomaly-detection': true,
    'commerce.predictive-replenishment': false,
    'corporate.mmm-light': true,
  },
  liveEvents: [],
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setFiltersFromUrl: (partial) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...Object.fromEntries(
          Object.entries(partial)
            .filter(([k, v]) => k in state.filters && v)
            .map(([k, v]) => [k === 'tab' ? 'vertical' : k, v])
        ),
      } as Filters,
    })),
  toggleFeatureFlag: ({ module, flag }) =>
    set((state) => {
      const key = `${module}.${flag}`;
      return {
        featureFlags: {
          ...state.featureFlags,
          [key]: !state.featureFlags[key],
        },
      };
    }),
  setSelectedAutomation: (automation) => set({ selectedAutomation: automation }),
  pushLiveEvent: (event) =>
    set((state) => ({
      liveEvents: [...state.liveEvents.slice(-20), event],
    })),
}));

export const selectActiveTab = (state: DashboardState) => state.filters.vertical;
