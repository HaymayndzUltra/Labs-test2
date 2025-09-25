import { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  numeric?: boolean;
  formatter?: (value: T[keyof T], row: T) => string;
}

interface DataTableProps<T> {
  id: string;
  columns: TableColumn<T>[];
  data: T[];
}

type SortDirection = 'ascending' | 'descending';

export const DataTable = <T extends Record<string, unknown>>({ id, columns, data }: DataTableProps<T>) => {
  const [sortState, setSortState] = useState<{ key: keyof T; direction: SortDirection } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortState) return data;
    const { key, direction } = sortState;
    return [...data].sort((a, b) => {
      const first = a[key];
      const second = b[key];
      if (first === second) return 0;
      if (first == null) return 1;
      if (second == null) return -1;
      if (typeof first === 'number' && typeof second === 'number') {
        return direction === 'ascending' ? first - second : second - first;
      }
      const firstText = String(first);
      const secondText = String(second);
      return direction === 'ascending'
        ? firstText.localeCompare(secondText)
        : secondText.localeCompare(firstText);
    });
  }, [data, sortState]);

  const handleSort = (column: TableColumn<T>) => {
    setSortState((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: 'ascending' };
      }
      if (current.direction === 'ascending') {
        return { key: column.key, direction: 'descending' };
      }
      return null;
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)]">
      <table id={id} className="min-w-full border-collapse">
        <thead className="bg-[var(--surface-0)]">
          <tr>
            {columns.map((column) => {
              const ariaSort =
                sortState?.key === column.key ? (sortState.direction === 'ascending' ? 'ascending' : 'descending') : 'none';
              return (
                <th
                  key={String(column.key)}
                  scope="col"
                  aria-sort={ariaSort}
                  className="sticky top-0 border-b border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-3 text-left text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]"
                >
                  <button
                    className="flex w-full items-center justify-between gap-2 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]"
                    onClick={() => handleSort(column)}
                  >
                    <span>{column.label}</span>
                    <span aria-hidden className="font-mono text-[var(--color-text-muted)]">
                      {ariaSort === 'ascending' ? '▲' : ariaSort === 'descending' ? '▼' : '↕'}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={clsx('border-b border-[var(--border-subtle)]', rowIndex % 2 === 0 && 'bg-[var(--surface-0)]')}>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={clsx(
                    'px-3 py-3 text-[14px] leading-[20px] text-[var(--color-text-secondary)]',
                    column.numeric && 'text-right'
                  )}
                >
                  <span className="font-mono">
                    {column.formatter ? column.formatter(row[column.key], row) : String(row[column.key] ?? '')}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
