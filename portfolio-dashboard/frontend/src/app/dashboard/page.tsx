import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { getPortfolioDashboard } from './data';
import type { PortfolioDashboardResponse } from './types';

function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="w-full border-b border-indigo-100/70 bg-white/70 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-2xl bg-indigo-100" />
            <div className="space-y-3">
              <div className="h-4 w-48 rounded-full bg-indigo-100" />
              <div className="h-3 w-72 rounded-full bg-indigo-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-highlight-${index}`} className="h-20 w-full animate-pulse rounded-2xl bg-indigo-50/70" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-action-${index}`} className="h-40 animate-pulse rounded-3xl border border-indigo-100/70 bg-white/80" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-card-${index}`} className="h-72 animate-pulse rounded-3xl border border-indigo-100/70 bg-white/80" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function DashboardDataResolver({
  promise,
}: {
  promise: Promise<PortfolioDashboardResponse>;
}) {
  const data = await promise;
  return <DashboardClient initialData={data} />;
}

export default function DashboardPage() {
  const dashboardPromise = getPortfolioDashboard();

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardDataResolver promise={dashboardPromise} />
    </Suspense>
  );
}
