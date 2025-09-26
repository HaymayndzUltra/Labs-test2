import { useMemo } from 'react';
import { specializedKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { AreaChart } from '../components/charts/AreaChart';
import { LineChart } from '../components/charts/LineChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const marketSignals = generateTimeSeries(12, 94, 0.08);
const spendBudgetSeries = generateTimeSeries(12, 88, 0.05);

const healthcareOpportunities = [
  { region: 'Northeast network', programs: 18, openings: 42, conversion: 0.31 },
  { region: 'Midwest clinics', programs: 12, openings: 28, conversion: 0.27 },
  { region: 'West coast hospitals', programs: 15, openings: 36, conversion: 0.34 },
  { region: 'Southeast specialists', programs: 10, openings: 24, conversion: 0.29 },
  { region: 'Telehealth growth', programs: 8, openings: 22, conversion: 0.26 }
];

const industrySignals = [
  { headline: 'Logistics AI adoption up 18% QoQ', tag: 'Supply chain' },
  { headline: 'Healthcare payers investing in remote monitoring pilots', tag: 'Healthcare' },
  { headline: 'Manufacturing carbon reporting mandates expand to SMEs', tag: 'Regulation' },
  { headline: 'Hospitality sees 12% staffing rebound with automation', tag: 'Hospitality' }
];

const formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export function SpecializedNichesModule() {
  const initialKpis = useMemo(
    () => [
      ...specializedKpis.realEstate.slice(0, 2).map((kpi) => ({ ...kpi })),
      { ...specializedKpis.finance[0] },
      { ...specializedKpis.healthcare[0] },
      { ...specializedKpis.healthcare[1] }
    ],
    []
  );
  const kpis = useLiveKpis(initialKpis);
  const kpiTrends = useMemo(
    () => initialKpis.map((kpi) => generateTimeSeries(18, kpi.value, 0.07).map((point) => point.value)),
    [initialKpis]
  );

  return (
    <section aria-labelledby="specialized-title" className="module-layout" data-accent="specialized">
      <h2 id="specialized-title" className="visually-hidden">
        Specialized niches
      </h2>
      <section className="kpi-band" aria-label="Specialized KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-specialized)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <AreaChart
            className="span-4"
            title="Market movements"
            description="Composite index tracking momentum across specialty verticals."
            series={marketSignals}
            gradientId="market-movements"
            verticalAccent="var(--vertical-specialized)"
          />

          <LineChart
            className="span-4"
            title="Spend vs budget"
            description="Rolling view of program spend against allocated budget."
            series={spendBudgetSeries}
            tone="vertical"
            verticalAccent="var(--vertical-specialized)"
          />

          <div className="card card--240 span-4" role="region" aria-labelledby="healthcare-opportunities-title">
            <div className="card__header">
              <h3 id="healthcare-opportunities-title" className="card__title">
                Healthcare opportunities
              </h3>
            </div>
            <DataTable
              columns={["Region", "Programs", "Open roles", "Conversion"]}
              rows={healthcareOpportunities.map((row) => [
                row.region,
                row.programs,
                formatter.format(row.openings),
                `${(row.conversion * 100).toFixed(1)}%`
              ])}
              numericColumns={[1, 2, 3]}
              footer={[`View all opportunities`, '', '', '→']}
            />
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="industry-signals-title">
            <div className="card__header">
              <h3 id="industry-signals-title" className="card__title">
                Industry signals
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {industrySignals.map((signal) => (
                <li key={signal.headline}>
                  <div>
                    <p className="automation-list__title">{signal.headline}</p>
                    <span className="automation-list__meta">{signal.tag}</span>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="automation-footer">View all insights</footer>
          </div>
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Orchestrate specialized playbooks for real estate, finance, and healthcare teams.',
              trigger: 'Deal velocity shifts ±15% or compliance updates published',
              conditions: 'Respect regional regulations and active NDAs.',
              actions: 'Alert sector lead → refresh enablement kit → sync campaign workflows.',
              metrics: [
                { label: 'Pipeline coverage', value: '4.3x' },
                { label: 'Compliance SLA', value: '100%' }
              ]
            }}
            backlog={{
              items: [
                { title: 'New market entry playbook', status: 'Drafting', tone: 'info' },
                { title: 'Healthcare credential checks', status: 'QA ready', tone: 'success' },
                { title: 'Portfolio churn watch', status: 'Awaiting data', tone: 'warning' }
              ],
              footer: 'Next sync Wednesday 11:00 ET'
            }}
            efficiency={{
              items: [
                { title: 'Underwriting automation', impact: 'Cuts review cycle by 3 days', delta: '↑ 12% approval rate' },
                { title: 'Care pathway routing', impact: 'Reduces patient wait time', delta: '−18% drop-offs' }
              ]
            }}
          />
        </aside>
      </div>
    </section>
  );
}
