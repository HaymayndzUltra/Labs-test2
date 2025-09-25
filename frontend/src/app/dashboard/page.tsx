'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { moduleLabels, moduleThemes, ModuleKey } from '@/lib/designTokens';
import { useThemeControls } from '../providers';

const HEADER_TITLE = 'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches';
const HEADER_GENERATED_AT = '09/26/2025, 4:14:00 AM';

const MODULES: ModuleKey[] = ['saas', 'ecommerce', 'corporate', 'custom-app', 'media', 'edtech', 'specialized'];

const COMPONENT_STATES = ['success', 'loading', 'empty', 'error'] as const;
type ModuleState = (typeof COMPONENT_STATES)[number];

type ExportFormat = 'csv' | 'json';

type AuditLogEntry = {
  id: string;
  module: ModuleKey;
  format: ExportFormat;
  url: string;
  timestamp: string;
  expiresAt: string;
};

type Toast = {
  id: string;
  message: string;
  tone: 'success' | 'error';
};

const nowIso = () => new Date().toISOString();

function createSignedUrl(format: ExportFormat, module: ModuleKey) {
  const signature = Math.random().toString(36).slice(2, 10);
  return `https://storage.premiumdash.app/exports/${module}/${Date.now()}.${format}?sig=${signature}`;
}

