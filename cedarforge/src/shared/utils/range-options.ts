export type RangeOption = {
  id: 'last_7_days' | 'last_14_days' | 'last_30_days' | 'quarter_to_date';
  label: string;
  days: number;
};

export const rangeOptions: RangeOption[] = [
  { id: 'last_7_days', label: 'Last 7 days', days: 7 },
  { id: 'last_14_days', label: 'Last 14 days', days: 14 },
  { id: 'last_30_days', label: 'Last 30 days', days: 30 },
  { id: 'quarter_to_date', label: 'Quarter to date', days: 90 }
];
