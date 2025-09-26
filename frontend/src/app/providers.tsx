'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { initPosthog } from '@/lib/analytics/posthog';
import { ThemeProvider } from 'next-themes';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    initPosthog();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
