'use client';

import { useMemo, useState } from 'react';
import { automationTemplates, headerConfig, moduleMotionMap, type ModuleKey } from '@/lib/design-system/tokens';
import { useThemeContext } from '@/lib/design-system/theme-context';

const VIEW_STATES = ['success', 'loading', 'empty', 'error'] as const;
type ViewState = (typeof VIEW_STATES)[number];

type ExportFormat = 'csv' | 'json';

type AuditLogEntry = {
  id: string;
  module: ModuleKey;
  format: ExportFormat;
  timestamp: string;
  signer: string;
};

type ModuleDefinition = {
  key: ModuleKey;
  name: string;
  description: string;
  kpis: Array<{
    label: string;
    value: string;
    deltaLabel: string;
    deltaType: 'up' | 'down' | 'neutral';
    assistive: string;
  }>;
  automationHighlights: string[];
  accessibilitySummary: string;
};

const moduleDefinitions: ModuleDefinition[] = [
  {
    key: 'saas',
    name: 'SaaS Lifecycle Orchestration',
    description:
      'End-to-end SaaS health with usage, billing resiliency, and workflow automation controls.',
    kpis: [
      {
        label: 'Net Revenue Retention',
        value: '118.4%',
        deltaLabel: '+3.2% vs last month',
        deltaType: 'up',
        assistive: 'Retention continues to climb as enterprise customers expand seats.',
      },
      {
        label: 'Active API Consumers',
        value: '2,940',
        deltaLabel: 'Usage anomaly band active',
        deltaType: 'neutral',
        assistive: 'Monitored by anomaly throttling automation; 2% nearing quota ceiling.',
      },
      {
        label: 'Churn Forecast',
        value: '2.4%',
        deltaLabel: 'Down 0.6 pts after success outreach',
        deltaType: 'up',
        assistive: 'Workflow triggered nightly with cohort hygiene to reduce churn.',
      },
    ],
    automationHighlights: automationTemplates.saas,
    accessibilitySummary:
      'Line chart compares MRR growth and churn trend with annotations for anomaly throttles. Donut chart exposes plan distribution with value labels and hashed fills.',
  },
  {
    key: 'ecommerce',
    name: 'E-commerce Growth Console',
    description:
      'Merchandising, fulfillment, and customer lifecycle intelligence with automation-ready insights.',
    kpis: [
      {
        label: 'Daily Gross Merchandise Value',
        value: '$1.82M',
        deltaLabel: '+12.4% lift after VIP campaign',
        deltaType: 'up',
        assistive: 'Conversion surge attributed to VIP perks workflow and Klaviyo sync.',
      },
      {
        label: 'Abandoned Cart Recovery',
        value: '38.6%',
        deltaLabel: 'SMS step outperforming email by 1.8x',
        deltaType: 'up',
        assistive: 'Automation cascades email, SMS, WhatsApp with adaptive exit rules.',
      },
      {
        label: 'Inventory at Risk',
        value: '126 SKUs',
        deltaLabel: 'Vendors auto-notified, 12 flagged for manual review',
        deltaType: 'down',
        assistive: 'Low-stock replenishment triggered with vendor SLAs and audit trails.',
      },
    ],
    automationHighlights: automationTemplates.ecommerce,
    accessibilitySummary:
      'Baseline-aligned bar chart tracks daily sales vs forecast; table highlights conversion percentages with bold headers. Export actions log to audit trail.',
  },
  {
    key: 'corporate',
    name: 'Corporate Analytics Nerve Center',
    description:
      'Executive-ready analytics combining funnel, pipeline velocity, and ML signal automations.',
    kpis: [
      {
        label: 'Pipeline Coverage',
        value: '3.4×',
        deltaLabel: 'Healthy coverage above 3× target',
        deltaType: 'up',
        assistive: 'Velocity alerts maintain healthy pipeline movement.',
      },
      {
        label: 'Lead Intent Surge',
        value: '28 accounts',
        deltaLabel: 'AI-identified last 7 days',
        deltaType: 'neutral',
        assistive: 'Intent surge automations trigger nurture tracks instantly.',
      },
      {
        label: 'Stalled Opportunities',
        value: '14 deals',
        deltaLabel: 'Down 5 after stall alerts',
        deltaType: 'up',
        assistive: 'Weekly digests escalate stuck deals to C-suite for intervention.',
      },
    ],
    automationHighlights: automationTemplates.corporate,
    accessibilitySummary:
      'Five-stage funnel aligns with executive insight cards. Donut uses structured palette with labels and patterns. Timeline logs automation actions.',
  },
  {
    key: 'productivity',
    name: 'Custom Productivity App Control Room',
    description:
      'Kanban velocity, workload distribution, and automation builder for rituals and syncing.',
    kpis: [
      {
        label: 'Sprint Completion',
        value: '92%',
        deltaLabel: 'Retro automation mitigated blockers',
        deltaType: 'up',
        assistive: 'Capacity balancing automation helped raise completion.',
      },
      {
        label: 'Stale Tasks',
        value: '34',
        deltaLabel: 'Down 18 after nudge flow',
        deltaType: 'up',
        assistive: 'Stale task nudges triggered via NLP classification.',
      },
      {
        label: 'Integration Sync Health',
        value: '99.2%',
        deltaLabel: 'Two-way sync stable across Jira/Trello/Asana',
        deltaType: 'neutral',
        assistive: 'Automation monitors connector latency and retries when needed.',
      },
    ],
    automationHighlights: automationTemplates.productivity,
    accessibilitySummary:
      'Kanban columns balanced with +8px gutters and keyboard drag support. Workload chart aligns with backlog list with shared baseline.',
  },
  {
    key: 'media',
    name: 'Content & Media Command Deck',
    description:
      'Editorial throughput, distribution readiness, and creative automation oversight.',
    kpis: [
      {
        label: 'Publish Readiness',
        value: '76%',
        deltaLabel: 'READY stories up 9 pts',
        deltaType: 'up',
        assistive: 'Control tower ensures embargo compliance before publish.',
      },
      {
        label: 'Blocked Items',
        value: '12',
        deltaLabel: 'Legal reviews pending',
        deltaType: 'down',
        assistive: 'Blocked queue alerts trigger cross-functional responses.',
      },
      {
        label: 'Highlight Clips Generated',
        value: '54',
        deltaLabel: '+18 week over week',
        deltaType: 'up',
        assistive: 'Semantic auto-tagging boosts highlight generation.',
      },
    ],
    automationHighlights: automationTemplates.media,
    accessibilitySummary:
      'Publishing queue baseline aligns with automation cards. READY/REVIEW/BLOCKED states use icons plus labels and maintain AA contrast.',
  },
  {
    key: 'edtech',
    name: 'EdTech Learning Operations',
    description:
      'Cohort mastery, engagement nudges, and credential automation with Credly integration.',
    kpis: [
      {
        label: 'Competency Mastery',
        value: '87%',
        deltaLabel: '+4 pts after adaptive remediation',
        deltaType: 'up',
        assistive: 'Adaptive remediation flows pushing mastery ahead of target.',
      },
      {
        label: 'Inactive Learners',
        value: '62',
        deltaLabel: 'Nudges scheduled every 48h',
        deltaType: 'neutral',
        assistive: 'Inactivity automations orchestrate mentor outreach and LMS messages.',
      },
      {
        label: 'Certificates Issued',
        value: '412',
        deltaLabel: 'Auto badge sync with Credly',
        deltaType: 'up',
        assistive: 'Automation ensures issuance within 30 minutes of completion.',
      },
    ],
    automationHighlights: automationTemplates.edtech,
    accessibilitySummary:
      'Heatmap uses aligned labels with numeric overlays. Alerts spacing normalized across stack. Tables maintain contrast for headers.',
  },
  {
    key: 'niches',
    name: 'Specialized Niches Hub',
    description:
      'Healthcare, finance, and real estate vertical workflows with shared automation backbone.',
    kpis: [
      {
        label: 'Healthcare Show Rate',
        value: '93.6%',
        deltaLabel: 'No-show prediction prevented 18 gaps',
        deltaType: 'up',
        assistive: 'Reminder automation escalated risky appointments to staff.',
      },
      {
        label: 'Finance Exceptions Cleared',
        value: '128',
        deltaLabel: 'Expense routing automation accelerated resolution',
        deltaType: 'up',
        assistive: 'Period close checklist sequenced approvals to stay compliant.',
      },
      {
        label: 'Real Estate Nurture Touchpoints',
        value: '4.8 avg',
        deltaLabel: 'Multi-channel reminders active',
        deltaType: 'neutral',
        assistive: 'Lead assignment flows ensure agents respond within SLA.',
      },
    ],
    automationHighlights: automationTemplates.niches,
    accessibilitySummary:
      'Appointments card height balanced with automation log tabs. Status badges feature icons and weight suited for dark theme readability.',
  },
];

