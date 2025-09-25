'use client';

import { useEffect, useState } from 'react';
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

function useAnimatedMetric(value: string, duration = 400) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const numericMatch = value.match(/[-+]?\d*[.,]?\d+/);

    if (!numericMatch || numericMatch[0].trim() === '') {
      setDisplayValue(value);
      return;
    }

    const matchIndex = numericMatch.index ?? 0;
    const numberToken = numericMatch[0];
    const prefix = value.slice(0, matchIndex);
    const suffix = value.slice(matchIndex + numberToken.length);
    const target = Number(numberToken.replace(/,/g, ''));

    if (!Number.isFinite(target)) {
      setDisplayValue(value);
      return;
    }

    const decimalPrecision = numberToken.includes('.')
      ? (numberToken.split('.')[1]?.length ?? 0)
      : 0;

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPrecision,
      maximumFractionDigits: decimalPrecision,
    });

    let animationFrame: number;
    const start = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * eased;
      setDisplayValue(`${prefix}${formatter.format(currentValue)}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    setDisplayValue(`${prefix}${formatter.format(0)}${suffix}`);
    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return displayValue;
}

function CountUpValue({ value, accentToken }: { value: string; accentToken: string }) {
  const animatedValue = useAnimatedMetric(value);

  return (
    <span
      className="kpi-value mt-3 block text-3xl font-semibold tracking-tight transition-colors duration-300"
      style={{ color: `var(${accentToken})` }}
      aria-live="polite"
    >
      {animatedValue}
    </span>
  );
}

export function KPIBand({ metrics, accentToken, onInspect }: KPIBandProps) {
  return (
    <div className="-mx-4 flex snap-band gap-6 overflow-x-auto px-4 pb-4 pt-2 sm:mx-0 sm:px-0">
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
            className="snap-item min-w-[260px] flex-1 rounded-[20px] border border-[color:var(--surface-border)] bg-white/10 p-6 text-left shadow-lg backdrop-blur-lg transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:focus-ring"
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
            <CountUpValue value={metric.value} accentToken={accentToken} />
            {metric.description ? (
              <p className="mt-2 text-xs text-slate-600">{metric.description}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
