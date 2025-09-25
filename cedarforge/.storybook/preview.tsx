import type { Preview } from '@storybook/react';
import '../src/styles.css';
import { tokens } from '../src/shared/tokens/tokens';

tokens;

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'Light Oat',
      values: [
        { name: 'Light Oat', value: 'var(--surface-0)' },
        { name: 'Dark Obsidian', value: '#0D0F11' }
      ]
    },
    layout: 'fullscreen'
  }
};

export default preview;
