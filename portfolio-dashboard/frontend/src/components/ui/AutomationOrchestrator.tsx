'use client';

import { useMemo, useState } from 'react';
import { Clock, Coins, Play, Settings2, Workflow } from 'lucide-react';
import type { AutomationWorkflow } from '@/app/dashboard/data';
import { AutomationBuilder } from './AutomationBuilder';
import { Card } from './Card';
import { StatusChip } from './StatusChip';
import { cn } from '@/lib/utils';

type AutomationOrchestratorProps = {
  workflows: AutomationWorkflow[];
  verticalAccent: string;
  onSimulate: (workflow: AutomationWorkflow) => Promise<void>;
  onRun: (workflow: AutomationWorkflow) => Promise<void>;
  onCreate: (values: { name: string; trigger: string; conditions: string; action: string; cadence: string }) => Promise<void>;
};

type OrchestratorTab = 'runs' | 'recipes' | 'billing';

const statusTone: Record<AutomationWorkflow['status'], Parameters<typeof StatusChip>[0]['tone']> = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  scheduled: 'info',
  running: 'info',
};

function formatRunDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AutomationOrchestrator({ workflows, verticalAccent, onRun, onSimulate, onCreate }: AutomationOrchestratorProps) {
  const [activeTab, setActiveTab] = useState<OrchestratorTab>('runs');
  const [expandedBuilder, setExpandedBuilder] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<'run' | 'simulate' | null>(null);

  const sortedWorkflows = useMemo(
    () =>
      [...workflows].sort((a, b) => {
        if (a.status === 'running' && b.status !== 'running') return -1;
        if (b.status === 'running' && a.status !== 'running') return 1;
        return new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime();
      }),
    [workflows]
  );

  const handleAction = async (workflow: AutomationWorkflow, type: 'run' | 'simulate') => {
    setPendingActionId(workflow.id);
    setPendingType(type);
    try {
      if (type === 'run') {
        await onRun(workflow);
      } else {
        await onSimulate(workflow);
      }
    } finally {
      setPendingActionId(null);
      setPendingType(null);
    }
  };

  return (
    <Card className="flex flex-col gap-5 border border-[var(--surface-border)] bg-[var(--surface-s1)]" padding="md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Automation</p>
          <h3 className="text-title-sm text-slate-900">Automation orchestrator</h3>
          <p className="text-xs text-slate-600">Unified runs, recipes, and billing controls across automation suites.</p>
        </div>
        <span
          className="inline-flex min-h-[32px] items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600"
          style={{ background: `color-mix(in srgb, var(${verticalAccent}) 18%, white)` }}
        >
          {workflows.length} workflows
        </span>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Automation orchestrator tabs">
        {(
          [
            { id: 'runs', icon: Workflow, label: 'Runs' },
            { id: 'recipes', icon: Settings2, label: 'Recipes' },
            { id: 'billing', icon: Coins, label: 'Billing' },
          ] as const
        ).map((tab) => (
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
            <tab.icon className="mr-2 inline h-4 w-4" aria-hidden />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'runs' ? (
        <div role="tabpanel" className="space-y-3">
          {sortedWorkflows.map((workflow) => {
            const isPending = pendingActionId === workflow.id;
            return (
              <article
                key={workflow.id}
                className="rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{workflow.title}</p>
                    <p className="text-xs text-slate-500">Last run {formatRunDate(workflow.lastRun)}</p>
                  </div>
                  <StatusChip label={workflow.status} tone={statusTone[workflow.status]} />
                </div>
                <p className="mt-2 text-xs text-slate-600">{workflow.trigger}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">Owner: {workflow.owner}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Channel: {workflow.channel}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">Cadence: {workflow.cadence}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                    onClick={() => handleAction(workflow, 'simulate')}
                    disabled={isPending}
                  >
                    <Clock className="h-4 w-4" aria-hidden />
                    {isPending && pendingType === 'simulate' ? 'Simulating…' : 'Simulate'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                    onClick={() => handleAction(workflow, 'run')}
                    disabled={isPending}
                  >
                    <Play className="h-4 w-4" aria-hidden />
                    {isPending && pendingType === 'run' ? 'Running…' : 'Run now'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {activeTab === 'recipes' ? (
        <div role="tabpanel" className="space-y-3">
          {workflows.map((workflow) => (
            <article
              key={workflow.id}
              className="rounded-[16px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{workflow.title}</p>
                  <p className="text-xs text-slate-500">Trigger: {workflow.trigger}</p>
                </div>
                <StatusChip label={workflow.active ? 'Active' : 'Paused'} tone={workflow.active ? 'success' : 'warning'} />
              </div>
              <p className="mt-2 text-xs text-slate-600">Action: {workflow.action}</p>
              <p className="text-xs text-slate-500">Next run {workflow.nextRun ? formatRunDate(workflow.nextRun) : 'on demand'}</p>
            </article>
          ))}
        </div>
      ) : null}

      {activeTab === 'billing' ? (
        <div role="tabpanel" className="space-y-4 text-xs text-slate-600">
          <p>
            Automation usage is metered per successful run with inclusive simulate allowances. Billing ties directly to
            workflow IDs and surfaces anomalies within the finance dashboard.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-[var(--primary-500)]" aria-hidden />
              <span>Simulations are free up to 500 per month; orchestrated runs bill at $0.09 each.</span>
            </li>
            <li className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-[var(--primary-500)]" aria-hidden />
              <span>Billing reports sync nightly with finance systems and expose ledger IDs for reconciliation.</span>
            </li>
          </ul>
        </div>
      ) : null}

      <div className="rounded-[16px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-s0)] px-4 py-3 text-xs text-slate-500">
        Need a new workflow?{' '}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[var(--primary-600)] underline-offset-2 hover:underline focus-visible:focus-ring"
          onClick={() => setExpandedBuilder((prev) => !prev)}
        >
          {expandedBuilder ? 'Hide builder' : 'Open builder'}
        </button>
        .
      </div>

      {expandedBuilder ? (
        <AutomationBuilder
          className="border border-dashed border-[var(--surface-border)]"
          verticalAccent={verticalAccent}
          onCreate={async (values) => {
            await onCreate(values);
            setExpandedBuilder(false);
          }}
        />
      ) : null}
    </Card>
  );
}
