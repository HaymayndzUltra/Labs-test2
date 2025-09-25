import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { DataTable } from '../components/DataTable';
import { ChartCard } from '../components/ChartCard';
import { HeatmapStrip } from '../components/charts/HeatmapStrip';
import { Skeleton } from '../components/Skeleton';

export const EdtechModule = () => {
  const { data, isLoading } = useModuleData('edtech');

  return (
    <div className="flex flex-col gap-6">
      <section className="grid-12" aria-label="Learning KPIs">
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
      <section className="grid-12" aria-label="Program performance">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="edtech-program-performance"
              columns={[
                { key: 'course', label: 'Course' },
                { key: 'enrollment', label: 'Enrollment', numeric: true },
                { key: 'completion', label: 'Completion' },
                { key: 'score', label: 'Avg score', numeric: true },
                { key: 'certs', label: 'Certificates', numeric: true }
              ]}
              data={data.charts.programPerformance as { course: string; enrollment: number; completion: string; score: string; certs: number }[]}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="edtech-activity"
              title="Student activity heatmap"
              subtitle="FERPA compliant — values anonymized"
              data={data.charts.studentActivity as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Day' },
                { key: 'value', label: 'Active cohorts' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value} active learners`}
            >
              <HeatmapStrip data={data.charts.studentActivity as { label: string; value: number }[]} />
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Automations & alerts">
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="edtech-automations"
              columns={[
                { key: 'name', label: 'Automation' },
                { key: 'cadence', label: 'Cadence' },
                { key: 'status', label: 'Status' }
              ]}
              data={data.tables.automation}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="edtech-alerts"
              columns={[
                { key: 'alert', label: 'Alert' },
                { key: 'severity', label: 'Severity' },
                { key: 'owner', label: 'Owner' }
              ]}
              data={data.tables.alerts}
            />
          )}
        </div>
      </section>
    </div>
  );
};
