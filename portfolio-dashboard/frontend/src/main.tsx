import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from './lib/simpleQuery';
import App from './App';
import { createQueryClient } from './lib/queryClient';
import { ThemeProvider } from './theme/ThemeProvider';
import { ToastProvider } from './components/toast/ToastProvider';
import './theme/global.css';

const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
