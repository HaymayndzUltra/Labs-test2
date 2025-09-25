import type { Meta, StoryObj } from '@storybook/react';
import { AutoBuilder } from '../src/shared/components/AutoBuilder';

const meta: Meta<typeof AutoBuilder> = {
  title: 'Core/AutoBuilder',
  component: AutoBuilder
};

export default meta;

type Story = StoryObj<typeof AutoBuilder>;

export const Default: Story = {
  args: {
    onSubmit: console.log
  }
};
