import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from '../components/primitives/KpiCard';
import { KPI } from '../data/fixtures';

const meta: Meta<typeof KpiCard> = {
  title: 'Components/KPI Card',
  component: KpiCard,
  parameters: {
    controls: { expanded: true }
  }
};

export default meta;

type Story = StoryObj<typeof KpiCard>;

const baseKpi: KPI = {
  label: 'Monthly Recurring Revenue',
  value: 842000,
  delta: 4.2,
  deltaDirection: 'up',
  basis: 'vs prior month',
  formatter: 'currency'
};

export const Default: Story = {
  args: {
    kpi: baseKpi
  }
};

export const NegativeDelta: Story = {
  args: {
    kpi: { ...baseKpi, delta: -1.8, deltaDirection: 'down', value: 812000 }
  }
};
