import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart, DonutChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { ModuleViewProps } from "../../moduleRegistry";
import { bookingPace, housekeepingLoad, queueMonitor, serviceTickets } from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";

const HospitalityDashboard = ({ onToast }: ModuleViewProps) => {
  const occupancy = useSseMock(82);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="Occupancy %" value={occupancy} delta={0.02} timeframe="Tonight" format="percent" />
        </div>
        <div className="col-span-3">
          <KPICard title="RevPAR" value={198} delta={0.07} timeframe="USD" format="currency" />
        </div>
        <div className="col-span-3">
          <KPICard title="NPS" value={63} delta={0.05} timeframe="7d" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Avg service time" value={12} delta={-0.04} timeframe="min" format="duration" />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-7">
          <Card title="Booking pace" subtitle="vs forecast" padding="lg">
            <BarChart
              title="Booking pace"
              data={bookingPace.map((day) => ({ label: day.label, value: day.booked }))}
              xAccessor={(item) => item.label}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
        <div className="col-span-5 space-y-6">
          <Card title="Housekeeping load" subtitle="Ready vs dirty" padding="lg">
            <DonutChart
              title="Rooms"
              data={housekeepingLoad.map((wing) => ({ label: wing.wing, value: wing.dirty }))}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
            />
          </Card>
          <Card title="Queue monitor" subtitle="Live guests" padding="lg">
            <DataTable
              caption="Queue status"
              exportFilename="queue-monitor"
              columns={[
                { id: "queue", header: "Queue", accessor: (row) => row.queue },
                { id: "guests", header: "Guests", accessor: (row) => row.guests, numeric: true },
                { id: "wait", header: "Wait", accessor: (row) => row.wait, numeric: true },
              ]}
              data={queueMonitor}
            />
          </Card>
        </div>
      </section>

      <Card title="Service tickets" subtitle="Guest experience" padding="lg">
        <DataTable
          caption="Service tickets"
          exportFilename="service-tickets"
          columns={[
            { id: "ticket", header: "Ticket", accessor: (row) => row.ticket },
            { id: "guest", header: "Guest", accessor: (row) => row.guest },
            { id: "issue", header: "Issue", accessor: (row) => row.issue },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
          data={serviceTickets}
        />
        <button
          className="mt-4 rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `hospitality-${Date.now()}`,
              title: "VIP flow primed",
              description: "VIP alerts synced to messaging teams.",
              tone: "info",
            })
          }
        >
          Trigger VIP alerts
        </button>
      </Card>
    </div>
  );
};

export default HospitalityDashboard;
