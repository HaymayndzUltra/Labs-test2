'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const IntakeSchema = z.object({
  goals: z.string().min(4),
  budget: z.string().min(2),
  timeline: z.string().min(2),
  dataMaturity: z.string().min(2),
});

export type IntakeValues = z.infer<typeof IntakeSchema>;

export function IntakeForm({ onSubmit, isLoading }: { onSubmit: (values: IntakeValues) => void; isLoading: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntakeValues>({ resolver: zodResolver(IntakeSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-white/40">Goals</label>
        <textarea
          {...register('goals')}
          className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/70 p-4 text-sm text-white/90"
          placeholder="Launch automated executive dashboards for..."
        />
        {errors.goals ? <p className="text-xs text-rose-300">{errors.goals.message}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">Budget</label>
          <input
            {...register('budget')}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/70 p-3 text-sm text-white/90"
            placeholder="$20k"
          />
          {errors.budget ? <p className="text-xs text-rose-300">{errors.budget.message}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">Timeline</label>
          <input
            {...register('timeline')}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/70 p-3 text-sm text-white/90"
            placeholder="6 weeks"
          />
          {errors.timeline ? <p className="text-xs text-rose-300">{errors.timeline.message}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">Data Maturity</label>
          <input
            {...register('dataMaturity')}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/70 p-3 text-sm text-white/90"
            placeholder="Fragmented APIs"
          />
          {errors.dataMaturity ? <p className="text-xs text-rose-300">{errors.dataMaturity.message}</p> : null}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-emerald-500/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-500 disabled:opacity-60"
      >
        {isLoading ? 'Processing…' : 'Send intake'}
      </button>
    </form>
  );
}
