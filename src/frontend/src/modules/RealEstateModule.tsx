import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleAreaChart } from "../components/charts/AccessibleAreaChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.realestate;

export const RealEstateModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6" }}>
        <DataTable id="realestate-listings" columns={data.tables.listings.columns} data={data.tables.listings.rows} />
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="Market momentum"
          description={data.descriptions.momentum}
          data={data.charts.momentum}
          columns={[
            { key: "month", label: "Month" },
            { key: "momentum", label: "Momentum" }
          ]}
        >
          <AccessibleAreaChart data={data.charts.momentum} dataKey="month" areas={[{ key: "momentum", color: data.accentToken, name: "Momentum" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 4" }}>
        <ListCard title={data.lists.inquiries.title} items={data.lists.inquiries.items} />
      </section>
      <section style={{ gridColumn: "span 8", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Agent notification loop, listing nurture, momentum watcher</p>
          </div>
          <StatusChip label="Regional" tone="info" subtle />
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

export default RealEstateModule;
