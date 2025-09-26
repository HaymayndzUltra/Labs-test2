'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Save, RotateCcw } from 'lucide-react';
import { useDashboardStore, type DateRange } from '@/state/dashboardStore';

type Option = { id: string; label: string };

const dateRangeOptions: Option[] = [
  { id: 'last_7', label: 'Last 7 days' },
  { id: 'last_30', label: 'Last 30 days' },
  { id: 'quarter', label: 'Quarter to date' },
  { id: 'year', label: 'Year to date' },
];

const orgOptions: Option[] = [
  { id: 'all', label: 'All orgs' },
  { id: 'northwind', label: 'Northwind' },
  { id: 'acme', label: 'Acme' },
];

const regionOptions: Option[] = [
  { id: 'global', label: 'Global' },
  { id: 'amer', label: 'Americas' },
  { id: 'emea', label: 'EMEA' },
  { id: 'apac', label: 'APAC' },
];

const planOptions: Option[] = [
  { id: 'any', label: 'Any plan' },
  { id: 'free', label: 'Free' },
  { id: 'pro', label: 'Pro' },
  { id: 'enterprise', label: 'Enterprise' },
];

const tierOptions: Option[] = [
  { id: 'any', label: 'Any tier' },
  { id: 't1', label: 'Tier 1' },
  { id: 't2', label: 'Tier 2' },
  { id: 't3', label: 'Tier 3' },
];

const segmentOptions: Option[] = [
  { id: 'all', label: 'All segments' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'midmarket', label: 'Mid-market' },
  { id: 'smb', label: 'SMB' },
];

const channelOptions: Option[] = [
  { id: 'all', label: 'All channels' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'api', label: 'API' },
  { id: 'email', label: 'Email' },
];

const sourceOptions: Option[] = [
  { id: 'all', label: 'All sources' },
  { id: 'paid', label: 'Paid' },
  { id: 'organic', label: 'Organic' },
  { id: 'direct', label: 'Direct' },
  { id: 'referral', label: 'Referral' },
];

type SavedView = {
  id: string;
  label: string;
  params: URLSearchParams;
};

function useSavedViews(key = 'pg-saved-views') {
  const [views, setViews] = useState<SavedView[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const parsed: Array<{ id: string; label: string; params: string }> = JSON.parse(raw);
      setViews(
        parsed.map((v) => ({ id: v.id, label: v.label, params: new URLSearchParams(v.params) }))
      );
    } catch {}
  }, [key]);

  const saveView = (label: string, params: URLSearchParams) => {
    const id = `${Date.now()}`;
    const next = [...views, { id, label, params: new URLSearchParams(params.toString()) }];
    setViews(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        key,
        JSON.stringify(next.map((v) => ({ id: v.id, label: v.label, params: v.params.toString() })))
      );
    }
  };

  return { views, saveView };
}

export function StickyFilterBar() {
  const { filters, setFilters, resetFilters } = useDashboardStore();
  const { views, saveView } = useSavedViews();

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set('dateRange', filters.dateRange);
    if (filters.segment) p.set('segment', filters.segment);
    if (filters.channel) p.set('channel', filters.channel);
    if (filters.org) p.set('org', filters.org);
    if (filters.region) p.set('region', filters.region);
    if (filters.plan) p.set('plan', filters.plan);
    if (filters.tier) p.set('tier', filters.tier);
    if (filters.source) p.set('source', filters.source);
    return p;
  }, [filters]);

  return (
    <div className="sticky top-0 z-10 border-b border-[var(--surface-border)] bg-[var(--surface-s2)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface-s2)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 overflow-hidden px-6 py-3">
        <div className="flex flex-1 items-center gap-4 overflow-x-auto pb-1 pt-1 [scrollbar-width:none] sm:[scrollbar-width:auto]">
          {/* Date range (global) */}
          <Group label="Date Range">
            <Select
              label="Date range"
              value={filters.dateRange}
              onChange={(id) => setFilters({ dateRange: id as DateRange })}
              options={dateRangeOptions}
            />
          </Group>

          {/* Channel */}
          <Group label="Channel">
            <Select
              label="Channel"
              value={filters.channel ?? 'all'}
              onChange={(id) => setFilters({ channel: id === 'all' ? null : id })}
              options={channelOptions}
            />
          </Group>

          {/* Source */}
          <Group label="Source">
            <Select
              label="Source"
              value={filters.source ?? 'all'}
              onChange={(id) => setFilters({ source: id === 'all' ? null : id })}
              options={sourceOptions}
            />
          </Group>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-4">
          <button
            type="button"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
            onClick={() => resetFilters()}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-[var(--primary-500)] px-3 py-1.5 text-xs font-semibold text-white shadow focus-visible:focus-ring"
            onClick={() => {
              const label = `View ${views.length + 1}`;
              saveView(label, params);
            }}
          >
            <Save className="h-4 w-4" aria-hidden />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-2.5 py-2">
      <legend className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </legend>
      <div className="flex items-center gap-2">{children}</div>
    </fieldset>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: Option[];
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-s1)] px-2 py-1 text-xs text-slate-700">
      <span className="text-[11px] text-slate-500">{label}</span>
      <select
        className="bg-transparent text-xs font-semibold outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}


