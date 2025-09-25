import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from '../components/kpi/KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'Design System/KPI Card',
  component: KpiCard,
  args: {
    metric: {
      id: 'mrr',
      label: 'Monthly recurring revenue',
      value: '$248K',
      change: 12.6,
      trend: 'up',
      description: 'vs last quarter',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof KpiCard> = {};

export const NegativeTrend: StoryObj<typeof KpiCard> = {
  args: {
    metric: {
      id: 'churn',
      label: 'Net revenue retention',
      value: '88%',
      change: -4.3,
      trend: 'down',
      description: 'MoM',
    },
  },
};
