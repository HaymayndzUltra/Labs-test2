import { useState } from 'react';
import { useModuleData } from '../hooks/useModuleData';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { LineSeriesChart } from '../components/charts/LineSeriesChart';
import { DataTable } from '../components/DataTable';
import { Skeleton } from '../components/Skeleton';
import { StatusChip } from '../components/StatusChip';

const accentClassMap: Record<string, string> = {
  realestate: 'shadow-[0_0_0_3px_var(--vertical-realestate)]',
  finance: 'shadow-[0_0_0_3px_var(--vertical-finance)]',
  healthcare: 'shadow-[0_0_0_3px_var(--vertical-healthcare)]'
};

export const NichesModule = () => {
  const { data, isLoading } = useModuleData('niches');
  const [activeVertical, setActiveVertical] = useState<'all' | 'realestate' | 'finance' | 'healthcare'>('all');

  const filterTable = <T extends Record<string, unknown>>(rows: T[], vertical: typeof activeVertical) => {
    if (vertical === 'all') return rows;
    if (vertical === 'realestate') return rows.filter((row) => 'asset' in row || 'property' in row);
    if (vertical === 'finance') return rows.filter((row) => 'process' in row);
    return rows.filter((row) => 'workflow' in row || 'clinic' in row);
  };

  const accent = activeVertical === 'all' ? '' : accentClassMap[activeVertical];

  return (
    <div className={`flex flex-col gap-6 ${accent}`}>
      <section className="grid-12" aria-label="Specialized KPIs">
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
      <section className="grid-12" aria-label="Market momentum & ROI">
        <div className="col-span-12 xl:col-span-8">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <ChartCard
              id="niches-market"
              title="Market momentum"
              subtitle="Real estate lead velocity with finance overlay"
              data={data.charts.marketMomentum as { date: string; value: number; comparison?: number }[]}
              columns={[
                { key: 'date', label: 'Quarter' },
                { key: 'value', label: 'Momentum index' },
                { key: 'comparison', label: 'Benchmark' }
              ]}
              onPointFocus={(point) => `${point.date} momentum ${point.value} benchmark ${point.comparison}`}
            >
              <LineSeriesChart data={data.charts.marketMomentum as { date: string; value: number; comparison?: number }[]} />
            </ChartCard>
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-4 h-40 w-full" />
            </div>
          ) : (
            <ChartCard
              id="niches-roi"
              title="ROI & utilization"
              subtitle="Select to filter data"
              data={data.charts.roiUtilization as { label: string; value: number }[]}
              columns={[
                { key: 'label', label: 'Bucket' },
                { key: 'value', label: 'Share %' }
              ]}
              onPointFocus={(point) => `${point.label} ${point.value}%`}
            >
              <div
                role="list"
                className="flex flex-col gap-2"
              >
                {(data.charts.roiUtilization as { label: string; value: number }[]).map((item) => (
                  <button
                    key={item.label}
                    role="listitem"
                    className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-3 text-left text-[14px] font-semibold text-[var(--color-text-secondary)] hover:border-primary-300"
                    onClick={() =>
                      setActiveVertical((current) =>
                        item.label.includes('ROI') ? 'finance' : item.label.includes('Pipeline') ? 'realestate' : 'healthcare'
                      )
                    }
                  >
                    <span>{item.label}</span>
                    <span className="font-mono">{item.value}%</span>
                  </button>
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      </section>
      <section className="grid-12" aria-label="Vertical tables">
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <div className="card-surface flex flex-col gap-3">
              <header className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">Real estate listings</h3>
                <StatusChip tone="info" label="PCI / SOC-2" />
              </header>
              <DataTable
                id="niches-listings"
                columns={[
                  { key: 'asset', label: 'Asset' },
                  { key: 'owner', label: 'Owner' },
                  { key: 'stage', label: 'Stage' },
                  { key: 'compliance', label: 'Compliance' }
                ]}
                data={filterTable(data.tables.listings, activeVertical)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <div className="card-surface flex flex-col gap-3">
              <header className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">Finance workflows</h3>
                <StatusChip tone="success" label="PCI / SOC-2" />
              </header>
              <DataTable
                id="niches-finance"
                columns={[
                  { key: 'process', label: 'Process' },
                  { key: 'owner', label: 'Owner' },
                  { key: 'status', label: 'Status' },
                  { key: 'compliance', label: 'Compliance' }
                ]}
                data={filterTable(data.tables.finance, activeVertical)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 xl:col-span-4">
          {isLoading || !data ? (
            <div className="card-surface">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-4 h-48 w-full" />
            </div>
          ) : (
            <div className="card-surface flex flex-col gap-3">
              <header className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">Healthcare ops</h3>
                <StatusChip tone="warning" label="HIPAA / BAA" />
              </header>
              <DataTable
                id="niches-healthcare"
                columns={[
                  { key: 'workflow', label: 'Workflow' },
                  { key: 'owner', label: 'Owner' },
                  { key: 'status', label: 'Status' },
                  { key: 'compliance', label: 'Compliance' }
                ]}
                data={filterTable(data.tables.healthcare, activeVertical)}
              />
            </div>
          )}
        </div>
      </section>
      <section className="card-surface flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[14px] text-[var(--color-text-secondary)]">Active vertical filter:</span>
          <StatusChip
            tone="info"
            label={
              activeVertical === 'all'
                ? 'All verticals'
                : activeVertical === 'realestate'
                  ? 'Real estate'
                  : activeVertical === 'finance'
                    ? 'Finance'
                    : 'Healthcare'
            }
          />
        </div>
        <button
          className="rounded-lg border border-[var(--border-strong)] px-4 py-2 text-[14px] font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--surface-0)]"
          onClick={() => setActiveVertical('all')}
        >
          Clear filter
        </button>
      </section>
    </div>
  );
};
