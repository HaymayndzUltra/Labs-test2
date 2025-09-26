import { useMemo } from 'react';
import { corporateKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const leadSegments = [
  { label: 'Organic', value: 36 },
  { label: 'Paid social', value: 22 },
  { label: 'Paid search', value: 18 },
  { label: 'Field events', value: 12 },
  { label: 'Partners', value: 8 },
  { label: 'Other', value: 4 }
];

const channelPerformance = [
  { channel: 'Paid search', sqls: 1840, pipeline: 1250000, winRate: 0.184 },
  { channel: 'Paid social', sqls: 1620, pipeline: 940000, winRate: 0.142 },
  { channel: 'Organic', sqls: 1485, pipeline: 720000, winRate: 0.126 },
  { channel: 'Webinars', sqls: 980, pipeline: 480000, winRate: 0.156 },
  { channel: 'Partners', sqls: 860, pipeline: 520000, winRate: 0.172 },
  { channel: 'Events', sqls: 640, pipeline: 420000, winRate: 0.131 }
];

const segmentHighlights = [
  { segment: 'Enterprise ABM pods', impact: '+14% SQL-to-opportunity', owners: '3 pods' },
  { segment: 'Mid-market nurtures', impact: '+9% reply lift', owners: 'Sequenced' },
  { segment: 'PLG self-serve', impact: '7.2k activations', owners: 'Usage monitor' },
  { segment: 'Partner sourced', impact: '18 co-sell deals', owners: 'AE council' },
  { segment: 'LATAM roll-out', impact: '32% growth QoQ', owners: 'Localized' }
];

const executiveInsights = [
  {
    statement: 'Performance Max now contributes 34% of qualified pipeline with ROAS guardrails at 4.6x.',
    tags: ['Acquisition', 'Paid']
  },
  {
    statement: 'Lead velocity up 11% after lifecycle SLA automation across SDR shifts.',
    tags: ['Pipeline health']
  },
  {
    statement: 'Creative audit paused 6 underperforming ads, reallocating spend to proven assets.',
    tags: ['Efficiency']
  }
];

const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2
});

export function CorporateAnalyticsModule() {
  const kpis = useLiveKpis(corporateKpis);
  const kpiTrends = useMemo(
    () => corporateKpis.map((kpi) => generateTimeSeries(24, kpi.value, 0.06).map((point) => point.value)),
    []
  );
  const conversionPerformance = useMemo(() => generateTimeSeries(12, 64, 0.12), []);

  return (
    <section aria-labelledby="growth-marketing-title" className="module-layout" data-accent="corporate">
      <h2 id="growth-marketing-title" className="visually-hidden">
        Growth marketing and pipeline analytics
      </h2>
      <section className="kpi-band" aria-label="Growth marketing KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-corporate)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <LineChart
            className="span-4"
            title="Conversion campaigns"
            description="Weekly conversion rate across paid and lifecycle orchestrations."
            series={conversionPerformance}
            tone="vertical"
            verticalAccent="var(--vertical-corporate)"
          />

          <DonutChart
            className="span-4"
            title="Lead segments mix"
            description="Share of qualified pipeline by originating segment."
            series={leadSegments.map((segment) => ({ label: segment.label, value: segment.value }))}
            palette={["#6E59D9", "#3C66F5", "#22D3EE", "#F59E0B", "#34D399", "#64748B"]}
          />

          <div className="card card--240 span-4" role="region" aria-labelledby="channel-performance-title">
            <div className="card__header">
              <h3 id="channel-performance-title" className="card__title">
                Channel performance
              </h3>
            </div>
            <DataTable
              columns={["Channel", "SQLs", "Pipeline", "Win rate"]}
              rows={channelPerformance.slice(0, 5).map((row) => [
                row.channel,
                numberFormatter.format(row.sqls),
                `$${numberFormatter.format(row.pipeline)}`,
                `${(row.winRate * 100).toFixed(1)}%`
              ])}
              numericColumns={[1, 2, 3]}
              footer={[`View all channels`, '', '', '→']}
            />
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="segment-impact-title">
            <div className="card__header">
              <h3 id="segment-impact-title" className="card__title">
                Segment impact
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {segmentHighlights.map((item) => (
                <li key={item.segment}>
                  <div>
                    <p className="automation-list__title">{item.segment}</p>
                    <span className="automation-list__meta">{item.impact}</span>
                  </div>
                  <span className="automation-delta">{item.owners}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="executive-insights-title">
            <div className="card__header">
              <h3 id="executive-insights-title" className="card__title">
                Executive insights
              </h3>
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
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Launch multi-touch journeys when revenue intelligence flags conversion opportunities.',
              trigger: 'Intent surge + account scoring ≥ 82 for 48h',
              conditions: 'Exclude open opportunities within 7 days and do-not-contact list.',
              actions:
                'Create AE workqueue → personalize Outreach sequence → push campaign brief to paid media team.',
              metrics: [
                { label: 'SQL target', value: '+480' },
                { label: 'SLA', value: '< 2h handoff' }
              ]
            }}
            backlog={{
              items: [
                { title: 'Lifecycle renewal triggers', status: 'QA ready', tone: 'info' },
                { title: 'Partner sourced re-engagement', status: 'Scoping', tone: 'warning' },
                { title: 'Paid social budget guardrails', status: 'Spec drafted', tone: 'success' }
              ],
              footer: 'Updated 12 minutes ago'
            }}
            efficiency={{
              items: [
                { title: 'Inbound fast lane routing', impact: 'CSAT 4.8 • 36 min response', delta: '+22% throughput' },
                { title: 'Dynamic creative testing', impact: 'Creative swaps every 72h', delta: '−18% CPA' }
              ]
            }}
          />
        </aside>
      </div>
    </section>
  );
}
