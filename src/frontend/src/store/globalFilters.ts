import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DateRangePreset = "7d" | "30d" | "90d" | "fy";

export interface GlobalFiltersState {
  dateRange: DateRangePreset;
  segment: string;
  vertical: string;
  setDateRange: (range: DateRangePreset) => void;
  setSegment: (segment: string) => void;
  setVertical: (vertical: string) => void;
}

export const useGlobalFilters = create<GlobalFiltersState>()(
  persist(
    (set) => ({
      dateRange: "30d",
      segment: "all",
      vertical: "saas",
      setDateRange: (dateRange) => set({ dateRange }),
      setSegment: (segment) => set({ segment }),
      setVertical: (vertical) => set({ vertical })
    }),
    {
      name: "pgpo.global-filters"
    }
  )
);
