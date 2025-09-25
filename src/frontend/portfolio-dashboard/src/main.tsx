import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './routes/App';
import { DesignSystemProvider } from './providers/DesignSystemProvider';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DesignSystemProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DesignSystemProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
