import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { FunnelChart } from '../components/charts/FunnelChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';

export const CorporateModule = () => {
  const { data, isLoading } = useModuleData('corporate');

  return (
    <div className="flex flex-col gap-6">
      <section className="grid-12" aria-label="Corporate KPIs">
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
      <section className="grid-12" aria-label="Funnel & mix">
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-52" />
              <Skeleton className="mt-4 h-56 w-full" />
            </div>
          ) : (
            <ChartCard
              id="corporate-funnel"
              title="Conversion funnel"
              subtitle="Visitors → MQL → SQL → Opp → Closed"
              data={data.charts.funnel as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Stage' },
                { key: 'value', label: 'Volume' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value.toLocaleString()} prospects`}
            >
              <FunnelChart data={data.charts.funnel as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="corporate-lead-mix"
              title="Lead source mix"
              subtitle="Sorted stacked distribution"
              data={data.charts.leadSources as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Source' },
                { key: 'value', label: 'Share %' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}% of leads`}
            >
              <StackedBarChart data={data.charts.leadSources as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Playbooks">
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="corporate-demand-playbook"
              columns={[
                { key: 'motion', label: 'Motion' },
                { key: 'owner', label: 'Owner' },
                { key: 'status', label: 'Status' },
                { key: 'next', label: 'Next best action' }
              ]}
              data={data.tables.demandPlaybook}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="corporate-automation"
              columns={[
                { key: 'name', label: 'Automation' },
                { key: 'cad', label: 'Cadence' },
                { key: 'status', label: 'Status' }
              ]}
              data={data.tables.automationPlays}
            />
          )}
        </div>
      </section>
    </div>
  );
};
