'use client';

import { ReactNode, useRef } from 'react';
import { SWRConfig, type SWRConfiguration } from 'swr';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const cacheRef = useRef<Map<string, unknown>>();

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

  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
