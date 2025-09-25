import { useMemo } from 'react';
import { ecommerceKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { BarChart } from '../components/charts/BarChart';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';
import { DataTable } from '../components/primitives/DataTable';

const topProducts = [
  ['Trail Runner', '$182,000', '5.6%', '1,240', '▲'],
  ['All-weather Parka', '$164,000', '6.4%', '820', '▲'],
  ['Everyday Tee', '$128,400', '3.2%', '2,430', '→'],
  ['Studio Legging', '$94,200', '4.6%', '560', '▼']
];

const operationsHealth = [
  ['Fulfillment SLA', '96%', 'success'],
  ['Payment health', '99.4%', 'success'],
  ['Support backlog', '132', 'warning']
];

export function EcommerceModule() {
  const kpis = useLiveKpis(ecommerceKpis);
  const salesTrends = useMemo(() => generateTimeSeries(12, 420, 0.12), []);

  return (
    <div className="dashboard-grid" data-accent="commerce">
      <section className="kpi-band" aria-label="Commerce KPIs">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <div className="card col-6" role="region" aria-labelledby="top-products">
        <div className="card__header">
          <h2 id="top-products" className="card__title">
            Top products leaderboard
          </h2>
          <p className="card__subtitle">Revenue, conversion, inventory cover, and trend direction.</p>
        </div>
        <DataTable columns={['Product', 'Revenue', 'Conversion', 'Inventory', 'Trend']} rows={topProducts} />
      </div>

      <div className="card col-6" role="region" aria-labelledby="promotion-builder">
        <div className="card__header">
          <h2 id="promotion-builder" className="card__title">
            Seasonal promotion builder
          </h2>
        </div>
        <form className="card-list" noValidate>
          <div className="form-field">
            <label htmlFor="campaign-name">Campaign name</label>
            <input id="campaign-name" name="campaign-name" required placeholder="Winter VIP drop" />
          </div>
          <div className="form-field">
            <label htmlFor="audience">Audience</label>
            <select id="audience" name="audience" required>
              <option value="vip">VIP</option>
              <option value="loyal">Loyalty tier</option>
              <option value="prospect">High intent prospects</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="incentive">Incentive</label>
            <input id="incentive" name="incentive" required placeholder="Free express shipping + 20%" />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={3} required placeholder="Preview omnichannel message" />
          </div>
          <div className="form-field">
            <label htmlFor="ab-split">A/B Split</label>
            <input id="ab-split" name="ab-split" type="number" min={0} max={100} defaultValue={50} />
          </div>
          <div className="form-field">
            <label htmlFor="throttle">Throttling guardrail</label>
            <input id="throttle" name="throttle" placeholder="Pause if inventory cover < 7 days" />
          </div>
          <div className="form-actions">
            <button type="submit" className="button-primary">
              Launch promotion
            </button>
            <button type="button" className="button-secondary">
              Preview
            </button>
          </div>
        </form>
      </div>

      <BarChart
        title="Sales trends"
        description="Week-over-week merchandise revenue performance."
        series={salesTrends.map((point) => ({ label: point.label, value: point.value }))}
        palette={["#E45A3F", "#F59E0B", "#3C66F5"]}
      />

      <div className="card col-4" role="region" aria-labelledby="automation-commerce">
        <div className="card__header">
          <h2 id="automation-commerce" className="card__title">
            Automation orchestration
          </h2>
        </div>
        <ul className="card-list">
          <li>Abandoned cart series <span className="status-chip" data-tone="warning">AOV tiered</span></li>
          <li>Inventory auto-replenish <span className="status-chip" data-tone="info">12 SKUs queued</span></li>
          <li>VIP delight <span className="status-chip" data-tone="success">Active</span></li>
        </ul>
      </div>

      <div className="card col-4" role="region" aria-labelledby="operational-health">
        <div className="card__header">
          <h2 id="operational-health" className="card__title">
            Operational health
          </h2>
        </div>
        <ul className="card-list">
          {operationsHealth.map(([label, value, tone]) => (
            <li key={label}>
              {label} <span className="status-chip" data-tone={tone}>{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card col-4">
        <AutomationBuilder
          name="commerce"
          defaults={{
            trigger: 'Inventory days of cover below 6 for top 100 SKUs',
            conditions: 'Skip if PO already in-flight, throttle by supplier capacity.',
            actions: 'Create PO in ERP → Notify planner → Pause paid campaigns for impacted SKUs',
            cadence: 'Check every hour during business days.'
          }}
        />
      </div>
    </div>
  );
}
