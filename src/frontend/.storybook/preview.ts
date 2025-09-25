import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: "32px", background: "var(--surface-s0)", minHeight: "100vh" }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

export default preview;
