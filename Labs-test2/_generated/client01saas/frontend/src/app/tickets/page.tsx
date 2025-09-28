'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { useAuth } from '../../context/AuthContext';
import { fetcher } from '../../lib/api';

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

function badgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'closed':
      return 'bg-green-50 text-green-700';
    case 'in_progress':
    case 'in-progress':
    case 'in progress':
      return 'bg-blue-50 text-blue-700';
    case 'open':
    default:
      return 'bg-orange-50 text-orange-700';
  }
}

export default function TicketsPage() {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR<Ticket[]>(token ? '/tickets' : null, fetcher);

  if (!token) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Maintenance tickets</h2>
        <p className="text-sm text-gray-600">
          Sign in to review and triage maintenance work.{' '}
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
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Maintenance queue</h2>
        <p className="text-sm text-gray-600">
          Prioritize issues by severity and keep a running log of vendor assignments.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load tickets. Refresh the page or confirm your role has access.
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ticket</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned vendor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  Loading tickets…
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="max-w-xs px-4 py-3 text-sm font-medium text-gray-900">
                    <div>{ticket.title}</div>
                    {ticket.description && (
                      <p className="mt-1 truncate text-xs text-gray-500">{ticket.description}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{ticket.priority}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {ticket.assigned_vendor || 'Unassigned'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {new Date(ticket.created_at).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <Link href={`/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-500">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  No tickets in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
