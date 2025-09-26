import { faker } from '@faker-js/faker';

export interface MetricPoint {
  label: string;
  value: number;
}

export interface ScenarioProjection {
  name: string;
  baseline: number;
  optimistic: number;
  conservative: number;
}

export interface GeospatialPoint {
  latitude: number;
  longitude: number;
  metric: number;
  label: string;
}

faker.seed(42);

export function generateTimeseries(length = 12, base = 1000, volatility = 0.12): MetricPoint[] {
  let current = base;
  return Array.from({ length }).map((_, index) => {
    const next = current * (1 + faker.number.float({ min: -volatility, max: volatility }));
    current = Math.max(next, 0);
    return {
      label: `M${index + 1}`,
      value: Math.round(current),
    };
  });
}

export function generateScenarioProjections(label: string): ScenarioProjection {
  const baseline = faker.number.float({ min: 0.2, max: 1.2, fractionDigits: 2 });
  return {
    name: label,
    baseline,
    optimistic: baseline * faker.number.float({ min: 1.1, max: 1.6, fractionDigits: 2 }),
    conservative: baseline * faker.number.float({ min: 0.7, max: 0.95, fractionDigits: 2 }),
  };
}

export function generateGeospatialPoints(count = 24): GeospatialPoint[] {
  return Array.from({ length: count }).map(() => ({
    latitude: faker.location.latitude({ max: 52, min: 24 }),
    longitude: faker.location.longitude({ max: -66, min: -124 }),
    metric: faker.number.float({ min: 0.2, max: 1.4, fractionDigits: 2 }),
    label: faker.location.city(),
  }));
}

export function generateTestimonials(count = 6) {
  return Array.from({ length: count }).map((_, index) => ({
    id: `testimonial-${index}`,
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    quote: faker.company.buzzPhrase(),
    uplift: faker.number.float({ min: 12, max: 48, fractionDigits: 1 }),
    metric: faker.helpers.arrayElement(['ARR', 'CSAT', 'Gross Margin', 'Retention']),
  }));
}

export function generateTimelineEvents(count = 8) {
  return Array.from({ length: count }).map((_, index) => ({
    id: `milestone-${index}`,
    date: faker.date.past({ years: 3 }).toISOString(),
    title: faker.company.catchPhrase(),
    summary: faker.lorem.sentence(),
    impact: faker.number.float({ min: 8, max: 24, fractionDigits: 1 }),
  }));
}

export function generateSkillHeatmapMetrics() {
  const skills = ['Data Storytelling', 'Visualization Systems', 'Automation Ops', 'UX Architecture', 'AI Ops'];
  return skills.map((skill) => ({
    subject: skill,
    current: faker.number.int({ min: 70, max: 95 }),
    potential: faker.number.int({ min: 85, max: 100 }),
  }));
}

export interface PodDiagnosticPoint {
  metric: string;
  value: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface PodDataBundle {
  overview: MetricPoint[];
  diagnostics: PodDiagnosticPoint[];
  scenarios: ScenarioProjection[];
  geospatial: GeospatialPoint[];
}

const STATUS_POOL: PodDiagnosticPoint['status'][] = ['ok', 'warning', 'critical'];

export function buildPodData(seed: number): PodDataBundle {
  faker.seed(seed);
  const overview = generateTimeseries(12, faker.number.int({ min: 800, max: 2400 }));
  const diagnostics = Array.from({ length: 6 }).map(() => ({
    metric: faker.helpers.arrayElement([
      'Conversion Rate',
      'Unit Economics',
      'Revenue Leakage',
      'Operational Load',
      'Acquisition Cost',
      'Quality Index',
    ]),
    value: faker.number.float({ min: 45, max: 98, fractionDigits: 1 }),
    status: faker.helpers.arrayElement(STATUS_POOL),
  }));
  const scenarios = ['Baseline Growth', 'Scenario A', 'Scenario B'].map((label) =>
    generateScenarioProjections(label),
  );
  const geospatial = generateGeospatialPoints(18);

  return {
    overview,
    diagnostics,
    scenarios,
    geospatial,
  };
}
