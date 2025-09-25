import { edTechKpisExtended } from './moduleKpis';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';
import { BarChart } from '../components/charts/BarChart';

const programPerformance = [
  ['Intro to Analytics', '1,240', '82%', '88'],
  ['Cloud Security', '980', '74%', '92'],
  ['Product Ops', '860', '68%', '84'],
  ['Design Systems', '720', '86%', '90']
];

const studentActivity = [
  { label: 'Mon', value: 82 },
  { label: 'Tue', value: 96 },
  { label: 'Wed', value: 74 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 64 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 36 }
];

export function EdTechModule() {
  const kpis = useLiveKpis(edTechKpisExtended);

  return (
    <div className="dashboard-grid" data-accent="edtech">
      <section className="kpi-band" aria-label="Learning KPIs">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <div className="card col-6" role="region" aria-labelledby="program-performance">
        <div className="card__header">
          <h2 id="program-performance" className="card__title">
            Program performance
          </h2>
        </div>
        <DataTable columns={['Course', 'Enrollment', 'Completion', 'Avg score']} rows={programPerformance} />
      </div>

      <BarChart
        title="Student activity heatmap"
        description="Relative activity intensity per day with keyboard traversal."
        series={studentActivity}
        palette={["#6F4CBB", "#3C66F5", "#22D3EE", "#34D399", "#F59E0B"]}
      />

      <div className="card col-4" role="region" aria-labelledby="edtech-automations">
        <div className="card__header">
          <h2 id="edtech-automations" className="card__title">
            Automation orchestration
          </h2>
        </div>
        <ul className="card-list">
          <li>Auto certificates <span className="status-chip" data-tone="success">Live</span></li>
          <li>Inactivity nudges <span className="status-chip" data-tone="warning">5 queued</span></li>
          <li>Mentor rotation <span className="status-chip" data-tone="info">Balancing</span></li>
        </ul>
      </div>

      <div className="card col-8">
        <AutomationBuilder
          name="edtech"
          defaults={{
            trigger: 'Learner inactive for 5 days or mastery dip detected',
            conditions: 'Respect FERPA preferences; avoid duplicate nudges.',
            actions: 'Send in-app reminder → Notify mentor → Queue adaptive review set',
            cadence: 'Evaluate daily with weekend catch-up sweeps.'
          }}
        />
      </div>
    </div>
  );
}
