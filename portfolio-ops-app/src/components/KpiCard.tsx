import { ReactNode } from 'react';
import clsx from 'clsx';

interface KpiCardProps {
  title: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' | 'flat'; label: string };
  timeBasis?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export const KpiCard = ({ title, value, delta, timeBasis, icon, loading }: KpiCardProps) => {
  return (
    <article
      className="card-surface flex min-h-[160px] flex-col justify-between gap-4 transition-all duration-200 hover:shadow-lg"
      aria-busy={loading}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-primary-500" aria-hidden>{icon}</span> : null}
          <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--color-text-secondary)]">
            {title}
          </h3>
        </div>
        {timeBasis ? (
          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-1 text-[12px] font-medium text-[var(--color-text-muted)]">
            {timeBasis}
          </span>
        ) : null}
      </header>
      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="h-9 w-32 animate-pulse rounded-md bg-primary-100" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-primary-50" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="kpi-value text-[var(--color-text-primary)]">{value}</span>
          {delta ? (
            <span
              className={clsx(
                'flex items-center gap-2 text-[14px] leading-[20px] font-medium',
                delta.trend === 'up' && 'text-success-500',
                delta.trend === 'down' && 'text-danger-500',
                delta.trend === 'flat' && 'text-[var(--color-text-muted)]'
              )}
            >
              <span aria-hidden>
                {delta.trend === 'up' ? '▲' : delta.trend === 'down' ? '▼' : '■'}
              </span>
              <span className="font-mono">{delta.value}</span>
              <span className="text-[var(--color-text-muted)]">{delta.label}</span>
            </span>
          ) : null}
        </div>
      )}
    </article>
  );
};
