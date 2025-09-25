import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { ModuleViewProps } from "../../moduleRegistry";
import { laneHealth, carrierScorecard, exceptionFeed, logisticsAutomations } from "../fixtures";
import { formatPercent } from "@shared/utils/format";
import { useSseMock } from "@shared/hooks/useSseMock";

const LogisticsDashboard = ({ onToast }: ModuleViewProps) => {
  const otifLive = useSseMock(89);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="OTIF %" value={otifLive} delta={0.012} timeframe="7d" format="number" positiveIsGood />
        </div>
        <div className="col-span-3">
          <KPICard title="In-transit units" value={38_420} delta={0.04} timeframe="Live" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="Avg lead time" value={3.8} delta={-0.06} timeframe="Days" format="duration" unit="hours" />
        </div>
        <div className="col-span-3">
          <KPICard title="Route cost/stop" value={37} delta={-0.02} timeframe="USD" format="currency" />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-7">
          <Card title="Lane health" subtitle="On-time vs delayed" padding="lg">
            <BarChart
              title="Lane on-time"
              data={laneHealth.map((lane) => ({ lane: lane.lane, value: Math.round(lane.onTime * 100) }))}
              xAccessor={(item) => item.lane}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
        <div className="col-span-5 space-y-6">
          <Card title="Exception feed" subtitle="Realtime triage" padding="lg">
            <ul className="space-y-3 text-sm text-text-secondary">
              {exceptionFeed.map((exception) => (
                <li key={exception.id} className="rounded-lg border border-line-soft bg-background-card px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{exception.type}</span>
                    <span className="rounded-full border border-line-soft px-2 py-0.5 text-xs text-text-muted">
                      {exception.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{exception.message}</p>
                  <p className="text-xs text-text-muted">ETA impact: {exception.etaImpact}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Card title="Carrier scorecard" subtitle="Cost & reliability" padding="lg">
        <DataTable
          caption="Carrier scorecard"
          exportFilename="carrier-scorecard"
          columns={[
            { id: "carrier", header: "Carrier", accessor: (row) => row.carrier },
            { id: "otif", header: "OTIF", accessor: (row) => formatPercent(row.otif), numeric: true },
            { id: "cost", header: "Cost/stop", accessor: (row) => `$${row.costPerStop.toFixed(2)}`, numeric: true },
            { id: "exceptions", header: "Exceptions", accessor: (row) => row.exceptions, numeric: true },
          ]}
          data={carrierScorecard}
        />
      </Card>

      <Card title="Automation guardrails" subtitle="Dynamic re-slotting" padding="lg">
        <button
          className="rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `logistics-${Date.now()}`,
              title: "Re-slotting simulation queued",
              description: "We will share reroute proposals in your inbox shortly.",
              tone: "info",
            })
          }
        >
          Run dry-run
        </button>
        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          {logisticsAutomations.map((automation) => (
            <div key={automation.id} className="rounded-lg border border-line-soft bg-background-raised px-3 py-2">
              <p className="font-semibold text-text-primary">{automation.name}</p>
              <p className="text-xs text-text-muted">{automation.trigger} · {automation.cadence} · {automation.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
