import { useState } from 'react';
import { useOptimisticAction } from '../primitives/Toast';

type AutomationStep = 'trigger' | 'conditions' | 'actions' | 'cadence';

interface AutomationBuilderProps {
  name: string;
  defaults?: Partial<Record<AutomationStep, string>>;
}

export function AutomationBuilder({ name, defaults = {} }: AutomationBuilderProps) {
  const [form, setForm] = useState<Record<AutomationStep, string>>({
    trigger: defaults.trigger ?? '',
    conditions: defaults.conditions ?? '',
    actions: defaults.actions ?? '',
    cadence: defaults.cadence ?? ''
  });

  const saveAutomation = useOptimisticAction(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      sessionStorage.setItem(`automation-${name}`, JSON.stringify(form));
      return true;
    },
    {
      pendingLabel: 'Enabling automation…',
      successLabel: 'Automation enabled',
      undoLabel: 'Undo enable',
      onUndo: () => sessionStorage.removeItem(`automation-${name}`)
    }
  );

  return (
    <form
      className="automation-builder"
      aria-label={`${name} automation builder`}
      onSubmit={(event) => {
        event.preventDefault();
        void saveAutomation();
      }}
    >
      <h3 className="section-title">Automation builder</h3>
      <p className="card__subtitle">
        Configure trigger, conditions, actions, and cadence. Changes are saved optimistically with undo support.
      </p>
      <AutomationField
        id={`${name}-trigger`}
        label="Trigger"
        placeholder="Describe the trigger signal (e.g., API drop 20%)"
        value={form.trigger}
        onChange={(value) => setForm((prev) => ({ ...prev, trigger: value }))}
      />
      <AutomationField
        id={`${name}-conditions`}
        label="Conditions"
        placeholder="Guardrails and thresholds"
        value={form.conditions}
        onChange={(value) => setForm((prev) => ({ ...prev, conditions: value }))}
      />
      <AutomationField
        id={`${name}-actions`}
        label="Actions"
        placeholder="Describe the sequence (Slack alert, assign owner, webhook)"
        value={form.actions}
        onChange={(value) => setForm((prev) => ({ ...prev, actions: value }))}
      />
      <AutomationField
        id={`${name}-cadence`}
        label="Cadence"
        placeholder="Ex: Immediately, repeat every 4h until resolved"
        value={form.cadence}
        onChange={(value) => setForm((prev) => ({ ...prev, cadence: value }))}
      />
      <div className="form-actions">
        <button type="submit" className="button-primary">
          Enable automation
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setForm({ trigger: '', conditions: '', actions: '', cadence: '' })}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

interface AutomationFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function AutomationField({ id, label, value, placeholder, onChange }: AutomationFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        minLength={0}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
