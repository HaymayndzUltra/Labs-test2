import { useMemo } from 'react';
import { customAppKpis } from './moduleKpis';
import { generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { AreaChart } from '../components/charts/AreaChart';
import { BarChart } from '../components/charts/BarChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const kanbanSnapshot = [
  { lane: 'Backlog', cards: 22, sla: '72%' },
  { lane: 'In progress', cards: 14, sla: '88%' },
  { lane: 'Review', cards: 7, sla: '94%' },
  { lane: 'Ready to launch', cards: 11, sla: '91%' }
];

const quickstartAutomations = [
  { label: 'Cycle close rituals', value: 62 },
  { label: 'Incident postmortems', value: 48 },
  { label: 'Intake triage', value: 44 },
  { label: 'Stakeholder updates', value: 38 }
];

const backlogItems = [
  { title: 'Self-healing workflows', status: 'Design sync', tone: 'info' },
  { title: 'Release readiness scorecard', status: 'Blocked: data feed', tone: 'warning' },
  { title: 'Ops handbook automation', status: 'In build', tone: 'success' }
];

const efficiencyHighlights = [
  { title: 'Ritual templates', impact: '45 min saved per sprint review', delta: '↑ 18% adoption' },
  { title: 'AI update digest', impact: 'Cuts stand-up time by 6 min', delta: '↓ 22% context switching' }
];

export function CustomAppModule() {
  const kpis = useLiveKpis(customAppKpis);
  const kpiTrends = useMemo(
    () => customAppKpis.map((kpi) => generateTimeSeries(20, kpi.value, 0.08).map((point) => point.value)),
    []
  );
  const usageSeries = useMemo(() => generateTimeSeries(12, 420, 0.1), []);
  const automationSeries = useMemo(
    () => quickstartAutomations.map((item) => ({ label: item.label, value: item.value })),
    []
  );

  return (
    <section aria-labelledby="productivity-suite-title" className="module-layout" data-accent="custom">
      <h2 id="productivity-suite-title" className="visually-hidden">
        Productivity suite and automation
      </h2>
      <section className="kpi-band" aria-label="Productivity suite KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-custom)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <div className="card card--240 span-4" role="region" aria-labelledby="kanban-summary-title">
            <div className="card__header">
              <h3 id="kanban-summary-title" className="card__title">
                Kanban summary board
              </h3>
            </div>
            <DataTable
              columns={["Lane", "Active cards", "SLA hit"]}
              rows={kanbanSnapshot.map((lane) => [lane.lane, lane.cards, lane.sla])}
              numericColumns={[1, 2]}
            />
          </div>

          <AreaChart
            className="span-4"
            title="Usage tracking metrics"
            description="Active rituals completed each week across the workspace."
            series={usageSeries}
            gradientId="usage-trend"
            verticalAccent="var(--vertical-custom)"
          />

          <BarChart
            className="span-4"
            title="Quickstart automations"
            description="Most launched playbooks from the automation library."
            series={automationSeries}
            palette={["#409C8C", "#3C66F5", "#F59E0B", "#6E59D9"]}
          />

          <div className="card card--240 span-4" role="region" aria-labelledby="ops-backlog-title">
            <div className="card__header">
              <h3 id="ops-backlog-title" className="card__title">
                Ops backlog
              </h3>
            </div>
            <DataTable
              columns={["Workstream", "Owner", "Status"]}
              rows={[
                ['Incident retros', 'SRE pod', 'Rolling out'],
                ['Release QA automation', 'Quality guild', 'Final review'],
                ['HubSpot sync', 'Platform team', 'Testing'],
                ['Knowledge base curator', 'Operations', 'Prioritized'],
                ['Compliance cadence', 'Program office', 'In scoping']
              ]}
              footer={[`View all backlog items`, '', '→']}
            />
          </div>
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Templatize recurring workflows to protect focus time across product operations.',
              trigger: 'Cycle milestone reached or task idle > 48h',
              conditions: 'Skip when launch freeze active; respect regional blackout dates.',
              actions: 'Assign playbook owner → sync with stand-up notes → notify channel stakeholders.',
              metrics: [
                { label: 'Coverage', value: '68%' },
                { label: 'Time saved', value: '12.4h/wk' }
              ]
            }}
            backlog={{
              items: backlogItems,
              footer: 'Next triage Thursday 09:00 PT'
            }}
            efficiency={{
              items: efficiencyHighlights
            }}
          />
        </aside>
      </div>
    </section>
  );
}
