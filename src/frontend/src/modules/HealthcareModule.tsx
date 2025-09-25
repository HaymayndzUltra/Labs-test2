import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleAreaChart } from "../components/charts/AccessibleAreaChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.healthcare;

export const HealthcareModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6" }}>
        <DataTable id="healthcare-appointments" columns={data.tables.appointments.columns} data={data.tables.appointments.rows} />
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="Patient momentum"
          description={data.descriptions.marketMomentum}
          data={data.charts.marketMomentum}
          columns={[
            { key: "month", label: "Month" },
            { key: "momentum", label: "Momentum" }
          ]}
        >
          <AccessibleAreaChart data={data.charts.marketMomentum} dataKey="month" areas={[{ key: "momentum", color: data.accentToken, name: "Momentum" }]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ListCard title={data.lists.compliance.title} items={data.lists.compliance.items} />
      </section>
      <section style={{ gridColumn: "span 6", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Omni-channel reminders, smart reschedule, CSAT loop</p>
          </div>
          <StatusChip label="HIPAA" tone="danger" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 900));
          }}
        />
      </section>
    </div>
  );
};

export default HealthcareModule;
