import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart, DonutChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { ModuleViewProps } from "../../moduleRegistry";
import { deviceHealth, latencyHistogram, maintenanceBacklog } from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";

const IoTDashboard = ({ onToast }: ModuleViewProps) => {
  const activeDevices = useSseMock(15_620);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="Active devices" value={activeDevices} delta={0.03} timeframe="Live" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Uptime %" value={98.4} delta={0.004} timeframe="30d" format="percent" />
        </div>
        <div className="col-span-3">
          <KPICard title="Alerts today" value={182} delta={0.11} timeframe="24h" format="number" positiveIsGood={false} />
        </div>
        <div className="col-span-3">
          <KPICard title="Avg latency" value={182} delta={-0.05} timeframe="ms" format="number" />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-6">
          <Card title="Device health" subtitle="Segment split" padding="lg">
            <BarChart
              title="Device health"
              data={deviceHealth.map((segment) => ({ label: segment.segment, value: Math.round(segment.healthy * 100) }))}
              xAccessor={(item) => item.label}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
        <div className="col-span-6">
          <Card title="Latency histogram" subtitle="Network edges" padding="lg">
            <DonutChart
              title="Latency buckets"
              data={latencyHistogram.map((bucket) => ({ label: bucket.bucket, value: bucket.count }))}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
            />
          </Card>
        </div>
      </section>

      <Card title="Maintenance backlog" subtitle="Predictive queue" padding="lg">
        <DataTable
          caption="Maintenance backlog"
          exportFilename="maintenance-backlog"
          columns={[
            { id: "device", header: "Device", accessor: (row) => row.device },
            { id: "issue", header: "Issue", accessor: (row) => row.issue },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
          data={maintenanceBacklog}
        />
      </Card>

      <Card title="Automations" subtitle="Predictive maintenance" padding="lg">
        <button
          className="rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `iot-${Date.now()}`,
              title: "Predictive job triggered",
              description: "Canary firmware roll-out started on pilot fleet.",
              tone: "info",
            })
          }
        >
          Launch canary rollout
        </button>
      </Card>
    </div>
  );
};

export default IoTDashboard;
