import { useMemo } from "react";
import { useGlobalFilters } from "../store/globalFilters";
import { FilterChips } from "./FilterChips";
import SegmentedTabs from "./SegmentedTabs";
import { modules } from "../data/modules";

const segments = [
  { id: "all", label: "All" },
  { id: "enterprise", label: "Enterprise" },
  { id: "midmarket", label: "Mid-market" },
  { id: "smb", label: "SMB" }
];

const dateRanges = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "fy", label: "Fiscal YTD" }
];

export const GlobalFilterBar: React.FC = () => {
  const { dateRange, segment, vertical, setDateRange, setSegment, setVertical } = useGlobalFilters();

  const segmentChips = useMemo(
    () => segments.map((item) => ({ ...item, selected: item.id === segment })),
    [segment]
  );

  const dateTabs = useMemo(() => dateRanges.map((item) => ({ id: item.id, label: item.label })), []);

  const verticalItems = useMemo(() => modules.map((module) => ({ id: module.id, label: module.name })), []);

  return (
    <section
      style={{
        background: "var(--surface-s1)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid var(--border-color)",
        display: "grid",
        gap: "16px"
      }}
      aria-label="Global filters"
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        <SegmentedTabs items={dateTabs} activeId={dateRange} onChange={(id) => setDateRange(id as never)} />
        <div>
          <label htmlFor="vertical-select" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Vertical
          </label>
          <select
            id="vertical-select"
            value={vertical}
            onChange={(event) => setVertical(event.target.value)}
            style={{
              marginLeft: "12px",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              padding: "8px 12px",
              background: "var(--surface-s1)",
              color: "var(--text-primary)"
            }}
          >
            {verticalItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <FilterChips ariaLabel="Segments" chips={segmentChips} onSelect={(id) => setSegment(id)} />
    </section>
  );
};

export default GlobalFilterBar;
