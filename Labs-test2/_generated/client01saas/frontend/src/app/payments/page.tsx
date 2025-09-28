'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { useAuth } from '../../context/AuthContext';
import { fetcher } from '../../lib/api';

interface Payment {
  id: number;
  tenant_id: number;
  amount: number;
  due_date: string;
  paid_at?: string | null;
  status: string;
  created_at: string;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function PaymentsPage() {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR<Payment[]>(token ? '/payments' : null, fetcher);

  if (!token) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-600">
          You need to sign in before tracking rent balances.{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Sign in to continue
          </Link>
          .
        </p>
      </div>
    );
  }

  const totalOutstanding = data?.reduce((sum, payment) => {
    return payment.status !== 'paid' ? sum + payment.amount : sum;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Rent ledger</h2>
        <p className="text-sm text-gray-600">
          Track dues and receivables. Overdue balances help prioritize follow-up and automation nudges.
        </p>
        {typeof totalOutstanding === 'number' && (
          <div className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-1 text-sm text-yellow-800">
            Outstanding balance: {'$'}{totalOutstanding.toFixed(2)}
          </div>
        )}
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load payments. Refresh the page or verify your credentials.
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tenant ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Due date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Paid at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  Loading payments…
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{payment.tenant_id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {'$'}{payment.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {new Date(payment.due_date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${'{'}
                        payment.status === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : payment.status === 'overdue'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-yellow-50 text-yellow-700'
                      {'}'}
                    >
                      {formatStatus(payment.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No payments recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
