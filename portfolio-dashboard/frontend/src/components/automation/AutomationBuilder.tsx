import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../toast/ToastProvider';

const automationSchema = z.object({
  name: z.string().min(3, 'Automation name must be at least 3 characters'),
  trigger: z.string().min(1, 'Select a trigger'),
  condition: z.string().min(1, 'Set at least one condition'),
  action: z.string().min(1, 'Describe the action'),
  cadence: z.string().min(1, 'Provide cadence details'),
});

type AutomationFormValues = z.infer<typeof automationSchema>;

const triggerOptions = [
  { id: 'api-usage', label: 'API usage drop' },
  { id: 'seat-underuse', label: 'Seat under-utilization' },
  { id: 'payment-decline', label: 'Payment decline' },
  { id: 'inventory-risk', label: 'Inventory below threshold' },
];

export function AutomationBuilder({ onCreate }: { onCreate?: (values: AutomationFormValues) => Promise<void> | void }) {
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      name: '',
      trigger: '',
      condition: '',
      action: '',
      cadence: '',
    },
  });
  const { pushToast } = useToast();

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.trigger && values.condition) {
        form.clearErrors();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    let reverted = false;
    pushToast({
      title: 'Automation saved',
      description: `${values.name} enabled`,
      actionLabel: 'Undo',
      onAction: () => {
        reverted = true;
        pushToast({ title: 'Automation reverted', description: `${values.name} disabled`, level: 'warning' });
      },
    });
    await onCreate?.(values);
    if (!reverted) {
      form.reset();
    }
  });

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Automation builder"
      style={{ display: 'grid', gap: 'var(--space-2)' }}
    >
      <div>
        <label htmlFor="automation-name" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Automation name
        </label>
        <input
          id="automation-name"
          {...form.register('name')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
          aria-invalid={form.formState.errors.name ? 'true' : 'false'}
        />
        {form.formState.errors.name ? (
          <p style={{ color: 'var(--danger-600)', fontSize: 12 }}>{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="automation-trigger" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Trigger
        </label>
        <select
          id="automation-trigger"
          {...form.register('trigger')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
        >
          <option value="">Select trigger</option>
          {triggerOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {form.formState.errors.trigger ? (
          <p style={{ color: 'var(--danger-600)', fontSize: 12 }}>{form.formState.errors.trigger.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="automation-condition" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Conditions
        </label>
        <textarea
          id="automation-condition"
          rows={3}
          {...form.register('condition')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
          aria-describedby="automation-condition-hint"
        />
        <p id="automation-condition-hint" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
          Example: Seat utilization below 40% for 2 consecutive weeks.
        </p>
        {form.formState.errors.condition ? (
          <p style={{ color: 'var(--danger-600)', fontSize: 12 }}>{form.formState.errors.condition.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="automation-action" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Actions
        </label>
        <textarea
          id="automation-action"
          rows={3}
          {...form.register('action')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
          aria-describedby="automation-action-hint"
        />
        <p id="automation-action-hint" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
          Example: Create CSM task, send Slack alert, trigger email follow-up.
        </p>
        {form.formState.errors.action ? (
          <p style={{ color: 'var(--danger-600)', fontSize: 12 }}>{form.formState.errors.action.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="automation-cadence" style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Cadence & guardrails
        </label>
        <textarea
          id="automation-cadence"
          rows={2}
          {...form.register('cadence')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
          }}
        />
        {form.formState.errors.cadence ? (
          <p style={{ color: 'var(--danger-600)', fontSize: 12 }}>{form.formState.errors.cadence.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        style={{
          alignSelf: 'flex-start',
          padding: '12px 20px',
          borderRadius: '999px',
          background: 'var(--primary-600)',
          color: '#fff',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 16px 40px -24px rgba(79, 70, 229, 0.6)',
        }}
      >
        Create automation
      </button>
    </form>
  );
}
