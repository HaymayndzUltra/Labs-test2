import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "../components/KpiCard";

const meta: Meta<typeof KpiCard> = {
  title: "Core/KpiCard",
  component: KpiCard,
  args: {
    title: "Monthly Recurring Revenue",
    value: 420000,
    valueType: "currency",
    delta: 0.06,
    deltaLabel: "Up 6% vs last month",
    timeBasis: "vs prior month",
    accent: "var(--vertical-saas)"
  }
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {};
