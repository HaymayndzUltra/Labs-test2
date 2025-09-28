'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

import { useAuth } from '../../../context/AuthContext';
import { fetcher } from '../../../lib/api';

interface Ticket {
  id: number;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  assigned_vendor?: string | null;
  tenant_id?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export default function TicketDetailPage() {
  const { token } = useAuth();
  const params = useParams<{ id: string }>();
  const ticketId = params?.id;
  const { data, error, isLoading } = useSWR<Ticket>(
    token && ticketId ? `/tickets/${encodeURIComponent(ticketId)}` : null,
    fetcher,
  );

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Ticket details</h2>
        <p className="text-sm text-gray-600">
          Please{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            sign in
          </Link>{' '}
          to view ticket details.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link href="/tickets" className="text-sm text-indigo-600 hover:text-indigo-500">
        ← Back to tickets
      </Link>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load the ticket. It may have been removed or you may not have access.
        </div>
      )}

      {isLoading && (
        <div className="rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading ticket…
        </div>
      )}

      {data && (
        <article className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">
                Priority: {data.priority}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                Status: {data.status}
              </span>
              {data.assigned_vendor && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                  Assigned to: {data.assigned_vendor}
                </span>
              )}
            </div>
          </header>

          {data.description && <p className="text-sm text-gray-700">{data.description}</p>}

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ticket ID</dt>
              <dd className="text-sm text-gray-900">{data.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tenant ID</dt>
              <dd className="text-sm text-gray-900">{data.tenant_id ?? 'Unassigned'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Created at</dt>
              <dd className="text-sm text-gray-900">{new Date(data.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last updated</dt>
              <dd className="text-sm text-gray-900">
                {data.updated_at ? new Date(data.updated_at).toLocaleString() : '—'}
              </dd>
            </div>
          </dl>
        </article>
      )}
    </div>
  );
}
