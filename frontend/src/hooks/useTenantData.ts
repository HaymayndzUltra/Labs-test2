'use client';

import { useMemo } from 'react';
import { useApi } from './useApi';

export function useTenantDetails() {
  return useApi<TenantResponse>('/api/v1/tenants/me');
}

export function useSubscription() {
  return useApi<SubscriptionResponse>('/api/v1/billing/subscription');
}

export type TenantResponse = {
  id: number;
  name: string;
  billing_email: string;
  slug: string;
  subscription?: SubscriptionResponse;
};

export type SubscriptionResponse = {
  id: number;
  plan: string;
  status: string;
  seats: number;
  current_period_start?: string;
  current_period_end?: string | null;
};

export function useTenantBillingSummary() {
  const { data: tenant } = useTenantDetails();
  const { data: subscription, ...rest } = useSubscription();

  const combined = useMemo(() => {
    if (!tenant || !subscription) return null;
    return {
      tenantName: tenant.name,
      plan: subscription.plan,
      status: subscription.status,
      seats: subscription.seats,
      current_period_end: subscription.current_period_end,
    };
  }, [tenant, subscription]);

  return { summary: combined, subscription, tenant, ...rest };
}
