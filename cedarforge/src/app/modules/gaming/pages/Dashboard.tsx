import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { LineChart } from '@shared/chart/LineChart';
import {
  cohortRetention,
  eventStream,
  gamingAutomations,
  gamingKpis,
  offerExperiments,
  crashHeat
} from '../fixtures/data';

const experimentColumns: ColumnDef<(typeof offerExperiments)[number]>[] = [
  { header: 'Variant', accessorKey: 'variant' },
  { header: 'Uplift %', accessorKey: 'uplift' },
  { header: 'Conversion %', accessorKey: 'conversion' }
];

const eventColumns: ColumnDef<(typeof eventStream)[number]>[] = [
  { header: 'Event', accessorKey: 'event' },
  { header: 'Segment', accessorKey: 'segment' },
  { header: 'Rate/min', accessorKey: 'rate' }
];

export default function GamingDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {gamingKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-gaming)" />
          </div>
        ))}
      </section>
      <div className="col-span-7">
        <ChartContainer
          title="Cohort Retention"
          description="Day 0-7 retention curve"
          onExport={() => undefined}
          dataTable={<RetentionTable />}
        >
          <LineChart data={cohortRetention} color="var(--accent-gaming)" />
        </ChartContainer>
      </div>
      <div className="col-span-5">
        <Card title="Offer Experiments" accent="var(--accent-gaming)">
          <DataTable ariaLabel="Offer experiments" data={offerExperiments} columns={experimentColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Crash Heat" accent="var(--accent-gaming)">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Window</th>
                <th className="px-4 py-2 text-left">iOS</th>
                <th className="px-4 py-2 text-left">Android</th>
                <th className="px-4 py-2 text-left">PC</th>
              </tr>
            </thead>
            <tbody>
              {crashHeat.map((row) => (
                <tr key={row.window}>
                  <td className="px-4 py-2">{row.window}</td>
                  <td className="px-4 py-2">{row.ios}%</td>
                  <td className="px-4 py-2">{row.android}%</td>
                  <td className="px-4 py-2">{row.pc}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Event Stream" accent="var(--accent-gaming)">
          <DataTable ariaLabel="Event stream" data={eventStream} columns={eventColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title="Automation Playbooks" accent="var(--accent-gaming)">
          <ul className="grid grid-cols-2 gap-4">
            {gamingAutomations.map((automation) => (
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

function RetentionTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Retention %</th>
        </tr>
      </thead>
      <tbody>
        {cohortRetention.map((point, index) => (
          <tr key={index}>
            <td>D{index}</td>
            <td>{point.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
