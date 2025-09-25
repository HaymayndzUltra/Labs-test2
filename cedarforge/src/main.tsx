import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';
import App from './App';
import './styles.css';
import { ThemeProvider } from './shared/state/theme-store';
import { AccessibilityAnnouncer } from './shared/components/AccessibilityAnnouncer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000
    }
  }
});

const messages = {};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AccessibilityAnnouncer />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </IntlProvider>
  </React.StrictMode>
);
