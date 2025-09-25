import { ReactNode, useMemo } from 'react';
import { exportToCsv } from '../lib/export';
import { ChartKeyboardNav } from './ChartKeyboardNav';

interface ChartColumn {
  key: string;
  label: string;
}

interface ChartCardProps<T extends Record<string, unknown>> {
  id: string;
  title: string;
  subtitle?: string;
  data: T[];
  columns: ChartColumn[];
  children: ReactNode;
  onPointFocus?: (datum: T, index: number) => string;
}

export const ChartCard = <T extends Record<string, unknown>>({
  id,
  title,
  subtitle,
  data,
  columns,
  children,
  onPointFocus
}: ChartCardProps<T>) => {
  const tableId = `${id}-datatable`;

  const columnHeaders = useMemo(
    () => (
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className="border-b border-[var(--border-subtle)] px-3 py-2 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]"
          >
            {column.label}
          </th>
        ))}
      </tr>
    ),
    [columns]
  );

  return (
    <section className="card-surface flex flex-col gap-4" aria-labelledby={`${id}-title`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 id={`${id}-title`} className="text-[16px] leading-[24px] font-semibold">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-[14px] leading-[20px] text-[var(--color-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
        <button
          className="rounded-lg border border-[var(--border-strong)] px-3 py-2 text-[12px] font-semibold text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700"
          onClick={() => exportToCsv(`${id}.csv`, data, columns)}
        >
          Download data (CSV)
        </button>
      </header>
      <ChartKeyboardNav
        data={data}
        onPointFocus={onPointFocus}
        tableId={tableId}
      >
        {children}
      </ChartKeyboardNav>
      <div className="overflow-auto rounded-lg border border-[var(--border-subtle)]">
        <table id={tableId} className="min-w-full border-collapse">
          <thead className="bg-[var(--surface-0)]">{columnHeaders}</thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-[var(--border-subtle)]">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2 text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                    <span className="font-mono">
                      {String(row[column.key as keyof typeof row] ?? '')}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
