'use client';

import { useMemo, useState } from 'react';
import { motionChoreography, tokenGroups } from '@/lib/designTokens';
import { useExperienceContext } from '../providers';

type TrendTone = 'positive' | 'negative' | 'neutral';

type KPI = {
  label: string;
  value: string;
  deltaLabel: string;
  tone: TrendTone;
  caption?: string;
};

type ChartType = 'line' | 'bar' | 'donut' | 'heatmap' | 'funnel';

type LinePoint = { x: string; y: number };

type ChartConfig = {
  id: string;
  title: string;
  subtitle: string;
  type: ChartType;
  altText: string;
  data:
    | { points: LinePoint[] }
    | { categories: string[]; series: number[] }
    | { segments: { id: string; label: string; value: number; pattern: string }[] }
    | { matrix: number[][]; rows: string[]; columns: string[] }
    | { steps: { label: string; value: number }[] };
};

type TableConfig = {
  caption: string;
  columns: string[];
  rows: (string | JSX.Element)[][];
  footnote?: string;
};

type AutomationFlow = {
  name: string;
  description: string;
  status: 'enabled' | 'paused';
};

type AutomationLog = {
  id: string;
  timestamp: string;
  module: string;
  summary: string;
  status: 'success' | 'warning' | 'error';
};

type ModuleState = {
  label: 'Loading' | 'Empty' | 'Error' | 'Success';
  description: string;
};

type ModuleConfig = {
  key: string;
  title: string;
  description: string;
  kpis: KPI[];
  charts: ChartConfig[];
  table: TableConfig;
  queues?: TableConfig;
  automationFlows: AutomationFlow[];
  states: ModuleState[];
  automationNotes: string[];
};

type ExportRecord = {
  id: string;
  module: string;
  format: 'csv' | 'json';
  url: string;
  createdAt: string;
};

const HEADER_TITLE =
  'Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches';
const HEADER_GENERATED_AT = '09/26/2025, 4:14:00 AM';

const statusIcon: Record<AutomationLog['status'], string> = {
  success: '✔️',
  warning: '⚠️',
  error: '⛔',
};

function TrendPill({ tone, label }: { tone: TrendTone; label: string }) {
  const toneClass =
    tone === 'positive'
      ? 'success'
      : tone === 'negative'
        ? 'error'
        : 'info';
  return (
    <span className={`ds-badge ${toneClass}`} aria-label={`Trend ${tone}: ${label}`}>
      {tone === 'positive' ? '▲' : tone === 'negative' ? '▼' : '◆'} {label}
    </span>
  );
}

