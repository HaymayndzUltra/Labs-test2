'use client';

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LogRocket from 'logrocket';
import posthog from 'posthog-js';
import { SWRConfig, type SWRConfiguration } from 'swr';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_placeholder-key';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';
const LOGROCKET_APP = process.env.NEXT_PUBLIC_LOGROCKET_APP ?? 'todo/upwork-dashboard';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const cacheRef = useRef<Map<string, unknown>>();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  if (!cacheRef.current) {
    cacheRef.current = new Map();
  }

  const swrConfig: SWRConfiguration = {
    provider: () => cacheRef.current as Map<string, unknown>,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 60_000,
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
    });

    LogRocket.init(LOGROCKET_APP, {
      release: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0',
      console: {
        shouldAggregateConsoleErrors: true,
      },
    });
  }, []);

  return (
    <SWRConfig value={swrConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" buttonPosition="bottom-left" />
      </QueryClientProvider>
    </SWRConfig>
  );
}
