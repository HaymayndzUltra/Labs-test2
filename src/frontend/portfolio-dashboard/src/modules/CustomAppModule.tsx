import { customAppKpis } from './moduleKpis';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';

const lanes = [
  { name: 'Backlog', count: 18 },
  { name: 'In progress', count: 12 },
  { name: 'Review', count: 6 },
  { name: 'Done', count: 22 }
];

const ideas = [
  'Shared automations library with role permissions',
  'AI summary on completed rituals',
  'Dependency graph export',
  'API triggered board snapshots'
];

const workload = [
  { label: 'Design', value: 18 },
  { label: 'Engineering', value: 26 },
  { label: 'QA', value: 9 },
  { label: 'Product', value: 14 }
];

export function CustomAppModule() {
  const kpis = useLiveKpis(customAppKpis);

  return (
    <div className="dashboard-grid" data-accent="custom">
      <section className="kpi-band" aria-label="Productivity suite KPIs">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <div className="card col-6" role="region" aria-labelledby="kanban-board">
        <div className="card__header">
          <h2 id="kanban-board" className="card__title">
            Kanban delivery board
          </h2>
        </div>
        <div role="list" aria-label="Kanban lanes" className="card-list">
          {lanes.map((lane) => (
            <div key={lane.name} role="listitem" tabIndex={0} className="card">
              <div className="card__header">
                <h3 className="card__title">{lane.name}</h3>
                <span className="badge">{lane.count} cards</span>
              </div>
              <p className="card__subtitle">
                Keyboard drag and drop supported. Press space to lift, arrows to move, enter to drop.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card col-6" role="region" aria-labelledby="idea-intake">
        <div className="card__header">
          <h2 id="idea-intake" className="card__title">
            Idea backlog intake
          </h2>
        </div>
        <ul className="card-list">
          {ideas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </div>

      <div className="card col-6" role="region" aria-labelledby="workload-distribution">
        <div className="card__header">
          <h2 id="workload-distribution" className="card__title">
            Workload distribution
          </h2>
        </div>
        <ul className="card-list">
          {workload.map((bucket) => (
            <li key={bucket.label}>
              {bucket.label}
              <div className="chart-legend__item">
                <span className="chart-legend__swatch" style={{ background: 'var(--vertical-custom)' }} />
                {bucket.value} active items
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card col-3" role="region" aria-labelledby="automation-custom">
        <div className="card__header">
          <h2 id="automation-custom" className="card__title">
            Automations
          </h2>
        </div>
        <ul className="card-list">
          <li>Sprint rituals <span className="status-chip" data-tone="success">Scheduled</span></li>
          <li>Workload rebalancing <span className="status-chip" data-tone="warning">2 flagged</span></li>
          <li>DevOps hooks <span className="status-chip" data-tone="info">PR sync live</span></li>
        </ul>
      </div>

      <div className="card col-3" role="region" aria-labelledby="recurring-task">
        <div className="card__header">
          <h2 id="recurring-task" className="card__title">
            Create recurring task
          </h2>
        </div>
        <form className="card-list">
          <label htmlFor="task-name">Task</label>
          <input id="task-name" placeholder="Prep sprint review" required />
          <label htmlFor="task-cadence">Cadence</label>
          <select id="task-cadence">
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>
          <label htmlFor="task-owner">Owner</label>
          <input id="task-owner" placeholder="Assign team or role" />
          <div className="form-actions">
            <button type="submit" className="button-primary">
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="card col-6">
        <AutomationBuilder
          name="custom"
          defaults={{
            trigger: 'Stale cards > 5 days in review lane',
            conditions: 'Notify only once per day. Skip if deployment blocked.',
            actions: 'Ping assignee → Add to daily standup agenda → Escalate after 48h',
            cadence: 'Check every 30 minutes via webhook events.'
          }}
        />
      </div>
    </div>
  );
}
