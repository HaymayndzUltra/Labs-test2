import { FormEvent, useState } from 'react';
import { useToast } from './ToastProvider';

interface AutomationBuilderProps {
  title: string;
  presets: string[];
  onDryRun?: (payload: AutomationDraft) => void;
}

export interface AutomationDraft {
  name: string;
  trigger: string;
  conditions: string;
  actions: string;
  cadence: string;
}

export const AutomationBuilder = ({ title, presets, onDryRun }: AutomationBuilderProps) => {
  const { push } = useToast();
  const [draft, setDraft] = useState<AutomationDraft>({
    name: presets[0] ?? 'Automation',
    trigger: '',
    conditions: '',
    actions: '',
    cadence: 'immediate'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const payload = { ...draft };
    push({
      title: 'Automation scheduled',
      description: 'Running dry-run while saving your configuration…',
      actionLabel: 'Undo',
      onAction: () => {
        setIsSubmitting(false);
        push({ title: 'Automation reverted', description: 'The configuration was rolled back.' });
      }
    });
    window.setTimeout(() => {
      setIsSubmitting(false);
      onDryRun?.(payload);
      push({
        title: 'Dry-run complete',
        description: 'Logs are ready in observability → automation workspace.'
      });
    }, 900);
  };

  return (
    <form
      aria-label={title}
      onSubmit={handleSubmit}
      className="card-surface flex flex-col gap-4"
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-[16px] leading-[24px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <p className="text-[14px] leading-[20px] text-[var(--color-text-muted)]">
          Trigger → conditions → actions → cadence. All actions support undo and audit trails.
        </p>
      </header>
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Template</span>
          <select
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2"
          >
            {presets.map((preset) => (
              <option key={preset}>{preset}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Trigger</span>
          <input
            required
            value={draft.trigger}
            onChange={(event) => setDraft((current) => ({ ...current, trigger: event.target.value }))}
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2"
            placeholder="e.g. API usage drop > 20%"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Conditions</span>
          <textarea
            required
            value={draft.conditions}
            onChange={(event) => setDraft((current) => ({ ...current, conditions: event.target.value }))}
            className="min-h-[120px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2"
            placeholder="Boolean logic, thresholds, or hold-out rules"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Actions</span>
          <textarea
            required
            value={draft.actions}
            onChange={(event) => setDraft((current) => ({ ...current, actions: event.target.value }))}
            className="min-h-[120px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2"
            placeholder="Notifications, tasks, webhooks, connectors"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Cadence</span>
          <select
            value={draft.cadence}
            onChange={(event) => setDraft((current) => ({ ...current, cadence: event.target.value }))}
            className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-0)] px-3 py-2"
          >
            <option value="immediate">Immediate + real-time guardrails</option>
            <option value="hourly">Hourly rollups</option>
            <option value="daily">Daily review</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-lg border border-[var(--border-strong)] px-4 py-2 text-[14px] font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--surface-0)]"
          onClick={() => onDryRun?.(draft)}
        >
          Dry-run
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary-500 px-5 py-2 text-[14px] font-semibold text-white shadow-elevation transition-transform duration-200 hover:bg-primary-600 active:translate-y-[1px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Save automation'}
        </button>
      </div>
    </form>
  );
};
