import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { LineChart } from '@shared/chart/LineChart';
import { StreamChart } from '@shared/chart/StreamChart';
import {
  derOutput,
  energyAutomations,
  energyKpis,
  loadCurve,
  outageMap,
  workOrders
} from '../fixtures/data';

const outageColumns: ColumnDef<(typeof outageMap)[number]>[] = [
  { header: 'Region', accessorKey: 'region' },
  { header: 'Outages', accessorKey: 'outages' },
  { header: 'Crews', accessorKey: 'crews' },
  { header: 'ETA', accessorKey: 'eta' }
];

const workOrderColumns: ColumnDef<(typeof workOrders)[number]>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Crew', accessorKey: 'crew' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'Task', accessorKey: 'task' },
  { header: 'Priority', accessorKey: 'priority' }
];

export default function EnergyDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {energyKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-energy)" />
          </div>
        ))}
      </section>
      <div className="col-span-7">
        <ChartContainer
          title="Load Curve"
          description="24h demand with forecast band"
          onExport={() => undefined}
          dataTable={<LoadTable />}
        >
          <LineChart data={loadCurve} color="var(--accent-energy)" />
        </ChartContainer>
      </div>
      <div className="col-span-5">
        <ChartContainer
          title="DER Output"
          description="Stream chart of solar, wind, storage"
          onExport={() => undefined}
          dataTable={<DerTable />}
        >
          <StreamChart
            data={derOutput}
            keys={['solar', 'wind', 'storage']}
            palette={['#36BD83', '#4F87E7', '#C3773B']}
          />
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <Card title="Outage Map" accent="var(--accent-energy)">
          <DataTable ariaLabel="Outage map" data={outageMap} columns={outageColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Work Orders" accent="var(--accent-energy)">
          <DataTable ariaLabel="Work orders" data={workOrders} columns={workOrderColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title="Automation Scenarios" accent="var(--accent-energy)">
          <ul className="grid grid-cols-2 gap-4">
            {energyAutomations.map((automation) => (
              <li key={automation.name} className="rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] p-4">
                <h4 className="text-[16px] font-semibold text-[color:var(--text-primary)]">{automation.name}</h4>
                <p className="text-[12px] text-[color:var(--text-secondary)]">
                  <strong>Trigger:</strong> {automation.trigger} · <strong>Cadence:</strong> {automation.cadence}
                </p>
                <p className="text-[12px] text-[color:var(--text-secondary)]"><strong>Actions:</strong> {automation.actions.join(', ')}</p>
                <p className="text-[12px] text-[color:var(--text-secondary)]"><strong>Guardrails:</strong> {automation.guardrails.join(', ')}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function LoadTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Hour</th>
          <th>MW</th>
        </tr>
      </thead>
      <tbody>
        {loadCurve.map((row) => (
          <tr key={row.date.toISOString()}>
            <td>{row.date.getHours()}:00</td>
            <td>{Math.round(row.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DerTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Solar</th>
          <th>Wind</th>
          <th>Storage</th>
        </tr>
      </thead>
      <tbody>
        {derOutput.map((row) => (
          <tr key={row.date.toISOString()}>
            <td>{row.date.toLocaleString('default', { month: 'short' })}</td>
            <td>{row.solar}</td>
            <td>{row.wind}</td>
            <td>{row.storage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
