import type { Meta, StoryObj } from '@storybook/react';
import { AutomationBuilder } from '../components/automation/AutomationBuilder';

const meta: Meta<typeof AutomationBuilder> = {
  title: 'Components/Automation Builder',
  component: AutomationBuilder,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj<typeof AutomationBuilder>;

export const SaaSPlaybook: Story = {
  args: {
    name: 'storybook-saas',
    defaults: {
      trigger: 'API consumption drops 20% in 24 hours',
      conditions: 'Exclude sandboxes, respect enterprise SLA.',
      actions: 'Send Slack alert → Create CSM task → Fire webhook',
      cadence: 'Run hourly until resolved'
    }
  }
};
