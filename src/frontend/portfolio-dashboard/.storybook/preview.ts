import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'fullscreen'
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'rtl', title: 'RTL' }
        ],
        showName: true
      }
    }
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'light' | 'dark' | 'rtl';
      const dir = theme === 'rtl' ? 'rtl' : 'ltr';
      const mode = theme === 'dark' ? 'dark' : 'light';
      document.documentElement.dir = dir;
      document.documentElement.dataset.theme = mode;
      return Story();
    }
  ]
};

export default preview;
