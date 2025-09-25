import { corporateKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';

const funnelStages = [
  { label: 'Visitors', value: 1820000 },
  { label: 'Marketing qualified', value: 126000 },
  { label: 'Sales qualified', value: 48200 },
  { label: 'Opportunities', value: 12840 },
  { label: 'Closed won', value: 4620 }
];

const executiveInsights = [
  { statement: 'Performance max campaigns driving 34% of SQLs', tags: ['Acquisition', 'Paid'] },
  { statement: 'Sales cycle compressing 3.5 days after MEDDIC training rollout', tags: ['Enablement'] },
  { statement: 'Attribution guardrails paused 4 underperforming creatives', tags: ['Efficiency'] }
];

const leadMix = [
  { label: 'Organic', value: 34 },
  { label: 'Paid social', value: 22 },
  { label: 'Paid search', value: 18 },
  { label: 'Events', value: 12 },
  { label: 'Partners', value: 9 },
  { label: 'Other', value: 5 }
];

export function CorporateAnalyticsModule() {
  const kpis = useLiveKpis(corporateKpis);
  const salesCycle = generateTimeSeries(10, 46, 0.08);

  return (
    <div className="dashboard-grid" data-accent="corporate">
      <section className="kpi-band" aria-label="Corporate analytics KPIs">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <LineChart
        title="Conversion funnel"
        description="Visitors to closed won by stage with accessible breakdown."
        series={funnelStages.map((stage, index) => ({ label: stage.label, value: stage.value * Math.pow(0.82, index) }))}
        tone="vertical"
        verticalAccent="var(--vertical-corporate)"
      />

      <BarChart
        title="Lead source mix"
        description="Share of SQLs across major channels."
        series={leadMix.map((item) => ({ label: item.label, value: item.value }))}
        palette={["#6E59D9", "#3C66F5", "#22D3EE", "#F59E0B", "#34D399", "#64748B"]}
      />

      <div className="card col-4" role="region" aria-labelledby="executive-insights">
        <div className="card__header">
          <h2 id="executive-insights" className="card__title">
            Executive insights
          </h2>
        </div>
        <ul className="card-list">
          {executiveInsights.map((insight) => (
            <li key={insight.statement}>
              <p className="card__subtitle">{insight.statement}</p>
              <div className="chart-legend">
                {insight.tags.map((tag) => (
                  <span key={tag} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card col-4" role="region" aria-labelledby="modeling">
        <div className="card__header">
          <h2 id="modeling" className="card__title">
            Modeling assumptions
          </h2>
        </div>
        <ul className="card-list">
          <li>Multi-touch attribution blending rule-based and Shapley data-driven share.</li>
          <li>Predictive lead scoring uses intent + firmographic fit with on-demand recalibration.</li>
          <li>All outputs cached with lineage; downloadable CSV/JSON for audit.</li>
        </ul>
      </div>

      <div className="card col-4" role="region" aria-labelledby="automation-corporate">
        <div className="card__header">
          <h2 id="automation-corporate" className="card__title">
            Automations
          </h2>
        </div>
        <ul className="card-list">
          <li>Intent surge → ABM bump <span className="status-chip" data-tone="info">Live</span></li>
          <li>Lifecycle SLA timers <span className="status-chip" data-tone="warning">2 at risk</span></li>
          <li>Attribution guardrails <span className="status-chip" data-tone="success">Healthy</span></li>
        </ul>
      </div>

      <div className="card col-6">
        <AutomationBuilder
          name="corporate"
          defaults={{
            trigger: 'Predictive score exceeds 82 with high intent signals',
            conditions: 'Ensure SDR coverage within 2 hours; block duplicates.',
            actions: 'Auto-route to SDR → Book meeting via Calendly → Notify AE in Slack',
            cadence: 'Immediate with 2 follow-up nudges at 4h and 24h.'
          }}
        />
      </div>

      <div className="col-6">
        <LineChart
          title="Sales cycle velocity"
          description="Average days to close for the past 10 cohorts."
          series={salesCycle}
          tone="vertical"
          verticalAccent="var(--vertical-corporate)"
        />
      </div>
    </div>
  );
}
