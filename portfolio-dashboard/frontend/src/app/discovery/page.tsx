import { Suspense } from 'react';
import { DiscoveryClient } from './DiscoveryClient';

function DiscoverySkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-16">
        <div className="h-10 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="h-[420px] animate-pulse rounded-3xl bg-white/5" />
          <div className="h-[420px] animate-pulse rounded-3xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <Suspense fallback={<DiscoverySkeleton />}>
      <DiscoveryClient />
    </Suspense>
  );
}
