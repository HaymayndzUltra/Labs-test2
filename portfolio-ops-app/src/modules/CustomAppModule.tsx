import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { BarChart } from '../components/charts/BarChart';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { KeyboardKanban } from '../components/KeyboardKanban';

const tasks = [
  { id: 't-1', title: 'Design onboarding checklist', assignee: 'Riley', lane: 'Backlog' },
  { id: 't-2', title: 'Implement webhook retries', assignee: 'Priya', lane: 'In Progress' },
  { id: 't-3', title: 'QA automation coverage', assignee: 'Chris', lane: 'Review' },
  { id: 't-4', title: 'Publish release notes', assignee: 'Lee', lane: 'Done' },
  { id: 't-5', title: 'Retro survey digest', assignee: 'Morgan', lane: 'In Progress' }
];

export const CustomAppModule = () => {
  const { data, isLoading } = useModuleData('customapp');

  return (
    <div className="flex flex-col gap-6">
      <section className="grid-12" aria-label="Productivity KPIs">
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
      <section className="grid-12" aria-label="Workload & kanban">
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="custom-workload"
              title="Workload distribution"
              subtitle="Capacity lines show planned vs actual"
              data={data.charts.workloadDistribution as { label: string; value: number; secondary?: number }[]}
              columns={[
                { key: 'label', label: 'Team' },
                { key: 'value', label: 'Actual %' },
                { key: 'secondary', label: 'Capacity %' }
              ]}
              onPointFocus={(point) => `${point.label} running at ${point.value}% vs capacity ${(point.secondary ?? 0)}%`}
            >
              <BarChart
                data={(data.charts.workloadDistribution as { label: string; value: number }[]).map((item) => ({
                  label: `${item.label}`,
                  value: item.value
                }))}
              />
            </ChartCard>
          )}
        </div>
        <div className="col-span-12 xl:col-span-6">
          <KeyboardKanban lanes={['Backlog', 'In Progress', 'Review', 'Done']} tasks={tasks} />
        </div>
      </section>
      <section className="grid-12" aria-label="Automation and rituals">
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="custom-automation"
              columns={[
                { key: 'label', label: 'Automation play' },
                { key: 'value', label: 'Runs %' }
              ]}
              data={data.charts.automationPlays as { label: string; value: number }[]}
            />
          )}
        </div>
        <div className="col-span-12 xl:col-span-6">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <DataTable
              id="custom-recurring"
              columns={[
                { key: 'ritual', label: 'Ritual' },
                { key: 'owner', label: 'Owner' },
                { key: 'cadence', label: 'Cadence' },
                { key: 'checklist', label: 'Checklist' }
              ]}
              data={data.tables.recurringTasks}
            />
          )}
        </div>
      </section>
    </div>
  );
};
