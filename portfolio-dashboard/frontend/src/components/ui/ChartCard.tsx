import type { ReactNode } from 'react';
import { Download } from 'lucide-react';
import { Card } from './Card';
import { cn, downloadAs } from '@/lib/utils';

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
}: ChartCardProps) {
  const borderClass = tone === 'accent' ? 'border-[color:rgba(59,130,246,0.35)]' : 'border-[var(--surface-border)]';

  return (
    <Card
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={ariaDescription ? `${id}-desc` : undefined}
      role="region"
      className={cn('flex h-full flex-col gap-6 border shadow-sm', borderClass)}
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
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/60 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[var(--primary-500)] hover:text-[var(--primary-600)] focus-visible:focus-ring"
              onClick={() => downloadAs('csv', `${id}.csv`, rows)}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/60 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[var(--primary-500)] hover:text-[var(--primary-600)] focus-visible:focus-ring"
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
        <div
          role="figure"
          aria-labelledby={`${id}-title`}
          aria-describedby={ariaDescription ? `${id}-desc` : undefined}
          className="motion-safe:animate-chart-reveal"
        >
          {children}
        </div>
        <div className="overflow-hidden rounded-xl border border-dashed border-[var(--surface-border)]">
          <table className="min-w-full divide-y divide-[var(--surface-border)]" aria-label={`${title} data table`}>
            <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn('px-4 py-3 text-left', column.align === 'right' && 'text-right')}
                    scope="col"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[var(--surface-s1)] text-sm text-slate-700">
              {rows.map((row, rowIndex) => (
                <tr
                  key={`${id}-row-${rowIndex}`}
                  className="interactive-row even:bg-white/60"
                  style={{ animationDelay: `${rowIndex * 20}ms` }}
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
      </div>
    </Card>
  );
}
