import { Suspense } from 'react';
import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';
import { getCommerceDashboard } from './data';
import type { EcommerceDashboardResponse } from './types';
import { generateMetadata, generateDashboardStructuredData, generateBreadcrumbStructuredData } from '../../lib/seo';
import { StructuredData } from '../../components/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard - Portfolio Analytics',
  description: 'Comprehensive portfolio analytics dashboard with real-time metrics, advanced filtering, personalized insights, and interactive data visualization. Track performance, analyze trends, and make data-driven decisions.',
  keywords: [
    'portfolio analytics',
    'dashboard',
    'real-time metrics',
    'data visualization',
    'performance tracking',
    'business intelligence',
    'analytics',
    'metrics',
    'insights',
    'filtering'
  ],
  canonical: '/dashboard',
  ogImage: '/dashboard-og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="w-full border-b border-indigo-100/70 bg-surface-alt/80 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-6">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-indigo-100" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-40 rounded bg-indigo-100" />
            <div className="h-3 w-56 rounded bg-indigo-50" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-12 pt-6 lg:grid-cols-12">
        <aside className="hidden space-y-4 lg:col-span-4 xl:col-span-3 lg:block">
          <div className="h-[520px] rounded-3xl border border-indigo-100/70 bg-white/70 shadow-soft" />
        </aside>
        <main className="col-span-1 space-y-6 lg:col-span-8 xl:col-span-9">
          <div className="h-52 rounded-3xl border border-indigo-100/70 bg-white/70 shadow-soft" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-card-${index}`}
                className="h-80 animate-pulse rounded-3xl border border-indigo-100/60 bg-surface-alt p-5 shadow-soft"
              >
                <div className="mb-4 h-40 rounded-2xl bg-neutral-200/80" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-neutral-200" />
                  <div className="h-6 w-1/2 rounded bg-neutral-200" />
                  <div className="h-4 w-2/3 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

async function DashboardDataResolver({
  promise,
}: {
  promise: Promise<EcommerceDashboardResponse>;
}) {
  const data = await promise;
  return <DashboardClient initialData={data} />;
}

export default function DashboardPage() {
  const dashboardPromise = getCommerceDashboard();
  
  // Generate structured data
  const dashboardData = generateDashboardStructuredData();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/dashboard' },
  ]);

  return (
    <>
      <StructuredData data={dashboardData} />
      <StructuredData data={breadcrumbData} />
      <Suspense fallback={<DashboardPageSkeleton />}>
        <DashboardDataResolver promise={dashboardPromise} />
      </Suspense>
    </>
  );
}
