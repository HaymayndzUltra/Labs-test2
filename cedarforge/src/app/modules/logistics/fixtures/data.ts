import { BandedBarDatum } from '@shared/chart/BandedBarChart';
import { LineChartPoint } from '@shared/chart/LineChart';
import { BulletDatum } from '@shared/chart/BulletChart';

export const logisticsKpis = [
  { title: 'OTIF %', value: 94, delta: 1.2, timeframe: 'Weekly' },
  { title: 'In-Transit Units', value: 421_000, delta: 4.3, timeframe: 'Live' },
  { title: 'Avg Lead Time', value: 5.8, delta: -0.4, timeframe: '14 day trend' },
  { title: 'Route Cost/Stop', value: 86, unit: '$', delta: -1.1, timeframe: 'Rolling 4w' }
];

export const laneHealth: BandedBarDatum[] = [
  { category: 'West → Central', value: 92, target: 97 },
  { category: 'Central → East', value: 88, target: 95 },
  { category: 'South → North', value: 96, target: 96 }
];

export const hubThroughput: LineChartPoint[] = Array.from({ length: 10 }).map((_, index) => ({
  date: new Date(2023, 10, index + 1),
  value: 45_000 + index * 3_100
}));

export const routeUtilization: BulletDatum[] = [
  { title: 'Linehaul', measure: 84, target: 90, range: [0, 110] },
  { title: 'Express', measure: 71, target: 85, range: [0, 110] },
  { title: 'Parcel', measure: 92, target: 92, range: [0, 110] }
];

export const carrierScorecard = [
  { carrier: 'SwiftFreight', reliability: 96, spend: '$1.2M', score: 'A-' },
  { carrier: 'BlueRoute', reliability: 91, spend: '$970k', score: 'B+' },
  { carrier: 'AtlasLine', reliability: 89, spend: '$640k', score: 'B' }
];

export const exceptionFeed = [
  { id: 'EX-2041', type: 'Delay', action: 'Auto reroute via DFW', status: 'In flight' },
  { id: 'EX-2042', type: 'Temperature', action: 'Dispatch cold-chain partner', status: 'Resolved' },
  { id: 'EX-2043', type: 'Damage', action: 'Hold at hub + photo audit', status: 'Escalated' }
];

export const logisticsAutomations = [
  {
    name: 'Dynamic re-slotting',
    trigger: 'webhook',
    cadence: 'On event',
    actions: ['Update WMS slot map', 'Notify floor supervisor'],
    guardrails: ['Max 2 moves per SKU per day', 'Respect labor quiet hours']
  },
  {
    name: 'Carrier auto-rebid',
    trigger: 'schedule',
    cadence: 'Weekly',
    actions: ['Request bids from top carriers', 'Score on on-time + cost'],
    guardrails: ['Exclude carriers <B rating', 'Dry run before execute']
  }
];
