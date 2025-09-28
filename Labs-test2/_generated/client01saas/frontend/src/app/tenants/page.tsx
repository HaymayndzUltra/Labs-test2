'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { useAuth } from '../../context/AuthContext';
import { fetcher } from '../../lib/api';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  unit_id?: number | null;
  created_at: string;
}

export default function TenantsPage() {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR<Tenant[]>(token ? '/tenants' : null, fetcher);

  if (!token) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Tenants</h2>
        <p className="text-sm text-gray-600">
          You need to be authenticated to view tenants.{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            Sign in to continue
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Tenant directory</h2>
        <p className="mt-2 text-sm text-gray-600">
          Monitor resident contact details, unit assignments, and enrollment dates scoped to your organization.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load tenants. Please retry or verify your access token.
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Unit ID
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  Loading tenants…
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{tenant.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{tenant.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {tenant.phone || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {tenant.unit_id ?? 'Unassigned'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No tenants found for your organization yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
