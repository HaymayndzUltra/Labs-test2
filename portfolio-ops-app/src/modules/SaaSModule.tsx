import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { LineSeriesChart } from '../components/charts/LineSeriesChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DataTable } from '../components/DataTable';
import { AutomationBuilder } from '../components/AutomationBuilder';
import { useToast } from '../components/ToastProvider';
import { Skeleton } from '../components/Skeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const SaaSModule = () => {
  const { data, isLoading, error, refetch } = useModuleData('saas');
  const { push } = useToast();

  if (error) {
    return (
      <div className="card-surface flex flex-col gap-3">
        <h3 className="text-[16px] font-semibold text-danger-500">Unable to load SaaS intelligence</h3>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          className="w-fit rounded-lg bg-danger-500 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid-12" aria-label="SaaS KPIs">
        {(isLoading ? Array.from({ length: 4 }) : data?.kpis ?? []).map((kpi, index) => (
          <div key={kpi?.title ?? index} className="col-span-12 md:col-span-6 xl:col-span-3">
            {isLoading || !kpi ? (
              <div className="card-surface flex flex-col gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-5 w-28" />
              </div>
            ) : (
              <KpiCard {...kpi} />
            )}
          </div>
        ))}
      </section>
      <section className="grid-12" aria-label="SaaS analytics">
        <div className="col-span-12 xl:col-span-8" id="saas-arr-panel" role="tabpanel" aria-labelledby="saas-tab">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="saas-arr-growth"
              title="ARR growth vs plan"
              subtitle="Pre-aggregated ARR by fiscal month with plan overlay"
              data={data.charts.arrGrowth as { date: string; value: number; comparison?: number }[]}
              columns={[
                { key: 'date', label: 'Period' },
                { key: 'value', label: 'Actual' },
                { key: 'comparison', label: 'Plan' }
              ]}
              onPointFocus={(point) => `Month ${point.date} actual ${point.value.toLocaleString()} plan ${point.comparison?.toLocaleString() ?? 'n/a'}`}
            >
              <LineSeriesChart data={data.charts.arrGrowth as { date: string; value: number; comparison?: number }[]} />
            </ChartCard>
          )}
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="saas-churn-composition"
              title="Churn composition"
              subtitle="Colorblind-safe donut with exportable data"
              data={data.charts.churnComposition as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Reason' },
                { key: 'value', label: 'Share %' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}% of churn`}
            >
              <ErrorBoundary>
                <DonutChart data={(data.charts.churnComposition as { label: string; value: number }[]) || []} />
              </ErrorBoundary>
            </ChartCard>
          )}
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="saas-billing"
              title="Billing cycle orchestration"
              data={data.charts.billingOrchestration as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Status' },
                { key: 'value', label: 'Percent' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}% of accounts`}
            >
              <ErrorBoundary>
                <DonutChart data={(data.charts.billingOrchestration as { label: string; value: number }[]) || []} />
              </ErrorBoundary>
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Plan usage">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="saas-plan-usage"
              columns={[
                { key: 'plan', label: 'Plan' },
                { key: 'price', label: 'Price' },
                { key: 'seats', label: 'Seats', numeric: true },
                { key: 'allocation', label: 'Allocation' },
                { key: 'churn', label: 'Churn' }
              ]}
              data={data.tables.planUsage}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <AutomationBuilder
              title="Churn recovery playbook"
              presets={data.tables.churnPlaybooks.map((playbook) => playbook.name)}
              onDryRun={() =>
                push({
                  title: 'Dry-run requested',
                  description: 'Simulating in staging tenant with audit logging.',
                  actionLabel: 'Undo',
                  onAction: () => push({ title: 'Dry-run cancelled' })
                })
              }
            />
          )}
        </div>
      </section>
    </div>
  );
};
