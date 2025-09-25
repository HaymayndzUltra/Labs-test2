import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from '../src/shared/components/KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'Core/KPICard',
  component: KPICard,
  args: {
    title: 'Cash Position',
    value: 125_000_000,
    delta: 4.2,
    timeframe: 'As of today',
    unit: '$',
    accent: 'var(--accent-finops)'
  }
};

export default meta;

type Story = StoryObj<typeof KPICard>;

export const Default: Story = {};
