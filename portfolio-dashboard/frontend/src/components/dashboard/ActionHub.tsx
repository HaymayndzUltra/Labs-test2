'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Bell, Download, Play, Workflow } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { useToast } from '@/components/ui/ToastProvider';
import { AutomationBuilder } from '@/components/ui/AutomationBuilder';

export type ExportRecord = {
  id: string;
  label: string;
  description: string;
  updatedAt: string;
  status: 'ready' | 'queued' | 'failed';
};

type HubAutomation = {
  id: string;
  title: string;
  status: 'healthy' | 'attention' | 'failed';
  lastRun: string;
};

type HubAlert = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  module: string;
};

type ActionHubProps = {
  exports: ExportRecord[];
  automations: HubAutomation[];
  alerts: HubAlert[];
};

type HubTab = 'exports' | 'automations' | 'alerts';

export function ActionHub({ exports, automations, alerts }: ActionHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('exports');
  const [builderOpen, setBuilderOpen] = useState(false);
  const { push } = useToast();

  const exportCounts = useMemo(() => {
    const ready = exports.filter((record) => record.status === 'ready').length;
    const queued = exports.filter((record) => record.status === 'queued').length;
    const failed = exports.filter((record) => record.status === 'failed').length;
    return { ready, queued, failed };
  }, [exports]);

  const automationCounts = useMemo(() => {
    const healthy = automations.filter((automation) => automation.status === 'healthy').length;
    const attention = automations.filter((automation) => automation.status === 'attention').length;
    const failed = automations.filter((automation) => automation.status === 'failed').length;
    return { healthy, attention, failed };
  }, [automations]);

  const alertCounts = useMemo(() => {
    const warning = alerts.filter((alert) => alert.severity === 'warning').length;
    const critical = alerts.filter((alert) => alert.severity === 'critical').length;
    const info = alerts.filter((alert) => alert.severity === 'info').length;
    return { warning, critical, info };
  }, [alerts]);

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    trackAnalyticsEvent('export_triggered', { format });
    push({
      title: `Export queued (${format.toUpperCase()})`,
      description: 'We will email you when the export is ready to download.',
      tone: 'info',
    });
  };

  return (
    <Card id="action-hub" className="sticky top-32 border border-[var(--surface-border-strong)]" padding="lg" role="complementary">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Operational command center</p>
          <h2 className="text-display-md text-slate-900">Action hub</h2>
          <p className="mt-1 text-xs text-slate-600">
            Launch exports, trigger automations, and review alerts in one place. All actions log correlation IDs and analytics.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
          onClick={() => {
            setBuilderOpen(true);
            trackAnalyticsEvent('drill_down', { destination: 'automation_builder' });
          }}
        >
          <Workflow className="h-4 w-4" aria-hidden />
          Open builder
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Action hub sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'exports'}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:focus-ring ${
            activeTab === 'exports'
              ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
              : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/70'
          }`}
          onClick={() => setActiveTab('exports')}
        >
          <Download className="h-4 w-4" aria-hidden />
          Exports
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">{exports.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'automations'}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:focus-ring ${
            activeTab === 'automations'
              ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
              : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/70'
          }`}
          onClick={() => setActiveTab('automations')}
        >
          <Play className="h-4 w-4" aria-hidden />
          Automations
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">{automations.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'alerts'}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:focus-ring ${
            activeTab === 'alerts'
              ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
              : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/70'
          }`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell className="h-4 w-4" aria-hidden />
          Alerts
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">{alerts.length}</span>
        </button>
      </div>

      <div className="mt-6 space-y-4" role="tabpanel">
        {activeTab === 'exports' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Ready · {exportCounts.ready}</span>
              <span>Queued · {exportCounts.queued}</span>
              <span>Failed · {exportCounts.failed}</span>
            </div>
            <div className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)]">
              <table className="min-w-full" aria-label="Exports table">
                <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="sticky top-0 px-4 py-3 text-left">Export</th>
                    <th className="sticky top-0 px-4 py-3 text-left">Status</th>
                    <th className="sticky top-0 px-4 py-3 text-left">Last updated</th>
                  </tr>
                </thead>
                <tbody className="max-h-[320px] divide-y divide-[var(--surface-border)] overflow-auto bg-[var(--surface-s1)] text-sm">
                  {exports.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white/70' : 'bg-[var(--surface-s1)]'}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{record.label}</div>
                        <p className="text-xs text-slate-500">{record.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip
                          label={record.status === 'ready' ? 'Ready' : record.status === 'queued' ? 'Queued' : 'Failed'}
                          tone={
                            record.status === 'ready'
                              ? 'success'
                              : record.status === 'queued'
                              ? 'info'
                              : 'danger'
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-600">{new Date(record.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="export-format" className="text-xs font-semibold text-slate-600">
                Export format
              </label>
              <select
                id="export-format"
                className="min-h-[44px] rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs text-slate-700 focus-visible:focus-ring"
                onChange={(event) => {
                  const value = event.target.value as 'csv' | 'json' | 'pdf';
                  if (!value) return;
                  handleExport(value);
                  event.target.value = '';
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select format
                </option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        ) : null}

        {activeTab === 'automations' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Healthy · {automationCounts.healthy}</span>
              <span>Needs review · {automationCounts.attention}</span>
              <span>Failed · {automationCounts.failed}</span>
            </div>
            <ul className="space-y-3" aria-label="Automation summary list">
              {automations.map((automation) => (
                <li key={automation.id} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                      <p className="text-xs text-slate-500">Last run {new Date(automation.lastRun).toLocaleString()}</p>
                    </div>
                    <StatusChip
                      label={
                        automation.status === 'healthy'
                          ? 'Healthy'
                          : automation.status === 'attention'
                          ? 'Needs review'
                          : 'Failed'
                      }
                      tone={
                        automation.status === 'healthy'
                          ? 'success'
                          : automation.status === 'attention'
                          ? 'warning'
                          : 'danger'
                      }
                    />
                  </div>
                  <a
                    href="#automation-orchestrator"
                    className="mt-2 inline-flex min-h-[32px] items-center text-xs font-semibold text-[var(--primary-600)] underline"
                  >
                    Manage in orchestrator
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeTab === 'alerts' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Critical · {alertCounts.critical}</span>
              <span>Warning · {alertCounts.warning}</span>
              <span>Info · {alertCounts.info}</span>
            </div>
            <ul className="space-y-3" aria-label="Alerts list">
              {alerts.map((alert) => (
                <li key={alert.id} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        alert.severity === 'critical'
                          ? 'text-[var(--danger-600)]'
                          : alert.severity === 'warning'
                          ? 'text-[var(--warning-600)]'
                          : 'text-[var(--info-600)]'
                      }`}
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{alert.module}</p>
                      <p className="text-xs text-slate-600">{alert.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <AutomationBuilder
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        verticalAccent="var(--primary-500)"
        onCreate={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          push({ title: 'Automation deployed', description: 'New automation available in orchestrator.', tone: 'success' });
        }}
      />
    </Card>
  );
}
