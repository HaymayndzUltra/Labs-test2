import type { CSSProperties, ReactNode } from 'react';
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
  className?: string;
  accentToken?: string;
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
  className,
  accentToken,
}: ChartCardProps) {
  const borderClass = tone === 'accent' ? 'border-[var(--primary-300)]/50' : 'border-[var(--surface-border)]';
  const style: CSSProperties | undefined = accentToken
    ? { ['--table-accent' as const]: `var(${accentToken})` }
    : undefined;

  return (
    <Card
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={ariaDescription ? `${id}-desc` : undefined}
      role="region"
      className={cn(
        'flex h-full flex-col gap-6 border bg-[var(--surface-s1)] shadow-sm animate-dashboard-panel',
        borderClass,
        className,
      )}
      style={style}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            {description ? (
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                {description}
              </p>
            ) : null}
            <h3 id={`${id}-title`} className="text-[18px] font-semibold text-[var(--neutral-900,#0b0d12)]">
              {title}
            </h3>
            {caption ? <p className="text-xs text-[var(--neutral-600,#5e6673)]">{caption}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-[12px] font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
              onClick={() => downloadAs('csv', `${id}.csv`, rows)}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-[12px] font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring"
              onClick={() => downloadAs('json', `${id}.json`, rows)}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div role="figure" aria-labelledby={`${id}-title`} aria-describedby={ariaDescription ? `${id}-desc` : undefined}>
          <div className="animate-dashboard-chart">{children}</div>
        </div>
        <div className="overflow-hidden rounded-xl border border-dashed border-[var(--surface-border)]">
          <div className="max-h-[220px] overflow-auto">
            <table className="min-w-full" aria-label={`${title} data table`}>
              <thead className="sticky top-0 z-10 bg-[var(--surface-s1)] text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--neutral-500,#5e6673)]">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-left',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                      )}
                      scope="col"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px] text-[var(--neutral-700,#384150)]">
                {rows.map((row, rowIndex) => (
                  <tr key={`${id}-row-${rowIndex}`} className="data-grid-row">
                    {columns.map((column) => (
                      <td
                        key={`${id}-row-${rowIndex}-${column.key}`}
                        className={cn(
                          'px-4 py-[11px]',
                          rowIndex % 2 === 0
                            ? 'bg-white/80 dark:bg-[rgba(15,23,42,0.35)]'
                            : 'bg-[var(--surface-s1)]/90 dark:bg-[rgba(15,23,42,0.55)]',
                          column.align === 'right' && 'text-right',
                          column.align === 'center' && 'text-center',
                        )}
                      >
                        {String(row[column.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-right text-[11px] uppercase tracking-[0.2em] text-[var(--neutral-500,#5e6673)]">
            Scroll for more
          </div>
        </div>
      </div>
    </Card>
  );
}