const headerId = 'premium-dashboard-header';

function stateLabel(state: ViewState) {
  switch (state) {
    case 'success':
      return 'Success';
    case 'loading':
      return 'Loading';
    case 'empty':
      return 'Empty';
    case 'error':
      return 'Error';
    default:
      return state;
  }
}

const formatLabel: Record<ExportFormat, string> = {
  csv: 'CSV',
  json: 'JSON',
};

const formatSigner: Record<ExportFormat, string> = {
  csv: 'Signature sha256:e-commerce-csv',
  json: 'Signature sha256:dashboard-json',
};

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function createSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="surface-card" key={`skeleton-${index}`}>
          <div className="skeleton --title" />
          <div className="skeleton --text" style={{ width: '60%', marginBottom: '8px' }} />
          <div className="skeleton --block" />
        </div>
      ))}
    </div>
  );
}

function DonutChart({
  title,
  data,
  palette,
  id,
}: {
  title: string;
  data: Array<{ label: string; value: number; pattern: string }>;
  palette: string[];
  id: string;
}) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulative = 0;
  return (
    <figure className="grid gap-4">
      <figcaption className="text-sm font-medium text-[color:var(--color-foreground)]">{title}</figcaption>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,220px)_1fr]">
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          className="mx-auto h-48 w-48"
        >
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-desc`}>
            {data.map((slice) => `${slice.label}: ${Math.round((slice.value / total) * 100)} percent`).join(', ')}
          </desc>
          <g transform="translate(100,100)">
            {data.map((slice, index) => {
              const startAngle = (cumulative / total) * Math.PI * 2;
              cumulative += slice.value;
              const endAngle = (cumulative / total) * Math.PI * 2;
              const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
              const radiusOuter = 90;
              const radiusInner = 55;
              const startX = Math.cos(startAngle) * radiusOuter;
              const startY = Math.sin(startAngle) * radiusOuter;
              const endX = Math.cos(endAngle) * radiusOuter;
              const endY = Math.sin(endAngle) * radiusOuter;
              const startXInner = Math.cos(endAngle) * radiusInner;
              const startYInner = Math.sin(endAngle) * radiusInner;
              const endXInner = Math.cos(startAngle) * radiusInner;
              const endYInner = Math.sin(startAngle) * radiusInner;
              return (
                <path
                  key={`${slice.label}-${index}`}
                  d={`M ${startX} ${startY} A ${radiusOuter} ${radiusOuter} 0 ${largeArc} 1 ${endX} ${endY} L ${startXInner} ${startYInner} A ${radiusInner} ${radiusInner} 0 ${largeArc} 0 ${endXInner} ${endYInner} Z`}
                  fill={`url(#${id}-pattern-${index})`}
                  stroke={palette[index % palette.length]}
                  strokeWidth={1.5}
                />
              );
            })}
          </g>
          <defs>
            {data.map((slice, index) => (
              <pattern
                key={`${slice.label}-pattern-${index}`}
                id={`${id}-pattern-${index}`}
                patternUnits="userSpaceOnUse"
                width={10}
                height={10}
              >
                <rect width="10" height="10" fill={palette[index % palette.length]} opacity={0.18} />
                <path d={slice.pattern} stroke={palette[index % palette.length]} strokeWidth={1} opacity={0.6} />
              </pattern>
            ))}
          </defs>
        </svg>
        <dl className="grid gap-3 self-center text-sm">
          {data.map((slice, index) => {
            const percent = total === 0 ? 0 : ((slice.value / total) * 100).toFixed(1);
            return (
              <div
                key={`${slice.label}-legend`}
                className="flex items-center justify-between gap-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-[color:var(--color-border-strong)]"
                    style={{ background: palette[index % palette.length], opacity: 0.6 }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[color:var(--color-foreground)]">{slice.label}</span>
                </div>
                <span className="kpi-value text-base">{percent}%</span>
              </div>
            );
          })}
        </dl>
      </div>
    </figure>
  );
}

