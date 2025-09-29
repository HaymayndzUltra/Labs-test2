import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { MetricCard, MetricTrend } from '@/app/dashboard/data';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon =
          metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus;
        const tone =
          metric.trend === 'up'
            ? 'text-[var(--success-600)] bg-[var(--success-50)]'
            : metric.trend === 'down'
            ? 'text-[var(--danger-600)] bg-[var(--danger-50)]'
            : 'text-[var(--neutral-600,#5e6673)] bg-[rgba(94,102,115,0.08)]';
        return (
          <button
            key={metric.id}
            type="button"
            onClick={() => onInspect?.(metric)}
            className={cn(
              'group kpi-hover relative flex h-full flex-col justify-between rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] p-5 text-left transition focus-visible:focus-ring',
            )}
            style={{ animationDelay: `${index * 80}ms` }}
            aria-label={`${metric.label}: ${metric.value}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--neutral-500,#5e6673)]">
                  {metric.label}
                </p>
                <AnimatedMetricValue
                  id={metric.id}
                  value={metric.value}
                  accentToken={accentToken}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>
              {metric.trend ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition flex-shrink-0',
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
            {metric.description ? (
              <p className="mt-4 text-[12px] text-[var(--neutral-600,#5e6673)]">{metric.description}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

type ParsedMetric = {
  prefix: string;
  suffix: string;
  decimals: number;
  hasGrouping: boolean;
  numeric: number;
};

function parseMetricValue(value: string): ParsedMetric | null {
  const match = value.trim().match(/^([^0-9+\-]*)([-+]?[0-9.,]+)(.*)$/);
  if (!match) {
    return null;
  }
  const [, prefix, numericPart, suffix] = match;
  const decimals = numericPart.includes('.') ? numericPart.split('.')[1]?.length ?? 0 : 0;
  const hasGrouping = numericPart.includes(',');
  const numeric = Number(numericPart.replace(/,/g, ''));
  if (Number.isNaN(numeric)) {
    return null;
  }
  return { prefix, suffix, decimals, hasGrouping, numeric };
}

function formatMetricValue(parsed: ParsedMetric, value: number) {
  const { prefix, suffix, decimals, hasGrouping } = parsed;
  let formatted: string;
  if (hasGrouping) {
    formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } else if (decimals > 0) {
    formatted = value.toFixed(decimals);
  } else {
    formatted = Math.round(value).toString();
  }
  return `${prefix}${formatted}${suffix}`;
}

function AnimatedMetricValue({
  id,
  value,
  accentToken,
  prefersReducedMotion,
}: {
  id: string;
  value: string;
  accentToken: string;
  prefersReducedMotion: boolean;
}) {
  const parsed = useMemo(() => parseMetricValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!parsed) {
      setDisplayValue(value);
      return;
    }

    const previousValue = previousValueRef.current[id] ?? 0;
    const targetValue = parsed.numeric;
    previousValueRef.current[id] = targetValue;

    if (prefersReducedMotion) {
      setDisplayValue(formatMetricValue(parsed, targetValue));
      return;
    }

    if (previousValue === targetValue) {
      setDisplayValue(formatMetricValue(parsed, targetValue));
      return;
    }

    let animationFrame: number;
    const duration = 180;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 2);
      const currentValue = previousValue + (targetValue - previousValue) * eased;
      setDisplayValue(formatMetricValue(parsed, currentValue));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [id, parsed, prefersReducedMotion, value]);

  return (
    <p
      className="kpi-value mt-3 text-[28px] font-semibold leading-none tracking-tight text-left"
      style={{ color: `var(${accentToken})` }}
    >
      {displayValue}
    </p>
  );
}
