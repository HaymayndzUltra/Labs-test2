import type { Preview } from "@storybook/react";
import "../src/index.css";
import { ThemeProvider } from "@shared/components/ThemeProvider";
import { useUIStore } from "@shared/state/uiStore";
import React from "react";

declare module "@storybook/react" {
  interface Parameters {
    direction?: "ltr" | "rtl";
  }
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      useUIStore.setState({ theme: context.globals?.theme === "dark" ? "dark" : "light" });
      return (
        <div dir={context.globals?.direction === "rtl" ? "rtl" : "ltr"} className={context.globals?.theme === "dark" ? "theme-dark" : ""}>
          <ThemeProvider>
            <div className="min-h-screen bg-background-base p-6">
              <Story />
            </div>
          </ThemeProvider>
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
    direction: {
      name: "Direction",
      description: "Text direction",
      defaultValue: "ltr",
      toolbar: {
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
      },
    },
  },
};

export default preview;
