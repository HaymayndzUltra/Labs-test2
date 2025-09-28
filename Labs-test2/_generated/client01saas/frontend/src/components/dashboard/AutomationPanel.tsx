'use client';

interface AutomationPanelProps {
  overduePayments: number;
  pendingTickets: number;
  recommendations: string[];
}

export function AutomationPanel({ overduePayments, pendingTickets, recommendations }: AutomationPanelProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-600">Automation Insights</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Overdue payments</p>
          <p className="text-xl font-semibold text-gray-900">{overduePayments}</p>
        </div>
        <div>
          <p className="text-gray-500">Open maintenance tickets</p>
          <p className="text-xl font-semibold text-gray-900">{pendingTickets}</p>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Recommendations</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {!recommendations.length && <li>No recommended automations at this time.</li>}
        </ul>
      </div>
    </div>
  );
}
