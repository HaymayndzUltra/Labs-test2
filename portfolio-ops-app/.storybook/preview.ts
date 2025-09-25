import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--surface-0)' },
        { name: 'surface-dark', value: '#0f172a' }
      ]
    },
    layout: 'fullscreen'
  }
};

export default preview;
