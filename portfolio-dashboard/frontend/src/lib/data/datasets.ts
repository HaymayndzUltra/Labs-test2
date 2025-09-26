import { faker } from '@faker-js/faker';
import type { PersonaId } from '@/state/persona-store';

export interface MetricPoint {
  date: string;
  value: number;
  sentiment?: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  delta: number;
  trend: MetricPoint[];
  format?: 'currency' | 'percent' | 'number';
}

export interface ScenarioConfig {
  metric: string;
  current: number;
  sliderMin: number;
  sliderMax: number;
  projection: number[];
}

export interface DashboardPod {
  id: string;
  title: string;
  summary: string;
  overview: DashboardMetric[];
  diagnostics: DashboardMetric[];
  scenarios: ScenarioConfig[];
}

const formatters: Record<string, () => number> = {
  currency: () => faker.number.float({ min: 50_000, max: 500_000, precision: 0.01 }),
  percent: () => faker.number.float({ min: -0.12, max: 0.32, precision: 0.001 }),
  number: () => faker.number.int({ min: 300, max: 8000 }),
};

const buildTrend = () =>
  Array.from({ length: 12 }).map((_, idx) => ({
    date: faker.date.soon({ days: (idx + 1) * 3 }).toISOString(),
    value: faker.number.float({ min: 20, max: 120, precision: 0.01 }),
    sentiment: faker.number.float({ min: -1, max: 1, precision: 0.01 }),
  }));

const buildMetric = (id: string, label: string, format: DashboardMetric['format'] = 'number'): DashboardMetric => {
  const base = formatters[format ?? 'number']();
  return {
    id,
    label,
    value: base,
    delta: faker.number.float({ min: -0.2, max: 0.45, precision: 0.001 }),
    trend: buildTrend(),
    format,
  };
};

const scenarioProjection = () =>
  Array.from({ length: 5 }).map(() => faker.number.float({ min: 0.8, max: 1.35, precision: 0.01 }));

export const generateDashboardPod = (persona: PersonaId, pod: 'fintech' | 'healthcare'): DashboardPod => {
  const baseLabel = `${pod === 'fintech' ? 'Fintech' : 'Healthcare'} ${persona.split('-')[0]}`;
  return {
    id: `${pod}-${persona}`,
    title: pod === 'fintech' ? 'Fintech Growth Intelligence' : 'Healthcare Outcomes Command',
    summary:
      pod === 'fintech'
        ? 'Real-time treasury, acquisition, and risk telemetry orchestrated for regulatory resilience.'
        : 'Clinical quality, staffing efficiency, and patient experience telemetry in one adaptive control tower.',
    overview: [
      buildMetric('revenue', `${baseLabel} Revenue`, 'currency'),
      buildMetric('runway', 'Runway Months Remaining', 'number'),
      buildMetric('conversion', 'Activation Conversion', 'percent'),
      buildMetric('engagement', 'Weekly Active Accounts', 'number'),
    ],
    diagnostics: [
      buildMetric('fraud-rate', 'Fraud Rate', 'percent'),
      buildMetric('support-load', 'Support Ticket Load', 'number'),
      buildMetric('ops-latency', 'Operational Latency', 'percent'),
      buildMetric('compliance', 'Compliance Score', 'percent'),
    ],
    scenarios: [
      {
        metric: 'Growth Velocity',
        current: faker.number.float({ min: 0.8, max: 1.2, precision: 0.01 }),
        sliderMin: 0.5,
        sliderMax: 1.8,
        projection: scenarioProjection(),
      },
      {
        metric: 'Retention Strength',
        current: faker.number.float({ min: 0.7, max: 0.95, precision: 0.01 }),
        sliderMin: 0.5,
        sliderMax: 1.2,
        projection: scenarioProjection(),
      },
      {
        metric: 'Capital Efficiency',
        current: faker.number.float({ min: 0.3, max: 0.6, precision: 0.01 }),
        sliderMin: 0.1,
        sliderMax: 1.0,
        projection: scenarioProjection(),
      },
    ],
  };
};

export const personaDataset = (persona: PersonaId) => ({
  timeline: buildTrend(),
  testimonials: Array.from({ length: 4 }).map(() => ({
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    quote: faker.company.buzzPhrase(),
    impact: faker.number.float({ min: 0.12, max: 0.64, precision: 0.01 }),
  })),
  skills: Array.from({ length: 6 }).map((_, idx) => ({
    axis: ['Strategy', 'Automation', 'Data Science', 'Design Systems', 'AI Ops', 'Growth'][idx],
    value: faker.number.float({ min: 0.5, max: 1, precision: 0.01 }),
  })),
});
