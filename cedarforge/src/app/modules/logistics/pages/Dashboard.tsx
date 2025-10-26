import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { BandedBarChart } from '@shared/chart/BandedBarChart';
import { LineChart } from '@shared/chart/LineChart';
import { BulletChart } from '@shared/chart/BulletChart';
import {
  carrierScorecard,
  exceptionFeed,
  hubThroughput,
  laneHealth,
  logisticsAutomations,
  logisticsKpis,
  routeUtilization
} from '../fixtures/data';

const carrierColumns: ColumnDef<(typeof carrierScorecard)[number]>[] = [
  { header: 'Carrier', accessorKey: 'carrier' },
  { header: 'Reliability', accessorKey: 'reliability' },
  { header: 'Spend', accessorKey: 'spend' },
  { header: 'Score', accessorKey: 'score' }
];

const exceptionColumns: ColumnDef<(typeof exceptionFeed)[number]>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Action', accessorKey: 'action' },
  { header: 'Status', accessorKey: 'status' }
];

export default function LogisticsDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {logisticsKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-logistics)" />
          </div>
        ))}
      </section>
      <div className="col-span-7">
        <ChartContainer
          title="Lane Health"
          description="Stacked performance by lane"
          onExport={() => undefined}
          dataTable={<LaneHealthTable />}
        >
          <BandedBarChart data={laneHealth} color="var(--accent-logistics)" />
        </ChartContainer>
      </div>
      <div className="col-span-5">
        <ChartContainer
          title="Hub Throughput"
          description="Heat-like area for hub volume"
          onExport={() => undefined}
          dataTable={<ThroughputTable />}
        >
          <LineChart data={hubThroughput} color="var(--accent-logistics)" />
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <ChartContainer
          title="Route Utilization"
          description="Bullet chart for each route family"
          onExport={() => undefined}
          dataTable={<RouteUtilizationTable />}
        >
          <BulletChart data={routeUtilization} color="var(--accent-logistics)" />
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <Card title="Carrier Scorecard" accent="var(--accent-logistics)">
          <DataTable ariaLabel="Carrier scorecard" data={carrierScorecard} columns={carrierColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Exception Feed" accent="var(--accent-logistics)">
          <DataTable ariaLabel="Exception feed" data={exceptionFeed} columns={exceptionColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Automation Recipes" accent="var(--accent-logistics)">
          <ul className="space-y-3 text-[14px] text-[color:var(--text-secondary)]">
            {logisticsAutomations.map((automation) => (
              <li key={automation.name} className="rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] p-4">
                <h4 className="text-[16px] font-semibold text-[color:var(--text-primary)]">{automation.name}</h4>
                <p><strong>Trigger:</strong> {automation.trigger}</p>
                <p><strong>Cadence:</strong> {automation.cadence}</p>
                <p><strong>Actions:</strong> {automation.actions.join(', ')}</p>
                <p><strong>Guardrails:</strong> {automation.guardrails.join(', ')}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function LaneHealthTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Lane</th>
          <th>Value</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {laneHealth.map((row) => (
          <tr key={row.category}>
            <td>{row.category}</td>
            <td>{row.value}</td>
            <td>{row.target}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ThroughputTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {hubThroughput.map((row) => (
          <tr key={row.date.toISOString()}>
            <td>{row.date.toDateString()}</td>
            <td>{row.value.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RouteUtilizationTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Measure</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {routeUtilization.map((row) => (
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
