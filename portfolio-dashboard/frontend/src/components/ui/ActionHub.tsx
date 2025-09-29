'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BellRing, Download, FlaskConical, Play, Workflow } from 'lucide-react';
import { Card } from './Card';
import { StatusChip } from './StatusChip';
import type { AutomationWorkflow } from '@/app/dashboard/data';
import { cn } from '@/lib/utils';

type ExportOption = {
  id: string;
  label: string;
  description?: string;
  format: 'csv' | 'json' | 'pdf';
  onExport: () => void;
};

type AutomationQuickAction = {
  id: string;
  title: string;
  status: AutomationWorkflow['status'];
  lastRun: string;
  onRun: () => void;
  onSimulate: () => void;
};

type AlertSummary = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
};

type ActionHubProps = {
  exports: ExportOption[];
  automations: AutomationQuickAction[];
  alerts: AlertSummary[];
  onLaunchOrchestrator: () => void;
};

type TabId = 'exports' | 'automations' | 'alerts';

const severityTone: Record<AlertSummary['severity'], { label: string; tone: Parameters<typeof StatusChip>[0]['tone'] }> = {
  info: { label: 'Info', tone: 'info' },
  warning: { label: 'Warning', tone: 'warning' },
  critical: { label: 'Critical', tone: 'danger' },
};

const severityIconTone: Record<AlertSummary['severity'], string> = {
  info: 'text-[var(--info-600)]',
  warning: 'text-[var(--warning-600)]',
  critical: 'text-[var(--danger-600)]',
};

const statusTone: Record<AutomationWorkflow['status'], Parameters<typeof StatusChip>[0]['tone']> = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  scheduled: 'info',
  running: 'info',
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
}

export function ActionHub({ exports, automations, alerts, onLaunchOrchestrator }: ActionHubProps) {
  const tabs = useMemo(
    () => [
      { id: 'exports' as TabId, label: `Exports (${exports.length})` },
      { id: 'automations' as TabId, label: `Automations (${automations.length})` },
      { id: 'alerts' as TabId, label: `Alerts (${alerts.length})` },
    ],
    [alerts.length, automations.length, exports.length]
  );

  const [activeTab, setActiveTab] = useState<TabId>('exports');

  return (
    <Card
      className="flex h-full flex-col gap-5 border border-[var(--surface-border)] bg-[var(--surface-s1)]"
      aria-label="Action hub"
      padding="md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Operations</p>
          <h3 className="text-title-sm text-slate-900">Action hub</h3>
          <p className="text-xs text-slate-600">Exports, orchestrations, and alerts in a single command surface.</p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
          onClick={onLaunchOrchestrator}
        >
          <Workflow className="h-4 w-4" aria-hidden />
          Launch orchestrator
        </button>
      </div>

      <div role="tablist" aria-label="Action hub tabs" className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={cn(
              'min-h-[40px] flex-1 rounded-full border px-3 py-2 text-xs font-semibold transition focus-visible:focus-ring',
              activeTab === tab.id
                ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-600)]'
                : 'border-[var(--surface-border)] bg-transparent text-slate-500 hover:bg-slate-100/70'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[220px]">
        {activeTab === 'exports' ? (
          <ul className="space-y-3" role="tabpanel">
            {exports.length === 0 ? (
              <li className="rounded-[16px] border border-dashed border-[var(--surface-border)] px-4 py-4 text-xs text-slate-500">
                No export templates configured yet.
              </li>
            ) : (
              exports.map((option) => (
                <li
                  key={option.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                    {option.description ? <p className="text-xs text-slate-500">{option.description}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                    onClick={option.onExport}
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {option.format.toUpperCase()}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        {activeTab === 'automations' ? (
          <ul className="space-y-3" role="tabpanel">
            {automations.length === 0 ? (
              <li className="rounded-[16px] border border-dashed border-[var(--surface-border)] px-4 py-4 text-xs text-slate-500">
                No automations linked. Launch a workflow to populate this space.
              </li>
            ) : (
              automations.map((automation) => (
                <li
                  key={automation.id}
                  className="rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                      <p className="text-xs text-slate-500">Last run {formatTimestamp(automation.lastRun)}</p>
                    </div>
                    <StatusChip label={automation.status} tone={statusTone[automation.status]} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                      onClick={automation.onSimulate}
                    >
                      <FlaskConical className="h-4 w-4" aria-hidden />
                      Simulate
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                      onClick={automation.onRun}
                    >
                      <Play className="h-4 w-4" aria-hidden />
                      Run now
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : null}

        {activeTab === 'alerts' ? (
          <ul className="space-y-3" role="tabpanel">
            {alerts.length === 0 ? (
              <li className="rounded-[16px] border border-dashed border-[var(--surface-border)] px-4 py-4 text-xs text-slate-500">
                No active alerts. All systems normal.
              </li>
            ) : (
              alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start gap-3 rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
                >
                  <AlertTriangle className={cn('mt-1 h-4 w-4', severityIconTone[alert.severity])} aria-hidden />
                  <div className="space-y-1">
                    <p className="text-sm text-slate-900">{alert.message}</p>
                    <StatusChip label={severityTone[alert.severity].label} tone={severityTone[alert.severity].tone} />
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-[16px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-s0)] px-4 py-3 text-xs text-slate-500">
        <BellRing className="h-4 w-4" aria-hidden />
        <span>Telemetry for exports, simulations, and alerts is captured for QA dashboards.</span>
      </div>
    </Card>
  );
}
