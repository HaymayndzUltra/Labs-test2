import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'Components/KPI Card',
  component: KpiCard,
  args: {
    title: 'Monthly Recurring Revenue',
    value: '$1,280,000',
    delta: { value: '+4.2%', trend: 'up', label: 'vs prior 30d' },
    timeBasis: 'Live'
  }
};

export default meta;

type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {};
