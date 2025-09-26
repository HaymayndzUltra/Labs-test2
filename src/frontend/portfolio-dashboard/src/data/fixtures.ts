import { addDays, format } from 'date-fns';
import { range } from 'd3-array';

export interface KPI {
  label: string;
  value: number;
  delta: number;
  deltaDirection: 'up' | 'down';
  basis: string;
  formatter: 'currency' | 'number' | 'percent' | 'duration';
}

export function formatKpiValue(kpi: KPI): string {
  if (kpi.formatter === 'duration') {
    const minutes = Math.floor(kpi.value);
    const seconds = Math.round((kpi.value % 1) * 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (kpi.formatter === 'percent') {
    return `${kpi.value.toFixed(1)}%`;
  }

  const options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: kpi.formatter === 'currency' ? 'currency' : 'decimal',
    currency: kpi.formatter === 'currency' ? 'USD' : undefined
  };

  return new Intl.NumberFormat('en-US', options).format(kpi.value);
}

export const saasKpis: KPI[] = [
  { label: 'Monthly Recurring Revenue', value: 842000, delta: 4.2, deltaDirection: 'up', basis: 'vs prior month', formatter: 'currency' },
  { label: 'Active Workspaces', value: 1265, delta: 2.1, deltaDirection: 'up', basis: 'vs prior month', formatter: 'number' },
  { label: 'API Consumption (30 day)', value: 97200000, delta: 6.8, deltaDirection: 'up', basis: 'requests', formatter: 'number' },
  { label: 'Net Revenue Retention', value: 116.4, delta: -1.2, deltaDirection: 'down', basis: 'vs target', formatter: 'percent' }
];

export const ecommerceKpis: KPI[] = [
  { label: 'Gross Merchandise Volume', value: 2450000, delta: 3.6, deltaDirection: 'up', basis: 'vs last week', formatter: 'currency' },
  { label: 'Orders (7-day)', value: 14820, delta: -2.4, deltaDirection: 'down', basis: 'vs last week', formatter: 'number' },
  { label: 'Average Order Value', value: 178, delta: 4.1, deltaDirection: 'up', basis: 'vs last week', formatter: 'currency' },
  { label: 'Return rate', value: 8.6, delta: -0.6, deltaDirection: 'down', basis: 'vs last week', formatter: 'percent' }
];

export const corporateKpis: KPI[] = [
  { label: 'Qualified pipeline', value: 13800000, delta: 6.2, deltaDirection: 'up', basis: 'vs target', formatter: 'currency' },
  { label: 'Monthly unique visitors', value: 620000, delta: 12.4, deltaDirection: 'up', basis: 'vs prior month', formatter: 'number' },
  { label: 'M→SQL conversion', value: 18.2, delta: 1.4, deltaDirection: 'up', basis: 'percentage', formatter: 'percent' },
  { label: 'Sales cycle (days)', value: 42, delta: -3.5, deltaDirection: 'down', basis: 'vs baseline', formatter: 'number' }
];

export const contentMediaKpis: KPI[] = [
  { label: 'Monthly plays/reads', value: 1840000, delta: 9.6, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
  { label: 'Avg watch time', value: 6.35, delta: 0.4, deltaDirection: 'up', basis: 'minutes', formatter: 'duration' },
  { label: 'Subscriber growth', value: 18400, delta: 3.1, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
  { label: 'Engagement score', value: 72, delta: 2.3, deltaDirection: 'up', basis: 'index', formatter: 'number' }
];

export const edtechKpis: KPI[] = [
  { label: 'Active learners', value: 48200, delta: 5.4, deltaDirection: 'up', basis: 'vs term start', formatter: 'number' },
  { label: 'Completion rate', value: 86.2, delta: 2.3, deltaDirection: 'up', basis: 'vs prior term', formatter: 'percent' },
  { label: 'Avg quiz score', value: 84.6, delta: 1.2, deltaDirection: 'up', basis: 'vs prior term', formatter: 'percent' },
  { label: 'Certificates issued', value: 16240, delta: 4.8, deltaDirection: 'up', basis: 'vs prior term', formatter: 'number' }
];

export const specializedKpis: Record<string, KPI[]> = {
  realEstate: [
    { label: 'Active listings', value: 684, delta: 8.3, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
    { label: 'Qualified inquiries', value: 1820, delta: 3.5, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
    { label: 'Avg response time', value: 2.4, delta: -0.2, deltaDirection: 'down', basis: 'hrs', formatter: 'number' }
  ],
  finance: [
    { label: 'Expense vs budget', value: 94.2, delta: -1.4, deltaDirection: 'down', basis: 'percentage', formatter: 'percent' },
    { label: 'Close readiness', value: 87, delta: 2.4, deltaDirection: 'up', basis: 'index', formatter: 'number' },
    { label: 'AP cycle time', value: 14, delta: -1.2, deltaDirection: 'down', basis: 'days', formatter: 'number' }
  ],
  healthcare: [
    { label: 'Patient satisfaction', value: 92.4, delta: 1.1, deltaDirection: 'up', basis: 'score', formatter: 'percent' },
    { label: 'No-show rate', value: 3.4, delta: -0.4, deltaDirection: 'down', basis: 'vs last month', formatter: 'percent' },
    { label: 'Avg wait time', value: 8.2, delta: -1.0, deltaDirection: 'down', basis: 'minutes', formatter: 'number' }
  ]
};

export interface ChartPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export function generateTimeSeries(days = 30, startValue = 1000, variance = 0.1): ChartPoint[] {
  const today = new Date();
  return range(days).map((offset) => {
    const date = addDays(today, -days + offset);
    const jitter = (Math.random() - 0.5) * variance * startValue;
    return {
      label: format(date, 'MMM dd'),
      value: Math.max(startValue + jitter + offset * variance * 10, 0)
    };
  });
}
