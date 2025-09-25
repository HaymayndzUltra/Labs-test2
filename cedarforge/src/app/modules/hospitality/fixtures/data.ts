import { LineChartPoint } from '@shared/chart/LineChart';

export const hospitalityKpis = [
  { title: 'Occupancy %', value: 82.4, delta: 3.6, timeframe: 'Week' },
  { title: 'RevPAR', value: 162, unit: '$', delta: 4.2, timeframe: 'Week' },
  { title: 'NPS', value: 58, delta: 2.0, timeframe: '30d' },
  { title: 'No-Shows', value: 46, delta: -12.3, timeframe: '7d' }
];

export const bookingPace: LineChartPoint[] = Array.from({ length: 8 }).map((_, week) => ({
  date: new Date(2023, week, 1),
  value: 65 + week * 4
}));

export const housekeepingLoad = [
  { wing: 'North', occupied: 120, clean: 80, turn: 40 },
  { wing: 'South', occupied: 98, clean: 68, turn: 30 }
];

export const queueMonitor = [
  { station: 'Front Desk', wait: 6.4 },
  { station: 'Concierge', wait: 3.1 },
  { station: 'Food & Bev', wait: 4.8 }
];

export const serviceTickets = [
  { id: 'SV-3001', type: 'Room Service', status: 'In progress', sla: '12m' },
  { id: 'SV-3002', type: 'Maintenance', status: 'Awaiting parts', sla: '45m' },
  { id: 'SV-3003', type: 'Housekeeping', status: 'Scheduled', sla: '30m' }
];

export const hospitalityAutomations = [
  {
    name: 'Smart upsell guardrails',
    trigger: 'threshold',
    cadence: 'Daily',
    actions: ['Target loyalty guests with upgrade offer', 'Cap at 10 per property'],
    guardrails: ['Skip VIP flagged guests', 'Respect PCI scope']
  },
  {
    name: 'No-show prevention workflow',
    trigger: 'schedule',
    cadence: '2h prior to arrival',
    actions: ['Send WhatsApp reminder', 'Offer late check-in'],
    guardrails: ['Stop after response', 'Audit request ID in PMS']
  }
];
