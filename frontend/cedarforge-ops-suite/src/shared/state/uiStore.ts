import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CedarTheme = "light" | "dark";
export type Environment = "production" | "staging" | "sandbox";
export type ModuleKey =
  | "finops"
  | "logistics"
  | "energy"
  | "people"
  | "iot"
  | "gaming"
  | "hospitality";

export interface FilterState {
  module: ModuleKey;
  environment: Environment;
  dateRange: { from: string; to: string };
  segment: string;
}

export interface UIState {
  theme: CedarTheme;
  filters: FilterState;
  toggleTheme: () => void;
  setTheme: (theme: CedarTheme) => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

const initialRange = () => {
  const now = new Date();
  const prior = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);
  return {
    from: prior.toISOString(),
    to: now.toISOString(),
  };
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      filters: {
        module: "finops",
        environment: "production",
        dateRange: initialRange(),
        segment: "global",
      },
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
    }),
    {
      name: "cedarforge-ui",
      partialize: (state) => ({ theme: state.theme, filters: state.filters }),
    }
  )
);
