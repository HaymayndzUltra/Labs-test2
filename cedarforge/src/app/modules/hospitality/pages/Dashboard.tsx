import { ColumnDef } from '@tanstack/react-table';
import { Card } from '@shared/components/Card';
import { KPICard } from '@shared/components/KPICard';
import { DataTable } from '@shared/components/DataTable';
import { ChartContainer } from '@shared/chart/ChartContainer';
import { LineChart } from '@shared/chart/LineChart';
import {
  bookingPace,
  hospitalityAutomations,
  hospitalityKpis,
  housekeepingLoad,
  queueMonitor,
  serviceTickets
} from '../fixtures/data';

const housekeepingColumns: ColumnDef<(typeof housekeepingLoad)[number]>[] = [
  { header: 'Wing', accessorKey: 'wing' },
  { header: 'Occupied', accessorKey: 'occupied' },
  { header: 'Clean', accessorKey: 'clean' },
  { header: 'Turn', accessorKey: 'turn' }
];

const queueColumns: ColumnDef<(typeof queueMonitor)[number]>[] = [
  { header: 'Station', accessorKey: 'station' },
  { header: 'Wait (min)', accessorKey: 'wait' }
];

const ticketColumns: ColumnDef<(typeof serviceTickets)[number]>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'SLA', accessorKey: 'sla' }
];

export default function HospitalityDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 grid grid-cols-12 gap-4">
        {hospitalityKpis.map((kpi) => (
          <div key={kpi.title} className="col-span-3 min-h-[160px]">
            <KPICard {...kpi} accent="var(--accent-hospitality)" />
          </div>
        ))}
      </section>
      <div className="col-span-7">
        <ChartContainer
          title="Booking Pace"
          description="Forward-looking band chart"
          onExport={() => undefined}
          dataTable={<BookingTable />}
        >
          <LineChart data={bookingPace} color="var(--accent-hospitality)" />
        </ChartContainer>
      </div>
      <div className="col-span-5">
        <Card title="Queue Monitor" accent="var(--accent-hospitality)">
          <DataTable ariaLabel="Queue monitor" data={queueMonitor} columns={queueColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Housekeeping Load" accent="var(--accent-hospitality)">
          <DataTable ariaLabel="Housekeeping load" data={housekeepingLoad} columns={housekeepingColumns} />
        </Card>
      </div>
      <div className="col-span-6">
        <Card title="Service Tickets" accent="var(--accent-hospitality)">
          <DataTable ariaLabel="Service tickets" data={serviceTickets} columns={ticketColumns} />
        </Card>
      </div>
      <div className="col-span-12">
        <Card title="Automation Recipes" accent="var(--accent-hospitality)">
          <ul className="grid grid-cols-2 gap-4">
            {hospitalityAutomations.map((automation) => (
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

function BookingTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Week</th>
          <th>Pace %</th>
        </tr>
      </thead>
      <tbody>
        {bookingPace.map((point, index) => (
          <tr key={index}>
            <td>W{index + 1}</td>
            <td>{point.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
