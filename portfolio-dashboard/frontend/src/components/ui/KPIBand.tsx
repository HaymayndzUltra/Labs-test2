'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { MetricCard, MetricTrend } from '@/app/dashboard/data';
import { cn, formatCompact, parseNumericFromString } from '@/lib/utils';
import { Sparkline } from '@/components/charts/Sparkline';

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
  const animatedValue = useMemo(() => {
    const numeric = parseNumericFromString(value);
    if (numeric == null) {
      return value;
    }

    const compactMatch = value.match(/^([^0-9+-]*)([-+]?[\d,.]+)([kKmM]?)(.*)$/);
    const prefix = compactMatch?.[1]?.trimStart() ?? '';
    const magnitude = compactMatch?.[3]?.toLowerCase() ?? '';
    const trailing = compactMatch?.[4] ?? '';

    let normalized = numeric;
    if (magnitude === 'm') {
      normalized = numeric * 1_000_000;
    } else if (magnitude === 'k') {
      normalized = numeric * 1_000;
    }

    const formatted = formatCompact(normalized);
    const suffix = trailing.trimStart().startsWith('%') ? '%' : '';
    const base = `${prefix}${formatted}${suffix}`.trim();

    return base.length > 0 ? base : value;
  }, [value]);

  const displayValue = useAnimatedMetric(animatedValue);

  return (
    <span
      className="kpi-value mt-3 block text-3xl font-semibold tracking-tight text-right transition-colors duration-300"
      style={{ color: `var(${accentToken})` }}
      aria-live="polite"
    >
      {displayValue}
    </span>
  );
}

export function KPIBand({ metrics, accentToken, onInspect }: KPIBandProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon =
          metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus;
        const tone =
          metric.trend === 'up'
            ? 'text-[var(--success-600)] bg-[var(--success-50)]'
            : metric.trend === 'down'
            ? 'text-[var(--danger-600)] bg-[var(--danger-50)]'
            : 'text-slate-600 bg-slate-100/70';
        const lastWindow: Array<{ label: string; value: number }> = Array.from({ length: 30 }).map((_, i) => ({ label: String(i + 1), value: Math.max(1, (parseNumericFromString(metric.value) ?? 0) * (0.9 + Math.random() * 0.2)) }));
        return (
          <button
            key={metric.id}
            type="button"
            onClick={() => onInspect?.(metric)}
            className="flex h-full min-h-[128px] flex-col justify-between rounded-[20px] border border-[color:var(--surface-border)] bg-white/10 p-5 text-left shadow-lg backdrop-blur-lg transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:focus-ring"
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
            <div className="mt-2 flex items-end justify-between gap-4">
              <div className="relative flex-1">
                <CountUpValue value={metric.value} accentToken={accentToken} />
                {metric.description ? (
                  <div className="group inline-block">
                    <span className="mt-1 inline-block cursor-help text-[11px] text-slate-600" aria-describedby={`${metric.id}-def`}>
                      {metric.description}
                    </span>
                    <span
                      role="tooltip"
                      id={`${metric.id}-def`}
                      className="invisible absolute z-20 mt-1 max-w-[220px] rounded-[10px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-2 py-1 text-[11px] text-slate-700 shadow-sm group-hover:visible"
                    >
                      {metric.label} definition and calculation context.
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="h-[36px] w-[120px] flex-shrink-0" aria-hidden>
                <Sparkline data={lastWindow} color={`var(${accentToken})`} height={36} variant="line" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
