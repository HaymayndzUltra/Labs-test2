import { clsx } from "clsx";

export interface FilterChip {
  id: string;
  label: string;
  selected: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onSelect: (id: string) => void;
  ariaLabel: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ chips, onSelect, ariaLabel }) => {
  return (
    <div role="listbox" aria-label={ariaLabel} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          role="option"
          aria-selected={chip.selected}
          onClick={() => onSelect(chip.id)}
          className={clsx("filter-chip", { selected: chip.selected })}
          style={{
            borderRadius: "999px",
            padding: "8px 16px",
            border: chip.selected ? "1px solid transparent" : "1px solid var(--border-color)",
            background: chip.selected ? "var(--primary-500)" : "var(--surface-s1)",
            color: chip.selected ? "#fff" : "var(--text-primary)",
            cursor: "pointer",
            transition: "background 200ms ease-in-out, color 200ms ease-in-out"
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
