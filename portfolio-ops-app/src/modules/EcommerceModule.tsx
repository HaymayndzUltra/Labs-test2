import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DataTable } from '../components/DataTable';
import { AutomationBuilder } from '../components/AutomationBuilder';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../components/ToastProvider';

export const EcommerceModule = () => {
  const { data, isLoading, error, refetch } = useModuleData('ecommerce');
  const { push } = useToast();

  if (error) {
    return (
      <div className="card-surface flex flex-col gap-3">
        <h3 className="text-[16px] font-semibold text-danger-500">Unable to load commerce insights</h3>
        <p className="text-[14px] text-[var(--color-text-muted)]">{String(error)}</p>
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
      <section className="grid-12" aria-label="E-commerce KPIs">
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
      <section className="grid-12" aria-label="Commerce analytics">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="ecommerce-weekly-sales"
              title="Weekly sales trend"
              subtitle="Rolling 12-week GMV performance"
              data={data.charts.weeklySales as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Week' },
                { key: 'value', label: 'GMV' }
              ]}
              onPointFocus={(point) => `Week ${point.label} GMV ${point.value.toLocaleString()}`}
            >
              <BarChart data={data.charts.weeklySales as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="ecommerce-retention"
              title="Retention tiers"
              subtitle="Customer segments sorted by lifetime purchases"
              data={data.charts.retentionTiers as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Tier' },
                { key: 'value', label: 'Share %' }
              ]}
              onPointFocus={(point) => `${point.label} represent ${point.value}% of buyers`}
            >
              <DonutChart data={data.charts.retentionTiers as { label: string; value: number }[]} />
            </ChartCard>
          )}
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="ecommerce-ops-health"
              title="Ops health index"
              data={data.charts.opsHealth as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Dimension' },
                { key: 'value', label: 'Score' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}%`}
            >
              <DonutChart data={data.charts.opsHealth as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Commerce tables">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="ecommerce-top-products"
              columns={[
                { key: 'sku', label: 'SKU' },
                { key: 'revenue', label: 'Revenue', numeric: true },
                { key: 'conversion', label: 'Conversion' },
                { key: 'inventory', label: 'Inventory' },
                { key: 'trend', label: 'Trend' }
              ]}
              data={data.tables.topProducts}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <AutomationBuilder
              title="Promotion & lifecycle automation"
              presets={data.tables.promotionBuilder.map((item) => item.name)}
              onDryRun={() =>
                push({
                  title: 'Preview generated',
                  description: 'A/B cohorts seeded with holdout rules.',
                  actionLabel: 'Undo',
                  onAction: () => push({ title: 'Preview rolled back' })
                })
              }
            />
          )}
        </div>
      </section>
    </div>
  );
};
