import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Download } from 'lucide-react';

export type DataTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  ariaLabel: string;
  onExport?: (format: 'csv' | 'json') => void;
};

export function DataTable<T extends object>({ data, columns, ariaLabel, onExport }: DataTableProps<T>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const rows = table.getRowModel().rows;
  const exportHandlers = useMemo(() => {
    if (onExport) return onExport;
    return (format: 'csv' | 'json') => {
      const blob = new Blob([
        format === 'json' ? JSON.stringify(data, null, 2) : toCsv(data)
      ], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ariaLabel}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    };
  }, [ariaLabel, data, onExport]);

  return (
    <div className="overflow-hidden rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)] shadow-[var(--shadow-1)]">
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <button
          className="flex h-11 items-center gap-2 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] px-4 text-sm font-semibold text-[color:var(--text-primary)] hover:border-[color:var(--accent-finops)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
          onClick={() => exportHandlers('csv')}
          type="button"
        >
          <Download size={16} /> CSV
        </button>
        <button
          className="flex h-11 items-center gap-2 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] px-4 text-sm font-semibold text-[color:var(--text-primary)] hover:border-[color:var(--accent-finops)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
          onClick={() => exportHandlers('json')}
          type="button"
        >
          <Download size={16} /> JSON
        </button>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y-[1.5px] divide-[color:var(--line-soft)]" role="table" aria-label={ariaLabel}>
          <thead className="bg-[color:var(--surface-2)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-left text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3" scope="col">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y-[1.5px] divide-[color:var(--line-soft)] text-[14px] leading-[20px]">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[color:var(--surface-2)] focus-within:bg-[color:var(--surface-2)]">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3" role="cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function toCsv(data: object[]) {
  if (!data.length) return '';
  const columns = Object.keys(data[0]);
  const rows = data.map((row) => columns.map((col) => JSON.stringify((row as any)[col] ?? '')).join(','));
  return [columns.join(','), ...rows].join('\n');
}
