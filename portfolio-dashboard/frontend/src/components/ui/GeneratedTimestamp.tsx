'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type GeneratedTimestampProps = {
  generatedAt: string;
  dataUpdatedAt: number;
  context: string;
  scopeLabel?: string;
  isFetching: boolean;
  isError: boolean;
  onRefresh: () => void;
};

const FIVE_MINUTES = 5 * 60 * 1000;

function formatAbsolute(date: Date, timeZone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone,
    }).format(date);
  } catch (error) {
    console.error('Failed to format timestamp', error);
    return date.toLocaleString();
  }
}

function formatRelative(diffMs: number, locale: string) {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const seconds = Math.round(diffMs / 1000);
  if (Math.abs(seconds) < 60) {
    return formatter.format(-seconds, 'second');
  }
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) {
    return formatter.format(-minutes, 'minute');
  }
  const hours = Math.round(minutes / 60);
  return formatter.format(-hours, 'hour');
}

export function GeneratedTimestamp({
  generatedAt,
  dataUpdatedAt,
  context,
  scopeLabel = 'Global',
  isFetching,
  isError,
  onRefresh,
}: GeneratedTimestampProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const timeZone = useMemo(() => {
    try {
      return new Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }, []);
  const [displayIso, setDisplayIso] = useState(generatedAt);
  const [swapState, setSwapState] = useState<'idle' | 'leaving' | 'entering'>('entering');
  const [nowTs, setNowTs] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(
      () => setNowTs(Date.now()),
      prefersReducedMotion ? 60000 : 15000,
    );
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayIso(generatedAt);
      setSwapState('idle');
      return undefined;
    }
    let settleTimer: number | null = null;
    setSwapState('leaving');
    const leaveTimer = window.setTimeout(() => {
      setDisplayIso(generatedAt);
      setSwapState('entering');
      settleTimer = window.setTimeout(() => setSwapState('idle'), 220);
    }, 90);
    return () => {
      window.clearTimeout(leaveTimer);
      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }
    };
  }, [generatedAt, prefersReducedMotion]);

  const absolute = useMemo(() => {
    const date = new Date(displayIso);
    return formatAbsolute(date, timeZone, locale);
  }, [displayIso, locale, timeZone]);

  const tooltip = useMemo(() => {
    const iso = new Date(displayIso).toISOString();
    return `${iso} • ${timeZone} \n${context}`;
  }, [context, displayIso, timeZone]);

  const diffMs = nowTs - dataUpdatedAt;
  const stale = diffMs > FIVE_MINUTES * 1.1;
  const offline = typeof navigator !== 'undefined' ? navigator.onLine === false : false;

  const relative = useMemo(() => formatRelative(nowTs - new Date(displayIso).getTime(), locale), [displayIso, locale, nowTs]);

  const statusTone = isError
    ? 'bg-[var(--danger-50)] text-[var(--danger-600)] border-[var(--danger-500)]/60'
    : offline
    ? 'bg-[rgba(59,130,246,0.12)] text-[var(--neutral-600,#5e6673)] border-[var(--surface-border)]'
    : stale
    ? 'bg-[var(--warning-50)] text-[var(--warning-600)] border-[var(--warning-500)]/60'
    : 'bg-[rgba(99,102,241,0.08)] text-[var(--neutral-600,#5e6673)] border-[var(--surface-border)]';

  const StatusIcon = isError ? AlertTriangle : offline ? WifiOff : Clock;

  return (
    <div className="flex flex-col items-end gap-3 text-right">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className={cn('freshness-chip border text-[12px] font-medium', statusTone)} role="status" aria-live="polite">
          <StatusIcon className="h-3.5 w-3.5" aria-hidden />
          {isFetching && !isError ? 'Generating…' : stale ? 'Stale data' : offline ? 'Offline cache' : 'Live'}
        </div>
        <button
          type="button"
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-[12px] font-medium text-[var(--neutral-700,#384150)] transition hover:bg-white focus-visible:focus-ring dark:hover:bg-[rgba(148,163,184,0.12)]"
          onClick={onRefresh}
          disabled={isFetching}
        >
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
          Refresh
        </button>
      </div>
      <div className="flex flex-col items-end gap-1 text-[12px] text-[var(--neutral-600,#5e6673)]">
        <span
          className={cn('freshness-value font-medium text-[var(--neutral-700,#384150)] dark:text-[rgba(226,232,240,0.92)]', {
            'opacity-50': isFetching,
          })}
          data-state={swapState === 'idle' ? undefined : swapState === 'leaving' ? 'leaving' : 'entering'}
          title={tooltip}
        >
          <span className="font-semibold uppercase tracking-[0.16em] text-[11px] text-[var(--neutral-500,#5e6673)]">Generated at</span>
          {absolute}
        </span>
        <span className="freshness-pill text-[var(--neutral-500,#5e6673)]" title={`Scope • ${scopeLabel}`}>
          Updated {relative} • {scopeLabel}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--neutral-500,#5e6673)]">{context}</span>
      </div>
    </div>
  );
}

export default GeneratedTimestamp;
