import type { Meta, StoryObj } from "@storybook/react";
import { AutoBuilder } from "./AutoBuilder";

const meta: Meta<typeof AutoBuilder> = {
  title: "CedarForge/Automations/AutoBuilder",
  component: AutoBuilder,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof AutoBuilder>;

export const Default: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // eslint-disable-next-line no-console
      console.log("Automation saved");
    },
  },
};
