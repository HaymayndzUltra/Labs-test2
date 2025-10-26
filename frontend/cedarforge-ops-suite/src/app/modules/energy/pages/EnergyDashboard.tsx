import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { LineChart, DonutChart, BarChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { ModuleViewProps } from "../../moduleRegistry";
import { loadCurve, derOutput, outageMap, workOrders } from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";

const EnergyDashboard = ({ onToast }: ModuleViewProps) => {
  const peakLoad = useSseMock(542);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="Peak load" value={peakLoad} delta={0.05} timeframe="MW" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Renewable %" value={58} delta={0.04} timeframe="Today" format="percent" />
        </div>
        <div className="col-span-3">
          <KPICard title="Outages" value={18} delta={-0.12} timeframe="Active" format="number" positiveIsGood={false} />
        </div>
        <div className="col-span-3">
          <KPICard title="SAIDI" value={43} delta={-0.06} timeframe="mins" format="number" positiveIsGood={false} />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-8">
          <Card title="Load curve" subtitle="Actual vs forecast" padding="lg">
            <LineChart
              title="Load curve"
              data={loadCurve.map((point) => ({
                time: new Date(2024, 4, 1, point.hour),
                load: point.load,
              }))}
              xAccessor={(item) => item.time}
              yAccessor={(item) => item.load}
            />
          </Card>
        </div>
        <div className="col-span-4 space-y-6">
          <Card title="DER output" subtitle="Mix" padding="lg">
            <DonutChart
              title="DER mix"
              data={derOutput}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
            />
          </Card>
          <Card title="Outage clusters" subtitle="Region status" padding="lg">
            <BarChart
              title="Outages"
              data={outageMap.map((row) => ({ label: row.region, value: row.outages }))}
              xAccessor={(item) => item.label}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
      </section>

      <Card title="Crew dispatch" subtitle="Live work orders" padding="lg">
        <DataTable
          caption="Work orders"
          exportFilename="energy-work-orders"
          columns={[
            { id: "id", header: "Order", accessor: (row) => row.id },
            { id: "crew", header: "Crew", accessor: (row) => row.crew },
            { id: "status", header: "Status", accessor: (row) => row.status },
            { id: "duration", header: "Duration", accessor: (row) => row.duration, numeric: true },
          ]}
          data={workOrders}
        />
      </Card>

      <Card title="Automation" subtitle="Battery dispatch" padding="lg">
        <button
          className="rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `energy-${Date.now()}`,
              title: "Dispatch plan generated",
              description: "Battery discharge schedule shared with control room.",
              tone: "success",
            })
          }
        >
          Export dispatch plan
        </button>
      </Card>
    </div>
  );
};

export default EnergyDashboard;
