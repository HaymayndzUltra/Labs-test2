import { contentMediaKpisExtended } from './moduleKpis';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { LineChart } from '../components/charts/LineChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';

const topStories = [
  ['AI in 2024', 'Video', '7 days', '142', 'Published'],
  ['Climate pulse', 'Podcast', '14 days', '98', 'In review'],
  ['Retail revival', 'Article', '30 days', '86', 'Ready'],
  ['Creator economics', 'Livestream', '3 days', '112', 'Blocked']
];

const publishingQueue = [
  { title: 'Emerging markets briefing', status: 'ready' },
  { title: 'Sports weekly digest', status: 'in-review' },
  { title: 'Highlights generator beta', status: 'blocked' }
];

export function ContentMediaModule() {
  const kpis = useLiveKpis(contentMediaKpisExtended);
  const engagementTrend = kpis.map((kpi, index) => ({ label: kpi.label, value: kpi.value * (1 + index * 0.02) }));

  return (
    <div className="dashboard-grid" data-accent="media">
      <section className="kpi-band" aria-label="Content engagement KPIs">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <LineChart
        title="Engagement trend"
        description="Watch time and reads momentum with markers for campaign spikes."
        series={engagementTrend}
        tone="vertical"
        verticalAccent="var(--vertical-media)"
      />

      <div className="card col-6" role="region" aria-labelledby="top-stories">
        <div className="card__header">
          <h2 id="top-stories" className="card__title">
            Top performing stories
          </h2>
        </div>
        <DataTable columns={['Title', 'Format', 'Window', 'Engagement', 'Status']} rows={topStories} />
      </div>

      <div className="card col-6" role="region" aria-labelledby="publishing-queue">
        <div className="card__header">
          <h2 id="publishing-queue" className="card__title">
            Publishing queue
          </h2>
        </div>
        <ul className="card-list">
          {publishingQueue.map((item) => (
            <li key={item.title}>
              {item.title}
              <span className="status-chip" data-tone={statusTone(item.status)}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card col-6" role="region" aria-labelledby="media-automations">
        <div className="card__header">
          <h2 id="media-automations" className="card__title">
            Automation orchestration
          </h2>
        </div>
        <ul className="card-list">
          <li>Editorial control tower <span className="status-chip" data-tone="success">Live</span></li>
          <li>Semantic auto-tagging <span className="status-chip" data-tone="warning">Training</span></li>
          <li>Highlight reel generator <span className="status-chip" data-tone="info">Queued</span></li>
        </ul>
      </div>

      <div className="card col-6">
        <AutomationBuilder
          name="media"
          defaults={{
            trigger: 'Content hits engagement score < 60 or compliance risk flagged',
            conditions: 'Respect embargo windows and rights management.',
            actions: 'Auto-tag → Route to editor → Generate highlight reel → Publish to channels',
            cadence: 'Check every 30 minutes with on-demand rerun.'
          }}
        />
      </div>
    </div>
  );
}

function statusTone(status: string) {
  switch (status) {
    case 'ready':
      return 'success';
    case 'in-review':
      return 'info';
    case 'blocked':
      return 'danger';
    default:
      return 'info';
  }
}
