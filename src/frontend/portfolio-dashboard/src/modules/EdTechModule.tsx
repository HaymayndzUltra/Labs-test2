import { useMemo } from 'react';
import { edTechKpisExtended } from './moduleKpis';
import { generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { DataTable } from '../components/primitives/DataTable';
import { BarChart } from '../components/charts/BarChart';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const coursePerformance = [
  { course: 'Intro to Analytics', enrollment: 1240, completion: 0.82, score: 88 },
  { course: 'Cloud Security', enrollment: 980, completion: 0.74, score: 92 },
  { course: 'Product Ops', enrollment: 860, completion: 0.68, score: 84 },
  { course: 'Design Systems', enrollment: 720, completion: 0.86, score: 90 },
  { course: 'AI Ethics Lab', enrollment: 540, completion: 0.71, score: 87 }
];

const activityHeatmap = [
  { label: 'Mon', value: 82 },
  { label: 'Tue', value: 96 },
  { label: 'Wed', value: 74 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 64 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 36 }
];

const alerts = [
  'Mentor bandwidth at 92% utilization—activate reserve pool.',
  'Accessibility compliance report due for March cohort.',
  'Live sessions hitting 98% capacity—consider overflow room.'
];

const successHighlights = [
  { label: 'Career placements', value: '78%', detail: '+6 pts QoQ' },
  { label: 'Adaptive practice', value: '12.6k', detail: 'sessions completed' },
  { label: 'At-risk interventions', value: '342', detail: 'coaches dispatched' }
];

const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1
});

export function EdTechModule() {
  const kpis = useLiveKpis(edTechKpisExtended);
  const kpiTrends = useMemo(
    () => edTechKpisExtended.map((kpi) => generateTimeSeries(20, kpi.value, 0.05).map((point) => point.value)),
    []
  );

  return (
    <section aria-labelledby="edtech-title" className="module-layout" data-accent="edtech">
      <h2 id="edtech-title" className="visually-hidden">
        EdTech learning analytics
      </h2>
      <section className="kpi-band" aria-label="Learning KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-edtech)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <div className="card card--240 span-4" role="region" aria-labelledby="course-performance-title">
            <div className="card__header">
              <h3 id="course-performance-title" className="card__title">
                Course performance
              </h3>
            </div>
            <DataTable
              columns={["Course", "Enrollment", "Completion", "Avg score"]}
              rows={coursePerformance.map((course) => [
                course.course,
                numberFormatter.format(course.enrollment),
                `${(course.completion * 100).toFixed(1)}%`,
                course.score
              ])}
              numericColumns={[1, 2, 3]}
              footer={[`View all programs`, '', '', '→']}
            />
          </div>

          <BarChart
            className="span-4"
            title="Student activity heatmap"
            description="Relative engagement intensity throughout the week."
            series={activityHeatmap}
            palette={["#6F4CBB", "#3C66F5", "#22D3EE", "#34D399", "#F59E0B"]}
          />

          <div className="card card--240 span-4" role="region" aria-labelledby="alerts-title">
            <div className="card__header">
              <h3 id="alerts-title" className="card__title">
                Alerts
              </h3>
            </div>
            <ul className="card-list">
              {alerts.map((alert) => (
                <li key={alert} className="card__subtitle">
                  {alert}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="success-title">
            <div className="card__header">
              <h3 id="success-title" className="card__title">
                Student success uplift
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {successHighlights.map((item) => (
                <li key={item.label}>
                  <div>
                    <p className="automation-list__title">{item.label}</p>
                    <span className="automation-list__meta">{item.detail}</span>
                  </div>
                  <span className="automation-delta">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Keep learners on track with adaptive nudges and mentor workflows.',
              trigger: 'Engagement dip > 20% or assessment mastery < 70%',
              conditions: 'Exclude recent outreach and respect quiet hours.',
              actions: 'Notify mentor → deliver adaptive practice set → schedule check-in reminder.',
              metrics: [
                { label: 'Retention lift', value: '+9 pts' },
                { label: 'Mentor response', value: '< 4h' }
              ]
            }}
            backlog={{
              items: [
                { title: 'Skills gap radar', status: 'Drafting', tone: 'info' },
                { title: 'Career services nudges', status: 'Blocked: data sync', tone: 'warning' },
                { title: 'Feedback sentiment scoring', status: 'QA ready', tone: 'success' }
              ],
              footer: 'Review cadence every Monday'
            }}
            efficiency={{
              items: [
                { title: 'Mentor pairing automation', impact: 'Improves match quality score', delta: '+12% NPS' },
                { title: 'Adaptive practice generator', impact: 'Reduces manual prep', delta: '−3h/week per coach' }
              ]
            }}
          />
        </aside>
      </div>
    </section>
  );
}
