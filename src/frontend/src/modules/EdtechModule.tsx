import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleBarChart } from "../components/charts/AccessibleBarChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.edtech;

export const EdtechModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6" }}>
        <DataTable id="program-performance" columns={data.tables.programs.columns} data={data.tables.programs.rows} />
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="Student activity heatmap"
          description={data.descriptions.activity}
          data={data.charts.activity}
          columns={[
            { key: "day", label: "Day" },
            { key: "active", label: "Active learners" }
          ]}
        >
          <AccessibleBarChart data={data.charts.activity} dataKey="day" bars={[{ key: "active", color: data.accentToken, name: "Active" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 4" }}>
        <ListCard title={data.lists.orchestration.title} items={data.lists.orchestration.items} />
      </section>
      <section style={{ gridColumn: "span 8", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Auto certificate issuance, inactivity nudges, mentor rotation</p>
          </div>
          <StatusChip label="FERPA ready" tone="info" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </section>
    </div>
  );
};

export default EdtechModule;
