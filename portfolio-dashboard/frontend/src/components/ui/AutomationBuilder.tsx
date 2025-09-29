'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Play } from 'lucide-react';
import { useToast } from './ToastProvider';
import { Card } from './Card';
import { cn } from '@/lib/utils';

const automationSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  trigger: z.string().min(3, 'Trigger is required'),
  conditions: z.string().min(3, 'Add at least one condition'),
  action: z.string().min(3, 'Action is required'),
  cadence: z.string().min(3, 'Cadence is required'),
});

type AutomationForm = z.infer<typeof automationSchema>;

type AutomationBuilderProps = {
  onCreate: (automation: AutomationForm) => Promise<void>;
  verticalAccent: string;
  className?: string;
};

export function AutomationBuilder({ onCreate, verticalAccent, className }: AutomationBuilderProps) {
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AutomationForm>({
    resolver: zodResolver(automationSchema),
    mode: 'onBlur',
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    const undoToken = crypto.randomUUID();
    push({
      id: undoToken,
      title: 'Automation saved',
      description: 'We queued your automation — it will deploy within seconds.',
      tone: 'success',
      actionLabel: 'Undo',
      onAction: () => {
        push({
          title: 'Automation reverted',
          description: 'We rolled back the automation deployment.',
          tone: 'info',
        });
      },
    });
    try {
      await onCreate(values);
      reset();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card className={cn('border border-[var(--surface-border)] bg-[var(--surface-s1)]', className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-title-sm text-slate-900">Automation builder</h3>
            <p className="text-xs text-slate-600">
              Trigger → Conditions → Actions → Cadence. Optimistic orchestration with undo.
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]"
            style={{ background: `color-mix(in srgb, var(${verticalAccent}) 18%, white)` }}
          >
            Live preview
          </span>
        </div>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Workflow name</span>
            <input
              {...register('name')}
              className="min-h-[44px] rounded-[14px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-sm text-slate-700 focus-visible:focus-ring"
              placeholder="e.g. Churn recovery playbook"
            />
            {errors.name ? <span className="text-xs text-[var(--danger-600)]">{errors.name.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Trigger</span>
            <input
              {...register('trigger')}
              className="min-h-[44px] rounded-[14px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-sm text-slate-700 focus-visible:focus-ring"
              placeholder="Segment API usage dips below 40% baseline"
            />
            {errors.trigger ? <span className="text-xs text-[var(--danger-600)]">{errors.trigger.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Conditions</span>
            <textarea
              {...register('conditions')}
              className="rounded-[14px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 text-sm text-slate-700 focus-visible:focus-ring"
              rows={3}
              placeholder="If workspace plan = Scale & seat utilization < 60%"
            />
            {errors.conditions ? (
              <span className="text-xs text-[var(--danger-600)]">{errors.conditions.message}</span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Actions</span>
            <textarea
              {...register('action')}
              className="rounded-[14px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-3 text-sm text-slate-700 focus-visible:focus-ring"
              rows={3}
              placeholder="Open CSM task, send Slack alert, launch in-app journey"
            />
            {errors.action ? (
              <span className="text-xs text-[var(--danger-600)]">{errors.action.message}</span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-slate-700">Cadence</span>
            <input
              {...register('cadence')}
              className="min-h-[44px] rounded-[14px] border border-[var(--surface-border)] bg-[var(--surface-s1)] px-4 py-2 text-sm text-slate-700 focus-visible:focus-ring"
              placeholder="Every weekday at 08:00 local"
            />
            {errors.cadence ? <span className="text-xs text-[var(--danger-600)]">{errors.cadence.message}</span> : null}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Outputs ship via Slack, Email, SMS, and CRM tasks. Idempotent webhooks with HMAC + retry.
            </p>
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary-600)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-500)] focus-visible:focus-ring"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              Launch automation
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}
