'use client';

import useSWR from 'swr';
import type { EcommerceDashboardResponse } from './types';
import { COMMERCE_DASHBOARD_ENDPOINT } from './data';
import { enrichDashboardPayload } from './transforms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function loadCommerceDashboard(): Promise<EcommerceDashboardResponse> {
  const response = await fetch(`${API_BASE_URL}${COMMERCE_DASHBOARD_ENDPOINT}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load commerce dashboard');
  }

  const payload = (await response.json()) as EcommerceDashboardResponse;
  return enrichDashboardPayload(payload);
}

export function useCommerceDashboard(initialData: EcommerceDashboardResponse) {
  const swrState = useSWR<EcommerceDashboardResponse>(
    COMMERCE_DASHBOARD_ENDPOINT,
    loadCommerceDashboard,
    {
      fallbackData: initialData,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 60_000,
    },
  );

  return {
    ...swrState,
    data: swrState.data ?? initialData,
  };
}
