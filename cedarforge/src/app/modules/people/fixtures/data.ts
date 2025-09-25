export const peopleKpis = [
  { title: 'Headcount', value: 1843, delta: 2.4, timeframe: 'Quarter to date' },
  { title: 'Offers Out', value: 62, delta: 3.1, timeframe: 'Current month' },
  { title: 'Time-to-Fill (days)', value: 36, delta: -1.7, timeframe: 'Rolling 90d' },
  { title: 'Attrition %', value: 12.6, delta: 0.4, timeframe: 'Trailing 12m' }
];

export const hiringFunnel = [
  { stage: 'Applicants', count: 4100 },
  { stage: 'Phone Screen', count: 1320 },
  { stage: 'Onsite', count: 420 },
  { stage: 'Offer', count: 96 },
  { stage: 'Hire', count: 72 }
];

export const compBands = [
  { band: 'IC3', median: 92_000, spread: '80k-105k' },
  { band: 'IC4', median: 128_000, spread: '110k-150k' },
  { band: 'M1', median: 148_000, spread: '130k-180k' }
];

export const attritionCohorts = [
  { cohort: '0-6m', rate: 6.2 },
  { cohort: '6-12m', rate: 4.1 },
  { cohort: '12-24m', rate: 2.3 },
  { cohort: '24m+', rate: 1.5 }
];

export const interviewLoad = [
  { interviewer: 'Nguyen', load: 12 },
  { interviewer: 'Patel', load: 9 },
  { interviewer: 'Garcia', load: 8 },
  { interviewer: 'Okafor', load: 6 }
];

export const feedbackQueue = [
  { candidate: 'A. Flores', stage: 'Onsite', age: '4h', owner: 'Nguyen' },
  { candidate: 'M. Singh', stage: 'Panel', age: '2h', owner: 'Garcia' },
  { candidate: 'L. Chen', stage: 'Offer Review', age: '1h', owner: 'Okafor' }
];

export const peopleAutomations = [
  {
    name: 'Offer approval workflow',
    trigger: 'manual',
    cadence: 'On submit',
    actions: ['Route to finance partner', 'Notify hiring manager', 'Post to Slack #offers'],
    guardrails: ['Auto escalate >$200k OTE', 'Audit log required']
  },
  {
    name: 'Interview load balancing',
    trigger: 'threshold',
    cadence: 'Hourly',
    actions: ['Detect overbooked interviewer', 'Suggest swap', 'Sync with calendar'],
    guardrails: ['Respect PTO events', 'Quiet hours 19:00-07:00 local']
  }
];
