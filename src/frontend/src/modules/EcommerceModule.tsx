import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleBarChart } from "../components/charts/AccessibleBarChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";
import { useToast } from "../components/toast/ToastContext";

const data = fixtures.ecommerce;

export const EcommerceModule: React.FC = () => {
  const { addToast } = useToast();
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 4", display: "grid", gap: "24px" }}>
        <DataTable id="ecommerce-top-products" columns={data.tables.topProducts.columns} data={data.tables.topProducts.rows} />
        <div style={{ background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Seasonal promotion builder</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Validate guardrails before activation to avoid stock-outs.</p>
          <label htmlFor="promo-name" style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Campaign name</label>
          <input id="promo-name" style={{ ...inputStyle }} placeholder="Summer VIP" />
          <label htmlFor="promo-audience" style={labelStyle}>Audience</label>
          <select id="promo-audience" style={inputStyle}>
            <option>VIP</option>
            <option>High AOV</option>
            <option>International</option>
          </select>
          <label htmlFor="promo-incentive" style={labelStyle}>Incentive</label>
          <input id="promo-incentive" style={inputStyle} placeholder="Buy 2 get 20%" />
          <label htmlFor="promo-throttle" style={labelStyle}>Throttle (min inventory days)</label>
          <input id="promo-throttle" type="number" min={7} defaultValue={15} style={inputStyle} />
          <button
            type="button"
            onClick={() =>
              addToast({
                title: "Promotion scheduled",
                description: "Guardrails active across channels.",
                tone: "success",
                actionLabel: "Undo",
                onAction: () => addToast({ title: "Promotion reverted", tone: "info" })
              })
            }
            style={submitStyle}
          >
            Launch promotion
          </button>
        </div>
      </section>
      <section style={{ gridColumn: "span 4", display: "grid", gap: "24px" }}>
        <ChartCard
          title="Sales trends"
          description={data.descriptions.salesTrend}
          data={data.charts.salesTrend}
          columns={[
            { key: "week", label: "Week" },
            { key: "ecommerce", label: "Revenue" }
          ]}
        >
          <AccessibleBarChart data={data.charts.salesTrend} dataKey="week" bars={[{ key: "ecommerce", color: data.accentToken, name: "GMV" }]} />
        </ChartCard>
        <ListCard title={data.lists.promotionBuilder.title} items={data.lists.promotionBuilder.items} />
      </section>
      <section style={{ gridColumn: "span 4", display: "grid", gap: "24px" }}>
        <ListCard title={data.lists.automation.title} items={data.lists.automation.items} />
        <div style={{ background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", boxShadow: "var(--shadow-elevation)", display: "grid", gap: "16px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Operational health</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Fulfillment SLA, payment health, support backlog</p>
            </div>
            <StatusChip label="Healthy" tone="success" subtle />
          </header>
          <AccessibleBarChart data={data.charts.operationalHealth} dataKey="category" bars={[{ key: "status", color: "var(--info-400)", name: "Health" }]} />
        </div>
      </section>
      <section style={{ gridColumn: "span 12", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Abandoned cart, inventory auto-replenish, VIP delight</p>
          </div>
          <StatusChip label="Feature flag: Pro" tone="info" subtle />
        </header>
        <AutomationBuilder
          triggerOptions={data.automations.triggers}
          conditionOptions={data.automations.conditions}
          actionOptions={data.automations.actions}
          cadenceOptions={data.automations.cadences}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 600));
          }}
        />
      </section>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid var(--border-color)",
  padding: "12px 16px",
  background: "var(--surface-s1)",
  color: "var(--text-primary)"
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  marginTop: "8px"
};

const submitStyle: React.CSSProperties = {
  borderRadius: "12px",
  padding: "12px 16px",
  border: "none",
  background: "var(--vertical-ecommerce)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

export default EcommerceModule;
