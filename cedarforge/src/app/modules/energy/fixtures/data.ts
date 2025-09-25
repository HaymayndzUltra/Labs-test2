import { LineChartPoint } from '@shared/chart/LineChart';
import { StreamDatum } from '@shared/chart/StreamChart';
import { BandedBarDatum } from '@shared/chart/BandedBarChart';

export const energyKpis = [
  { title: 'Peak Load (MW)', value: 12_430, delta: -2.1, timeframe: 'Yesterday' },
  { title: 'Renewable %', value: 47, delta: 3.4, timeframe: 'Rolling 7d' },
  { title: 'Outage Count', value: 14, delta: -5.0, timeframe: 'Current' },
  { title: 'SAIDI (min)', value: 42, delta: 1.3, timeframe: 'Month' }
];

export const loadCurve: LineChartPoint[] = Array.from({ length: 24 }).map((_, hour) => ({
  date: new Date(2024, 1, 1, hour),
  value: 6_500 + Math.sin(hour / 24 * Math.PI) * 2_400
}));

export const derOutput: StreamDatum[] = Array.from({ length: 12 }).map((_, index) => ({
  date: new Date(2023, index, 1),
  solar: 120 + index * 10,
  wind: 180 + Math.sin(index) * 35,
  storage: 90 + index * 6
}));

export const outageMap = [
  { region: 'North', outages: 6, crews: 4, eta: '1h 20m' },
  { region: 'South', outages: 3, crews: 2, eta: '50m' },
  { region: 'East', outages: 5, crews: 3, eta: '2h 10m' }
];

export const workOrders = [
  { id: 'WO-9201', crew: 'Crew 14', status: 'En route', task: 'Pole replacement', priority: 'High' },
  { id: 'WO-9202', crew: 'Crew 11', status: 'On site', task: 'Switchgear reset', priority: 'Medium' },
  { id: 'WO-9203', crew: 'Crew 6', status: 'Completed', task: 'Transformer diagnostic', priority: 'Low' }
];

export const energyAutomations = [
  {
    name: 'Battery dispatch evening peak',
    trigger: 'schedule',
    cadence: 'Daily 17:30',
    actions: ['Discharge DER clusters', 'Notify control room', 'Log dispatch event'],
    guardrails: ['Respect SoC floor 35%', 'Cancel if price < $40/MWh']
  },
  {
    name: 'Outage crew paging',
    trigger: 'threshold',
    cadence: 'Real time',
    actions: ['Page nearest crew', 'Open safety checklist', 'Announce ETA to OMS'],
    guardrails: ['Max 3 simultaneous pages per crew', 'Requires lockout tag verification']
  }
];
