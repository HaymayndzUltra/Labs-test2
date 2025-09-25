import { useMemo } from 'react';
import { saasKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { DonutChart } from '../components/charts/DonutChart';
import { LineChart } from '../components/charts/LineChart';
import { AreaChart } from '../components/charts/AreaChart';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';
import { DataTable } from '../components/primitives/DataTable';

const churnHealth = [
  { label: 'Healthy', value: 68 },
  { label: 'Monitor', value: 22 },
  { label: 'Critical', value: 10 }
];

const subscriptionPlans = [
  ['Scale', '$1,200', '250 seats', '91%', '88%', '6%'],
  ['Growth', '$620', '120 seats', '82%', '76%', '9%'],
  ['Starter', '$240', '40 seats', '67%', '54%', '14%']
];

export function SaaSModule() {
  const liveKpis = useLiveKpis(saasKpis);
  const mrrGrowth = useMemo(() => generateTimeSeries(16, 780, 0.08), []);
  const apiUsage = useMemo(() => generateTimeSeries(16, 72, 0.12), []);

  return (
    <div className="dashboard-grid" data-accent="saas">
      <section className="kpi-band" aria-label="Subscription KPIs">
        {liveKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <div className="card col-8" role="region" aria-labelledby="subscription-plans">
        <div className="card__header">
          <h2 id="subscription-plans" className="card__title">
            Subscription plans
          </h2>
          <p className="card__subtitle">Plan composition, activation health, allocation, and churn risk.</p>
        </div>
        <DataTable
          columns={["Plan", "Price", "Seats", "Activation", "Allocation", "Churn"]}
          rows={subscriptionPlans}
        />
      </div>

      <DonutChart
        title="Churn health"
        description="Breakdown of healthy, monitor, and critical cohorts."
        series={churnHealth}
        palette={["#1C3AB0", "#F59E0B", "#B91C1C"]}
      />

      <LineChart
        title="MRR growth"
        description="Trailing 16-week MRR performance with optimistically updated values."
        series={mrrGrowth}
        tone="vertical"
        verticalAccent="var(--vertical-saas)"
      />

      <AreaChart
        title="API usage saturation"
        description="Normalized usage across major endpoints vs allocation."
        series={apiUsage}
        gradientId="api-usage"
        verticalAccent="var(--vertical-saas)"
      />

      <div className="card col-4" role="region" aria-labelledby="billing-cycle">
        <div className="card__header">
          <h2 id="billing-cycle" className="card__title">
            Billing cycle orchestration
          </h2>
        </div>
        <ul className="card-list">
          <li>Card expiry sweep <span className="status-chip" data-tone="warning">9 expiring</span></li>
          <li>Dunning workflow <span className="status-chip" data-tone="info">Retrying</span></li>
          <li>Monthly close checklist <span className="status-chip" data-tone="success">On track</span></li>
        </ul>
      </div>

      <div className="card col-4" role="region" aria-labelledby="churn-playbook">
        <div className="card__header">
          <h2 id="churn-playbook" className="card__title">
            Churn recovery playbook
          </h2>
        </div>
        <form className="card-list" aria-describedby="churn-guidance">
          <p id="churn-guidance" className="card__subtitle">
            Templates orchestrate multi-channel outreach. Guardrails enforce seat utilization thresholds.
          </p>
          <label htmlFor="template-select">Template</label>
          <select id="template-select">
            <option>Predictive churn outreach</option>
            <option>API regression follow-up</option>
            <option>Seat underuse activation</option>
          </select>
          <label htmlFor="fallback-owner">Fallback owner</label>
          <input id="fallback-owner" type="text" placeholder="Select escalation owner" />
          <label htmlFor="trigger-threshold">Trigger threshold</label>
          <input id="trigger-threshold" type="number" min={0} max={100} placeholder="NRR dip (%)" />
          <label htmlFor="message-preview">Message preview</label>
          <textarea id="message-preview" rows={3} placeholder="Preview localized outreach copy" />
          <div className="form-actions">
            <button type="submit" className="button-primary">
              Launch playbook
            </button>
            <button type="button" className="button-secondary">
              Save draft
            </button>
          </div>
        </form>
      </div>

      <div className="card col-4" role="region" aria-labelledby="automation-panel">
        <div className="card__header">
          <h2 id="automation-panel" className="card__title">
            Automation orchestration
          </h2>
        </div>
        <ul className="card-list">
          <li>Billing reconciliation <span className="status-chip" data-tone="success">Enabled</span></li>
          <li>Churn signals &rarr; CSM task <span className="status-chip" data-tone="warning">Threshold 12%</span></li>
          <li>Burst protection <span className="status-chip" data-tone="info">Monitoring</span></li>
        </ul>
      </div>

      <div className="card col-8">
        <AutomationBuilder
          name="saas"
          defaults={{
            trigger: 'NRR dips below 110% or API usage drops 15% week-over-week',
            conditions: 'Exclude enterprise tier. Confirm payment method healthy.',
            actions: 'Create CSM task → Slack channel ping → Email workspace admin with localized template',
            cadence: 'Immediately. Re-evaluate every 24 hours for 5 days.'
          }}
        />
      </div>
    </div>
  );
}
