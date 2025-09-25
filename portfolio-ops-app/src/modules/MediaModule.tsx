import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { LineSeriesChart } from '../components/charts/LineSeriesChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';

export const MediaModule = () => {
  const { data, isLoading } = useModuleData('media');

  return (
    <div className="flex flex-col gap-6">
      <section className="grid-12" aria-label="Media KPIs">
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
      <section className="grid-12" aria-label="Engagement & automations">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="media-engagement"
              title="Engagement trend"
              subtitle="Line series with live benchmarks"
              data={data.charts.engagementTrend as { date: string; value: number; comparison?: number }[]}
              columns={[
                { key: 'date', label: 'Week' },
                { key: 'value', label: 'Plays' },
                { key: 'comparison', label: 'Benchmark' }
              ]}
              onPointFocus={(point) => `Week ${point.date} ${point.value.toLocaleString()} plays benchmark ${point.comparison?.toLocaleString()}`}
            >
              <LineSeriesChart data={data.charts.engagementTrend as { date: string; value: number; comparison?: number }[]} />
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
              id="media-automation-mix"
              title="Automation orchestration"
              subtitle="Right-rail ops overview"
              data={data.charts.automationMix as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Automation' },
                { key: 'value', label: 'Share %' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}% of automations`}
            >
              <DonutChart data={data.charts.automationMix as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Publishing tables">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="media-top-stories"
              columns={[
                { key: 'title', label: 'Story' },
                { key: 'format', label: 'Format' },
                { key: 'window', label: 'Window' },
                { key: 'engagement', label: 'Score', numeric: true },
                { key: 'status', label: 'Status' }
              ]}
              data={data.tables.topStories}
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
            <DataTable
              id="media-publishing-queue"
              columns={[
                { key: 'slot', label: 'Slot' },
                { key: 'title', label: 'Title' },
                { key: 'status', label: 'Status' },
                { key: 'owner', label: 'Owner' }
              ]}
              data={data.tables.publishingQueue}
            />
          )}
        </div>
      </section>
    </div>
  );
};
