import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

type Column = {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
};

type ChartCardProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  caption?: string;
  rows: Record<string, unknown>[];
  columns: Column[];
  ariaDescription?: string;
  toolbar?: ReactNode;
  tone?: 'default' | 'accent';
  metadata?: {
    freshness: string;
    source: string;
  };
  chartHeight?: number;
};

export function ChartCard({
  id,
  title,
  description,
  caption,
  children,
  rows,
  columns,
  ariaDescription,
  toolbar,
  tone = 'default',
  metadata,
  chartHeight = 320,
}: ChartCardProps) {
  const borderClass = tone === 'accent' ? 'border-[var(--primary-300)]/50' : 'border-[var(--surface-border)]';

  return (
    <Card
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={ariaDescription ? `${id}-desc` : undefined}
      role="region"
      className={cn('flex h-full flex-col gap-5 border bg-[var(--surface-s1)]', borderClass)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 id={`${id}-title`} className="text-title-sm text-slate-900">
              {title}
            </h3>
            {description ? (
              <p id={`${id}-desc`} className="text-xs text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {toolbar}
            {metadata ? (
              <span className="rounded-full border border-dashed border-[var(--surface-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Updated {metadata.freshness}
              </span>
            ) : null}
          </div>
        </div>
        {caption ? <p className="text-xs text-slate-500">{caption}</p> : null}
      </div>

      <div className="flex flex-col gap-4">
        <div
          role="figure"
          aria-labelledby={`${id}-title`}
          aria-describedby={ariaDescription ? `${id}-desc` : undefined}
          style={{ minHeight: chartHeight }}
        >
          {children}
        </div>
        <div className="max-h-[360px] overflow-auto rounded-[18px] border border-dashed border-[var(--surface-border)]">
          <table className="min-w-full divide-y divide-[var(--surface-border)]" aria-label={`${title} data table`}>
            <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className={cn('px-4 py-3 text-left', column.align === 'right' && 'text-right')}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-700">
              {rows.map((row, rowIndex) => (
                <tr key={`${id}-row-${rowIndex}`} className="focus-within:bg-[var(--primary-50)]">
                  {columns.map((column) => (
                    <td
                      key={`${id}-row-${rowIndex}-${column.key}`}
                      className={cn('px-4 py-[11px]', column.align === 'right' && 'text-right')}
                    >
                      {String(row[column.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {metadata ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <span>Scope: {metadata.source}</span>
            <span>Rows: {rows.length}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
