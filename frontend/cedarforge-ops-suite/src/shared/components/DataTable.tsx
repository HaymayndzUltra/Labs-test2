import { useMemo, useState } from "react";
import { Save, Download } from "lucide-react";
import clsx from "classnames";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  width?: string;
  numeric?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption: string;
  exportFilename?: string;
}

export const DataTable = <T,>({ columns, data, caption, exportFilename = "export" }: DataTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return data;
    const sorted = [...data].sort((a, b) => {
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);
      const aNumber = typeof aValue === "number" ? aValue : Number(String(aValue).replace(/[^0-9.-]/g, ""));
      const bNumber = typeof bValue === "number" ? bValue : Number(String(bValue).replace(/[^0-9.-]/g, ""));
      return sortDirection === "asc" ? aNumber - bNumber : bNumber - aNumber;
    });
    return sorted;
  }, [columns, data, sortColumn, sortDirection]);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const exportCsv = () => {
    const headers = columns.map((column) => column.header).join(",");
    const rows = sortedData
      .map((row) =>
        columns
          .map((column) => {
            const value = column.accessor(row);
            return JSON.stringify(typeof value === "string" ? value : String(value ?? ""));
          })
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFilename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const json = JSON.stringify(sortedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFilename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-secondary">{caption}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex h-9 items-center gap-2 rounded-md border border-line-soft bg-background-card px-3 text-xs font-semibold text-text-primary"
          >
            <Download className="h-4 w-4" aria-hidden /> CSV
          </button>
          <button
            onClick={exportJson}
            className="flex h-9 items-center gap-2 rounded-md border border-line-soft bg-background-card px-3 text-xs font-semibold text-text-primary"
          >
            <Save className="h-4 w-4" aria-hidden /> JSON
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-line-strong">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full border-collapse text-left" role="grid">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-background-raised text-xs uppercase tracking-[0.08em] text-text-muted">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    style={{ width: column.width }}
                    className={clsx(
                      "border-b border-line-soft px-4 py-3",
                      column.numeric && "text-right"
                    )}
                    aria-sort={sortColumn === column.id ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                  >
                    <button
                      className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-text-secondary"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.header}
                      <span aria-hidden>{sortColumn === column.id ? (sortDirection === "asc" ? "▲" : "▼") : ""}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-background-card text-sm text-text-secondary">
              {sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={clsx(
                    "border-b border-line-soft last:border-b-0 hover:bg-background-raised focus-within:bg-background-raised",
                    rowIndex % 2 === 1 && "bg-background-raised/40"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={clsx(
                        "px-4 py-3 align-middle",
                        column.numeric ? "text-right font-mono" : "text-left"
                      )}
                    >
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
