import { useMemo } from 'react';
import { contentMediaKpisExtended } from './moduleKpis';
import { generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { LineChart } from '../components/charts/LineChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const topStories = [
  { title: 'AI in 2024', format: 'Video', window: '7 days', engagement: 142000, status: 'Published' },
  { title: 'Climate pulse', format: 'Podcast', window: '14 days', engagement: 98000, status: 'In review' },
  { title: 'Retail revival', format: 'Article', window: '30 days', engagement: 86000, status: 'Ready' },
  { title: 'Creator economics', format: 'Livestream', window: '3 days', engagement: 112000, status: 'Blocked' },
  { title: 'Game day insights', format: 'Shorts', window: '7 days', engagement: 76000, status: 'Queued' }
];

const publishingQueue = [
  { title: 'Emerging markets briefing', owner: 'Editorial', due: 'Today' },
  { title: 'Sports weekly digest', owner: 'Studios', due: 'Tomorrow' },
  { title: 'Highlights generator beta', owner: 'Labs', due: 'Friday' },
  { title: 'Festival takeover', owner: 'LiveOps', due: 'Monday' }
];

const highlightsApprovals = [
  { title: 'Rights clearance: World Cup clips', status: 'Legal review', tone: 'warning' },
  { title: 'Localization sprint: APAC', status: 'Approved', tone: 'success' },
  { title: 'Brand partnership: Summit', status: 'Assets pending', tone: 'info' },
  { title: 'Accessibility captions', status: 'Scheduled', tone: 'success' }
];

export function ContentMediaModule() {
  const kpis = useLiveKpis(contentMediaKpisExtended);
  const kpiTrends = useMemo(
    () => contentMediaKpisExtended.map((kpi) => generateTimeSeries(24, kpi.value, 0.09).map((point) => point.value)),
    []
  );
  const engagementTrend = useMemo(() => generateTimeSeries(16, 72, 0.15), []);
  const formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  return (
    <section aria-labelledby="content-media-title" className="module-layout" data-accent="media">
      <h2 id="content-media-title" className="visually-hidden">
        Content and media
      </h2>
      <section className="kpi-band" aria-label="Content engagement KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-media)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <LineChart
            className="span-4"
            title="Engagement trend"
            description="Rolling engagement index across video, audio, and written formats."
            series={engagementTrend}
            tone="vertical"
            verticalAccent="var(--vertical-media)"
          />

          <div className="card card--240 span-4" role="region" aria-labelledby="top-stories-title">
            <div className="card__header">
              <h3 id="top-stories-title" className="card__title">
                Top performing stories
              </h3>
            </div>
            <DataTable
              columns={["Title", "Format", "Window", "Engagement", "Status"]}
              rows={topStories.map((story) => [
                story.title,
                story.format,
                story.window,
                formatter.format(story.engagement),
                story.status
              ])}
              numericColumns={[3]}
              footer={[`View all stories`, '', '', '', '→']}
            />
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="publishing-queue-title">
            <div className="card__header">
              <h3 id="publishing-queue-title" className="card__title">
                Publishing queue
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {publishingQueue.map((item) => (
                <li key={item.title}>
                  <div>
                    <p className="automation-list__title">{item.title}</p>
                    <span className="automation-list__meta">{item.owner}</span>
                  </div>
                  <span className="automation-delta">Due {item.due}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="approvals-title">
            <div className="card__header">
              <h3 id="approvals-title" className="card__title">
                Highlights & approvals
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {highlightsApprovals.map((item) => (
                <li key={item.title}>
                  <div>
                    <p className="automation-list__title">{item.title}</p>
                    <span className="automation-list__meta">{item.status}</span>
                  </div>
                  <span className="status-chip" data-tone={item.tone}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Automate packaging, rights, and amplification workflows for every release.',
              trigger: 'Content score dips < 60 or major release scheduled',
              conditions: 'Check embargo windows and territory rights before launch.',
              actions: 'Alert channel owners → spin up highlight reel → push captions & metadata updates.',
              metrics: [
                { label: 'Launch SLA', value: '< 45 min' },
                { label: 'Rights cleared', value: '98%' }
              ]
            }}
            backlog={{
              items: [
                { title: 'Podcast chapter markers', status: 'Ready for QA', tone: 'success' },
                { title: 'Dynamic promo swaps', status: 'Briefing', tone: 'info' },
                { title: 'Archive digitization', status: 'Resourcing', tone: 'warning' }
              ],
              footer: 'Editorial sync in 25 minutes'
            }}
            efficiency={{
              items: [
                { title: 'Smart clip selection', impact: 'Cuts editing by 3 hrs', delta: '↑ 24% watch time' },
                { title: 'Auto-caption rollout', impact: 'Accessibility compliance 100%', delta: '↓ 18% manual QA' }
              ]
            }}
          />
        </aside>
      </div>
    </section>
  );
}
