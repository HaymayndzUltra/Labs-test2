import { KPI } from '../data/fixtures';

export const customAppKpis: KPI[] = [
  { label: 'Active rituals', value: 420, delta: 6.2, deltaDirection: 'up', basis: 'vs last sprint', formatter: 'number' },
  { label: 'Automation coverage', value: 62.4, delta: 3.8, deltaDirection: 'up', basis: 'vs last sprint', formatter: 'percent' },
  { label: 'Cycle time', value: 4.6, delta: -0.4, deltaDirection: 'down', basis: 'days', formatter: 'number' },
  { label: 'NPS', value: 68, delta: 2.4, deltaDirection: 'up', basis: 'rolling 30d', formatter: 'number' }
];

export const contentMediaKpisExtended: KPI[] = [
  { label: 'Monthly plays/reads', value: 1840000, delta: 9.6, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
  { label: 'Avg watch time', value: 6.35, delta: 0.4, deltaDirection: 'up', basis: 'minutes', formatter: 'duration' },
  { label: 'Subscriber growth', value: 18400, delta: 3.1, deltaDirection: 'up', basis: 'vs last month', formatter: 'number' },
  { label: 'Engagement score', value: 72, delta: 2.3, deltaDirection: 'up', basis: 'index', formatter: 'number' }
];

export const edTechKpisExtended: KPI[] = [
  { label: 'Active learners', value: 48200, delta: 5.4, deltaDirection: 'up', basis: 'vs term start', formatter: 'number' },
  { label: 'Completion rate', value: 86.2, delta: 2.3, deltaDirection: 'up', basis: 'vs prior term', formatter: 'percent' },
  { label: 'Avg quiz score', value: 84.6, delta: 1.2, deltaDirection: 'up', basis: 'vs prior term', formatter: 'percent' },
  { label: 'Certificates issued', value: 16240, delta: 4.8, deltaDirection: 'up', basis: 'vs prior term', formatter: 'number' }
];
