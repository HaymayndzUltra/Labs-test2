import type { Meta, StoryObj } from "@storybook/react";
import { KPICard } from "./KPICard";

const meta: Meta<typeof KPICard> = {
  title: "CedarForge/KPI/KPICard",
  component: KPICard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {
    title: "Net Burn",
    value: 820000,
    delta: -0.04,
    timeframe: "30d",
    format: "currency",
    sparkline: [72, 68, 74, 71, 77, 79, 82, 84, 86, 88],
  },
};

export const PositiveDelta: Story = {
  args: {
    title: "Renewable %",
    value: 0.62,
    delta: 0.03,
    timeframe: "today",
    format: "percent",
  },
};
