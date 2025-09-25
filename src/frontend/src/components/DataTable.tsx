import { useMemo, useState } from "react";
import { clsx } from "clsx";

type SortDirection = "asc" | "desc" | "none";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  align?: "start" | "end";
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  id: string;
  columns: Column<T>[];
  data: T[];
  sortable?: boolean;
  dense?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({ id, columns, data, sortable = true, dense }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [direction, setDirection] = useState<SortDirection>("none");

  const sortedData = useMemo(() => {
    if (!sortable || !sortKey || direction === "none") {
      return data;
    }
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === bValue) return 0;
      if (aValue == null) return -1;
      if (bValue == null) return 1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [data, direction, sortKey, sortable]);

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (key !== sortKey) {
      setSortKey(key);
      setDirection("asc");
    } else {
      setDirection((prev) => (prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc"));
    }
  };

  return (
    <div style={{ borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden", background: "var(--surface-s1)" }}>
      <table id={id} role="table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr role="row" style={{ background: "var(--surface-s2)" }}>
            {columns.map((column) => {
              const isActive = column.key === sortKey;
              const ariaSort = !sortable || direction === "none" || !isActive ? "none" : direction;
              return (
                <th
                  key={column.key}
                  scope="col"
                  role="columnheader"
                  aria-sort={ariaSort}
                  style={{
                    textAlign: column.align === "end" ? "right" : "left",
                    padding: dense ? "12px 16px" : "16px 24px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    cursor: sortable ? "pointer" : "default",
                    userSelect: "none"
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    {column.label}
                    {sortable && (
                      <span aria-hidden="true" className={clsx("sort-indicator", { active: isActive })}>
                        {isActive ? (direction === "asc" ? "▲" : direction === "desc" ? "▼" : "–") : ""}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              style={{ borderBottom: "1px solid var(--border-color)", height: dense ? "40px" : "44px" }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  role="cell"
                  style={{
                    textAlign: column.align === "end" ? "right" : "left",
                    padding: dense ? "12px 16px" : "16px 24px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontFeatureSettings: "'tnum' 1, 'lnum' 1"
                  }}
                >
                  {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: "12px 24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button type="button" onClick={() => downloadData(sortedData, id, "csv")} className="focus-ring" style={exportButtonStyle}>
          Export CSV
        </button>
        <button type="button" onClick={() => downloadData(sortedData, id, "json")} className="focus-ring" style={exportButtonStyle}>
          Export JSON
        </button>
      </div>
    </div>
  );
}

const exportButtonStyle: React.CSSProperties = {
  borderRadius: "8px",
  padding: "8px 12px",
  border: "1px solid var(--border-color)",
  background: "var(--surface-s1)",
  cursor: "pointer"
};

function downloadData<T>(data: T[], id: string, format: "csv" | "json") {
  const content = format === "json" ? JSON.stringify(data, null, 2) : convertToCsv(data);
  const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${id}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCsv<T>(data: T[]) {
  if (!data.length) return "";
  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = (row as Record<string, unknown>)[header];
        if (value == null) return "";
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
