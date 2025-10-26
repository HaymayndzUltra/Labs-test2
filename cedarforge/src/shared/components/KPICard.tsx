import { ReactNode, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

export type KPICardProps = {
  title: string;
  value: number;
  unit?: string;
  delta?: number;
  timeframe: string;
  accent?: string;
  sparkline?: ReactNode;
};

export function KPICard({ title, value, unit, delta, timeframe, accent, sparkline }: KPICardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let raf: number;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedValue(Math.round(value * progress));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const deltaPositive = (delta ?? 0) >= 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-6 shadow-[var(--shadow-1)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[12px] font-semibold leading-[16px] tracking-wide text-[color:var(--text-secondary)] uppercase">
            {title}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[34px] font-[750] leading-[40px] text-[color:var(--text-primary)]" style={accent ? { color: accent } : undefined}>
              {unit}
              {animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            {delta !== undefined && (
              <span
                className={clsx('flex items-center gap-1 text-[12px] font-semibold leading-[16px]', {
                  'text-jade-400': deltaPositive,
                  'text-carmine-300': !deltaPositive
                })}
              >
                {deltaPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        {sparkline && <div className="h-12 w-24">{sparkline}</div>}
      </div>
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">{timeframe}</p>
    </div>
  );
}
