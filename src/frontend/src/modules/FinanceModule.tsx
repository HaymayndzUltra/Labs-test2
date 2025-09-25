import KpiBand from "../components/KpiBand";
import { ChartCard } from "../components/charts/ChartCard";
import { AccessibleLineChart } from "../components/charts/AccessibleLineChart";
import { AccessibleDonutChart } from "../components/charts/AccessibleDonutChart";
import { DataTable } from "../components/DataTable";
import ListCard from "../components/ListCard";
import { AutomationBuilder } from "../components/automation/AutomationBuilder";
import { fixtures } from "../data/fixtures";
import StatusChip from "../components/StatusChip";

const data = fixtures.finance;

export const FinanceModule: React.FC = () => {
  return (
    <div className="grid-container" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      <div style={{ gridColumn: "span 12" }}>
        <KpiBand accent={data.accentToken} kpis={data.kpis} />
      </div>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="Expense vs budget"
          description={data.descriptions.expenseTrend}
          data={data.charts.expenseTrend}
          columns={[
            { key: "month", label: "Month" },
            { key: "actual", label: "Actual" },
            { key: "budget", label: "Budget" }
          ]}
        >
          <AccessibleLineChart
            data={data.charts.expenseTrend}
            dataKey="month"
            lines={[
              { key: "actual", color: data.accentToken, name: "Actual" },
              { key: "budget", color: "var(--info-400)", name: "Budget" }
            ]}
          />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ChartCard
          title="ROI breakdown"
          description={data.descriptions.roiBreakdown}
          data={data.charts.roiBreakdown}
          columns={[
            { key: "channel", label: "Channel" },
            { key: "roi", label: "ROI" }
          ]}
        >
          <AccessibleDonutChart data={data.charts.roiBreakdown} valueKey="roi" nameKey="channel" colors={[data.accentToken, "var(--success-400)", "var(--warning-400)", "var(--danger-400)"]} />
        </ChartCard>
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <DataTable id="finance-spend" columns={data.tables.spend.columns} data={data.tables.spend.rows} />
      </section>
      <section style={{ gridColumn: "span 6" }}>
        <ListCard title={data.lists.compliance.title} items={data.lists.compliance.items} />
      </section>
      <section style={{ gridColumn: "span 12", background: "var(--surface-s1)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "24px", display: "grid", gap: "24px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Automation orchestration</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Month-end close, expense routing, anomaly detection</p>
          </div>
          <StatusChip label="PCI scope" tone="warning" subtle />
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

export default FinanceModule;
