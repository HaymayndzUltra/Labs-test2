import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleLineChart } from "../components/charts/AccessibleLineChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.media;

export const MediaModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="Engagement trend"
          description={data.descriptions.engagement}
          data={data.charts.engagement}
          columns={[
            { key: "day", label: "Day" },
            { key: "engagement", label: "Score" }
          ]}
        >
          <AccessibleLineChart data={data.charts.engagement} dataKey="day" lines={[{ key: "engagement", color: data.accentToken, name: "Engagement" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <DataTable id="media-top-stories" columns={data.tables.stories.columns} data={data.tables.stories.rows} />
      </section>
      <section style={{ gridColumn: "span 4" }}>
        <ListCard title={data.lists.queue.title} items={data.lists.queue.items} />
      </section>
      <section style={{ gridColumn: "span 8", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Control tower, auto-tagging, highlights generator</p>
          </div>
          <StatusChip label="Add-on" tone="warning" subtle />
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

export default MediaModule;
