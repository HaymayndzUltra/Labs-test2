import { useState } from 'react';
import { Stepper, StepperStep } from './Stepper';
import { Card } from './Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const automationSchema = z.object({
  name: z.string().min(3),
  trigger: z.string(),
  condition: z.string(),
  action: z.string(),
  cadence: z.string(),
  dryRun: z.boolean().default(true)
});

type AutomationForm = z.infer<typeof automationSchema>;

const steps: StepperStep[] = [
  { id: 'trigger', label: 'Trigger', description: 'Schedule · Threshold · Anomaly · Webhook' },
  { id: 'conditions', label: 'Conditions', description: 'Segments, budgets, geography' },
  { id: 'actions', label: 'Actions', description: 'Notify · Mutate · Webhook · Retry' },
  { id: 'cadence', label: 'Cadence', description: 'Frequency caps, quiet hours' }
];

export function AutoBuilder({ onSubmit }: { onSubmit: (automation: AutomationForm) => void }) {
  const [step, setStep] = useState<'trigger' | 'conditions' | 'actions' | 'cadence'>('trigger');
  const { register, handleSubmit, formState } = useForm<AutomationForm>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      name: 'Untitled automation',
      trigger: 'threshold',
      condition: 'segment: enterprise',
      action: 'notify:slack',
      cadence: 'hourly',
      dryRun: true
    }
  });

  return (
    <Card title="Automation Builder" accent="var(--accent-finops)">
      <Stepper steps={steps} active={step} onChange={(id) => setStep(id as typeof step)} />
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((values) => {
          onSubmit(values);
        })}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-[color:var(--text-primary)]">Automation name</span>
            <input
              {...register('name')}
              className="h-11 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-transparent px-3"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-[color:var(--text-primary)]">Trigger</span>
            <select
              {...register('trigger')}
              className="h-11 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-transparent px-3"
            >
              <option value="schedule">Schedule</option>
              <option value="threshold">Threshold</option>
              <option value="anomaly">Anomaly</option>
              <option value="webhook">Webhook</option>
              <option value="manual">Manual</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-[color:var(--text-primary)]">Conditions</span>
          <textarea
            {...register('condition')}
            className="min-h-[96px] rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-transparent px-3 py-2"
            placeholder="segment: enterprise; geography: emea"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-[color:var(--text-primary)]">Actions</span>
          <textarea
            {...register('action')}
            className="min-h-[96px] rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-transparent px-3 py-2"
            placeholder="notify:slack://finops; mutate:queue://net-new"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-[color:var(--text-primary)]">Cadence</span>
          <input
            {...register('cadence')}
            className="h-11 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-transparent px-3"
            placeholder="Every 30 minutes"
          />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register('dryRun')} className="h-4 w-4 rounded border-[color:var(--line-soft)]" />
          <span>Dry-run before activating (provides diff preview)</span>
        </label>
        {formState.errors && Object.keys(formState.errors).length > 0 && (
          <pre className="rounded-[12px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-2)] p-3 text-xs">
            {JSON.stringify(formState.errors, null, 2)}
          </pre>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="h-11 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] px-5 text-sm"
            onClick={() => setStep('trigger')}
          >
            Reset
          </button>
          <button
            type="submit"
            className="h-11 rounded-[16px] border-[1.5px] border-transparent bg-[color:var(--accent-finops)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-2)]"
          >
            Publish automation
          </button>
        </div>
      </form>
    </Card>
  );
}
