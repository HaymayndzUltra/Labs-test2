'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock3, RefreshCcw, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type GeneratedStatus = 'loading' | 'ready' | 'stale' | 'offline';

type GeneratedAtStampProps = {
  timestamp: string | null;
  lastGoodTimestamp: string | null;
  status: GeneratedStatus;
  timezone: string;
  contextSummary: string;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

function formatDisplay(timestamp: string | null, timezone: string) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch (error) {
    return date.toLocaleString();
  }
}

function getRelativeLabel(timestamp: string | null) {
  if (!timestamp) return 'Unknown';
  const now = Date.now();
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  const diff = Math.max(0, now - date.getTime());
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  if (minutes <= 0) {
    if (seconds <= 5) return 'Updated just now';
    return `Updated ${seconds}s ago`;
  }
  if (minutes < 60) {
    return `Updated ${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Updated ${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
}

function getFreshnessTone(timestamp: string | null) {
  if (!timestamp) return 'warning';
  const diff = Date.now() - new Date(timestamp).getTime();
  if (Number.isNaN(diff)) return 'warning';
  if (diff <= 5 * 60 * 1000) return 'positive';
  if (diff <= 10 * 60 * 1000) return 'neutral';
  return 'warning';
}

export function GeneratedAtStamp({
  timestamp,
  lastGoodTimestamp,
  status,
  timezone,
  contextSummary,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onRefresh,
  isRefreshing,
}: GeneratedAtStampProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [relativeLabel, setRelativeLabel] = useState(() => getRelativeLabel(timestamp));

  useEffect(() => {
    setRelativeLabel(getRelativeLabel(timestamp));
    if (prefersReducedMotion) return;
    const interval = window.setInterval(() => {
      setRelativeLabel(getRelativeLabel(timestamp));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, timestamp]);

  const tone = getFreshnessTone(lastGoodTimestamp ?? timestamp);

  const tooltip = useMemo(() => {
    const iso = lastGoodTimestamp ? new Date(lastGoodTimestamp).toISOString() : 'n/a';
    return `${iso}\n${timezone}\n${contextSummary}`;
  }, [contextSummary, lastGoodTimestamp, timezone]);

  const displayTimestamp = formatDisplay(timestamp ?? lastGoodTimestamp, timezone);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'loading':
        return 'Generating…';
      case 'offline':
        return 'Offline cache';
      case 'stale':
        return 'Showing last good data';
      default:
        return 'Generated at';
    }
  }, [status]);

  const freshnessClasses = cn(
    'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
    tone === 'positive' && 'border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)] text-[#166534]',
    tone === 'neutral' && 'border-[rgba(59,130,246,0.28)] bg-[rgba(59,130,246,0.08)] text-[#1d4ed8]',
    tone === 'warning' && 'border-[rgba(217,119,6,0.35)] bg-[rgba(217,119,6,0.12)] text-[#b45309]'
  );

  return (
    <div className="flex flex-col items-end gap-3 text-right">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className={freshnessClasses}>
          <Clock3 className="h-3.5 w-3.5" aria-hidden />
          {relativeLabel}
        </span>
        <button
          type="button"
          onClick={onToggleAutoRefresh}
          aria-pressed={autoRefreshEnabled}
          className={cn(
            'inline-flex min-h-[32px] items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium transition focus-visible:focus-ring',
            autoRefreshEnabled
              ? 'border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.12)] text-[var(--primary-600)]'
              : 'border-[var(--surface-border)] bg-[var(--surface-s1)] text-[var(--neutral-600,#5e6673)] hover:border-[var(--primary-300)]'
          )}
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
          {autoRefreshEnabled ? 'Auto-refresh on' : 'Auto-refresh off'}
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-busy={isRefreshing}
          className={cn(
            'inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-s1)] px-3 py-1 text-[12px] font-medium text-[var(--neutral-700,#384150)] transition hover:border-[var(--primary-300)] hover:text-[var(--primary-600)] focus-visible:focus-ring',
            isRefreshing && 'cursor-not-allowed opacity-60'
          )}
        >
          <span className="inline-flex items-center gap-1">
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
            Refresh now
          </span>
        </button>
      </div>
      <div
        className={cn(
          'generated-at-token inline-flex items-center gap-3 rounded-[12px] border px-4 py-3 text-[12px] transition',
          status === 'loading' && 'border-[rgba(59,130,246,0.4)] bg-[rgba(59,130,246,0.08)] text-[var(--primary-600)]',
          status === 'stale' && 'border-[rgba(217,119,6,0.4)] bg-[rgba(217,119,6,0.08)] text-[#b45309]',
          status === 'offline' && 'border-[rgba(71,85,105,0.5)] bg-[rgba(71,85,105,0.08)] text-[#334155]',
          status === 'ready' && 'border-[var(--surface-border)] bg-[var(--surface-s1)] text-[var(--neutral-600,#5e6673)]'
        )}
        title={tooltip}
        role="status"
        aria-live={status === 'loading' ? 'polite' : 'off'}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary-500)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary-600)]" />
            </span>
            {statusLabel}
          </span>
        ) : null}
        {status === 'stale' ? (
          <span className="inline-flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            {statusLabel}
          </span>
        ) : null}
        {status === 'offline' ? (
          <span className="inline-flex items-center gap-2">
            <WifiOff className="h-4 w-4" aria-hidden />
            {statusLabel}
          </span>
        ) : null}
        {status === 'ready' ? (
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" aria-hidden />
            {statusLabel}
          </span>
        ) : null}
        <span className="font-semibold text-[var(--neutral-900,#0b0d12)] dark:text-[rgba(233,236,242,0.94)]">
          {displayTimestamp}
        </span>
      </div>
    </div>
  );
}

export type { GeneratedStatus };

