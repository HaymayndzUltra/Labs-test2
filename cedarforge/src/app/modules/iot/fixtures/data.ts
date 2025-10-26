import { BandedBarDatum } from '@shared/chart/BandedBarChart';
import { LineChartPoint } from '@shared/chart/LineChart';

export const iotKpis = [
  { title: 'Active Devices', value: 32_480, delta: 5.2, timeframe: 'Live' },
  { title: 'Uptime %', value: 99.2, delta: 0.3, timeframe: 'Rolling 30d' },
  { title: 'Alerts Today', value: 87, delta: -12.4, timeframe: '24h' },
  { title: 'Avg Latency (ms)', value: 184, delta: -18.2, timeframe: '7d' }
];

export const deviceHealth: BandedBarDatum[] = [
  { category: 'Gateway', value: 98.2, target: 99.5 },
  { category: 'Sensor', value: 96.1, target: 98.5 },
  { category: 'Vehicle', value: 97.4, target: 99.0 }
];

export const latencyHistogram = [
  { bucket: '<100ms', count: 14_200 },
  { bucket: '100-200ms', count: 10_340 },
  { bucket: '200-400ms', count: 5_280 },
  { bucket: '>400ms', count: 960 }
];

export const geoClusters = [
  { cluster: 'Seattle', devices: 3_400, uptime: '99.5%', issues: 2 },
  { cluster: 'Berlin', devices: 2_980, uptime: '99.1%', issues: 5 },
  { cluster: 'Singapore', devices: 4_120, uptime: '99.7%', issues: 1 }
];

export const maintenanceBacklog = [
  { id: 'MT-3091', device: 'Vehicle 204', issue: 'Battery temp', status: 'Scheduled' },
  { id: 'MT-3092', device: 'Sensor 889', issue: 'Signal drift', status: 'Open' },
  { id: 'MT-3093', device: 'Gateway 77', issue: 'Packet loss', status: 'In progress' }
];

export const iotAutomations = [
  {
    name: 'Predictive maintenance dispatch',
    trigger: 'anomaly',
    cadence: 'Real time',
    actions: ['Enqueue maintenance ticket', 'Notify field service partner'],
    guardrails: ['Confidence >0.85', 'Limit to 5 dispatches/hour']
  },
  {
    name: 'Firmware canary rollout',
    trigger: 'schedule',
    cadence: 'Nightly',
    actions: ['Push update to canary cohort', 'Monitor telemetry', 'Auto rollback on error spike'],
    guardrails: ['Max 1% fleet per batch', 'Require manual approval for rollback']
  }
];
