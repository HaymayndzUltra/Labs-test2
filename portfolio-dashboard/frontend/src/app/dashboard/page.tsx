import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { getPortfolioDashboard } from './data';
import type { PortfolioDashboardResponse } from './data';

function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="border-b border-indigo-100/70 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8">
          <div className="h-5 w-40 animate-pulse rounded-full bg-indigo-100" />
          <div className="h-8 w-80 animate-pulse rounded-full bg-indigo-100" />
          <div className="h-4 w-96 animate-pulse rounded-full bg-indigo-50" />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl space-y-6 px-6">
        <div className="h-32 animate-pulse rounded-3xl border border-indigo-100/70 bg-white/70 shadow-lg" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-card-${index}`}
              className="h-72 animate-pulse rounded-3xl border border-indigo-100/60 bg-white/70 shadow-md"
            />
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