function Heatmap({
  matrix,
  caption,
  yLabels,
  xLabels,
  id,
}: {
  matrix: number[][];
  caption: string;
  yLabels: string[];
  xLabels: string[];
  id: string;
}) {
  const max = Math.max(...matrix.flat());
  return (
    <figure className="grid gap-4">
      <figcaption className="text-sm font-medium text-[color:var(--color-foreground)]">{caption}</figcaption>
      <div className="overflow-x-auto">
        <table className="table-fixed border-separate border-spacing-[0]">
          <caption id={`${id}-summary`} className="visually-hidden">
            {caption}. Highest value {max}.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-foreground-muted)]">
                Cohort
              </th>
              {xLabels.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-foreground)]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={`row-${yLabels[rowIndex]}`} className="border-b border-[color:var(--color-border)] last:border-none">
                <th
                  scope="row"
                  className="px-4 py-3 text-xs font-medium text-[color:var(--color-foreground)]"
                >
                  {yLabels[rowIndex]}
                </th>
                {row.map((value, colIndex) => {
                  const intensity = max === 0 ? 0 : value / max;
                  const background = `linear-gradient(135deg, rgba(108, 77, 217, ${0.15 + intensity * 0.35}) 0%, rgba(45, 108, 223, ${
                    0.12 + intensity * 0.28
                  }) 100%)`;
                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className="px-4 py-3 text-center align-middle">
                      <div
                        className="rounded-md px-3 py-2 text-sm font-medium text-[color:var(--color-foreground)]"
                        style={{
                          background,
                          color: intensity > 0.6 ? 'white' : 'var(--color-foreground)',
                        }}
                      >
                        {value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function AutomationBuilder({ moduleKey }: { moduleKey: ModuleKey }) {
  const recipes = automationTemplates[moduleKey];
  return (
    <section
      aria-labelledby={`${moduleKey}-automation-builder`}
      className="surface-card surface-card--raised motion-group"
      data-state="enter"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 id={`${moduleKey}-automation-builder`} className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Automation Builder
          </h3>
          <p className="text-sm text-[color:var(--color-foreground-muted)]">
            Compose triggers, conditions, and actions with audit-ready tracking.
          </p>
        </div>
        <button
          type="button"
          className="pill bg-[color:var(--color-primary)] text-white transition-transform duration-[var(--duration-standard)] ease-[var(--ease-smooth)] hover:-translate-y-0.5 focus-visible:focus-ring"
        >
          Launch workflow
        </button>
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5">
          <h4 className="text-sm font-semibold text-[color:var(--color-foreground)]">Triggers</h4>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-foreground-muted)]">
            {recipes.slice(0, 2).map((item) => (
              <li key={`trigger-${item}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 rounded-full bg-[color:var(--color-primary)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5">
          <h4 className="text-sm font-semibold text-[color:var(--color-foreground)]">Conditions</h4>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-foreground-muted)]">
            {recipes.slice(2, 4).map((item) => (
              <li key={`condition-${item}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 rounded-full bg-[color:var(--color-info)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5">
          <h4 className="text-sm font-semibold text-[color:var(--color-foreground)]">Actions</h4>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-foreground-muted)]">
            {recipes.slice(4).map((item) => (
              <li key={`action-${item}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 rounded-full bg-[color:var(--color-success)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Timeline({
  entries,
  title,
  id,
}: {
  entries: Array<{ label: string; timestamp: string; status: 'success' | 'warning' | 'error' | 'info'; description: string }>;
  title: string;
  id: string;
}) {
  const statusClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  } as const;
  const statusIcon = {
    success: '✓',
    warning: '⚠',
    error: '⛔',
    info: 'ℹ',
  } as const;
  return (
    <section className="surface-card motion-group" data-state="enter" aria-labelledby={`${id}-title`}>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h3 id={`${id}-title`} className="text-lg font-semibold text-[color:var(--color-foreground)]">
            {title}
          </h3>
          <p className="text-sm text-[color:var(--color-foreground-muted)]">
            Automation trail with signed records.
          </p>
        </div>
      </header>
      <ol className="mt-6 space-y-4">
        {entries.map((entry) => (
          <li key={`${id}-${entry.label}`} className="flex flex-col gap-2 border-l-2 border-[color:var(--color-border)] pl-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`status-badge ${statusClass[entry.status]}`}>
                <span aria-hidden="true">{statusIcon[entry.status]}</span>
                <span>{entry.status.toUpperCase()}</span>
              </span>
              <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{entry.label}</p>
              <span className="text-xs text-[color:var(--color-foreground-muted)]">{entry.timestamp}</span>
            </div>
            <p className="text-sm text-[color:var(--color-foreground-muted)]">{entry.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExportControls({
  onExport,
  disabled,
}: {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['csv', 'json'] as ExportFormat[]).map((format) => (
        <button
          key={format}
          type="button"
          className="pill bg-[color:var(--color-surface)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] transition-colors focus-visible:focus-ring"
          onClick={() => onExport(format)}
          disabled={disabled}
        >
          Export {formatLabel[format]}
        </button>
      ))}
    </div>
  );
}

function ModuleHeader() {
  return (
    <header aria-labelledby={headerId} className="grid gap-1">
      <h2 id={headerId} className="text-2xl font-semibold text-[color:var(--color-foreground)]">
        {headerConfig.title}
      </h2>
      <p className="text-xs text-[color:var(--color-foreground-muted)]">Generated at {headerConfig.generatedAt}</p>
    </header>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="surface-card" role="alert">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="status-badge badge-error">
          <span>⛔</span>
          <span>Error</span>
        </span>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[color:var(--color-foreground)]">We hit a snag</p>
          <p className="text-sm text-[color:var(--color-foreground-muted)]">{message}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="surface-card" role="status">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{title}</p>
        <p className="text-sm text-[color:var(--color-foreground-muted)]">{description}</p>
      </div>
    </div>
  );
}

function ModuleSuccess({ module }: { module: ModuleDefinition }) {
  const { key } = module;
  switch (key) {
    case 'saas':
      return <SaasModule module={module} />;
    case 'ecommerce':
      return <EcommerceModule module={module} />;
    case 'corporate':
      return <CorporateModule module={module} />;
    case 'productivity':
      return <ProductivityModule module={module} />;
    case 'media':
      return <MediaModule module={module} />;
    case 'edtech':
      return <EdtechModule module={module} />;
    case 'niches':
      return <NichesModule module={module} />;
    default:
      return null;
  }
}

function ModuleContainer({
  module,
  viewState,
  onExport,
}: {
  module: ModuleDefinition;
  viewState: ViewState;
  onExport: (format: ExportFormat) => void;
}) {
  return (
    <section className="grid gap-6" aria-labelledby={`${module.key}-title`}>
      <ModuleHeader />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h3 id={`${module.key}-title`} className="text-xl font-semibold text-[color:var(--color-foreground)]">
              {module.name}
            </h3>
            <p className="text-sm text-[color:var(--color-foreground-muted)]">{module.description}</p>
          </div>
          <ExportControls onExport={onExport} disabled={viewState !== 'success'} />
        </div>
        <p className="text-xs text-[color:var(--color-foreground-muted)]">
          Motion choreography: {moduleMotionMap[module.key].entry}. {moduleMotionMap[module.key].details}
        </p>
      </div>
      {viewState === 'loading' && createSkeletonGrid()}
      {viewState === 'error' && <ErrorState message="Failed to load latest metrics. Retry after verifying integrations." />}
      {viewState === 'empty' && (
        <EmptyState
          title="No data yet"
          description="Connect your data sources or run automations to populate this module."
        />
      )}
      {viewState === 'success' && <ModuleSuccess module={module} />}
      <p className="text-xs text-[color:var(--color-foreground-muted)]">
        Reduced motion: {moduleMotionMap[module.key].reduceMotion}
      </p>
      <p className="text-xs text-[color:var(--color-foreground-muted)]" aria-live="polite">
        Chart summary: {module.accessibilitySummary}
      </p>
    </section>
  );
}

function KpiGrid({ module }: { module: ModuleDefinition }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] lg:min-w-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {module.kpis.map((kpi) => (
            <article
              key={`${module.key}-kpi-${kpi.label}`}
              className="surface-card motion-group"
              data-state="enter"
              aria-label={`${kpi.label} card`}
            >
              <header className="flex items-center justify-between">
                <span className="kpi-label">{kpi.label}</span>
                <span className="text-xs text-[color:var(--color-foreground-muted)]">{kpi.assistive}</span>
              </header>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <span className="kpi-value">{kpi.value}</span>
                <span
                  className={`status-badge ${
                    kpi.deltaType === 'up'
                      ? 'badge-success'
                      : kpi.deltaType === 'down'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}
                >
                  <span aria-hidden="true">
                    {kpi.deltaType === 'up' ? '▲' : kpi.deltaType === 'down' ? '▼' : '•'}
                  </span>
                  <span>{kpi.deltaLabel}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaasModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
        <section className="surface-card xl:col-span-7" aria-labelledby="saas-usage-heading">
          <header className="flex items-center justify-between">
            <div>
              <h4 id="saas-usage-heading" className="text-lg font-semibold text-[color:var(--color-foreground)]">
                Usage vs Churn Trend
              </h4>
              <p className="text-xs text-[color:var(--color-foreground-muted)]">
                Stronger axis contrast ensures readability; hover reveals cohort-level details.
              </p>
            </div>
            <span className="pill bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]">Live</span>
          </header>
          <div className="chart-wrapper" role="img" aria-label="Usage uptrend 14% while churn falling to 2.4%" />
          <dl className="grid gap-2 text-sm text-[color:var(--color-foreground-muted)] md:grid-cols-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-6 rounded-sm bg-[color:var(--color-primary)]" />
              <span>Monthly Recurring Revenue ↑ 14%</span>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-6 rounded-sm bg-[color:var(--color-success)]" />
              <span>Churn rate ↓ 0.6 pts</span>
            </div>
          </dl>
        </section>
        <section className="surface-card xl:col-span-5" aria-labelledby="saas-plan-donut">
          <DonutChart
            id="saas-plan-donut"
            title="Plan Mix"
            data={[
              { label: 'Scale', value: 42, pattern: 'M0 0 L10 10' },
              { label: 'Growth', value: 33, pattern: 'M0 10 L10 0' },
              { label: 'Starter', value: 18, pattern: 'M5 0 L5 10' },
              { label: 'Trials', value: 7, pattern: 'M0 5 L10 5' },
            ]}
            palette={['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)']}
          />
        </section>
      </div>
      <AutomationBuilder moduleKey="saas" />
      <Timeline
        id="saas-log"
        title="Run Log"
        entries={[
          {
            label: 'Billing retries completed',
            timestamp: 'Today · 04:00 UTC',
            status: 'success',
            description: 'Dunning cadence executed across 126 accounts with signed ledger update.',
          },
          {
            label: 'Churn alert routed',
            timestamp: 'Today · 02:30 UTC',
            status: 'warning',
            description: 'Success manager notified with predicted 18% downgrade probability.',
          },
          {
            label: 'Workflow draft generated',
            timestamp: 'Yesterday · 21:12 UTC',
            status: 'info',
            description: 'Natural-language request translated into workflow template for review.',
          },
        ]}
      />
    </div>
  );
}

function EcommerceModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-7" aria-labelledby="ecommerce-sales-trend">
          <header className="flex items-center justify-between">
            <div>
              <h4 id="ecommerce-sales-trend" className="text-lg font-semibold text-[color:var(--color-foreground)]">
                Daily Sales vs Forecast
              </h4>
              <p className="text-xs text-[color:var(--color-foreground-muted)]">
                Trend baseline perfectly aligned with table insights for conversion clarity.
              </p>
            </div>
            <span className="pill bg-[color:var(--color-info-soft)] text-[color:var(--color-info)]">Forecast variance -1.8%</span>
          </header>
          <div className="chart-wrapper" role="img" aria-label="Sales trend above forecast 12 of last 14 days" />
          <div className="table-grid">
            <table>
              <thead>
                <tr>
                  <th scope="col">Channel</th>
                  <th scope="col">Orders</th>
                  <th scope="col">Conversion %</th>
                  <th scope="col">Avg order value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { channel: 'Web', orders: '8,412', conversion: '4.2%', aov: '$128.42' },
                  { channel: 'Mobile app', orders: '6,903', conversion: '5.8%', aov: '$116.73' },
                  { channel: 'Marketplace', orders: '3,108', conversion: '2.7%', aov: '$98.30' },
                ].map((row) => (
                  <tr key={row.channel}>
                    <td>{row.channel}</td>
                    <td>{row.orders}</td>
                    <td className="text-[color:var(--color-foreground)] font-semibold">{row.conversion}</td>
                    <td>{row.aov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="surface-card xl:col-span-5" aria-labelledby="ecommerce-funnel">
          <h4 id="ecommerce-funnel" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Conversion Funnel
          </h4>
          <ol className="mt-4 space-y-3">
            {[
              { stage: 'Sessions', value: '1.2M', delta: '+8%' },
              { stage: 'Product views', value: '620K', delta: '+11%' },
              { stage: 'Add to cart', value: '186K', delta: '+9%' },
              { stage: 'Checkout start', value: '102K', delta: '+6%' },
              { stage: 'Completed orders', value: '68K', delta: '+4%' },
            ].map((item, index) => (
              <li
                key={item.stage}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[color:var(--color-foreground)]">{item.stage}</span>
                  <span className="text-xs text-[color:var(--color-success)]">{item.delta}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[color:var(--color-border)]">
                  <div
                    className="h-2 rounded-full bg-[color:var(--color-primary)]"
                    style={{ width: `${100 - index * 12}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-foreground-muted)]">{item.value}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <AutomationBuilder moduleKey="ecommerce" />
      <Timeline
        id="ecommerce-log"
        title="Automation & Export Log"
        entries={[
          {
            label: 'CSV export signed',
            timestamp: 'Today · 05:10 UTC',
            status: 'info',
            description: 'Orders export shared with finance via signed URL.',
          },
          {
            label: 'Fraud hold applied',
            timestamp: 'Today · 03:25 UTC',
            status: 'warning',
            description: 'High risk orders routed to manual review queue.',
          },
          {
            label: 'Low-stock replenishment triggered',
            timestamp: 'Yesterday · 22:45 UTC',
            status: 'success',
            description: 'Vendors notified with SLA timers to prevent stockouts.',
          },
        ]}
      />
    </div>
  );
}

function CorporateModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-6" aria-labelledby="corporate-funnel">
          <h4 id="corporate-funnel" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Five-Stage Revenue Funnel
          </h4>
          <ol className="mt-6 space-y-4">
            {[
              { stage: 'Inquiry', value: '5,120', conversion: '28%' },
              { stage: 'Qualified', value: '1,434', conversion: '62%' },
              { stage: 'Proposal', value: '612', conversion: '44%' },
              { stage: 'Negotiation', value: '284', conversion: '36%' },
              { stage: 'Closed Won', value: '102', conversion: '25%' },
            ].map((stage, index) => (
              <li key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[color:var(--color-foreground)]">{stage.stage}</span>
                  <span className="text-xs text-[color:var(--color-foreground-muted)]">{stage.value}</span>
                </div>
                <div className="h-3 rounded-full bg-[color:var(--color-surface-subtle)]">
                  <div
                    className="h-3 rounded-full bg-[color:var(--color-primary)]"
                    style={{ width: `${90 - index * 12}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-[color:var(--color-success)]">Conversion {stage.conversion}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="surface-card xl:col-span-6" aria-labelledby="corporate-donut">
          <DonutChart
            id="corporate-donut"
            title="Revenue Contribution by Segment"
            data={[
              { label: 'Enterprise', value: 44, pattern: 'M0 0 L10 10' },
              { label: 'Mid-market', value: 26, pattern: 'M0 10 L10 0' },
              { label: 'Commercial', value: 18, pattern: 'M5 0 L5 10' },
              { label: 'Public Sector', value: 7, pattern: 'M0 5 L10 5' },
              { label: 'Partner', value: 5, pattern: 'M0 0 L10 0' },
            ]}
            palette={['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)']}
          />
        </section>
      </div>
      <section className="surface-card" aria-labelledby="corporate-insights">
        <h4 id="corporate-insights" className="text-lg font-semibold text-[color:var(--color-foreground)]">
          Executive Insights
        </h4>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[
            'ML lead scoring uplifted win rate 4.6 pts week over week.',
            'Pipeline stall alerts resolved 5 high-value deals within 48 hours.',
            'Intent surge triggers launched 3 ABM plays automatically.',
            'Lifecycle nurture sequences increased email engagement 21%.',
          ].map((insight) => (
            <article
              key={insight}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5"
            >
              <p className="text-sm text-[color:var(--color-foreground)]">{insight}</p>
            </article>
          ))}
        </div>
      </section>
      <AutomationBuilder moduleKey="corporate" />
      <Timeline
        id="corporate-log"
        title="Lifecycle Timeline"
        entries={[
          {
            label: 'C-suite digest delivered',
            timestamp: 'Today · 06:00 UTC',
            status: 'success',
            description: 'Automated commentary sent to leadership with insights attachments.',
          },
          {
            label: 'Velocity stall escalated',
            timestamp: 'Today · 02:40 UTC',
            status: 'warning',
            description: 'Account owner reminded with recommended playbook.',
          },
          {
            label: 'Intent surge detected',
            timestamp: 'Yesterday · 19:22 UTC',
            status: 'info',
            description: 'High-fit accounts prioritized for outreach and nurtures updated.',
          },
        ]}
      />
    </div>
  );
}

function ProductivityModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-8" aria-labelledby="productivity-kanban">
          <h4 id="productivity-kanban" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Sprint Kanban
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3" style={{ gap: '32px' }}>
            {[
              { title: 'Ready', count: 12, color: 'var(--color-info)' },
              { title: 'In Progress', count: 18, color: 'var(--color-primary)' },
              { title: 'Review', count: 9, color: 'var(--color-success)' },
            ].map((column) => (
              <div
                key={column.title}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-5"
                role="list"
                aria-label={`${column.title} column with ${column.count} cards`}
              >
                <header className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[color:var(--color-foreground)]">{column.title}</span>
                  <span className="status-badge badge-info" style={{ color: column.color }}>
                    <span aria-hidden="true">•</span>
                    <span>{column.count}</span>
                  </span>
                </header>
                <div className="mt-4 space-y-3" role="presentation">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={`${column.title}-${card}`}
                      className="rounded-lg bg-[color:var(--color-surface)] p-4 shadow-sm transition-transform duration-[var(--duration-standard)] ease-[var(--ease-smooth)] hover:-translate-y-0.5"
                      tabIndex={0}
                      role="button"
                      aria-label={`${column.title} card ${card}`}
                    >
                      <p className="text-sm font-medium text-[color:var(--color-foreground)]">{column.title} task {card}</p>
                      <p className="text-xs text-[color:var(--color-foreground-muted)]">
                        Accessible drag with space/enter and arrow keys.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="surface-card xl:col-span-4" aria-labelledby="productivity-workload">
          <h4 id="productivity-workload" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Workload Alignment
          </h4>
          <ul className="mt-4 space-y-3">
            {[
              { squad: 'Velocity', load: '92%', status: 'Balanced' },
              { squad: 'Atlas', load: '103%', status: 'Overloaded' },
              { squad: 'Nova', load: '88%', status: 'Under target' },
            ].map((team) => (
              <li key={team.squad} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-foreground)]">{team.squad}</p>
                  <p className="text-xs text-[color:var(--color-foreground-muted)]">Automation suggests reallocating capacity.</p>
                </div>
                <div className="text-right">
                  <p className="kpi-value text-base">{team.load}</p>
                  <span className="text-xs text-[color:var(--color-info)]">{team.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <AutomationBuilder moduleKey="productivity" />
      <Timeline
        id="productivity-log"
        title="Orchestration Log"
        entries={[
          {
            label: 'Sprint ritual orchestrated',
            timestamp: 'Today · 09:00 UTC',
            status: 'success',
            description: 'Standup, planning, and retro invites sequenced with reminders.',
          },
          {
            label: 'NLP idea triage completed',
            timestamp: 'Today · 07:45 UTC',
            status: 'info',
            description: 'New ideas categorized for backlog review automatically.',
          },
          {
            label: 'Capacity balancing triggered',
            timestamp: 'Yesterday · 18:20 UTC',
            status: 'warning',
            description: 'Atlas squad flagged for overload; tasks reassigned to Nova.',
          },
        ]}
      />
    </div>
  );
}

function MediaModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-7" aria-labelledby="media-queue">
          <h4 id="media-queue" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Publishing Queue
          </h4>
          <ul className="mt-4 space-y-3">
            {[
              { title: 'Global economy explainer', state: 'READY', icon: '🚀' },
              { title: 'Creator spotlight: Q4 trends', state: 'REVIEW', icon: '📝' },
              { title: 'Policy update briefing', state: 'BLOCKED', icon: '⛔' },
            ].map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{item.title}</p>
                  <p className="text-xs text-[color:var(--color-foreground-muted)]">Queue baseline aligned with automation panel.</p>
                </div>
                <span className="status-badge badge-info">
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.state}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface-card xl:col-span-5" aria-labelledby="media-automation">
          <h4 id="media-automation" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Automation Sync
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-foreground-muted)]">
            {automationTemplates.media.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <AutomationBuilder moduleKey="media" />
      <Timeline
        id="media-log"
        title="Distribution Log"
        entries={[
          {
            label: 'Highlight clips published',
            timestamp: 'Today · 08:10 UTC',
            status: 'success',
            description: '54 clips syndicated to YouTube and TikTok with accessibility captions.',
          },
          {
            label: 'Blocked queue escalated',
            timestamp: 'Today · 05:25 UTC',
            status: 'warning',
            description: 'Legal review pending; automation paused distribution.',
          },
          {
            label: 'Semantic tagging refreshed',
            timestamp: 'Yesterday · 21:00 UTC',
            status: 'info',
            description: 'Metadata re-generated for 320 assets ensuring accurate search.',
          },
        ]}
      />
    </div>
  );
}

function EdtechModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-7" aria-labelledby="edtech-heatmap">
          <Heatmap
            id="edtech-heatmap"
            caption="Competency Mastery Heatmap"
            matrix={[
              [78, 84, 91, 88],
              [64, 73, 82, 79],
              [92, 94, 97, 95],
            ]}
            yLabels={['Beginner Cohort', 'Intermediate Cohort', 'Advanced Cohort']}
            xLabels={['Module 1', 'Module 2', 'Module 3', 'Module 4']}
          />
        </section>
        <section className="surface-card xl:col-span-5" aria-labelledby="edtech-alerts">
          <h4 id="edtech-alerts" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Alerts & Interventions
          </h4>
          <ul className="mt-4 space-y-3">
            {[
              { title: 'Inactivity nudge scheduled', detail: '62 learners queued for outreach', status: 'info' },
              { title: 'Mentor rotation', detail: 'Next rotation in 2 days', status: 'success' },
              { title: 'Adaptive remediation', detail: '18 learners assigned supplemental paths', status: 'warning' },
            ].map((alert) => (
              <li key={alert.title} className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4">
                <span className={`status-badge ${alert.status === 'success' ? 'badge-success' : alert.status === 'warning' ? 'badge-warning' : 'badge-info'}`}>
                  <span aria-hidden="true">{alert.status === 'success' ? '✓' : alert.status === 'warning' ? '⚠' : 'ℹ'}</span>
                  <span>{alert.status.toUpperCase()}</span>
                </span>
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-foreground)]">{alert.title}</p>
                  <p className="text-xs text-[color:var(--color-foreground-muted)]">{alert.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <AutomationBuilder moduleKey="edtech" />
      <Timeline
        id="edtech-log"
        title="Learning Automation Log"
        entries={[
          {
            label: 'Certificates issued',
            timestamp: 'Today · 04:10 UTC',
            status: 'success',
            description: 'Credly sync delivered 412 new badges with signed receipts.',
          },
          {
            label: 'Inactivity nudges sent',
            timestamp: 'Today · 01:55 UTC',
            status: 'info',
            description: 'Multi-channel nudges sent to dormant learners with mentor cc.',
          },
          {
            label: 'Adaptive remediation refreshed',
            timestamp: 'Yesterday · 19:10 UTC',
            status: 'warning',
            description: 'AI recommended additional resources for flagged competencies.',
          },
        ]}
      />
    </div>
  );
}

function NichesModule({ module }: { module: ModuleDefinition }) {
  return (
    <div className="grid gap-6">
      <KpiGrid module={module} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="surface-card xl:col-span-5" aria-labelledby="niche-appointments">
          <h4 id="niche-appointments" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Healthcare Appointments
          </h4>
          <ul className="mt-4 space-y-3">
            {[
              { patient: 'Jordan Alvarez', clinician: 'Dr. Malik', time: '09:00 · Video', status: 'CONFIRMED' },
              { patient: 'Priya Desai', clinician: 'PA Owens', time: '09:30 · Clinic', status: 'AT RISK' },
              { patient: 'Sean Rivers', clinician: 'Dr. Chen', time: '10:00 · Clinic', status: 'CONFIRMED' },
            ].map((appt) => (
              <li
                key={`${appt.patient}-${appt.time}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{appt.patient}</p>
                  <p className="text-xs text-[color:var(--color-foreground-muted)]">{appt.clinician} · {appt.time}</p>
                </div>
                <span className={`status-badge ${appt.status === 'AT RISK' ? 'badge-warning' : 'badge-success'}`}>
                  <span aria-hidden="true">{appt.status === 'AT RISK' ? '⚠' : '✓'}</span>
                  <span>{appt.status}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface-card xl:col-span-7" aria-labelledby="niche-automation">
          <h4 id="niche-automation" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Automation Logs & Tabs
          </h4>
          <div className="mt-4 grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {['Healthcare', 'Finance', 'Real Estate', 'Shared'].map((label) => (
                <span key={label} className="pill bg-[color:var(--color-surface)] border-[color:var(--color-border)]">
                  {label}
                </span>
              ))}
            </div>
            <Timeline
              id="niche-log"
              title="Vertical Automation Log"
              entries={[
                {
                  label: 'No-show prediction escalated',
                  timestamp: 'Today · 07:15 UTC',
                  status: 'warning',
                  description: 'Healthcare assistant triggered concierge outreach.',
                },
                {
                  label: 'Expense anomaly flagged',
                  timestamp: 'Today · 06:50 UTC',
                  status: 'error',
                  description: 'Finance automation routed to compliance for review.',
                },
                {
                  label: 'Listing nurture drip launched',
                  timestamp: 'Yesterday · 20:05 UTC',
                  status: 'success',
                  description: 'Real estate pipeline engaged across email, SMS, and WhatsApp.',
                },
              ]}
            />
          </div>
        </section>
      </div>
      <AutomationBuilder moduleKey="niches" />
    </div>
  );
}

export default function DashboardPage() {
  const { theme, setTheme, direction, setDirection, motion, setMotion } = useThemeContext();
  const [activeModule, setActiveModule] = useState<ModuleKey>('saas');
  const [viewState, setViewState] = useState<ViewState>('success');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: createId(),
      module: 'saas',
      format: 'csv',
      timestamp: 'Today · 03:15 UTC',
      signer: formatSigner.csv,
    },
  ]);
  const [toast, setToast] = useState<null | { title: string; description: string; kind: 'success' | 'info' | 'error' }>(null);

  const activeDefinition = useMemo(
    () => moduleDefinitions.find((module) => module.key === activeModule)!,
    [activeModule]
  );

  const handleExport = (format: ExportFormat) => {
    const entry: AuditLogEntry = {
      id: createId(),
      module: activeModule,
      format,
      timestamp: new Date().toUTCString(),
      signer: formatSigner[format],
    };
    setAuditLog((prev) => [entry, ...prev]);
    setToast({
      title: `Exported ${formatLabel[format]} for ${activeDefinition.name}`,
      description: `Signed URL issued · ${entry.signer}`,
      kind: 'success',
    });
    setTimeout(() => setToast(null), 3600);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div className="grid gap-6">
        <section className="surface-card surface-card--raised motion-group" data-state="enter">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <ModuleHeader />
              <p className="text-sm text-[color:var(--color-foreground-muted)]">
                Unified design system with light, dark, and RTL parity. All components respect WCAG AA contrast,
                Reduced Motion preferences, and 8pt baseline grid across viewport breakpoints.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--color-foreground-muted)]" htmlFor="theme-select">
                  Theme
                </label>
                <select
                  id="theme-select"
                  className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as typeof theme)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--color-foreground-muted)]" htmlFor="direction-select">
                  Direction
                </label>
                <select
                  id="direction-select"
                  className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
                  value={direction}
                  onChange={(event) => setDirection(event.target.value as typeof direction)}
                >
                  <option value="ltr">LTR</option>
                  <option value="rtl">RTL</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-medium text-[color:var(--color-foreground-muted)]" htmlFor="motion-select">
                  Motion
                </label>
                <select
                  id="motion-select"
                  className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
                  value={motion}
                  onChange={(event) => setMotion(event.target.value as typeof motion)}
                >
                  <option value="full">Full</option>
                  <option value="reduce">Reduce</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="grid gap-2">
              <p className="text-xs font-medium text-[color:var(--color-foreground-muted)]">Module</p>
              <div className="flex flex-wrap gap-2">
                {moduleDefinitions.map((module) => (
                  <button
                    key={module.key}
                    type="button"
                    className={`pill transition-transform duration-[var(--duration-standard)] ease-[var(--ease-smooth)] ${
                      module.key === activeModule
                        ? 'bg-[color:var(--color-primary)] text-white'
                        : 'bg-[color:var(--color-surface)] border-[color:var(--color-border)] hover:-translate-y-0.5'
                    }`}
                    onClick={() => setActiveModule(module.key)}
                  >
                    {module.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <p className="text-xs font-medium text-[color:var(--color-foreground-muted)]">State</p>
              <div className="flex flex-wrap gap-2">
                {VIEW_STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    className={`pill transition-transform duration-[var(--duration-standard)] ease-[var(--ease-smooth)] ${
                      viewState === state
                        ? 'bg-[color:var(--color-success)] text-white'
                        : 'bg-[color:var(--color-surface)] border-[color:var(--color-border)] hover:-translate-y-0.5'
                    }`}
                    onClick={() => setViewState(state)}
                  >
                    {stateLabel(state)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ModuleContainer module={activeDefinition} viewState={viewState} onExport={handleExport} />

        <section className="surface-card" aria-labelledby="audit-log-title">
          <h3 id="audit-log-title" className="text-lg font-semibold text-[color:var(--color-foreground)]">
            Export Audit Trail
          </h3>
          <p className="text-sm text-[color:var(--color-foreground-muted)]">
            Every export issues a signed URL and immutable log entry. Latest shown first.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="table-grid">
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Module</th>
                  <th scope="col">Format</th>
                  <th scope="col">Signed URL</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.timestamp}</td>
                    <td>{moduleDefinitions.find((mod) => mod.key === entry.module)?.name ?? entry.module}</td>
                    <td>{formatLabel[entry.format]}</td>
                    <td>{entry.signer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {toast && (
        <div role="status" className="toast" data-kind={toast.kind}>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{toast.title}</p>
            <p className="text-xs text-[color:var(--color-foreground-muted)]">{toast.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
