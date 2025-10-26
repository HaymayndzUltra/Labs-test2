import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { LineChart } from '@shared/chart/LineChart';
import { BandedBarChart } from '@shared/chart/BandedBarChart';
import { BulletChart } from '@shared/chart/BulletChart';
import { useToastStore } from '@shared/components/Toast';
import { AutoBuilder } from '@shared/components/AutoBuilder';
import { createMockSse } from '@shared/utils/mock-sse';
import {
  cashWaterfall,
  collectionsAging,
  finopsAutomations,
  finopsKpis,
  paymentHealth,
  revenueLeakage,
  forecastVsActual
} from '../fixtures/data';

type AgingRow = (typeof collectionsAging)[number];
type PaymentHealthRow = (typeof paymentHealth)[number];

const agingColumns: ColumnDef<AgingRow>[] = [
  { header: 'Bucket', accessorKey: 'bucket' },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: (info) => `$${Number(info.getValue()).toLocaleString()}`
  }
];

const paymentColumns: ColumnDef<PaymentHealthRow>[] = [
  { header: 'Region', accessorKey: 'region' },
  { header: 'BIN', accessorKey: 'bin' },
  { header: 'Anomaly', accessorKey: 'anomaly' },
  { header: 'Status', accessorKey: 'status' }
];

export default function FinOpsDashboard() {
  const pushToast = useToastStore((state) => state.push);

  useEffect(() => {
    return createMockSse(() => {
      pushToast({
        title: 'Treasury live update',
        description: 'Latest ledger delta ingested'
      });
    }, 15000);
  }, [pushToast]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {finopsKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-finops)" />
          </div>
        ))}
      </section>
      <div className="col-span-7">
        <ChartContainer
          title="Cash Waterfall"
          description="Month-by-month glidepath with forecast band"
          onExport={() => undefined}
          dataTable={<AgingTable />}
        >
          <LineChart data={cashWaterfall} color="var(--accent-finops)" />
        </ChartContainer>
      </div>
      <div className="col-span-5">
        <ChartContainer
          title="Revenue Leakage"
          description="Banded bars for leakage vs. guardrail"
          onExport={() => undefined}
          dataTable={<LeakageTable />}
        >
          <BandedBarChart data={revenueLeakage} />
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <Card title="Collections Aging" accent="var(--accent-finops)">
          <DataTable ariaLabel="Collections aging buckets" data={collectionsAging} columns={agingColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Payment Health" accent="var(--accent-finops)">
          <DataTable ariaLabel="Payment health anomalies" data={paymentHealth} columns={paymentColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <ChartContainer
          title="Forecast vs Actual"
          description="Bullet chart across quarters"
          onExport={() => undefined}
          dataTable={<ForecastTable />}
        >
          <BulletChart data={forecastVsActual} />
        </ChartContainer>
      </div>
      <div className="col-span-8">
        <Card title="Automation Library" accent="var(--accent-finops)">
          <ul className="grid grid-cols-2 gap-4">
            {finopsAutomations.map((automation) => (
              <li key={automation.name} className="rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] p-4">
                <h4 className="text-[16px] font-semibold text-[color:var(--text-primary)]">{automation.name}</h4>
                <dl className="mt-2 space-y-1 text-[12px] text-[color:var(--text-secondary)]">
                  <div className="flex justify-between"><dt>Trigger</dt><dd>{automation.trigger}</dd></div>
                  <div className="flex justify-between"><dt>Cadence</dt><dd>{automation.cadence}</dd></div>
                  <div>
                    <dt className="font-semibold">Actions</dt>
                    <dd>{automation.actions.join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Guardrails</dt>
                    <dd>{automation.guardrails.join(', ')}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="col-span-4">
        <AutoBuilder
          onSubmit={(automation) =>
            pushToast({
              title: 'Automation drafted',
              description: `${automation.name} ready for approval`
            })
          }
        />
      </div>
    </div>
  );
}

function AgingTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Bucket</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {collectionsAging.map((row) => (
          <tr key={row.bucket}>
            <td>{row.bucket}</td>
            <td>{row.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LeakageTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Value</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {revenueLeakage.map((row) => (
          <tr key={row.category}>
            <td>{row.category}</td>
            <td>{row.value.toFixed(2)}</td>
            <td>{row.target.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ForecastTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Measure</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {forecastVsActual.map((row) => (
          <tr key={row.title}>
            <td>{row.title}</td>
            <td>{row.measure}</td>
            <td>{row.target}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
