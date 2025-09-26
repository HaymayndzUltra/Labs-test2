import { faker } from '@faker-js/faker';

export type MetricPoint = {
  date: string;
  value: number;
  label?: string;
  segment?: string;
};

export type DashboardDataset = {
  kpis: { label: string; value: number; delta: number }[];
  timeSeries: MetricPoint[];
  anomalies: MetricPoint[];
  scenarios: MetricPoint[];
};

const buildTimeSeries = (length = 24, base = 1000, volatility = 0.12): MetricPoint[] => {
  const now = new Date();
  return Array.from({ length }).map((_, index) => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - (length - index));
    const noise = faker.number.float({ min: -volatility, max: volatility });
    const value = Math.max(0, Math.round(base * (1 + noise + index * 0.01)));
    return {
      date: date.toISOString(),
      value,
    };
  });
};

const buildAnomalies = (timeSeries: MetricPoint[]): MetricPoint[] =>
  timeSeries
    .filter(() => faker.number.float({ min: 0, max: 1 }) > 0.75)
    .slice(0, 4)
    .map((point) => ({
      ...point,
      label: faker.hacker.verb(),
      segment: faker.helpers.arrayElement(['North America', 'EMEA', 'APAC']),
    }));

const buildScenarios = (base: number): MetricPoint[] => {
  return [
    { label: 'Conservative', value: Math.round(base * 0.85), date: 'T-1' },
    { label: 'Target', value: base, date: 'T0' },
    { label: 'Stretch', value: Math.round(base * 1.25), date: 'T+1' },
  ];
};

export const generateFintechDataset = (): DashboardDataset => {
  const base = faker.number.int({ min: 2_500_000, max: 7_500_000 });
  const timeSeries = buildTimeSeries(18, base / 50, 0.22);
  return {
    kpis: [
      { label: 'Assets Under Watch', value: base, delta: faker.number.float({ min: -3, max: 5 }) },
      { label: 'Net ARR', value: Math.round(base * 0.23), delta: faker.number.float({ min: 1, max: 7 }) },
      { label: 'Risk Exposure', value: Math.round(base * 0.11), delta: faker.number.float({ min: -6, max: -1 }) },
    ],
    timeSeries,
    anomalies: buildAnomalies(timeSeries),
    scenarios: buildScenarios(base),
  };
};

export const generateHealthcareDataset = (): DashboardDataset => {
  const base = faker.number.int({ min: 80_000, max: 180_000 });
  const timeSeries = buildTimeSeries(18, base / 12, 0.18);
  return {
    kpis: [
      { label: 'Patient Throughput', value: base, delta: faker.number.float({ min: -2, max: 4 }) },
      { label: 'Readmission Rate', value: Math.round(base * 0.06), delta: faker.number.float({ min: -5, max: 1 }) },
      { label: 'Satisfaction Index', value: Math.round(base * 0.87), delta: faker.number.float({ min: 3, max: 9 }) },
    ],
    timeSeries,
    anomalies: buildAnomalies(timeSeries),
    scenarios: buildScenarios(base),
  };
};

export const generateTimeline = (length = 8) =>
  Array.from({ length }).map((_, index) => ({
    id: `timeline-${index}`,
    period: faker.date.past({ years: 2 }).toISOString(),
    title: faker.hacker.phrase(),
    summary: faker.lorem.sentence(),
    velocity: faker.number.float({ min: 0.45, max: 0.98 }),
  }));

export const generateTestimonials = (length = 6) =>
  Array.from({ length }).map((_, index) => ({
    id: `testimonial-${index}`,
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    quote: faker.lorem.paragraph(),
    metric: faker.number.int({ min: 5, max: 45 }),
  }));
