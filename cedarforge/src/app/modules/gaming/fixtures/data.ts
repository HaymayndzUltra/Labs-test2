import { LineChartPoint } from '@shared/chart/LineChart';

export const gamingKpis = [
  { title: 'DAU', value: 2_430_000, delta: 4.2, timeframe: 'Yesterday' },
  { title: 'MAU', value: 9_820_000, delta: 2.4, timeframe: 'Rolling 30d' },
  { title: 'ARPDAU', value: 3.42, unit: '$', delta: 0.6, timeframe: '7d' },
  { title: 'Crash Rate', value: 0.42, delta: -0.12, timeframe: '24h' }
];

export const cohortRetention: LineChartPoint[] = Array.from({ length: 7 }).map((_, day) => ({
  date: new Date(2023, 6, day + 1),
  value: 60 - day * 6
}));

export const offerExperiments = [
  { variant: 'Control', uplift: 0, conversion: 2.4 },
  { variant: 'Offer A', uplift: 4.2, conversion: 2.5 },
  { variant: 'Offer B', uplift: 6.1, conversion: 2.7 }
];

export const crashHeat = [
  { window: '00:00', ios: 0.3, android: 0.4, pc: 0.2 },
  { window: '06:00', ios: 0.2, android: 0.5, pc: 0.3 },
  { window: '12:00', ios: 0.5, android: 0.7, pc: 0.4 },
  { window: '18:00', ios: 0.4, android: 0.6, pc: 0.3 }
];

export const eventStream = [
  { event: 'StorePurchase', segment: 'Whales', rate: 420 },
  { event: 'MatchStart', segment: 'Core', rate: 12_400 },
  { event: 'Crash', segment: 'Android', rate: 43 }
];

export const gamingAutomations = [
  {
    name: 'Price experiment guardrail',
    trigger: 'anomaly',
    cadence: 'Real time',
    actions: ['Pause variant', 'Alert LiveOps', 'Capture telemetry snapshot'],
    guardrails: ['Stop if ARPDAU -5%', 'Auto resume after review']
  },
  {
    name: 'Crash spike rollback',
    trigger: 'threshold',
    cadence: 'Real time',
    actions: ['Rollback patch', 'Notify on-call', 'Open incident ticket'],
    guardrails: ['Requires crash rate >0.8%', 'Limit to once per 2h']
  }
];
