export const chartPalette = {
  indigo: ['#6366f1', '#818cf8', '#a5b4fc'],
  emerald: ['#10b981', '#34d399', '#6ee7b7'],
  violet: ['#7c3aed', '#a855f7', '#c084fc'],
  amber: ['#f59e0b', '#fbbf24', '#fcd34d'],
  rose: ['#f43f5e', '#fb7185', '#fda4af'],
  slate: ['#1f2937', '#4b5563', '#9ca3af'],
};

type TrendIconMap = {
  up: string;
  down: string;
  steady: string;
};

export const trendLabels: TrendIconMap = {
  up: 'Growth accelerating',
  down: 'Decline detected',
  steady: 'Stable performance',
};

export const weekdayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
