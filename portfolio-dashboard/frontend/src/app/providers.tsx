'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initPosthog } from '@/lib/analytics/posthog';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => new QueryClient());

  if (typeof window !== 'undefined') {
    initPosthog();
  }

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