function KPIGroup({ heading, kpis }: { heading: string; kpis: KPI[] }) {
  return (
    <section aria-labelledby={`${heading.replace(/\s+/g, '-').toLowerCase()}-kpis`} className="ds-card raised">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 id={`${heading.replace(/\s+/g, '-').toLowerCase()}-kpis`} className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">
            {heading}
          </h3>
          <p className="ds-caption">Tabular KPIs align to the automation intelligence baseline.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full flex gap-4" style={{ paddingBottom: 'var(--space-8)' }}>
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="min-w-[220px] flex-1 ds-card"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              aria-label={`${kpi.label} metric`}
            >
              <p className="ds-label-strong">{kpi.label}</p>
              <p className="ds-kpi-value mt-2" aria-live="polite">
                {kpi.value}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <TrendPill tone={kpi.tone} label={kpi.deltaLabel} />
                {kpi.caption ? <span className="ds-caption">{kpi.caption}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChartRenderer({ chart }: { chart: ChartConfig }) {
  const descriptionId = `${chart.id}-description`;
  const renderContent = () => {
    if (chart.type === 'line') {
      const dataset = chart.data as { points: LinePoint[] };
      const values = dataset.points.map((point) => point.y);
      const maxValue = Math.max(...values, 1);
      const minValue = Math.min(...values, 0);
      const viewHeight = 180;
      const viewWidth = 360;
      const points = dataset.points
        .map((point, index) => {
          const x = (index / (dataset.points.length - 1 || 1)) * viewWidth;
          const normalized = (point.y - minValue) / (maxValue - minValue || 1);
          const y = viewHeight - normalized * viewHeight;
          return `${x},${y}`;
        })
        .join(' ');
      return (
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} role="presentation" className="w-full h-44">
          <defs>
            <linearGradient id={`${chart.id}-line`} x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary-300)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="var(--color-surface-subtle)" rx="12" />
          <polyline
            fill="none"
            stroke={`url(#${chart.id}-line)`}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          {dataset.points.map((point, index) => {
            const x = (index / (dataset.points.length - 1 || 1)) * viewWidth;
            const normalized = (point.y - minValue) / (maxValue - minValue || 1);
            const y = viewHeight - normalized * viewHeight;
            return <circle key={point.x} cx={x} cy={y} r={6} fill="var(--color-primary-500)" />;
          })}
        </svg>
      );
    }
    if (chart.type === 'bar') {
      const dataset = chart.data as { categories: string[]; series: number[] };
      const maxValue = Math.max(...dataset.series, 1);
      const barWidth = 52;
      const gap = 12;
      const chartHeight = 180;
      return (
        <svg viewBox={`0 0 ${(barWidth + gap) * dataset.series.length} ${chartHeight}`} role="presentation" className="w-full h-44">
          {dataset.series.map((value, index) => {
            const height = (value / maxValue) * (chartHeight - 24);
            const x = index * (barWidth + gap);
            const y = chartHeight - height - 8;
            return (
              <g key={dataset.categories[index]}>
                <rect x={x} y={y} width={barWidth} height={height} rx="12" fill="var(--color-primary-500)" opacity={0.88} />
                <pattern id={`${chart.id}-pattern-${index}`} patternUnits="userSpaceOnUse" width="6" height="6">
                  <path d="M0 0L6 6ZM-3 3L3 9ZM3 -3L9 3" stroke="var(--color-text-inverse)" strokeWidth="1" />
                </pattern>
                <rect
                  x={x + barWidth * 0.15}
                  y={y + barWidth * 0.1}
                  width={barWidth * 0.7}
                  height={height - barWidth * 0.2}
                  fill={`url(#${chart.id}-pattern-${index})`}
                  opacity={0.22}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--color-text-subtle)"
                  fontWeight={600}
                >
                  {value.toLocaleString()}
                </text>
                <text x={x + barWidth / 2} y={chartHeight} textAnchor="middle" fontSize="12" fill="var(--color-text-muted)">
                  {dataset.categories[index]}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }
    if (chart.type === 'donut') {
      const dataset = chart.data as { segments: { id: string; label: string; value: number; pattern: string }[] };
      const total = dataset.segments.reduce((acc, segment) => acc + segment.value, 0);
      const radius = 64;
      const circumference = 2 * Math.PI * radius;
      let accumulated = 0;
      return (
        <svg viewBox="0 0 220 220" role="presentation" className="w-full h-56">
          <defs>
            {dataset.segments.map((segment) => (
              <pattern
                key={`${chart.id}-${segment.id}`}
                id={`${chart.id}-pattern-${segment.id}`}
                patternUnits="userSpaceOnUse"
                width="8"
                height="8"
              >
                <rect width="8" height="8" fill="var(--color-primary-500)" opacity={0.7} />
                <path d="M0 8L8 0" stroke="var(--color-text-inverse)" strokeWidth="2" strokeDasharray={segment.pattern === 'dash' ? '2 4' : '4 4'} />
              </pattern>
            ))}
          </defs>
          <g transform="translate(110,110)">
            <circle r={radius} fill="none" stroke="var(--color-surface-subtle)" strokeWidth="28" />
            {dataset.segments.map((segment) => {
              const dash = (segment.value / total) * circumference;
              const dashArray = `${dash} ${circumference - dash}`;
              const circle = (
                <circle
                  key={segment.id}
                  r={radius}
                  fill="none"
                  stroke={`url(#${chart.id}-pattern-${segment.id})`}
                  strokeWidth="28"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-accumulated}
                  strokeLinecap="butt"
                />
              );
              accumulated += dash;
              return circle;
            })}
            <text textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight={600} fill="var(--color-text-strong)">
              {total}
            </text>
          </g>
        </svg>
      );
    }
    if (chart.type === 'heatmap') {
      const dataset = chart.data as { matrix: number[][]; rows: string[]; columns: string[] };
      const flat = dataset.matrix.flat();
      const max = Math.max(...flat, 1);
      const cellSize = 36;
      return (
        <svg viewBox={`0 0 ${cellSize * dataset.columns.length} ${cellSize * dataset.rows.length}`} role="presentation" className="w-full h-56">
          {dataset.matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const intensity = value / max;
              return (
                <g key={`${rowIndex}-${colIndex}`}>
                  <rect
                    x={colIndex * cellSize}
                    y={rowIndex * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={`rgba(107, 78, 255, ${0.15 + intensity * 0.7})`}
                    stroke="var(--color-border)"
                    rx="8"
                  />
                  <text
                    x={colIndex * cellSize + cellSize / 2}
                    y={rowIndex * cellSize + cellSize / 2 + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--color-text-strong)"
                    fontWeight={600}
                  >
                    {value}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      );
    }
    const dataset = chart.data as { steps: { label: string; value: number }[] };
    const max = Math.max(...dataset.steps.map((step) => step.value), 1);
    return (
      <div className="flex flex-col gap-3" aria-hidden="true">
        {dataset.steps.map((step, index) => {
          const width = `${(step.value / max) * 100}%`;
          return (
            <div key={step.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[length:var(--font-size-14)] text-[color:var(--color-text-subtle)]">
                <span className="font-semibold">{index + 1}. {step.label}</span>
                <span>{step.value.toLocaleString()}</span>
              </div>
              <div className="h-10 bg-[color:var(--color-surface-subtle)] rounded-lg overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width,
                    background: `linear-gradient(90deg, var(--color-primary-500), var(--color-primary-300))`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <figure className="ds-card raised flex flex-col gap-4" style={{ minHeight: '320px' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[length:var(--font-size-14)] font-semibold text-[color:var(--color-text-subtle)] uppercase tracking-[0.12em]">
            {chart.title}
          </p>
          <h4 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)] mt-1">
            {chart.subtitle}
          </h4>
        </div>
        <span className="ds-chip" aria-hidden="true">
          {chart.type.toUpperCase()}
        </span>
      </div>
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4" role="img" aria-describedby={descriptionId}>
        {renderContent()}
      </div>
      <figcaption id={descriptionId} className="ds-caption">
        {chart.altText}
      </figcaption>
    </figure>
  );
}

function DataTable({ table }: { table: TableConfig }) {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label={table.caption}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">
            {table.caption}
          </h4>
          {table.footnote ? <p className="ds-caption mt-1">{table.footnote}</p> : null}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="ds-table" role="grid">
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th scope="col" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ModuleStates({ states }: { states: ModuleState[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-label="Module states">
      {states.map((state) => (
        <div key={state.label} className="ds-card dense" role="group" aria-label={`${state.label} state`}>
          <p className="text-[length:var(--font-size-14)] font-semibold text-[color:var(--color-text-strong)]">{state.label}</p>
          {state.label === 'Loading' ? (
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="ds-skeleton h-3 w-full" />
              <div className="ds-skeleton h-3 w-3/4" />
              <div className="ds-skeleton h-3 w-2/3" />
            </div>
          ) : (
            <p className="ds-caption mt-2">{state.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function AutomationFlowList({ flows, notes }: { flows: AutomationFlow[]; notes: string[] }) {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Automation highlights">
      <div>
        <h4 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Automation Programs</h4>
        <p className="ds-caption mt-1">Builder-ready sequences aligned with orchestration logs.</p>
      </div>
      <ul className="space-y-3">
        {flows.map((flow) => (
          <li key={flow.name} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[color:var(--color-text-strong)] font-semibold">{flow.name}</p>
              <p className="ds-caption text-[color:var(--color-text-muted)]">{flow.description}</p>
            </div>
            <span className={`ds-badge ${flow.status === 'enabled' ? 'success' : 'warning'}`}>
              {flow.status === 'enabled' ? 'Active' : 'Paused'}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-[color:var(--color-border)] pt-3 space-y-2">
        {notes.map((note) => (
          <p key={note} className="ds-caption flex items-start gap-2">
            <span aria-hidden="true">☑︎</span>
            <span>{note}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
const modules: ModuleConfig[] = [
  {
    key: 'saas',
    title: 'SaaS Reliability & Growth',
    description:
      'Elevate subscription health with anomaly-aware billing, retention workflows, and AI-assisted workflow generation.',
    kpis: [
      { label: 'Net Revenue Retention', value: '124.3%', deltaLabel: '+4.2% vs LY', tone: 'positive', caption: 'Cohort normalized' },
      { label: 'Monthly Churn', value: '2.6%', deltaLabel: '-0.7 pts', tone: 'positive', caption: 'Smart retry impact' },
      { label: 'API Throughput', value: '1.2B calls', deltaLabel: '+180M', tone: 'positive', caption: 'Adaptive throttling live' },
      { label: 'Workflow Launches', value: '327', deltaLabel: '↑ Natural language', tone: 'neutral', caption: 'Launch workflow CTA conversions' },
    ],
    charts: [
      {
        id: 'saas-cohort-line',
        title: 'Cohort Trend',
        subtitle: 'Weekly expansion revenue vs churned accounts',
        type: 'line',
        altText: 'Line chart showing weekly expansion revenue outpacing churn over the last 12 weeks.',
        data: {
          points: [
            { x: 'W1', y: 98 },
            { x: 'W2', y: 103 },
            { x: 'W3', y: 109 },
            { x: 'W4', y: 112 },
            { x: 'W5', y: 116 },
            { x: 'W6', y: 121 },
            { x: 'W7', y: 125 },
            { x: 'W8', y: 130 },
            { x: 'W9', y: 136 },
            { x: 'W10', y: 142 },
            { x: 'W11', y: 147 },
            { x: 'W12', y: 151 },
          ],
        },
      },
      {
        id: 'saas-plan-mix',
        title: 'Plan Utilization',
        subtitle: 'Active seats by plan tier with usage segments',
        type: 'donut',
        altText: 'Donut chart showing 55% of seats on Growth, 30% on Scale, 15% on Starter tiers with patterned segments.',
        data: {
          segments: [
            { id: 'growth', label: 'Growth', value: 550, pattern: 'dash' },
            { id: 'scale', label: 'Scale', value: 300, pattern: 'dot' },
            { id: 'starter', label: 'Starter', value: 150, pattern: 'solid' },
          ],
        },
      },
    ],
    table: {
      caption: 'Usage Thresholds',
      columns: ['Account', 'Plan', 'Limit', 'Usage', 'Status'],
      rows: [
        ['Atlassian Partners', 'Scale', '1.0B API calls', '0.82B', <span className="ds-badge warning" key="saas1">Approaching</span>],
        ['Nova Labs', 'Growth', '250 seats', '240', <span className="ds-badge success" key="saas2">Healthy</span>],
        ['Orbit Analytics', 'Starter', '50 seats', '50', <span className="ds-badge error" key="saas3">Upgrade needed</span>],
      ],
      footnote: 'Axis alignment tuned for accessibility; captions maintain AA contrast.',
    },
    automationFlows: [
      {
        name: 'Churn Sentinel',
        description: 'Predictive churn triggers escalate to success pods and launch recovery offers.',
        status: 'enabled',
      },
      {
        name: 'Billing Guardian',
        description: 'Dunning retries with payment method fallback and invoice email summarization.',
        status: 'enabled',
      },
      {
        name: 'Usage Accelerator',
        description: 'API anomaly throttling with plan-limit upsell prompts.',
        status: 'paused',
      },
    ],
    states: [
      { label: 'Loading', description: 'Skeleton shimmer indicates active refresh (≤400ms before deltas animate).' },
      { label: 'Empty', description: 'No workflows yet. Use natural language builder to create a recipe.' },
      { label: 'Error', description: 'Retry contact with Billing Guardian. API usage service timed out.' },
      { label: 'Success', description: 'Workflow launched with guardrails and audit trail stored.' },
    ],
    automationNotes: [
      'Nightly hygiene cohorts rebuild scoring models and archive stale trials.',
      'Launch workflow CTA uses emphasis easing and pulses on success.',
    ],
  },
  {
    key: 'ecommerce',
    title: 'E-commerce Growth & Logistics',
    description:
      'Optimize conversion, fulfillment, and loyalty across omnichannel journeys with automation-ready analytics.',
    kpis: [
      { label: 'Gross Merchandise Value', value: '$8.4M', deltaLabel: '+12% QoQ', tone: 'positive', caption: 'Baseline aligned to trendline' },
      { label: 'Conversion Rate', value: '3.48%', deltaLabel: '+0.36 pts', tone: 'positive', caption: 'Header contrast boosted' },
      { label: 'Avg. Fulfillment Time', value: '1.7 days', deltaLabel: '-0.4 days', tone: 'positive', caption: 'Vendor routing automation' },
      { label: 'Abandoned Cart Saves', value: '2,941', deltaLabel: '+418', tone: 'neutral', caption: 'Email→SMS→WhatsApp flow' },
    ],
    charts: [
      {
        id: 'commerce-sales-line',
        title: 'Sales Momentum',
        subtitle: 'Daily revenue vs. fulfilment completion baseline-aligned',
        type: 'line',
        altText: 'Line chart showing synchronized baseline between sales trend and fulfillment completion.',
        data: {
          points: [
            { x: 'D1', y: 640 },
            { x: 'D2', y: 680 },
            { x: 'D3', y: 720 },
            { x: 'D4', y: 760 },
            { x: 'D5', y: 820 },
            { x: 'D6', y: 840 },
            { x: 'D7', y: 880 },
          ],
        },
      },
      {
        id: 'commerce-funnel',
        title: 'Conversion Funnel',
        subtitle: 'Session → Checkout → Purchase → Loyalty enrollment',
        type: 'funnel',
        altText: 'Funnel showing 1.2M sessions, 320k checkouts, 210k purchases, 68k loyalty enrollments.',
        data: {
          steps: [
            { label: 'Sessions', value: 1200000 },
            { label: 'Checkout Initiated', value: 320000 },
            { label: 'Purchases', value: 210000 },
            { label: 'Loyalty Enrollment', value: 68000 },
          ],
        },
      },
    ],
    table: {
      caption: 'Merchandising Performance',
      columns: ['Collection', 'CVR %', 'AOV', 'Inventory', 'Status'],
      rows: [
        ['Summer Capsule', '4.2%', '$182', 'Low (12%)', <span key="ec1" className="ds-badge warning">Replenish</span>],
        ['Home Essentials', '3.7%', '$96', 'Healthy (54%)', <span key="ec2" className="ds-badge success">On target</span>],
        ['VIP Exclusives', '9.1%', '$268', 'Tight (8%)', <span key="ec3" className="ds-badge error">Escalate</span>],
      ],
      footnote: 'Headers boldened for conversion columns; baseline aligned with chart grid.',
    },
    automationFlows: [
      { name: 'Abandoned Cart Concierge', description: 'Email → SMS → WhatsApp rescue sequences with dynamic offers.', status: 'enabled' },
      { name: 'Smart Vendor Replenishment', description: 'Low-stock triggers re-order tasks by vendor SLA windows.', status: 'enabled' },
      { name: 'Fraud Sentinel', description: 'Risk scoring escalates to manual review queue with hold toggles.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Inventory skeleton table aligns with sales baseline while data streams load.' },
      { label: 'Empty', description: 'No automation templates published. Import from Shopify or Magento connectors.' },
      { label: 'Error', description: 'Fraud service unreachable. Queue orders on hold and alert risk pod.' },
      { label: 'Success', description: 'Multi-channel sync completed with Klaviyo + WhatsApp connectors.' },
    ],
    automationNotes: [
      'Return optimization flow issues dynamic refunds and restock routing.',
      'VIP perks automation upgrades loyalty tiers with personalization tokens.',
    ],
  },
  {
    key: 'corporate',
    title: 'Corporate Analytics Command',
    description:
      'Executive-ready analytics for enterprise revenue, pipeline velocity, and ML-led lead prioritization.',
    kpis: [
      { label: 'Pipeline Coverage', value: '3.6x', deltaLabel: '+0.4x', tone: 'positive', caption: 'Executive baseline' },
      { label: 'Lead Win Probability', value: '62%', deltaLabel: '+6 pts', tone: 'positive', caption: 'ML scored' },
      { label: 'Velocity Stall Alerts', value: '47', deltaLabel: '-9', tone: 'positive', caption: 'Automations resolved' },
      { label: 'C-Suite Digest', value: '12 sent', deltaLabel: '+3 insights', tone: 'neutral', caption: 'Auto commentary' },
    ],
    charts: [
      {
        id: 'corporate-funnel',
        title: 'Revenue Funnel',
        subtitle: 'Lead → Qualified → Proposal → Closed Won pacing',
        type: 'funnel',
        altText: 'Funnel chart showing 48k leads converting to 3.6k closed-won deals.',
        data: {
          steps: [
            { label: 'Leads', value: 48000 },
            { label: 'Qualified', value: 16000 },
            { label: 'Proposal', value: 7400 },
            { label: 'Closed Won', value: 3600 },
          ],
        },
      },
      {
        id: 'corporate-donut',
        title: 'Segment Contribution',
        subtitle: 'Structured 5-color palette across verticals',
        type: 'donut',
        altText: 'Donut chart: SaaS 28%, Manufacturing 22%, Finance 18%, Healthcare 17%, Other 15%.',
        data: {
          segments: [
            { id: 'saas', label: 'SaaS', value: 28, pattern: 'dash' },
            { id: 'mfg', label: 'Manufacturing', value: 22, pattern: 'dot' },
            { id: 'fin', label: 'Finance', value: 18, pattern: 'dash' },
            { id: 'health', label: 'Healthcare', value: 17, pattern: 'dot' },
            { id: 'other', label: 'Other', value: 15, pattern: 'solid' },
          ],
        },
      },
    ],
    table: {
      caption: 'Executive Insights',
      columns: ['Region', 'Pipeline $', 'Velocity Days', 'Intent Surge', 'Focus'],
      rows: [
        ['AMER', '$24M', '32', 'High (38%)', <span key="corp1" className="ds-badge success">Accelerate</span>],
        ['EMEA', '$18M', '44', 'Medium (21%)', <span key="corp2" className="ds-badge warning">Enablement</span>],
        ['APAC', '$12M', '48', 'High (40%)', <span key="corp3" className="ds-badge success">Target</span>],
      ],
      footnote: 'Funnel spacing normalized vs insights padding for consistent rhythm.',
    },
    automationFlows: [
      { name: 'ML Lead Scoring', description: 'Refresh model nightly; sync high-intent to CRM priority queues.', status: 'enabled' },
      { name: 'Velocity Alerts', description: 'Detect stage aging >4 days and route to sales coaching pods.', status: 'enabled' },
      { name: 'Weekly C-Suite Digest', description: 'Auto commentary with anomaly flagging delivered Mondays.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Executive module skeleton respects baseline alignment before data streaming.' },
      { label: 'Empty', description: 'Upload CRM dataset to initialize ML scoring insights.' },
      { label: 'Error', description: 'Data warehouse sync paused. Check credentials for Snowflake connector.' },
      { label: 'Success', description: 'Lifecycle nurture orchestrations running with zero drift.' },
    ],
    automationNotes: ['Intent surge triggers orchestrate nurture drips by product line.'],
  },
  {
    key: 'custom-app',
    title: 'Custom Web App Productivity',
    description: 'Balance kanban throughput, backlog hygiene, and capacity across hybrid product teams.',
    kpis: [
      { label: 'Sprint Velocity', value: '68 pts', deltaLabel: '+7 pts', tone: 'positive', caption: 'Aligned to backlog rhythm' },
      { label: 'Active WIP', value: '42 cards', deltaLabel: '-5 cards', tone: 'positive', caption: 'Kanban width + gutters' },
      { label: 'Stale Tasks', value: '6', deltaLabel: '-4', tone: 'positive', caption: 'Stale nudges applied' },
      { label: 'Capacity Utilization', value: '78%', deltaLabel: '+3 pts', tone: 'neutral', caption: 'Balanced across pods' },
    ],
    charts: [
      {
        id: 'custom-kanban-line',
        title: 'Throughput Trend',
        subtitle: 'Completed cards vs committed backlog',
        type: 'line',
        altText: 'Line chart showing increasing throughput over 8 sprints.',
        data: {
          points: [
            { x: 'S1', y: 42 },
            { x: 'S2', y: 48 },
            { x: 'S3', y: 53 },
            { x: 'S4', y: 57 },
            { x: 'S5', y: 61 },
            { x: 'S6', y: 63 },
            { x: 'S7', y: 66 },
            { x: 'S8', y: 68 },
          ],
        },
      },
      {
        id: 'custom-workload-heatmap',
        title: 'Workload Balance',
        subtitle: 'Capacity heatmap across squads and ceremonies',
        type: 'heatmap',
        altText: 'Heatmap showing distribution of workload across squads with numeric overlays for clarity.',
        data: {
          rows: ['Platform', 'Mobile', 'Growth', 'Design'],
          columns: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          matrix: [
            [6, 4, 8, 7, 5],
            [5, 6, 6, 6, 4],
            [4, 5, 7, 5, 4],
            [3, 4, 5, 4, 3],
          ],
        },
      },
    ],
    table: {
      caption: 'Backlog & Rituals',
      columns: ['Squad', 'Backlog Items', 'Ready', 'Blocked', 'Action'],
      rows: [
        ['Platform', '18', '12', <span key="ca1" className="ds-badge success">2 cleared</span>, <button key="ca1btn" className="ds-chip ds-focus-ring">Review</button>],
        ['Mobile', '14', '9', <span key="ca2" className="ds-badge warning">3 pending</span>, <button key="ca2btn" className="ds-chip ds-focus-ring">Sync</button>],
        ['Growth', '9', '7', <span key="ca3" className="ds-badge info">Focus</span>, <button key="ca3btn" className="ds-chip ds-focus-ring">Prioritize</button>],
      ],
      footnote: '+8px gutters between kanban lanes mirrored in table row spacing.',
    },
    automationFlows: [
      { name: 'Sprint Ritual Orchestrator', description: 'Plan, standup, review, and retro automation with reminders.', status: 'enabled' },
      { name: 'Stale Task Nudger', description: 'Detect inactivity >3 days and ping owners with context.', status: 'enabled' },
      { name: 'Capacity Balancer', description: 'Auto-shifts work between squads using workload matrix.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Kanban skeleton keeps column heights balanced during fetch.' },
      { label: 'Empty', description: 'No backlog imported. Connect Jira, Trello, or Asana for sync.' },
      { label: 'Error', description: 'Sync conflict detected. Review integration log timeline.' },
      { label: 'Success', description: 'Two-way sync active with automation guardrails.' },
    ],
    automationNotes: ['NLP idea triage surfaces product opportunities with semantic scoring.'],
  },
  {
    key: 'media',
    title: 'Content & Media Operations',
    description: 'Command publishing, talent coordination, and rights management with cross-channel automation.',
    kpis: [
      { label: 'Publishing Velocity', value: '84 stories', deltaLabel: '+12', tone: 'positive', caption: 'Queue aligned baseline' },
      { label: 'Ready / Review / Blocked', value: '34 / 18 / 6', deltaLabel: 'Icons reinforce state', tone: 'neutral', caption: 'Non-color cues active' },
      { label: 'Highlight Clips', value: '126', deltaLabel: '+28', tone: 'positive', caption: 'AI generator output' },
      { label: 'Rights Expiring', value: '9 assets', deltaLabel: '-3', tone: 'positive', caption: 'Alerts resolved' },
    ],
    charts: [
      {
        id: 'media-bar',
        title: 'Channel Mix',
        subtitle: 'Stories per channel with categorical palette',
        type: 'bar',
        altText: 'Bar chart showing counts for Web, App, YouTube, TikTok, Newsletter.',
        data: {
          categories: ['Web', 'App', 'YouTube', 'TikTok', 'Newsletter'],
          series: [48, 36, 22, 18, 12],
        },
      },
      {
        id: 'media-queue-line',
        title: 'Publishing Queue Health',
        subtitle: 'Aligned baseline between queue and automation card',
        type: 'line',
        altText: 'Line chart showing queue counts trending upward steadily.',
        data: {
          points: [
            { x: 'W1', y: 40 },
            { x: 'W2', y: 44 },
            { x: 'W3', y: 48 },
            { x: 'W4', y: 52 },
            { x: 'W5', y: 54 },
            { x: 'W6', y: 58 },
          ],
        },
      },
    ],
    table: {
      caption: 'Top Stories Queue',
      columns: ['Story', 'Stage', 'Channel', 'Owner', 'ETA'],
      rows: [
        [
          'Global Markets Brief',
          <span key="media1" className="ds-badge success">
            ✅ Ready
          </span>,
          'Web',
          <strong key="media1name">R. Chen</strong>,
          'Today 3 PM',
        ],
        [
          'Creator Spotlight',
          <span key="media2" className="ds-badge warning">
            🕒 Review
          </span>,
          'YouTube',
          <strong key="media2name">A. Lopez</strong>,
          'Tomorrow 10 AM',
        ],
        [
          'Policy Explainer',
          <span key="media3" className="ds-badge error">
            ⛔ Blocked
          </span>,
          'Newsletter',
          <strong key="media3name">K. Patel</strong>,
          'Awaiting Legal',
        ],
      ],
      footnote: 'Icons plus labels ensure color-blind safe state cues.',
    },
    automationFlows: [
      { name: 'Publishing Control Tower', description: 'Schedule orchestration with cross-channel pushes and approvals.', status: 'enabled' },
      { name: 'Semantic Auto-tagging', description: 'Vector tagging pipeline syncs to CMS and DAM metadata.', status: 'enabled' },
      { name: 'Blocked Queue Alerts', description: 'Escalates blocked stories to legal and rights teams.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Publishing queue skeleton and automation cards share padding density.' },
      { label: 'Empty', description: 'No content scheduled. Connect CMS or import CSV to populate queue.' },
      { label: 'Error', description: 'Clip generator service offline. Fallback to manual editing.' },
      { label: 'Success', description: 'All channels synchronized with YouTube and TikTok integrations.' },
    ],
    automationNotes: [
      'Highlight clip generator uses emphasis easing for preview transitions.',
      'Ready/Review/Blocked states include icons and tooltips for clarity.',
    ],
  },
  {
    key: 'edtech',
    title: 'EdTech Learning Outcomes',
    description: 'Track mastery, engagement, and certification velocity with adaptive interventions.',
    kpis: [
      { label: 'Active Learners', value: '84,120', deltaLabel: '+6.4% MoM', tone: 'positive', caption: 'Heatmap labels aligned' },
      { label: 'Completion Rate', value: '71%', deltaLabel: '+4 pts', tone: 'positive', caption: 'Remediation loop' },
      { label: 'Mentor Sessions', value: '1,942', deltaLabel: '+312', tone: 'positive', caption: 'Rotation automation' },
      { label: 'Certificates Issued', value: '5,480', deltaLabel: '+18%', tone: 'positive', caption: 'Auto-issued via Credly' },
    ],
    charts: [
      {
        id: 'edtech-heatmap',
        title: 'Mastery Heatmap',
        subtitle: 'Module mastery vs engagement with numeric overlays',
        type: 'heatmap',
        altText: 'Heatmap showing engagement distribution for modules with numeric overlays and tooltips.',
        data: {
          rows: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
          columns: ['Engagement', 'Mastery', 'Confidence', 'Remediation'],
          matrix: [
            [82, 74, 70, 48],
            [88, 79, 76, 55],
            [91, 84, 82, 68],
            [76, 69, 64, 46],
          ],
        },
      },
      {
        id: 'edtech-bar',
        title: 'Intervention Impact',
        subtitle: 'Adaptive nudges vs inactive cohorts',
        type: 'bar',
        altText: 'Bar chart comparing intervention impact across cohorts.',
        data: {
          categories: ['Freshmen', 'Sophomore', 'Junior', 'Senior'],
          series: [68, 74, 81, 77],
        },
      },
    ],
    table: {
      caption: 'Learner Signals',
      columns: ['Learner', 'Program', 'Status', 'Last Activity', 'Action'],
      rows: [
        [
          <strong key="ed1">M. Singh</strong>,
          'Data Science',
          <span key="ed1status" className="ds-badge warning">
            ⚠️ Needs attention
          </span>,
          '2 days ago',
          <button key="ed1btn" className="ds-chip ds-focus-ring">Assign mentor</button>,
        ],
        [
          <strong key="ed2">J. Morales</strong>,
          'Cybersecurity',
          <span key="ed2status" className="ds-badge success">
            ✅ On track
          </span>,
          'Today',
          <button key="ed2btn" className="ds-chip ds-focus-ring">Send kudos</button>,
        ],
        [
          <strong key="ed3">L. Chen</strong>,
          'Business Analytics',
          <span key="ed3status" className="ds-badge info">
            ℹ️ Monitor
          </span>,
          '5 days ago',
          <button key="ed3btn" className="ds-chip ds-focus-ring">Schedule 1:1</button>,
        ],
      ],
      footnote: 'Alert spacing normalized; table headers contrast strengthened.',
    },
    automationFlows: [
      { name: 'Auto Certificate Issuance', description: 'Issue credentials and sync to Credly instantly.', status: 'enabled' },
      { name: 'Inactivity Nudge Loop', description: 'Detect inactivity and send multi-channel reminders.', status: 'enabled' },
      { name: 'Adaptive Remediation', description: 'Launch targeted lessons when mastery <70%.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Heatmap skeleton ensures grid labels remain aligned.' },
      { label: 'Empty', description: 'No cohorts imported. Connect LMS to populate learners.' },
      { label: 'Error', description: 'Mentor rotation service unreachable. Retry or contact admin.' },
      { label: 'Success', description: 'Mentor rotation and adaptive nudges active across programs.' },
    ],
    automationNotes: ['LMS integration keeps rosters in sync across Canvas and Blackboard.'],
  },
  {
    key: 'niches',
    title: 'Specialized Niches (Healthcare, Finance, Real Estate)',
    description: 'Tailor automation and analytics for regulated industries with resilient UX.',
    kpis: [
      { label: 'Healthcare No-show Risk', value: '6.8%', deltaLabel: '-1.2 pts', tone: 'positive', caption: 'Prediction accuracy' },
      { label: 'Finance Expense SLA', value: '96% on-time', deltaLabel: '+3 pts', tone: 'positive', caption: 'Routing workflows' },
      { label: 'Real Estate Lead SLA', value: '92% within 2h', deltaLabel: '+8 pts', tone: 'positive', caption: 'Multi-channel reminders' },
      { label: 'Intake Assistants', value: '34 digital concierges', deltaLabel: '+9', tone: 'neutral', caption: 'Shared assistant pods' },
    ],
    charts: [
      {
        id: 'niche-line',
        title: 'Compliance Activity',
        subtitle: 'Healthcare escalation vs finance anomalies',
        type: 'line',
        altText: 'Line chart comparing compliance volumes across verticals.',
        data: {
          points: [
            { x: 'Jan', y: 28 },
            { x: 'Feb', y: 34 },
            { x: 'Mar', y: 31 },
            { x: 'Apr', y: 38 },
            { x: 'May', y: 36 },
            { x: 'Jun', y: 42 },
          ],
        },
      },
      {
        id: 'niche-bar',
        title: 'Workflow Impact',
        subtitle: 'Appointments balanced vs automation logs',
        type: 'bar',
        altText: 'Bar chart showing appointment adherence, expense approvals, and listing nurture completions.',
        data: {
          categories: ['Healthcare', 'Finance', 'Real Estate'],
          series: [86, 92, 88],
        },
      },
    ],
    table: {
      caption: 'Appointments & Automation Logs',
      columns: ['Domain', 'Primary Focus', 'Latest Automation', 'Owner', 'Status'],
      rows: [
        [
          'Healthcare',
          'Clinic reminders',
          'No-show escalation triggered',
          <strong key="hc-name">Dr. N. Alvarez</strong>,
          <span key="hc-status" className="ds-badge success">
            ✓ Stable
          </span>,
        ],
        [
          'Finance',
          'Expense routing',
          'Quarter close checklist automated',
          <strong key="fin-name">A. Reynolds</strong>,
          <span key="fin-status" className="ds-badge info">
            ℹ Monitoring
          </span>,
        ],
        [
          'Real Estate',
          'Lead nurture',
          'Listing drips distributed',
          <strong key="re-name">S. Morgan</strong>,
          <span key="re-status" className="ds-badge warning">
            • Attention
          </span>,
        ],
      ],
      footnote: 'Line weights tuned for dark mode readability; semantic badges reinforced with glyphs.',
    },
    automationFlows: [
      { name: 'Healthcare No-show Escalation', description: 'Predict, remind, and escalate to care team tasks.', status: 'enabled' },
      { name: 'Finance Close Automation', description: 'Route expenses, detect anomalies, orchestrate close checklist.', status: 'enabled' },
      { name: 'Real Estate Lead Orchestration', description: 'Assign leads, schedule drips, and manage reminders.', status: 'enabled' },
    ],
    states: [
      { label: 'Loading', description: 'Appointments card skeleton height equals automation logs for visual balance.' },
      { label: 'Empty', description: 'No domain selected. Choose Healthcare, Finance, or Real Estate to load data.' },
      { label: 'Error', description: 'Shared digital intake assistant offline. Failover to manual triage queue.' },
      { label: 'Success', description: 'All regulated workflows validated with audit trails.' },
    ],
    automationNotes: ['Digital intake assistants fan out triage tasks across industries.'],
  },
];
const automationTemplates = {
  saas: {
    triggers: ['Churn probability > 0.6', 'Payment failure detected', 'API error spike'],
    conditions: ['Customer tier = Growth+', 'Invoice status = Past due 3 days'],
    actions: ['Launch recovery journey', 'Open support escalation', 'Generate workflow via NL prompt'],
  },
  ecommerce: {
    triggers: ['Cart idle 3 hours', 'Inventory below 15%', 'High-risk payment'],
    conditions: ['Customer tagged VIP', 'SKU margin > 25%'],
    actions: ['Send SMS follow-up', 'Notify vendor for restock', 'Place order on review hold'],
  },
  corporate: {
    triggers: ['Intent surge detected', 'Stage stuck > 4 days', 'Lead score > 80'],
    conditions: ['Region = AMER', 'Deal size > $100k'],
    actions: ['Assign executive sponsor', 'Schedule coaching session', 'Send AI commentary digest'],
  },
  'custom-app': {
    triggers: ['Task stale 48h', 'Capacity > 90%', 'Sprint retro feedback negative'],
    conditions: ['Squad velocity < target', 'Story points > 8'],
    actions: ['Nudge owner with context', 'Rebalance capacity', 'Escalate to product lead'],
  },
  media: {
    triggers: ['Story blocked > 6h', 'Rights expiration approaching', 'Trending topic spike'],
    conditions: ['Channel = TikTok', 'Sponsor required'],
    actions: ['Alert legal + rights team', 'Generate highlight clip', 'Publish across channels'],
  },
  edtech: {
    triggers: ['Learner inactive 5 days', 'Assessment score < 70%', 'Mentor slot open'],
    conditions: ['Program = Data Science', 'Cohort risk = High'],
    actions: ['Send adaptive nudge', 'Assign mentor rotation', 'Issue completion certificate'],
  },
  niches: {
    triggers: ['No-show prediction > 0.5', 'Expense anomaly flagged', 'Lead idle > 2h'],
    conditions: ['Domain = Healthcare', 'Compliance severity = High'],
    actions: ['Escalate to care coordinator', 'Lock expense until review', 'Send multi-channel reminder'],
  },
};

const automationRunLogs: AutomationLog[] = [
  { id: 'run-2315', timestamp: '2025-09-25T04:28:00Z', module: 'SaaS', summary: 'Billing Guardian retried invoice and succeeded', status: 'success' },
  { id: 'run-2316', timestamp: '2025-09-25T04:32:00Z', module: 'E-commerce', summary: 'Fraud Sentinel held 12 orders for review', status: 'warning' },
  { id: 'run-2317', timestamp: '2025-09-25T04:36:00Z', module: 'Media', summary: 'Clip generator fallback triggered manual edit', status: 'error' },
  { id: 'run-2318', timestamp: '2025-09-25T04:40:00Z', module: 'EdTech', summary: 'Adaptive remediation launched for 64 learners', status: 'success' },
];

function AutomationBuilder({ onPreview }: { onPreview: (payload: string) => void }) {
  const [moduleKey, setModuleKey] = useState<ModuleConfig['key']>('saas');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const template = automationTemplates[moduleKey];

  const toggleItem = (collection: string[], value: string, setter: (next: string[]) => void) => {
    setter(collection.includes(value) ? collection.filter((item) => item !== value) : [...collection, value]);
  };

  const preview = () => {
    const summary = `Automation for ${moduleKey}:\nTriggers: ${selectedTriggers.join(', ') || 'None'}\nConditions: ${selectedConditions.join(', ') || 'None'}\nActions: ${selectedActions.join(', ') || 'None'}`;
    onPreview(summary);
  };

  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Automation builder">
      <div className="flex flex-col gap-1">
        <h3 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Automation Builder</h3>
        <p className="ds-caption">Compose triggers, conditions, and actions with full keyboard support.</p>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-[color:var(--color-text-subtle)]">
        Module
        <select
          className="ds-card dense bg-[color:var(--color-surface-subtle)] border border-[color:var(--color-border)] focus:outline-none focus:ring-0"
          value={moduleKey}
          onChange={(event) => {
            setModuleKey(event.target.value as ModuleConfig['key']);
            setSelectedTriggers([]);
            setSelectedConditions([]);
            setSelectedActions([]);
          }}
        >
          {modules.map((module) => (
            <option key={module.key} value={module.key}>
              {module.title}
            </option>
          ))}
        </select>
      </label>
      <div className="grid lg:grid-cols-3 gap-4" role="group" aria-label="Automation composer">
        <AutomationBuilderColumn
          label="Triggers"
          description="Events that start the automation"
          items={template.triggers}
          selectedItems={selectedTriggers}
          onToggle={(value) => toggleItem(selectedTriggers, value, setSelectedTriggers)}
        />
        <AutomationBuilderColumn
          label="Conditions"
          description="Rules that must be true"
          items={template.conditions}
          selectedItems={selectedConditions}
          onToggle={(value) => toggleItem(selectedConditions, value, setSelectedConditions)}
        />
        <AutomationBuilderColumn
          label="Actions"
          description="What happens next"
          items={template.actions}
          selectedItems={selectedActions}
          onToggle={(value) => toggleItem(selectedActions, value, setSelectedActions)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 justify-between border-t border-[color:var(--color-border)] pt-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-subtle)]">
            <input type="checkbox" className="accent-[var(--color-primary-500)]" /> Enable audit trail sync
          </label>
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-subtle)]">
            <input type="checkbox" className="accent-[var(--color-primary-500)]" /> Respect quiet hours
          </label>
        </div>
        <button
          className="ds-chip ds-focus-ring bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)] hover:translate-y-[-2px] transition"
          onClick={preview}
        >
          Preview Workflow Summary
        </button>
      </div>
    </section>
  );
}

function AutomationBuilderColumn({
  label,
  description,
  items,
  selectedItems,
  onToggle,
}: {
  label: string;
  description: string;
  items: string[];
  selectedItems: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="ds-card dense flex flex-col gap-3" role="group" aria-label={label}>
      <div>
        <h4 className="text-[length:var(--font-size-14)] font-semibold text-[color:var(--color-text-strong)]">{label}</h4>
        <p className="ds-caption">{description}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <li key={item}>
              <button
                type="button"
                className={`w-full text-left ds-chip ds-focus-ring ${
                  isSelected ? 'bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)]' : ''
                }`}
                aria-pressed={isSelected}
                onClick={() => onToggle(item)}
              >
                {isSelected ? '☑︎' : '☐'} {item}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
function AutomationRunLogPanel({ logs }: { logs: AutomationLog[] }) {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Automation run logs">
      <div className="flex flex-col gap-1">
        <h3 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Run Logs</h3>
        <p className="ds-caption">Real-time orchestration telemetry with semantic status cues.</p>
      </div>
      <ol className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="flex flex-col gap-1 border border-[color:var(--color-border)] rounded-lg p-3 bg-[color:var(--color-surface-subtle)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[color:var(--color-text-subtle)]">{log.module}</span>
              <span className={`ds-badge ${log.status === 'success' ? 'success' : log.status === 'warning' ? 'warning' : 'error'}`}>
                {statusIcon[log.status]} {log.status.toUpperCase()}
              </span>
            </div>
            <p className="text-[color:var(--color-text-strong)] text-sm">{log.summary}</p>
            <time className="ds-caption" dateTime={log.timestamp}>
              {new Date(log.timestamp).toLocaleString()}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExportCenter({
  onExport,
  auditLog,
}: {
  onExport: (moduleKey: ModuleConfig['key'], format: 'csv' | 'json') => void;
  auditLog: ExportRecord[];
}) {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Export center">
      <div className="flex flex-col gap-1">
        <h3 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Data Export & Audit Trail</h3>
        <p className="ds-caption">Exports provide signed URLs and append entries to the immutable log.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <div key={module.key} className="ds-card dense flex flex-col gap-3">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-[color:var(--color-text-strong)]">{module.title}</p>
              <p className="ds-caption">Choose export format:</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 ds-chip ds-focus-ring bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)] justify-center"
                onClick={() => onExport(module.key, 'csv')}
              >
                Export CSV
              </button>
              <button
                type="button"
                className="flex-1 ds-chip ds-focus-ring bg-[color:var(--color-surface-subtle)] text-[color:var(--color-text-strong)] justify-center"
                onClick={() => onExport(module.key, 'json')}
              >
                Export JSON
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--color-border)] pt-3">
        <h4 className="text-[length:var(--font-size-14)] font-semibold text-[color:var(--color-text-subtle)]">Audit Log</h4>
        <div className="mt-2 max-h-64 overflow-auto border border-[color:var(--color-border)] rounded-lg">
          <table className="ds-table" role="grid">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Module</th>
                <th scope="col">Format</th>
                <th scope="col">Signed URL</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-sm text-[color:var(--color-text-muted)]">
                    No exports yet. Signed URLs will appear here with retention timestamps.
                  </td>
                </tr>
              ) : (
                auditLog.map((record) => (
                  <tr key={record.id}>
                    <td>{record.createdAt}</td>
                    <td>{record.module}</td>
                    <td>{record.format.toUpperCase()}</td>
                    <td>
                      <a href={record.url} className="text-[color:var(--color-primary-500)] underline" rel="noreferrer">
                        {record.url}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ModuleSection({ module, onExport }: { module: ModuleConfig; onExport: (format: 'csv' | 'json') => void }) {
  return (
    <section
      id={module.key}
      className="grid gap-6 lg:grid-cols-12 ds-motion-enter"
      style={{ alignItems: 'start' }}
      aria-labelledby={`${module.key}-title`}
    >
      <header className="lg:col-span-12 flex flex-col gap-2">
        <h2 id={`${module.key}-title`} className="text-[length:var(--font-size-24)] font-semibold text-[color:var(--color-text-strong)]">
          {module.title}
        </h2>
        <p className="ds-caption text-[color:var(--color-text-muted)] max-w-3xl">{module.description}</p>
      </header>
      <div className="lg:col-span-12">
        <KPIGroup heading="Key Performance Indicators" kpis={module.kpis} />
      </div>
      <div className="lg:col-span-8 flex flex-col gap-6">
        {module.charts.map((chart) => (
          <ChartRenderer key={chart.id} chart={chart} />
        ))}
      </div>
      <div className="lg:col-span-4 space-y-6">
        <AutomationFlowList flows={module.automationFlows} notes={module.automationNotes} />
        <ModuleStates states={module.states} />
      </div>
      <div className="lg:col-span-8">
        <DataTable table={module.table} />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-4">
        <button
          type="button"
          className="ds-chip ds-focus-ring bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)] justify-center"
          onClick={() => onExport('csv')}
        >
          Export Module CSV
        </button>
        <button
          type="button"
          className="ds-chip ds-focus-ring bg-[color:var(--color-surface-subtle)] text-[color:var(--color-text-strong)] justify-center"
          onClick={() => onExport('json')}
        >
          Export Module JSON
        </button>
      </div>
    </section>
  );
}
function ExperienceControls() {
  const { theme, setTheme, direction, setDirection, reduceMotion, setReduceMotion } = useExperienceContext();
  return (
    <section className="ds-card raised flex flex-wrap items-center justify-between gap-4" aria-label="Experience controls">
      <div>
        <h2 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Experience Controls</h2>
        <p className="ds-caption">Light, Dark, and RTL parity with optional reduced motion.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="ds-caption">Theme:</span>
          <button
            type="button"
            className={`ds-chip ds-focus-ring ${theme === 'light' ? 'bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)]' : ''}`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            className={`ds-chip ds-focus-ring ${theme === 'dark' ? 'bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)]' : ''}`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="ds-caption">Layout:</span>
          <button
            type="button"
            className={`ds-chip ds-focus-ring ${direction === 'ltr' ? 'bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)]' : ''}`}
            onClick={() => setDirection('ltr')}
          >
            LTR
          </button>
          <button
            type="button"
            className={`ds-chip ds-focus-ring ${direction === 'rtl' ? 'bg-[color:var(--color-primary-500)] text-[color:var(--color-text-inverse)]' : ''}`}
            onClick={() => setDirection('rtl')}
          >
            RTL
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-subtle)]">
          <input
            type="checkbox"
            className="accent-[var(--color-primary-500)]"
            checked={reduceMotion}
            onChange={(event) => setReduceMotion(event.target.checked)}
          />
          Reduce Motion
        </label>
      </div>
    </section>
  );
}
function TokenSheet() {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Design token sheet">
      <div>
        <h3 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Design Tokens</h3>
        <p className="ds-caption">Color, typography, spacing, elevation, and motion tokens stay consistent across modules.</p>
      </div>
      <div className="space-y-4">
        {tokenGroups.map((group) => (
          <div key={group.name} className="border border-[color:var(--color-border)] rounded-lg p-3 bg-[color:var(--color-surface-subtle)]">
            <h4 className="text-sm font-semibold text-[color:var(--color-text-strong)]">{group.name}</h4>
            <p className="ds-caption mb-2">{group.description}</p>
            <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(group.tokens).map(([tokenKey, tokenValue]) => (
                <div key={tokenKey} className="flex flex-col">
                  <dt className="ds-caption uppercase tracking-[0.08em]">{tokenKey}</dt>
                  <dd className="text-sm text-[color:var(--color-text-strong)]">
                    {typeof tokenValue === 'object' && !Array.isArray(tokenValue)
                      ? 'light' in tokenValue
                        ? `Light: ${tokenValue.light} / Dark: ${tokenValue.dark}`
                        : JSON.stringify(tokenValue)
                      : tokenValue}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function MotionMap() {
  return (
    <section className="ds-card raised flex flex-col gap-4" aria-label="Motion choreography">
      <div>
        <h3 className="text-[length:var(--font-size-18)] font-semibold text-[color:var(--color-text-strong)]">Motion Map</h3>
        <p className="ds-caption">Luxury motion choreography with staggered entry respecting reduced motion preferences.</p>
      </div>
      <ol className="space-y-3">
        {motionChoreography.map((phase) => (
          <li key={phase.phase} className="flex items-start gap-3">
            <span className="ds-badge info" aria-hidden="true">
              {phase.window}
            </span>
            <div>
              <p className="text-sm font-semibold text-[color:var(--color-text-strong)]">{phase.phase}</p>
              <p className="ds-caption">{phase.notes}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function DashboardPage() {
  const [auditLog, setAuditLog] = useState<ExportRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = (moduleKey: ModuleConfig['key'], format: 'csv' | 'json') => {
    const timestamp = new Date();
    const signature = Math.random().toString(36).slice(2, 10);
    const url = `https://cdn.example.com/exports/${moduleKey}-${timestamp.getTime()}.${format}?sig=${signature}`;
    const record: ExportRecord = {
      id: `${moduleKey}-${signature}`,
      module: modules.find((module) => module.key === moduleKey)?.title ?? moduleKey,
      format,
      url,
      createdAt: timestamp.toLocaleString(),
    };
    setAuditLog((previous) => [record, ...previous]);
    setToastMessage(`${record.module} ${format.toUpperCase()} export ready. Signed URL copied to log.`);
    window.setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePreview = (summary: string) => {
    setToastMessage(summary);
    window.setTimeout(() => setToastMessage(null), 6000);
  };

  const moduleSections = useMemo(() => modules, []);

  return (
    <div className="bg-[color:var(--color-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="ds-card raised text-center space-y-2">
          <h1 className="text-[length:var(--font-size-32)] font-semibold text-[color:var(--color-text-strong)]">{HEADER_TITLE}</h1>
          <p className="ds-caption">Generated at {HEADER_GENERATED_AT}</p>
          <p className="text-[length:var(--font-size-14)] text-[color:var(--color-text-muted)] max-w-3xl mx-auto">
            Unified dashboard system spanning SaaS, commerce, corporate analytics, productivity, media, education, and regulated niches.
            Every module inherits the same design tokens, accessibility compliance, and automation-ready IA.
          </p>
        </header>

        <ExperienceControls />

        <section className="grid gap-6 lg:grid-cols-3" aria-label="Automation intelligence overview">
          <AutomationBuilder onPreview={handlePreview} />
          <AutomationRunLogPanel logs={automationRunLogs} />
          <MotionMap />
        </section>

        <TokenSheet />

        <ExportCenter onExport={handleExport} auditLog={auditLog} />

        <div className="space-y-16">
          {moduleSections.map((module) => (
            <ModuleSection
              key={module.key}
              module={module}
              onExport={(format) => handleExport(module.key, format)}
            />
          ))}
        </div>
      </div>
      {toastMessage ? (
        <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto ds-card raised ds-toast-enter text-sm text-[color:var(--color-text-strong)] max-w-lg">
            {toastMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
}
