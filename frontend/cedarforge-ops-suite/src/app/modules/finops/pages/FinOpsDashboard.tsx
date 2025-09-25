import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart, BulletChart, DonutChart } from "@shared/chart/ChartPrimitives";
import { DataTable } from "@shared/components/DataTable";
import { AutoBuilder } from "@shared/components/AutoBuilder";
import { ModuleViewProps } from "../../moduleRegistry";
import {
  cashWaterfall,
  revenueLeakage,
  collectionsAging,
  forecastVsActual,
  paymentHealth,
  finopsAutomations,
} from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";
import { formatCurrency, formatPercent } from "@shared/utils/format";

const kpiSparkline = [72, 68, 74, 71, 77, 79, 82, 84, 86, 88];

const FinOpsDashboard = ({ onToast }: ModuleViewProps) => {
  const cashLive = useSseMock(12_280_000);

  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard
            title="Cash position"
            value={cashLive}
            delta={0.032}
            timeframe="Live"
            format="currency"
            sparkline={kpiSparkline}
            accent="var(--accent-finops)"
          />
        </div>
        <div className="col-span-3">
          <KPICard title="Net burn" value={-820_000} delta={-0.04} timeframe="Last 30d" format="currency" />
        </div>
        <div className="col-span-3">
          <KPICard title="Runway" value={18} delta={0.08} timeframe="Months" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="DSO" value={39} delta={-0.06} timeframe="Days" format="number" />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-7 space-y-6">
          <Card title="Cash waterfall" subtitle="Direct & indirect flows" padding="lg">
            <BarChart
              title="Cash waterfall"
              description="Net movement across treasury flows"
              data={cashWaterfall}
              xAccessor={(point) => point.stage}
              yAccessor={(point) => point.amount}
            />
          </Card>
          <Card title="Forecast vs actual" subtitle="Monthly" padding="lg">
            <BulletChart
              title="Forecast accuracy"
              description="Actual vs forecast and targets"
              ranges={forecastVsActual.map((point) => point.forecast)}
              measure={forecastVsActual.at(-1)?.actual ?? 0}
              target={forecastVsActual.at(-1)?.target ?? 0}
            />
          </Card>
        </div>
        <div className="col-span-5 space-y-6">
          <Card title="Revenue leakage" subtitle="Prevented vs outstanding" padding="lg">
            <DonutChart
              title="Leakage composition"
              data={revenueLeakage}
              valueAccessor={(item) => item.prevented + item.unresolved}
              labelAccessor={(item) => item.type}
            />
          </Card>
          <Card title="Payment health" subtitle="Region/BIN anomalies" padding="lg">
            <DataTable
              caption="BIN level performance"
              exportFilename="payment-health"
              columns={[
                { id: "region", header: "Region", accessor: (row) => row.region },
                { id: "bin", header: "BIN", accessor: (row) => row.bin },
                {
                  id: "success",
                  header: "Success %",
                  accessor: (row) => formatPercent(row.successRate, { minimumFractionDigits: 1 }),
                  numeric: true,
                },
                {
                  id: "anomaly",
                  header: "Anomaly",
                  accessor: (row) => row.anomalyScore.toFixed(2),
                  numeric: true,
                },
              ]}
              data={paymentHealth}
            />
          </Card>
        </div>
      </section>

      <Card title="Collections aging" subtitle="Bucketed exposure" padding="lg">
        <DataTable
          caption="Collections aging"
          exportFilename="collections-aging"
          columns={[
            { id: "customer", header: "Customer", accessor: (row) => row.customer },
            { id: "current", header: "Current", accessor: (row) => formatCurrency(row.current), numeric: true },
            { id: "30", header: "30d", accessor: (row) => formatCurrency(row.d30), numeric: true },
            { id: "60", header: "60d", accessor: (row) => formatCurrency(row.d60), numeric: true },
            { id: "90", header: "90d", accessor: (row) => formatCurrency(row.d90), numeric: true },
          ]}
          data={collectionsAging}
        />
      </Card>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="Automation blueprint" subtitle="Leakage detector" padding="lg">
          <AutoBuilder
            onSubmit={() =>
              onToast({
                id: `finops-${Date.now()}`,
                title: "Automation queued",
                description: "Leakage detector deployed with dry-run enabled.",
                tone: "success",
              })
            }
          />
        </Card>
        <Card title="Runbook" subtitle="Revenue assurance automations" padding="lg">
          <ul className="space-y-3 text-sm text-text-secondary">
            {finopsAutomations.map((automation) => (
              <li key={automation.id} className="rounded-lg border border-line-soft bg-background-card px-3 py-3">
                <p className="text-sm font-semibold text-text-primary">{automation.name}</p>
                <p className="text-xs text-text-muted">{automation.trigger} · {automation.cadence} · {automation.status}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
};

export default FinOpsDashboard;
