import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleBarChart } from "../components/charts/AccessibleBarChart";
import { AccessibleDonutChart } from "../components/charts/AccessibleDonutChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.analytics;

export const AnalyticsModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6", display: "grid", gap: "24px" }}>
        <ChartCard
          title="Conversion funnel"
          description={data.descriptions.funnel}
          data={data.charts.funnel}
          columns={[
            { key: "stage", label: "Stage" },
            { key: "value", label: "Volume" }
          ]}
        >
          <AccessibleBarChart data={data.charts.funnel} dataKey="stage" bars={[{ key: "value", color: data.accentToken, name: "Volume" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 6", display: "grid", gap: "24px" }}>
        <ChartCard
          title="Lead source mix"
          description={data.descriptions.leadMix}
          data={data.charts.leadMix}
          columns={[
            { key: "source", label: "Source" },
            { key: "share", label: "Share" }
          ]}
        >
          <AccessibleDonutChart data={data.charts.leadMix} valueKey="share" nameKey="source" colors={["var(--vertical-analytics)", "var(--info-400)", "var(--success-400)", "var(--warning-400)", "var(--danger-400)"]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 4" }}>
        <ListCard title={data.lists.insights.title} items={data.lists.insights.items} />
      </section>
      <section style={{ gridColumn: "span 8" }}>
        <DataTable id="analytics-executive" columns={data.tables.executive.columns} data={data.tables.executive.rows} />
      </section>
      <section style={{ gridColumn: "span 12", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Predictive lead scoring, intent surge sync, lifecycle SLA</p>
          </div>
          <StatusChip label="MMM light" tone="info" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 700));
          }}
        />
      </section>
    </div>
  );
};

export default AnalyticsModule;
