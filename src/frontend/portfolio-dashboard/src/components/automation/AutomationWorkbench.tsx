import { clsx } from 'clsx';

interface BuilderMetrics {
  label: string;
  value: string;
}

interface AutomationBuilderSection {
  summary: string;
  trigger: string;
  conditions: string;
  actions: string;
  metrics?: BuilderMetrics[];
  ctaLabel?: string;
}

interface BacklogItem {
  title: string;
  status: string;
  tone?: 'success' | 'warning' | 'info' | 'danger';
  owner?: string;
}

interface AutomationBacklogSection {
  items: BacklogItem[];
  footer?: string;
}

interface EfficiencyItem {
  title: string;
  impact: string;
  delta?: string;
}

interface EfficiencySection {
  items: EfficiencyItem[];
}

interface AutomationWorkbenchProps {
  builder: AutomationBuilderSection;
  backlog: AutomationBacklogSection;
  efficiency: EfficiencySection;
}

export function AutomationWorkbench({ builder, backlog, efficiency }: AutomationWorkbenchProps) {
  return (
    <aside className="automation-workbench" aria-label="Automation workbench">
      <section className={clsx('card', 'card--240', 'automation-card')} aria-labelledby="automation-builder">
        <div className="card__header">
          <div>
            <h2 id="automation-builder" className="card__title">
              Automation builder
            </h2>
            <p className="card__subtitle">{builder.summary}</p>
          </div>
        </div>
        <dl className="automation-builder__grid">
          <div>
            <dt>Trigger</dt>
            <dd>{builder.trigger}</dd>
          </div>
          <div>
            <dt>Conditions</dt>
            <dd>{builder.conditions}</dd>
          </div>
          <div>
            <dt>Actions</dt>
            <dd>{builder.actions}</dd>
          </div>
        </dl>
        {builder.metrics && (
          <div className="automation-metrics" role="group" aria-label="Key guardrails">
            {builder.metrics.map((metric) => (
              <span key={metric.label} className="automation-metric">
                <strong>{metric.value}</strong>
                {metric.label}
              </span>
            ))}
          </div>
        )}
        <button type="button" className="button-primary">
          {builder.ctaLabel ?? 'Launch'}
        </button>
      </section>

      <section className={clsx('card', 'card--240', 'automation-card')} aria-labelledby="automation-backlog">
        <div className="card__header">
          <div>
            <h2 id="automation-backlog" className="card__title">
              Automation backlog
            </h2>
            <p className="card__subtitle">Signals queued for build-or-buy decisions.</p>
          </div>
        </div>
        <ul className="automation-list">
          {backlog.items.map((item) => (
            <li key={item.title}>
              <div>
                <p className="automation-list__title">{item.title}</p>
                {item.owner && <span className="automation-list__meta">Owner: {item.owner}</span>}
              </div>
              <span className="status-chip" data-tone={item.tone}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
        {backlog.footer && <footer className="automation-footer">{backlog.footer}</footer>}
      </section>

      <section className={clsx('card', 'card--240', 'automation-card')} aria-labelledby="automation-efficiency">
        <div className="card__header">
          <div>
            <h2 id="automation-efficiency" className="card__title">
              Efficiency showcases
            </h2>
            <p className="card__subtitle">Highlights from recently launched automations.</p>
          </div>
        </div>
        <ul className="automation-list automation-list--stacked">
          {efficiency.items.map((item) => (
            <li key={item.title}>
              <div>
                <p className="automation-list__title">{item.title}</p>
                <span className="automation-list__meta">{item.impact}</span>
              </div>
              {item.delta && <span className="automation-delta">{item.delta}</span>}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
