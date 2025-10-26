import { LineChartPoint } from '@shared/chart/LineChart';
import { BandedBarDatum } from '@shared/chart/BandedBarChart';
import { BulletDatum } from '@shared/chart/BulletChart';

export const finopsKpis = [
  { title: 'Cash Position', value: 134_500_000, unit: '$', delta: 4.1, timeframe: 'As of today' },
  { title: 'Net Burn', value: 3_250_000, unit: '$', delta: -2.3, timeframe: 'Monthly' },
  { title: 'Runway (months)', value: 18, delta: 1.2, timeframe: 'Rolling' },
  { title: 'DSO', value: 42, delta: -3.5, timeframe: 'Last 30 days' }
];

export const cashWaterfall: LineChartPoint[] = Array.from({ length: 12 }).map((_, index) => ({
  date: new Date(2023, index, 1),
  value: 80_000_000 + index * 2_500_000
}));

export const revenueLeakage: BandedBarDatum[] = [
  { category: 'FX slippage', value: 1.4, target: 0.9 },
  { category: 'Billing', value: 1.1, target: 0.7 },
  { category: 'Tax', value: 0.8, target: 0.5 }
];

export const forecastVsActual: BulletDatum[] = [
  { title: 'Q1 Collections', measure: 93, target: 96, range: [0, 110] },
  { title: 'Q2 Collections', measure: 88, target: 94, range: [0, 110] },
  { title: 'Q3 Collections', measure: 95, target: 95, range: [0, 110] }
];

export const collectionsAging = [
  { bucket: '0-30', amount: 12_500_000 },
  { bucket: '31-60', amount: 6_200_000 },
  { bucket: '61-90', amount: 2_900_000 },
  { bucket: '90+', amount: 1_100_000 }
];

export const paymentHealth = [
  { region: 'NA', bin: '4111', anomaly: 'Chargeback spike', status: 'Investigating' },
  { region: 'EU', bin: '5500', anomaly: 'FX variance', status: 'Monitoring' },
  { region: 'APAC', bin: '3566', anomaly: 'Issuer decline', status: 'Resolved' }
];

export const finopsAutomations = [
  {
    name: 'Dunning ladder - digital wallets',
    trigger: 'threshold',
    cadence: 'Every 6 hours',
    actions: ['Send Slack to Treasury', 'Retry payment with FX buffer'],
    guardrails: ['3 retries per customer', 'Quiet hours 22:00-06:00']
  },
  {
    name: 'Leakage detector (shipping/tax)',
    trigger: 'anomaly',
    cadence: 'Real time',
    actions: ['Create NetSuite journal entry draft', 'Notify FinOps channel'],
    guardrails: ['Requires >$10k variance', 'Dry run preview before publish']
  }
];
