import { cache } from 'react';
import type { EcommerceDashboardResponse } from './types';
import { enrichDashboardPayload } from './transforms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export const COMMERCE_DASHBOARD_ENDPOINT = '/api/v1/commerce-dashboard';
const COMMERCE_DASHBOARD_URL = `${API_BASE_URL}${COMMERCE_DASHBOARD_ENDPOINT}`;

type NextRequestOptions = {
  revalidate?: number;
  tags?: string[];
};

type CommerceDashboardFetchOptions = RequestInit & {
  next?: NextRequestOptions;
};

export async function fetchCommerceDashboard(
  options: CommerceDashboardFetchOptions = {},
): Promise<EcommerceDashboardResponse> {
  const { next, headers, ...rest } = options;

  const requestInit: CommerceDashboardFetchOptions = {
    ...rest,
    cache: rest.cache ?? 'no-store',
    headers: {
      Accept: 'application/json',
      ...(headers ?? {}),
    },
    ...(next ? { next } : {}),
  };

  const response = await fetch(COMMERCE_DASHBOARD_URL, requestInit);

  if (!response.ok) {
    throw new Error('Failed to load commerce dashboard');
  }

  const payload = (await response.json()) as EcommerceDashboardResponse;
  return enrichDashboardPayload(payload);
}

export const getCommerceDashboard = cache(async () =>
  fetchCommerceDashboard({
    cache: 'force-cache',
    next: { revalidate: 300, tags: ['commerce-dashboard'] },
  }),
);
