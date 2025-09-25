import { useId } from "react";

export interface SegmentedTabItem {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({ items, activeId, onChange }) => {
  const tablistId = useId();
  return (
    <div role="tablist" aria-orientation="horizontal" id={tablistId} style={{ display: "inline-flex", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tablistId}-${item.id}`}
            id={`${tablistId}-tab-${item.id}`}
            type="button"
            onClick={() => onChange(item.id)}
            style={{
              padding: "12px 20px",
              background: isActive ? "var(--primary-500)" : "transparent",
              color: isActive ? "#fff" : "var(--text-primary)",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 180ms ease-in-out"
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;
