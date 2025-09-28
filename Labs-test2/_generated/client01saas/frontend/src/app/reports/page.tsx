'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

interface SummaryResponse {
  month: string;
  highlights: string[];
  overdue_total: number;
  automation_opportunities: string[];
}

export default function ReportsPage() {
  const { token } = useAuth();
  const [month, setMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('You must be signed in to generate reports.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await api.post('/reports/org-monthly', null, {
        params: { month },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `org-summary-${month}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Unable to generate the PDF report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummarize = async () => {
    setError(null);

    if (!token) {
      setError('You must be signed in to request summaries.');
      return;
    }

    setIsSummarizing(true);
    try {
      const { data } = await api.post<SummaryResponse>('/ai/monthly-summary', { month });
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch the monthly summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Reports & Insights</h2>
        <p className="text-sm text-gray-600">
          Please{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
            sign in
          </Link>{' '}
          to export monthly reports and view AI-generated highlights.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Reports & Insights</h2>
        <p className="text-sm text-gray-600">
          Download organization-ready PDFs and run an AI-assisted summary over the latest ledger activity.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleGenerateReport}>
          <div className="space-y-1">
            <label htmlFor="report-month" className="block text-sm font-medium text-gray-700">
              Reporting month
            </label>
            <input
              id="report-month"
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGenerating ? 'Generating…' : 'Download PDF report'}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI monthly summary</h3>
          <p className="text-sm text-gray-600">
            Runs a rules-based summary using rent, ticket, and automation signals. When LLM access is configured, this endpoint
            can switch to generative output automatically.
          </p>
        </div>
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSummarizing ? 'Summarizing…' : 'Run monthly summary'}
        </button>

        {summary && (
          <div className="space-y-4 rounded-md border border-emerald-100 bg-emerald-50 p-4">
            <div>
              <h4 className="text-sm font-semibold text-emerald-800">Highlights for {summary.month}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                {summary.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-emerald-900">
              Overdue total: {'$'}{summary.overdue_total.toFixed(2)}
            </div>
            {summary.automation_opportunities.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-emerald-800">Automation opportunities</h5>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                  {summary.automation_opportunities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
