import { useEffect, useState } from "react";
import KpiBand from "../components/KpiBand";
import { DataTable } from "../components/DataTable";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleDonutChart } from "../components/charts/AccessibleDonutChart";
import { AccessibleLineChart } from "../components/charts/AccessibleLineChart";
import { AccessibleAreaChart } from "../components/charts/AccessibleAreaChart";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import { mockLiveMetricsStream, type LiveMetric } from "../services/liveMetrics";
import StatusChip from "../components/StatusChip";
import { useToast } from "../components/toast/ToastContext";

const data = fixtures.saas;

export const SaaSModule: React.FC = () => {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const dispose = mockLiveMetricsStream(setLiveMetrics);
    return dispose;
  }, []);

  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section
        style={{
          gridColumn: "span 8",
          display: "grid",
          gap: "24px"
        }}
      >
        <ChartCard
          title="Churn health"
          description={data.descriptions.churnHealth}
          data={data.charts.churnHealth}
          columns={[
            { key: "stage", label: "Stage" },
            { key: "value", label: "Share" }
          ]}
        >
          <AccessibleDonutChart data={data.charts.churnHealth} valueKey="value" nameKey="stage" colors={["var(--success-500)", "var(--warning-400)", "var(--danger-400)"]} />
        </ChartCard>
        <ChartCard
          title="MRR growth"
          description={data.descriptions.mrrGrowth}
          data={data.charts.mrrGrowth}
          columns={[
            { key: "month", label: "Month" },
            { key: "mrr", label: "MRR" }
          ]}
        >
          <AccessibleLineChart data={data.charts.mrrGrowth} dataKey="month" lines={[{ key: "mrr", color: "var(--vertical-saas)", name: "MRR" }]} />
        </ChartCard>
        <ChartCard
          title="API usage saturation"
          description={data.descriptions.apiUsage}
          data={data.charts.apiUsage}
          columns={[
            { key: "day", label: "Day" },
            { key: "saturation", label: "Saturation" }
          ]}
        >
          <AccessibleAreaChart data={data.charts.apiUsage} dataKey="day" areas={[{ key: "saturation", color: "var(--info-400)", name: "Saturation" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 4", display: "grid", gap: "24px" }}>
        <div style={{ background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", boxShadow: "var(--shadow-elevation)", display: "grid", gap: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Live billing signals</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
            {liveMetrics.map((metric) => (
              <li key={metric.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{metric.label}</p>
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Updated {new Date(metric.updatedAt).toLocaleTimeString()}</p>
                </div>
                <span style={{ fontFeatureSettings: "'tnum' 1, 'lnum' 1", fontWeight: 600 }}>{metric.value.toFixed(0)}</span>
              </li>
            ))}
          </ul>
        </div>
        <ListCard title={data.lists.orchestration.title} items={data.lists.orchestration.items} />
        <div style={{ background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", boxShadow: "var(--shadow-elevation)", display: "grid", gap: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Churn recovery playbook</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Template, fallback owner, and threshold configured per segment.</p>
          <button
            type="button"
            onClick={() =>
              addToast({
                title: "Playbook enabled",
                description: "Churn recovery playbook will auto sync.",
                tone: "info",
                actionLabel: "Undo",
                onAction: () => addToast({ title: "Undo successful", tone: "success" })
              })
            }
            style={{
              borderRadius: "12px",
              border: "none",
              background: data.accentToken,
              color: "#fff",
              padding: "12px 16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Enable playbook
          </button>
        </div>
      </section>
      <section style={{ gridColumn: "span 12" }}>
        <DataTable
          id="saas-plans"
          columns={data.tables.plans.columns.map((column) => ({
            key: column.key,
            label: column.label,
            align: column.align
          }))}
          data={data.tables.plans.rows}
        />
      </section>
      <section style={{ gridColumn: "span 12", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", boxShadow: "var(--shadow-elevation)", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Billing reconciliation, outreach, burst protection</p>
          </div>
          <StatusChip label="Feature flag: enabled" tone="info" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        />
      </section>
    </div>
  );
};

export default SaaSModule;
