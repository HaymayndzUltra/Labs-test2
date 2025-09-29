'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  Loader2,
  Play,
  RefreshCcw,
  Workflow,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { FilterChip } from '@/components/ui/FilterChip';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { useToast } from '@/components/ui/ToastProvider';
import type { TabDefinition } from '@/app/dashboard/data';

export type AggregatedAutomation = {
  id: string;
  title: string;
  trigger: string;
  action: string;
  owner: string;
  channel: string;
  cadence: string;
  active: boolean;
  moduleId: TabDefinition['id'];
  moduleLabel: string;
  lastRun: string;
  status: 'healthy' | 'attention' | 'failed';
  nextRun?: string;
};

export type BillingRun = {
  id: string;
  label: string;
  nextRun: string;
  owners: string[];
  status: 'scheduled' | 'processing' | 'completed';
};

type AutomationOrchestratorProps = {
  automations: AggregatedAutomation[];
  billingRuns: BillingRun[];
};

type OrchestratorTab = 'runs' | 'recipes' | 'billing';

const tabCopy: Record<OrchestratorTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  runs: { label: 'Runs', icon: Activity },
  recipes: { label: 'Recipes', icon: Workflow },
  billing: { label: 'Billing', icon: ClipboardList },
};

function toRelativeDate(isoDate: string) {
  const now = new Date();
  const date = new Date(isoDate);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function AutomationOrchestrator({ automations, billingRuns }: AutomationOrchestratorProps) {
  const [activeTab, setActiveTab] = useState<OrchestratorTab>('runs');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const { push } = useToast();

  const summary = useMemo(() => {
    const ordered = [...automations].sort((a, b) => new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime());
    return ordered.slice(0, 3);
  }, [automations]);

  const moduleFilters = useMemo(() => {
    const modules = new Map<string, number>();
    automations.forEach((automation) => {
      modules.set(automation.moduleLabel, (modules.get(automation.moduleLabel) ?? 0) + 1);
    });
    return Array.from(modules.entries());
  }, [automations]);

  const handleAction = async (
    automation: AggregatedAutomation,
    action: 'simulate' | 'run'
  ) => {
    setPendingAction(`${automation.id}-${action}`);
    trackAnalyticsEvent(action === 'simulate' ? 'automation_simulate' : 'automation_run', {
      automationId: automation.id,
      module: automation.moduleId,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPendingAction(null);
    push({
      title: `${automation.title}`,
      description: action === 'simulate' ? 'Simulation completed and logs captured.' : 'Run completed successfully.',
      tone: action === 'simulate' ? 'info' : 'success',
    });
  };

  return (
    <Card id="automation-orchestrator" className="border border-[var(--surface-border-strong)] bg-[var(--surface-s1)]" padding="lg">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Unified automation orchestration</p>
          <h2 className="text-display-md text-slate-900">Automation control center</h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Manage runs, recipes, and billing automation from a single pane. Track health, last run visibility, and trigger
            simulations with confidence.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {moduleFilters.map(([moduleLabel, count]) => (
              <FilterChip key={moduleLabel} label={`${moduleLabel} · ${count}`} active onClick={() => setActiveTab('runs')} />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-[var(--success-600)]" aria-hidden />
            <span>Change log captured with correlation IDs</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3"
            aria-label={`${item.title} automation summary`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <StatusChip
                label={item.status === 'healthy' ? 'Healthy' : item.status === 'attention' ? 'Needs review' : 'Failed'}
                tone={item.status === 'healthy' ? 'success' : item.status === 'attention' ? 'warning' : 'danger'}
              />
            </div>
            <p className="text-xs text-slate-500">Last run {toRelativeDate(item.lastRun)} · {item.moduleLabel}</p>
            <p className="text-xs text-slate-600">Trigger: {item.trigger}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3" role="tablist" aria-label="Automation orchestrator sections">
        {(Object.keys(tabCopy) as OrchestratorTab[]).map((tab) => {
          const Icon = tabCopy[tab].icon;
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:focus-ring transition ${
                isActive
                  ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                  : 'border-[var(--surface-border)] text-slate-600 hover:bg-slate-100/70'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tabCopy[tab].label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4" role="tabpanel" aria-live="polite">
        {activeTab === 'runs' ? (
          <div className="overflow-hidden rounded-[20px] border border-[var(--surface-border)]">
            <table className="min-w-full" aria-label="Automation runs table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="sticky top-0 px-4 py-3 text-left">Automation</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Module</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Last run</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Cadence</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Status</th>
                  <th className="sticky top-0 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="max-h-[360px] divide-y divide-[var(--surface-border)] overflow-auto bg-[var(--surface-s1)] text-sm">
                {automations.map((automation, index) => (
                  <tr
                    key={automation.id}
                    className={index % 2 === 0 ? 'bg-white/70' : 'bg-[var(--surface-s1)]'}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">{automation.title}</td>
                    <td className="px-4 py-3 text-slate-600">{automation.moduleLabel}</td>
                    <td className="px-4 py-3 text-slate-600">{toRelativeDate(automation.lastRun)}</td>
                    <td className="px-4 py-3 text-slate-600">{automation.cadence}</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100/70 focus-visible:focus-ring"
                          onClick={() => handleAction(automation, 'simulate')}
                          disabled={pendingAction !== null}
                        >
                          {pendingAction === `${automation.id}-simulate` ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : (
                            <RefreshCcw className="h-4 w-4" aria-hidden />
                          )}
                          Simulate
                        </button>
                        <button
                          type="button"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
                          onClick={() => handleAction(automation, 'run')}
                          disabled={pendingAction !== null}
                        >
                          {pendingAction === `${automation.id}-run` ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : (
                            <Play className="h-4 w-4" aria-hidden />
                          )}
                          Run now
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === 'recipes' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {automations.map((automation) => (
              <div key={`${automation.id}-recipe`} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{automation.title}</p>
                    <p className="text-xs text-slate-500">{automation.moduleLabel}</p>
                  </div>
                  <StatusChip
                    label={automation.active ? 'Active' : 'Paused'}
                    tone={automation.active ? 'success' : 'warning'}
                  />
                </div>
                <dl className="mt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-medium text-slate-700">Trigger</dt>
                    <dd className="text-right text-slate-600">{automation.trigger}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-medium text-slate-700">Action</dt>
                    <dd className="text-right text-slate-600">{automation.action}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-medium text-slate-700">Channel</dt>
                    <dd className="text-right text-slate-600">{automation.channel}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === 'billing' ? (
          <div className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-s1)]">
            <table className="min-w-full" aria-label="Billing automation table">
              <thead className="bg-[var(--surface-s0)] text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="sticky top-0 px-4 py-3 text-left">Workflow</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Next run</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Owners</th>
                  <th className="sticky top-0 px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="max-h-[320px] divide-y divide-[var(--surface-border)] overflow-auto bg-[var(--surface-s1)] text-sm">
                {billingRuns.map((run, index) => (
                  <tr key={run.id} className={index % 2 === 0 ? 'bg-white/70' : 'bg-[var(--surface-s1)]'}>
                    <td className="px-4 py-3 font-medium text-slate-900">{run.label}</td>
                    <td className="px-4 py-3 text-slate-600">{run.nextRun}</td>
                    <td className="px-4 py-3 text-slate-600">{run.owners.join(', ')}</td>
                    <td className="px-4 py-3">
                      <StatusChip
                        label={run.status}
                        tone={run.status === 'completed' ? 'success' : run.status === 'processing' ? 'info' : 'warning'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