function formatTimestamp(date: Date) {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const EMPTY_MESSAGE = 'No records yet. Configure automation or ingest data to populate this view.';

export default function DashboardPage() {
  const { theme, toggleTheme, direction, toggleDirection, reduceMotion, setReduceMotion } = useThemeControls();
  const [activeModule, setActiveModule] = useState<ModuleKey>('saas');
  const [moduleState, setModuleState] = useState<ModuleState>('success');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const moduleDescription = useMemo(() => moduleThemes[activeModule].description, [activeModule]);

  const handleExport = (format: ExportFormat) => {
    const url = createSignedUrl(format, activeModule);
    const timestamp = formatTimestamp(new Date());
    const expiresAt = formatTimestamp(new Date(Date.now() + 1000 * 60 * 60));
    const entry: AuditLogEntry = {
      id: `${nowIso()}-${format}`,
      module: activeModule,
      format,
      url,
      timestamp,
      expiresAt,
    };
    setAuditLog((prev) => [entry, ...prev]);
    setToasts((prev) => [
      ...prev,
      {
        id: entry.id,
        tone: 'success',
        message: `${moduleLabels[activeModule]} ${format.toUpperCase()} export ready. Signed URL expires at ${expiresAt}.`,
      },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="ds-app-frame" role="main" aria-live="polite">
      <header className="ds-header" aria-labelledby="module-header">
        <div>
          <h1 id="module-header" className="ds-header-title">
            {HEADER_TITLE}
          </h1>
          <p className="ds-header-caption">Generated at {HEADER_GENERATED_AT}</p>
        </div>
        <p className="ds-caption ds-readable-line">
          Unified 12-column grid, automation-ready IA, light/dark/RTL parity, and luxury motion choreography deliver a cohesive
          executive-grade command center.
        </p>
      </header>

      <section className="ds-toolbar" aria-label="Global controls">
        <div className="ds-toolbar-group" role="group" aria-label="Theme and direction toggles">
          <button type="button" className="ds-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
            Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
          <button type="button" className="ds-toggle" onClick={toggleDirection} aria-pressed={direction === 'rtl'}>
            Layout: {direction === 'rtl' ? 'RTL' : 'LTR'}
          </button>
          <label className="ds-toggle-switch">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => setReduceMotion(event.target.checked)}
              aria-label="Enable reduced motion"
            />
            <span>Reduce motion</span>
          </label>
        </div>

        <div className="ds-toolbar-group" role="group" aria-label="Export actions">
          <div className="ds-export-actions">
            <button type="button" className="ds-button" onClick={() => handleExport('csv')}>
              Export CSV
            </button>
            <button type="button" className="ds-button secondary" onClick={() => handleExport('json')}>
              Export JSON
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Module picker">
        <nav className="ds-tablist" role="tablist" aria-label="Dashboard modules">
          {MODULES.map((module) => (
            <button
              key={module}
              role="tab"
              id={`tab-${module}`}
              aria-selected={module === activeModule}
              aria-controls={`panel-${module}`}
              className="ds-tab"
              onClick={() => setActiveModule(module)}
              type="button"
            >
              <span aria-hidden="true">{moduleThemes[module].icon}</span> {moduleLabels[module]}
            </button>
          ))}
        </nav>
      </section>

      <section className="ds-inline-controls" aria-label="State controls">
        <span className="ds-caption">View component state:</span>
        <div role="group" aria-label="Component states" className="ds-inline-controls">
          {COMPONENT_STATES.map((state) => (
            <button
              key={state}
              type="button"
              className={`ds-chip${moduleState === state ? ' is-active' : ''}`}
              aria-pressed={moduleState === state}
              onClick={() => setModuleState(state)}
            >
              {state}
            </button>
          ))}
        </div>
      </section>

      <ModuleContent module={activeModule} state={moduleState} moduleDescription={moduleDescription} />

      <section className="ds-card" aria-label="Audit log">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Signed export audit log</h2>
            <p className="ds-card-subtitle">
              Every CSV/JSON export records module, format, signed URL, and expiration for downstream automation.
            </p>
          </div>
        </div>
        {auditLog.length === 0 ? (
          <div className="ds-empty-state" role="status">
            <p>{EMPTY_MESSAGE}</p>
          </div>
        ) : (
          <div className="ds-table-scroll" role="region" aria-live="polite">
            <table className="ds-audit-log-table ds-audit-table" aria-describedby="audit-caption">
              <caption id="audit-caption" className="ds-caption">
                Signed URL exports with one-hour validity windows.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Module</th>
                  <th scope="col">Format</th>
                  <th scope="col">Signed URL</th>
                  <th scope="col">Expires</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.timestamp}</td>
                    <td>{moduleLabels[entry.module]}</td>
                    <td>{entry.format.toUpperCase()}</td>
                    <td>
                      <a href={entry.url} rel="noopener noreferrer" className="ds-caption" target="_blank">
                        {entry.url}
                      </a>
                    </td>
                    <td>{entry.expiresAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="ds-toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="ds-toast" role={toast.tone === 'success' ? 'status' : 'alert'}>
            <span aria-hidden="true">{toast.tone === 'success' ? '✅' : '⚠️'}</span>
            <div>
              <p className="ds-caption">{toast.message}</p>
              <button type="button" className="ds-button secondary" onClick={() => removeToast(toast.id)}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ModuleContentProps {
  module: ModuleKey;
  state: ModuleState;
  moduleDescription: string;
}

function ModuleContent({ module, state, moduleDescription }: ModuleContentProps) {
  switch (module) {
    case 'saas':
      return <SaasModule state={state} description={moduleDescription} />;
    case 'ecommerce':
      return <EcommerceModule state={state} description={moduleDescription} />;
    case 'corporate':
      return <CorporateModule state={state} description={moduleDescription} />;
    case 'custom-app':
      return <CustomAppModule state={state} description={moduleDescription} />;
    case 'media':
      return <MediaModule state={state} description={moduleDescription} />;
    case 'edtech':
      return <EdTechModule state={state} description={moduleDescription} />;
    case 'specialized':
      return <SpecializedModule state={state} description={moduleDescription} />;
    default:
      return null;
  }
}

type ModuleSectionProps = {
  title: string;
  subtitle: string;
  description?: string;
  state: ModuleState;
  children: ReactNode;
  id: string;
};

function ModuleSection({ title, subtitle, description, children, state, id }: ModuleSectionProps) {
  return (
    <section
      className="ds-card"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-desc` : undefined}
      id={id}
    >
      <div className="ds-card-header">
        <div>
          <h2 id={`${id}-title`} className="ds-card-title">
            {title}
          </h2>
          <p className="ds-card-subtitle">{subtitle}</p>
          {description ? (
            <p id={`${id}-desc`} className="ds-caption ds-readable-line">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {state === 'error' ? (
        <div className="ds-alert" data-variant="error" role="alert">
          <span aria-hidden="true">⚠️</span>
          <div>
            <strong>Data refresh failed.</strong>
            <p className="ds-caption">
              Attempt the refresh again or check automation logs for integration errors.
            </p>
          </div>
        </div>
      ) : state === 'loading' ? (
        <div className="ds-chart-placeholder" aria-busy="true">
          <span className="ds-skeleton" style={{ width: '60%' }} />
        </div>
      ) : state === 'empty' ? (
        <div className="ds-empty-state" role="status">
          <p>{EMPTY_MESSAGE}</p>
          <button type="button" className="ds-button" onClick={() => undefined}>
            Launch ingestion wizard
          </button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function SaasModule({ state, description }: { state: ModuleState; description: string }) {
  const chartAltId = 'saas-churn-alt';
  return (
    <div role="tabpanel" id="panel-saas" aria-labelledby="tab-saas">
      <section className="ds-card" aria-label="SaaS overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">SaaS orchestration</h2>
            <p className="ds-card-subtitle">Retention, billing hygiene, and API steadiness.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
          <button type="button" className="ds-button" style={{ minWidth: '200px' }}>
            Launch workflow
          </button>
        </div>
        <div className="ds-kpi-grid" role="list">
          {['Net revenue retention', 'Weekly churn risk', 'Plan limits at risk', 'API anomaly throttles'].map((label, index) => (
            <div key={label} className="ds-kpi-card" role="listitem">
              {state === 'loading' ? (
                <div className="ds-skeleton" style={{ width: '80%', height: '20px' }} aria-hidden="true" />
              ) : (
                <>
                  <span className="ds-kpi-label">{label}</span>
                  <span className="ds-kpi-value">{['129%', '3.4%', '12', '4'][index]}</span>
                  <span className="ds-kpi-delta" data-variant={index === 1 ? 'warning' : 'success'}>
                    {index === 1 ? '▲ +0.8pts vs last week' : '▼ stable vs target'}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <ModuleSection
        id="saas-retention"
        title="Cohort and churn intelligence"
        subtitle="Churn alerting, billing retries, nightly hygiene jobs"
        description="Axis labels maintain AA contrast. Donut reveals actual values and patterns; natural-language generator can draft workflows from anomalies."
        state={state}
      >
        <div className="ds-module-grid">
          <div className="span-8">
            <div className="ds-chart-placeholder" role="img" aria-labelledby={chartAltId}>
              <span aria-hidden="true">Retention curve with cohort overlay</span>
            </div>
            <p id={chartAltId} className="ds-chart-alt">
              Retention remains above 88% across primary cohorts; July onboarding shows 3.2% churn spike triggering workflow suggestions.
            </p>
          </div>
          <div className="span-4">
            <div className="ds-card dense">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                Dunning & upsell queue
              </h3>
              <ul className="ds-bullet-list">
                <li>Retry overdue invoices (12) with tiered messaging cadence.</li>
                <li>Upsell plan-limit accounts &gt;90% usage with tailored CTA.</li>
                <li>API usage anomaly flagged for throttle automation.</li>
              </ul>
            </div>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        id="saas-automation"
        title="Automation builder"
        subtitle="Triggers → conditions → actions"
        description="Churn alerts, billing retries, API throttling, plan-limit upsells, nightly hygiene, and natural-language workflow generator."
        state={state}
      >
        <AutomationBuilder
          triggers={["Churn probability > 0.35", 'Payment failed twice', 'API error spike 3σ', 'Usage > 90% of plan']}
          conditions={['Account tier is Growth or Scale', 'Customer health ≠ critical', 'Region supports proactive outreach']}
          actions={['Send concierge email + in-app assistant', 'Queue dunning retries', 'Throttle endpoint + notify API owner', 'Open NL workflow composer']}
        />
        <AutomationLog
          entries={[
            {
              time: '04:18',
              summary: 'Churn alert triggered for Finix Cloud',
              status: 'success',
              detail: 'Health score dropped to 42. Concierge play launched with Slack + email follow-up.',
            },
            {
              time: '03:52',
              summary: 'API anomaly throttle',
              status: 'warning',
              detail: 'Burst traffic blocked for 6 minutes. Auto-opened incident channel.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function EcommerceModule({ state, description }: { state: ModuleState; description: string }) {
  const chartAltId = 'ecommerce-sales-alt';
  return (
    <div role="tabpanel" id="panel-ecommerce" aria-labelledby="tab-ecommerce">
      <section className="ds-card" aria-label="E-commerce overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">E-commerce performance</h2>
            <p className="ds-card-subtitle">Conversion, fulfillment, loyalty, and retention.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-kpi-grid" role="list">
          {['Gross merchandise volume', 'Conversion rate', 'Low-stock SKUs', 'Return optimization impact'].map((label, index) => (
            <div key={label} className="ds-kpi-card" role="listitem">
              {state === 'loading' ? (
                <div className="ds-skeleton" style={{ width: '70%', height: '20px' }} aria-hidden="true" />
              ) : (
                <>
                  <span className="ds-kpi-label">{label}</span>
                  <span className="ds-kpi-value">{['$4.8M', '3.9%', '42', '$312K'][index]}</span>
                  <span className="ds-kpi-delta" data-variant={index === 2 ? 'warning' : 'success'}>
                    {index === 2 ? '▲ 9 SKUs at risk' : '▲ Improved vs last cycle'}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <ModuleSection
        id="ecommerce-sales"
        title="Sales trends and conversion table"
        subtitle="Baseline aligned between chart and fulfillment table"
        description="Bolder headers highlight conversion %. Shopify, Magento, Klaviyo, and WhatsApp orchestration stays in lockstep."
        state={state}
      >
        <div className="ds-module-grid">
          <div className="span-8">
            <div className="ds-chart-placeholder" role="img" aria-labelledby={chartAltId}>
              <span aria-hidden="true">Sales and conversion trend chart</span>
            </div>
            <p id={chartAltId} className="ds-chart-alt">
              Rolling 30-day GMV peaks at $4.8M with conversion lift 0.4pts; weekend dips offset by loyalty pushes.
            </p>
          </div>
          <div className="span-4">
            <table className="ds-table dense" aria-label="Conversion table">
              <thead>
                <tr>
                  <th scope="col">Channel</th>
                  <th scope="col">Conversion %</th>
                  <th scope="col">AOV</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Organic', '4.1%', '$112'],
                  ['Paid social', '3.6%', '$98'],
                  ['Email', '5.2%', '$131'],
                ].map(([channel, conversion, aov]) => (
                  <tr key={channel}>
                    <td>{channel}</td>
                    <td>
                      <span className="ds-table-status" data-variant="success">
                        <span aria-hidden="true">⟲</span>
                        {conversion}
                      </span>
                    </td>
                    <td>{aov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        id="ecommerce-automation"
        title="Automation orchestration"
        subtitle="Abandoned cart, low stock, fraud, VIP perks"
        description="Email → SMS → WhatsApp sequences, vendor replenishment, fraud holds, return optimizations, Shopify/Magento &amp; Klaviyo/WhatsApp sync."
        state={state}
      >
        <AutomationBuilder
          triggers={["Cart abandoned 2h", 'Inventory threshold < 15', 'Fraud score > 0.7', 'VIP purchase anniversary']}
          conditions={['Segment = VIP or High Intent', 'Inventory supplier available', 'Payment gateway flagged risk', 'Loyalty tier ≥ Gold']}
          actions={['Send email → SMS → WhatsApp flow', 'Auto-create vendor PO', 'Hold order + request docs', 'Push perks to Klaviyo + WhatsApp']}
        />
        <AutomationLog
          entries={[
            {
              time: '05:02',
              summary: 'Abandoned cart journey triggered',
              status: 'success',
              detail: 'Cross-channel flow launched for 1,248 contacts with 9% immediate recovery.',
            },
            {
              time: '04:21',
              summary: 'Low-stock vendor sync',
              status: 'info',
              detail: 'Auto PO issued to vendor for SKU LUM-204 with ETA 3 days.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function CorporateModule({ state, description }: { state: ModuleState; description: string }) {
  const funnelAltId = 'corporate-funnel-alt';
  return (
    <div role="tabpanel" id="panel-corporate" aria-labelledby="tab-corporate">
      <section className="ds-card" aria-label="Corporate analytics overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Corporate analytics</h2>
            <p className="ds-card-subtitle">Executive KPIs, funnel pacing, and insights.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-kpi-grid" role="list">
          {['ARR run rate', 'Pipeline velocity', 'Lead intent surge', 'C-suite digest readiness'].map((label, index) => (
            <div key={label} className="ds-kpi-card" role="listitem">
              {state === 'loading' ? (
                <div className="ds-skeleton" style={{ width: '60%', height: '20px' }} aria-hidden="true" />
              ) : (
                <>
                  <span className="ds-kpi-label">{label}</span>
                  <span className="ds-kpi-value">{['$72M', '23 days', '+42%', 'Ready'][index]}</span>
                  <span className="ds-kpi-delta" data-variant={index === 1 ? 'warning' : 'success'}>
                    {index === 1 ? '▼ 2 days vs target' : '▲ Positive variance'}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <ModuleSection
        id="corporate-funnel"
        title="Funnel vs table insights"
        subtitle="Spacing normalized across funnel and executive table"
        description="Structured five-color donut palette with value labels prevents oversaturation while preserving accessibility."
        state={state}
      >
        <div className="ds-module-grid">
          <div className="span-6">
            <div className="ds-chart-donut" role="img" aria-label="Revenue funnel breakdown">
              <div className="ds-chart-placeholder ds-chart-pattern" aria-hidden="true">
                Funnel visualization
              </div>
              <div className="ds-donut-values">
                {[
                  ['Marketing qualified', '24%'],
                  ['Sales accepted', '18%'],
                  ['Proposal', '33%'],
                  ['Negotiation', '15%'],
                  ['Closed won', '10%'],
                ].map(([label, value], index) => (
                  <div key={label} className="ds-donut-value">
                    <span>
                      <span
                        className="ds-legend-swatch"
                        style={{
                          backgroundColor: `var(--ds-chart-palette-${index + 1})`,
                        }}
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="span-6">
            <table className="ds-table" aria-label="Executive insights table">
              <thead>
                <tr>
                  <th scope="col">Leader</th>
                  <th scope="col">Focus</th>
                  <th scope="col">Next action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['CEO', 'ARR expansion', 'Review top upsell campaigns'],
                  ['CRO', 'Pipeline health', 'Resolve stalled stage 3 deals'],
                  ['CMO', 'Intent surge', 'Launch nurture for product-led leads'],
                ].map(([leader, focus, action]) => (
                  <tr key={leader}>
                    <td>{leader}</td>
                    <td>{focus}</td>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        id="corporate-automation"
        title="Lifecycle automations"
        subtitle="Lead scoring, velocity stall alerts, intent surges"
        description="Lifecycle nurture, ML scoring, pipeline velocity warnings, and weekly C-suite digests with auto commentary."
        state={state}
      >
        <AutomationBuilder
          triggers={["Lead score > 82", 'Stage stagnation 10 days', 'Intent surge percentile 95', 'Meeting cancelled twice']}
          conditions={['Owner available in next 4h', 'Account tier Enterprise', 'Compliance step complete']}
          actions={['Assign executive closer', 'Send nurture variant B', 'Generate exec summary', 'Escalate to RevOps channel']}
        />
        <AutomationLog
          entries={[
            {
              time: '05:15',
              summary: 'Velocity stall alert',
              status: 'warning',
              detail: 'Three opportunities idle for 12 days; reminders dispatched and exec digest updated.',
            },
            {
              time: '04:45',
              summary: 'Intent surge trigger',
              status: 'success',
              detail: 'AI commentary appended to weekly digest covering APAC product interest.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function CustomAppModule({ state, description }: { state: ModuleState; description: string }) {
  return (
    <div role="tabpanel" id="panel-custom-app" aria-labelledby="tab-custom-app">
      <section className="ds-card" aria-label="Custom productivity app overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Custom web app productivity</h2>
            <p className="ds-card-subtitle">Work orchestration and backlog balance.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-module-grid">
          <div className="span-8">
            <div className="ds-kanban" role="application" aria-label="Kanban backlog">
              {[
                ['Ready', 'info'],
                ['In progress', 'warning'],
                ['Blocked', 'error'],
              ].map(([column, variant]) => (
                <div key={column} className="ds-kanban-column">
                  <h4>
                    <span aria-hidden="true">{variant === 'info' ? '🟦' : variant === 'warning' ? '🟧' : '🟥'}</span>
                    {column}
                  </h4>
                  {state === 'loading' ? (
                    <div className="ds-skeleton" style={{ height: '120px' }} aria-hidden="true" />
                  ) : (
                    [1, 2].map((item) => (
                      <article key={item} className="ds-kanban-card" role="group" aria-label={`${column} card ${item}`}>
                        <h5 style={{ margin: 0, fontSize: '1rem' }}>Refine automation {item}</h5>
                        <p className="ds-caption">
                          Sprint ritual orchestration, stale-task nudges, NLP idea triage, capacity balancing, and Jira/Trello/Asana sync.
                        </p>
                      </article>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="span-4">
            <div className="ds-card dense">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                Workload alignment
              </h3>
              <div className="ds-chart-bar">
                {[
                  ['Design', 72],
                  ['Engineering', 84],
                  ['QA', 58],
                  ['Research', 44],
                ].map(([team, value]) => (
                  <div key={team} className="ds-chart-bar-item">
                    <div className="ds-label-stack">
                      <span>{team}</span>
                      <span className="ds-caption">Capacity usage {value}%</span>
                    </div>
                    <div className="ds-chart-bar-track" aria-hidden="true">
                      <span className="ds-chart-bar-fill" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModuleSection
        id="custom-automation"
        title="Automation orchestrator"
        subtitle="Sprint rituals, stale tasks, NLP triage"
        description="Two-way sync with Jira, Trello, Asana. Space key initiates drag for keyboard users; capacity balancing baked in."
        state={state}
      >
        <AutomationBuilder
          triggers={["Sprint retro scheduled", 'Task idle > 5 days', 'Idea submitted via NLP assistant']}
          conditions={['Squad capacity < 85%', 'Task priority ≥ medium', 'Mentor available in timezone']}
          actions={['Auto-generate retro agenda', 'Send nudge + escalate to lead', 'Create backlog item + assign owner']}
        />
        <AutomationLog
          entries={[
            {
              time: '05:08',
              summary: 'Stale-task nudge batch',
              status: 'info',
              detail: '19 tasks nudged; 4 escalations triggered for blockers.',
            },
            {
              time: '04:34',
              summary: 'Sprint ritual orchestration',
              status: 'success',
              detail: 'Stand-up recap compiled and posted to shared workspace.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function MediaModule({ state, description }: { state: ModuleState; description: string }) {
  return (
    <div role="tabpanel" id="panel-media" aria-labelledby="tab-media">
      <section className="ds-card" aria-label="Content and media overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Content &amp; media intelligence</h2>
            <p className="ds-card-subtitle">Publishing queue, highlight clips, distribution.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-module-grid">
          <div className="span-8">
            <div className="ds-card dense">
              <div className="ds-section-header">
                <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                  Publishing queue
                </h3>
                <span className="ds-caption">Aligned with automation card baseline</span>
              </div>
              <div className="ds-scroll-area" role="list">
                {['READY', 'REVIEW', 'BLOCKED'].map((status) => (
                  <div key={status} className="ds-log-item" role="listitem">
                    <div>
                      <strong className="ds-caption-strong">{status}</strong>
                      <p className="ds-caption">Feature story on {status === 'READY' ? 'AI trends' : status === 'REVIEW' ? 'market outlook' : 'legal hold'}.</p>
                    </div>
                    <span className="ds-badge" data-variant={status === 'BLOCKED' ? 'error' : status === 'REVIEW' ? 'warning' : 'success'}>
                      <span aria-hidden="true">{status === 'BLOCKED' ? '⛔' : status === 'REVIEW' ? '🕒' : '✅'}</span>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="span-4">
            <div className="ds-card dense">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                Top stories
              </h3>
              <ul className="ds-bullet-list">
                <li>Creator economy index hits new high.</li>
                <li>Video highlight clip generator shipping.</li>
                <li>Semantic tagging coverage 96%.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ModuleSection
        id="media-automation"
        title="Publishing control tower"
        subtitle="Auto-tagging, clip generation, blocked alerts"
        description="CMS/DAM with YouTube and TikTok integrations. READY/REVIEW/BLOCKED states blend iconography and text to avoid color-only cues."
        state={state}
      >
        <AutomationBuilder
          triggers={["Story status = Ready", 'Blocked for legal review', 'High engagement clip detected']}
          conditions={['Channel has scheduling window', 'Legal SLA > 2h', 'Asset rights confirmed']}
          actions={['Auto-schedule cross-channel publish', 'Alert legal + reroute to editor', 'Generate clip & push to social']}
        />
        <AutomationLog
          entries={[
            {
              time: '05:40',
              summary: 'Highlight clip generator',
              status: 'success',
              detail: 'Auto-created 12 clips and distributed to YouTube + TikTok playlists.',
            },
            {
              time: '05:05',
              summary: 'Blocked queue alert',
              status: 'warning',
              detail: 'Legal flagged usage rights; escalated to newsroom lead.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function EdTechModule({ state, description }: { state: ModuleState; description: string }) {
  const heatmapAltId = 'edtech-heatmap-alt';
  return (
    <div role="tabpanel" id="panel-edtech" aria-labelledby="tab-edtech">
      <section className="ds-card" aria-label="EdTech overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">EdTech learning pulse</h2>
            <p className="ds-card-subtitle">Engagement, mastery, credentialing.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-kpi-grid" role="list">
          {['Active learners', 'Completion rate', 'Certificates issued', 'Mentor availability'].map((label, index) => (
            <div key={label} className="ds-kpi-card" role="listitem">
              {state === 'loading' ? (
                <div className="ds-skeleton" style={{ width: '65%', height: '20px' }} aria-hidden="true" />
              ) : (
                <>
                  <span className="ds-kpi-label">{label}</span>
                  <span className="ds-kpi-value">{['12,482', '78%', '3,214', '92%'][index]}</span>
                  <span className="ds-kpi-delta" data-variant={index === 1 ? 'warning' : 'success'}>
                    {index === 1 ? '▼ -2pts vs target' : '▲ Improved engagement'}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <ModuleSection
        id="edtech-heatmap"
        title="Mastery heatmap"
        subtitle="Labels aligned with grid + numeric overlays"
        description="WCAG AA contrast maintained. Tooltips available on focus with numeric overlays representing mastery percentages."
        state={state}
      >
        <div className="ds-module-grid">
          <div className="span-8">
            <div role="img" aria-labelledby={heatmapAltId} className="ds-card dense">
              <div className="ds-heatmap">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className="ds-heatmap-label">
                    {day}
                  </span>
                ))}
                {[78, 64, 82, 91, 73, 55, 49].map((value) => (
                  <span
                    key={value}
                    className="ds-heatmap-value"
                    data-intensity={value > 85 ? 'high' : value > 65 ? 'medium' : 'low'}
                    aria-label={`Mastery ${value}%`}
                  >
                    {value}%
                  </span>
                ))}
              </div>
            </div>
            <p id={heatmapAltId} className="ds-chart-alt">
              Weekday mastery ranges from 64% to 91%; weekend dips trigger adaptive remediation nudges.
            </p>
          </div>
          <div className="span-4">
            <table className="ds-table" aria-label="EdTech alerts">
              <thead>
                <tr>
                  <th scope="col">Alert</th>
                  <th scope="col">Segment</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Inactivity > 7 days', 'STEM cohort B', 'Nudge + mentor outreach'],
                  ['Certification pending', 'Design cohort', 'Auto-issue Credly badge'],
                  ['Low mastery unit 4', 'Global cohort', 'Assign adaptive path'],
                ].map(([alert, segment, action]) => (
                  <tr key={alert}>
                    <td>{alert}</td>
                    <td>{segment}</td>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModuleSection>

      <ModuleSection
        id="edtech-automation"
        title="Learning automations"
        subtitle="Certificates, inactivity, remediation, mentor rotation"
        description="LMS + Credly integration ensures badges, nudges, adaptive remediation, and mentor scheduling stay automated."
        state={state}
      >
        <AutomationBuilder
          triggers={["Course completion = true", 'Inactivity 5 days', 'Assessment < 65%', 'Mentor rotation cycle']}
          conditions={['Learner timezone matches mentor', 'Credential approved', 'Adaptive module available']}
          actions={['Issue certificate + push to Credly', 'Send multi-channel nudge', 'Assign remediation path', 'Rotate mentor pairings']}
        />
        <AutomationLog
          entries={[
            {
              time: '05:12',
              summary: 'Auto-certificate run',
              status: 'success',
              detail: 'Credly badges issued to 842 learners with LMS sync.',
            },
            {
              time: '04:48',
              summary: 'Adaptive remediation triggered',
              status: 'info',
              detail: '23 learners assigned targeted practice for unit 4.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

function SpecializedModule({ state, description }: { state: ModuleState; description: string }) {
  return (
    <div role="tabpanel" id="panel-specialized" aria-labelledby="tab-specialized">
      <section className="ds-card" aria-label="Specialized niches overview">
        <div className="ds-card-header">
          <div>
            <h2 className="ds-card-title">Specialized niches</h2>
            <p className="ds-card-subtitle">Healthcare, finance, real estate orchestration.</p>
            <p className="ds-caption ds-readable-line">{description}</p>
          </div>
        </div>
        <div className="ds-module-grid">
          <div className="span-6">
            <div className="ds-card dense">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                Healthcare appointments
              </h3>
              <ul className="ds-bullet-list">
                <li>
                  <strong>Dr. Ayana Brooks</strong> — Telehealth consult (status: <span className="ds-badge" data-variant="success">Confirmed</span>)
                </li>
                <li>
                  <strong>Dr. Chen Patel</strong> — Follow-up (status: <span className="ds-badge" data-variant="warning">At risk</span>)
                </li>
              </ul>
            </div>
          </div>
          <div className="span-6">
            <div className="ds-card dense">
              <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
                Automation logs
              </h3>
              <div className="ds-automation-log">
                {[
                  {
                    title: 'Healthcare reminders',
                    detail: 'No-show predictions escalated for 3 patients; SMS + email triggered.',
                    tone: 'warning',
                  },
                  {
                    title: 'Finance approvals',
                    detail: 'Expense routing auto-approved for Team Ops within policy bounds.',
                    tone: 'success',
                  },
                ].map((item) => (
                  <article key={item.title} className="ds-automation-log-item">
                    <header>
                      <strong>{item.title}</strong>
                      <span className="ds-badge" data-variant={item.tone === 'warning' ? 'warning' : 'success'}>
                        {item.tone === 'warning' ? '⚠️' : '✅'} {item.tone === 'warning' ? 'Attention' : 'OK'}
                      </span>
                    </header>
                    <p className="ds-caption">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ModuleSection
        id="specialized-automation"
        title="Industry automation suite"
        subtitle="Healthcare, finance, real estate, shared intake"
        description="Reminder cadences, no-show prediction, expense approvals, anomaly detection, close checklist, lead nurture drips, multi-channel reminders, digital intake assistants."
        state={state}
      >
        <div className="ds-module-grid">
          <div className="span-4">
            <AutomationBuilder
              title="Healthcare"
              triggers={['Appointment booked', 'No-show probability > 0.5']}
              conditions={['Clinician available', 'Escalation path ready']}
              actions={['Send reminders across SMS/email', 'Escalate to care coordinator']}
              compact
            />
          </div>
          <div className="span-4">
            <AutomationBuilder
              title="Finance"
              triggers={['Expense submitted', 'Anomaly detected']}
              conditions={['Policy threshold < $5K', 'Quarter close window']}
              actions={['Route to approver', 'Launch period-close checklist']}
              compact
            />
          </div>
          <div className="span-4">
            <AutomationBuilder
              title="Real estate"
              triggers={['Lead captured', 'Listing nurture sequence start']}
              conditions={['Agent availability', 'Channel opted-in']}
              actions={['Assign agent', 'Send multi-channel reminders']}
              compact
            />
          </div>
        </div>
        <AutomationLog
          entries={[
            {
              time: '05:28',
              summary: 'Digital intake assistant',
              status: 'info',
              detail: 'Triaged 57 requests into tasks across healthcare, finance, and real estate queues.',
            },
            {
              time: '04:59',
              summary: 'Expense anomaly review',
              status: 'warning',
              detail: 'Escalated 2 out-of-policy submissions for CFO sign-off.',
            },
          ]}
          state={state}
        />
      </ModuleSection>
    </div>
  );
}

interface AutomationBuilderProps {
  triggers: string[];
  conditions: string[];
  actions: string[];
  title?: string;
  compact?: boolean;
}

function AutomationBuilder({ triggers, conditions, actions, title, compact }: AutomationBuilderProps) {
  const cardClass = compact ? 'ds-card dense' : 'ds-card dense';
  return (
    <div className={cardClass}>
      {title ? (
        <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
          {title} automation
        </h3>
      ) : (
        <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
          Builder canvas
        </h3>
      )}
      <p className="ds-caption">Configure triggers → conditions → actions with accessible keyboard flows.</p>
      <div className="ds-automation-builder" role="list">
        <div className="ds-builder-block" role="listitem">
          <h4>Triggers</h4>
          <ul className="ds-bullet-list">
            {triggers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ds-builder-block" role="listitem">
          <h4>Conditions</h4>
          <ul className="ds-bullet-list">
            {conditions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ds-builder-block" role="listitem">
          <h4>Actions</h4>
          <ul className="ds-bullet-list">
            {actions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ds-inline-controls" role="group" aria-label="Automation toggles">
        <label className="ds-toggle-switch">
          <input type="checkbox" defaultChecked />
          <span>Enabled</span>
        </label>
        <button type="button" className="ds-button secondary">
          Run test
        </button>
        <button type="button" className="ds-button">
          Deploy automation
        </button>
      </div>
    </div>
  );
}

interface AutomationLogProps {
  entries: { time: string; summary: string; status: 'success' | 'warning' | 'info'; detail: string }[];
  state: ModuleState;
}

function AutomationLog({ entries, state }: AutomationLogProps) {
  if (state === 'loading') {
    return <div className="ds-skeleton" style={{ width: '100%', height: '180px' }} aria-hidden="true" />;
  }
  if (state === 'empty') {
    return (
      <div className="ds-empty-state" role="status">
        <p>No automation runs logged yet.</p>
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div className="ds-alert" data-variant="error" role="alert">
        <span aria-hidden="true">⚠️</span>
        <div>
          <strong>Automation log unavailable.</strong>
          <p className="ds-caption">Check integration credentials and retry.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="ds-card dense">
      <h3 className="ds-card-title" style={{ fontSize: '1rem' }}>
        Run log
      </h3>
      <div className="ds-log-list" aria-live="polite">
        {entries.map((entry) => (
          <article key={`${entry.summary}-${entry.time}`} className="ds-log-item">
            <div>
              <strong>{entry.summary}</strong>
              <p className="ds-caption">{entry.detail}</p>
            </div>
            <div className="ds-log-meta">
              <span>{entry.time}</span>
              <span className="ds-badge" data-variant={entry.status === 'success' ? 'success' : entry.status === 'warning' ? 'warning' : 'info'}>
                {entry.status === 'success' ? '✅ Success' : entry.status === 'warning' ? '⚠️ Attention' : 'ℹ️ Info'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
