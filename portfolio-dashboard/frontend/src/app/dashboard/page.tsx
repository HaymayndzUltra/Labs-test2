import { Suspense } from 'react';
import { getDashboardVaultData } from './data';
import { DashboardClient } from './DashboardClient';

function DashboardVaultSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-16">
        <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function DashboardDataResolver() {
  const data = await getDashboardVaultData();
  return <DashboardClient initialData={data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardVaultSkeleton />}>
      <DashboardDataResolver />
    </Suspense>
  );
}
