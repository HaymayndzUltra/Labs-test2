import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { getPortfolioDashboard } from './data';
import type { PortfolioDashboard } from './types';

function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="border-b border-indigo-100/70 bg-white/80 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8">
          <div className="h-3 w-32 rounded-full bg-indigo-100" />
          <div className="h-8 w-72 rounded-full bg-indigo-100" />
          <div className="h-4 w-[420px] rounded-full bg-indigo-50" />
        </div>
      </div>
      <div className="border-b border-indigo-100/70 bg-white/70">
        <div className="mx-auto flex max-w-7xl gap-3 px-6 py-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`tab-${index}`} className="h-8 w-32 rounded-full bg-indigo-100/70" />
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-3">
          <div className="h-48 rounded-3xl border border-indigo-100/70 bg-white/80 shadow-sm" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`job-${index}`} className="h-40 rounded-3xl border border-indigo-100/70 bg-white/70 shadow-sm" />
          ))}
        </aside>
        <main className="space-y-6 lg:col-span-9">
          <div className="h-56 rounded-3xl border border-indigo-100/70 bg-gradient-to-r from-indigo-200 to-sky-200 shadow-sm" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`metric-${index}`} className="h-40 rounded-3xl border border-indigo-100/70 bg-white/80 shadow-sm" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`chart-${index}`} className="h-80 rounded-3xl border border-indigo-100/70 bg-white/80 shadow-sm" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-72 rounded-3xl border border-indigo-100/70 bg-white/80 shadow-sm" />
            <div className="h-72 rounded-3xl border border-indigo-100/70 bg-white/80 shadow-sm" />
          </div>
        </main>
      </div>
    </div>
  );
}

async function DashboardDataResolver({ promise }: { promise: Promise<PortfolioDashboard> }) {
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
