import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { BandedBarChart } from '@shared/chart/BandedBarChart';
import {
  deviceHealth,
  geoClusters,
  iotAutomations,
  iotKpis,
  latencyHistogram,
  maintenanceBacklog
} from '../fixtures/data';

const clusterColumns: ColumnDef<(typeof geoClusters)[number]>[] = [
  { header: 'Cluster', accessorKey: 'cluster' },
  { header: 'Devices', accessorKey: 'devices' },
  { header: 'Uptime', accessorKey: 'uptime' },
  { header: 'Issues', accessorKey: 'issues' }
];

const backlogColumns: ColumnDef<(typeof maintenanceBacklog)[number]>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Device', accessorKey: 'device' },
  { header: 'Issue', accessorKey: 'issue' },
  { header: 'Status', accessorKey: 'status' }
];

export default function IotDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {iotKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-iot)" />
          </div>
        ))}
      </section>
      <div className="col-span-6">
        <ChartContainer
          title="Device Health"
          description="Banded bars for device cohorts"
          onExport={() => undefined}
          dataTable={<DeviceHealthTable />}
        >
          <BandedBarChart data={deviceHealth} color="var(--accent-iot)" />
        </ChartContainer>
      </div>
      <div className="col-span-6">
        <Card title="Latency Histogram" accent="var(--accent-iot)">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Bucket</th>
                <th className="px-4 py-2 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              {latencyHistogram.map((bucket) => (
                <tr key={bucket.bucket}>
                  <td className="px-4 py-2">{bucket.bucket}</td>
                  <td className="px-4 py-2">{bucket.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Geo Clusters" accent="var(--accent-iot)">
          <DataTable ariaLabel="Geo clusters" data={geoClusters} columns={clusterColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Maintenance Backlog" accent="var(--accent-iot)">
          <DataTable ariaLabel="Maintenance backlog" data={maintenanceBacklog} columns={backlogColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title="Automation Recipes" accent="var(--accent-iot)">
          <ul className="grid grid-cols-2 gap-4">
            {iotAutomations.map((automation) => (
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

function DeviceHealthTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Cohort</th>
          <th>Value</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {deviceHealth.map((row) => (
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
