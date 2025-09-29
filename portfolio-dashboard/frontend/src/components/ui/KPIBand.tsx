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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
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
            className="group relative flex min-h-[152px] flex-col justify-between gap-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-s1)] p-5 text-left shadow-sm transition focus-visible:focus-ring motion-safe:animate-kpi-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>
              {metric.trend ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-[6px] text-[11px] font-semibold transition',
                    tone,
                  )}
                  aria-label={trendCopy[metric.trend]}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {metric.change != null
                    ? `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%`
                    : trendCopy[metric.trend]}
                </span>
              ) : null}
            </div>
            <p
              className="kpi-value text-[28px] font-bold leading-[32px] tracking-[-0.01em] text-[var(--text-primary)]"
              style={{ color: `var(${accentToken})` }}
            >
              {metric.value}
            </p>
            {metric.description ? (
              <p className="text-xs text-[var(--text-secondary)]">{metric.description}</p>
            ) : null}
            <span
              className="pointer-events-none absolute inset-x-5 bottom-5 h-0.5 origin-left scale-x-0 bg-[var(--surface-border)] transition group-hover:scale-x-100"
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
