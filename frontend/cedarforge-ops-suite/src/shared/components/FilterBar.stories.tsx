import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./FilterBar";
import { ThemeProvider } from "@shared/components/ThemeProvider";

const meta: Meta<typeof FilterBar> = {
  title: "CedarForge/Navigation/FilterBar",
  component: FilterBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="bg-background-base p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof FilterBar> = {};
