'use client';

import { useCallback, useMemo, useState } from 'react';
import { apiHelpers } from '@/lib/api';
import { useTenantBillingSummary } from '@/hooks/useTenantData';
import { useTenantContext } from '@/hooks/useTenantContext';

const PLAN_OPTIONS = [
  { id: 'starter', name: 'Starter', seats: 5 },
  { id: 'growth', name: 'Growth', seats: 25 },
  { id: 'scale', name: 'Scale', seats: 100 },
];

export default function DashboardPage() {
  const { summary, tenant, subscription, isLoading, mutate } = useTenantBillingSummary();
  const { isAdmin } = useTenantContext();
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);

  const activePlan = subscription?.plan ?? 'starter';

  const availablePlans = useMemo(() => {
    return PLAN_OPTIONS.map((plan) => ({
      ...plan,
      isActive: plan.id === activePlan,
    }));
  }, [activePlan]);

  const handlePlanChange = useCallback(
    async (planId: string) => {
      if (!isAdmin) return;
      try {
        setUpdatingPlan(planId);
        await apiHelpers.post('/api/v1/billing/subscription', {
          plan: planId,
          seats: PLAN_OPTIONS.find((plan) => plan.id === planId)?.seats ?? 5,
          status: 'active',
        });
        await mutate();
      } finally {
        setUpdatingPlan(null);
      }
    },
    [isAdmin, mutate]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600">
          Monitor tenant activity, manage billing, and understand plan usage at a glance.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Tenant</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {tenant?.name ?? 'Loading...'}
            </dd>
            <p className="mt-2 text-xs text-gray-500">Billing Email: {tenant?.billing_email ?? '—'}</p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Plan</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {subscription?.plan ?? 'starter'}
            </dd>
            <p className="mt-2 text-xs text-gray-500">Seats included: {subscription?.seats ?? 5}</p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Subscription Status</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900 capitalize">
              {subscription?.status ?? 'trialing'}
            </dd>
            <p className="mt-2 text-xs text-gray-500">
              Next renewal:{' '}
              {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString()
                : 'TBD'}
            </p>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Manage Subscription</h3>
            <p className="mt-1 text-sm text-gray-500">
              Switch plans to unlock additional seats and capabilities for your organization.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 ${
                    plan.isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                  }`}
                >
                  <h4 className="text-md font-semibold text-gray-900">{plan.name}</h4>
                  <p className="text-sm text-gray-500">Includes {plan.seats} seats</p>
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={plan.isActive || updatingPlan === plan.id}
                  >
                    {plan.isActive ? 'Current plan' : updatingPlan === plan.id ? 'Updating...' : 'Switch plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Billing Summary</h3>
          {summary ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="text-base font-semibold text-gray-900">{summary.plan}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-base font-semibold text-gray-900 capitalize">{summary.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Seats</dt>
                <dd className="text-base font-semibold text-gray-900">{summary.seats}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Next renewal</dt>
                <dd className="text-base font-semibold text-gray-900">
                  {summary.current_period_end
                    ? new Date(summary.current_period_end).toLocaleDateString()
                    : 'In trial'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">{isLoading ? 'Loading billing details...' : 'No billing data available.'}</p>
          )}
        </div>
      </section>
    </div>
  );
}
