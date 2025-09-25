import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { MetricCard, MetricTrend } from '@/app/dashboard/data';
import { cn } from '@/lib/utils';

type KPIBandProps = {
  metrics: MetricCard[];
  accentToken: string;
  onInspect?: (metric: MetricCard) => void;
};

const trendCopy: Record<MetricTrend, string> = {
  up: 'Improving',
  down: 'Declining',
  steady: 'Stable',
};

export function KPIBand({ metrics, accentToken, onInspect }: KPIBandProps) {
  return (
    <div className="-mx-4 flex snap-band gap-4 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:px-0">
      {metrics.map((metric) => {
        const Icon =
          metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus;
        const tone =
          metric.trend === 'up'
            ? 'text-[var(--success-600)] bg-[var(--success-50)]'
            : metric.trend === 'down'
            ? 'text-[var(--danger-600)] bg-[var(--danger-50)]'
            : 'text-slate-600 bg-slate-100/70';
        return (
          <button
            key={metric.id}
            type="button"
            onClick={() => onInspect?.(metric)}
            className="snap-item min-w-[260px] flex-1 rounded-[20px] border border-[color:var(--surface-border)] bg-[var(--surface-s1)] p-5 text-left shadow-sm transition focus-visible:focus-ring"
            style={{
              boxShadow: '0 18px 36px rgba(79, 70, 229, 0.08)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {metric.label}
              </p>
              {metric.trend ? (
                <span
                  className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold', tone)}
                  aria-label={trendCopy[metric.trend]}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {metric.change != null ? `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%` : trendCopy[metric.trend]}
                </span>
              ) : null}
            </div>
            <p
              className="kpi-value mt-3 text-3xl font-semibold"
              style={{ color: `var(${accentToken})` }}
            >
              {metric.value}
            </p>
            {metric.description ? (
              <p className="mt-2 text-xs text-slate-600">{metric.description}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
