import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Card } from './Card';
import { cn, downloadAs } from '@/lib/utils';

export type CardMetadata = {
  updatedAt: string;
  source: string;
  scope: string;
};

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
  metadata?: CardMetadata;
  footerLink?: { href: string; label: string; onClick?: () => void };
  paginate?: boolean;
  rowsPerPage?: number;
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
  footerLink,
  paginate = false,
  rowsPerPage = 10,
}: ChartCardProps) {
  const borderClass = tone === 'accent' ? 'border-[var(--primary-300)]/50' : 'border-[var(--surface-border)]';
  const [page, setPage] = useState(0);
  const paginatedRows = useMemo(() => {
    if (!paginate) return rows;
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [paginate, rows, page, rowsPerPage]);
  const totalPages = paginate ? Math.ceil(rows.length / rowsPerPage) : 1;
  const hasRows = paginatedRows.length > 0;

  const footerNode = footerLink ? (
    <a
      href={footerLink.href}
      onClick={footerLink.onClick}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-[var(--primary-600)] transition hover:bg-[var(--primary-50)] focus-visible:focus-ring"
    >
      {footerLink.label}
      <ExternalLink className="h-4 w-4" aria-hidden />
    </a>
  ) : undefined;

  return (
    <Card
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={ariaDescription ? `${id}-desc` : undefined}
      role="region"
      className={cn('flex h-full flex-col gap-5 border bg-[var(--surface-s1)]', borderClass)}
      metadata={metadata}
      footer={footerNode}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
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
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
              onClick={() => downloadAs('csv', `${id}.csv`, rows)}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
              onClick={() => downloadAs('json', `${id}.json`, rows)}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export JSON
            </button>
          </div>
        </div>
        {caption ? <p className="text-xs text-slate-500">{caption}</p> : null}
      </div>

      <div className="flex flex-col gap-4">
        <div role="figure" aria-labelledby={`${id}-title`} aria-describedby={ariaDescription ? `${id}-desc` : undefined}>
          {children}
        </div>
        {hasRows ? (
          <div className="max-h-[360px] overflow-auto rounded-[18px] border border-dashed border-[var(--surface-border)]">
            <table className="min-w-full divide-y divide-[var(--surface-border)]" aria-label={`${title} data table`}>
              <thead className="sticky top-0 bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className={cn('px-4 py-3 text-left', column.align === 'right' && 'text-right')}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)] bg-[var(--surface-s1)] text-sm text-slate-700">
                {paginatedRows.map((row, rowIndex) => (
                  <tr
                    key={`${id}-row-${rowIndex}`}
                    className="focus-within:bg-[var(--primary-50)] odd:bg-white/50"
                  >
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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--surface-border)] px-6 py-12 text-center text-sm text-slate-500">
            <span className="text-base font-semibold text-slate-600">No records within this view.</span>
            <p className="mt-2 max-w-sm text-xs text-slate-500">
              Adjust global filters or change the timeframe to repopulate this dataset.
            </p>
          </div>
        )}
        {paginate && totalPages > 1 ? (
          <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--surface-border)] px-3 py-1 focus-visible:focus-ring"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Prev
              </button>
              <button
                type="button"
                className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--surface-border)] px-3 py-1 focus-visible:focus-ring"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
