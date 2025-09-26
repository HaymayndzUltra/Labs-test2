'use client';

import { Panel } from '@/components/ui/panel';
import { SectionHeader } from '@/components/ui/section-header';
import { usePersonaStore } from '@/state/persona-store';

const WORKFLOW_STEPS = [
  {
    title: 'Intake → Proposal → CRM',
    description:
      'n8n workflow consumes intake payload, generates summarised brief via LangChain, and creates CRM lead stub.',
  },
  {
    title: 'Personalised Follow-up',
    description: 'Email template merges proposal snapshot, attaches booking link placeholder, and schedules reminder.',
  },
  {
    title: 'Rules Engine',
    description: 'Persona flag toggles dataset, theme, and recommended dashboards instantly.',
  },
];

const RULES = [
  { persona: 'Healthcare', rule: 'Load HIPAA compliance dashboards + staffing simulator.' },
  { persona: 'Fintech', rule: 'Enable risk anomaly tagging + treasury stress scenarios.' },
  { persona: 'SaaS', rule: 'Prefill ARR cohorts + activation sequences.' },
];

export const AutomationPersonalization = () => {
  const { persona } = usePersonaStore();

  return (
    <section className="space-y-12">
      <SectionHeader
        eyebrow="Automation & Personalisation"
        title="Workflow orchestration and rules-driven experiences"
        description="Preview n8n automation blueprints, personalised follow-ups, and persona-aware rules toggles ready for CRM wiring."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Panel className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">n8n Workflow Overview</h3>
          <ol className="space-y-3 text-sm text-slate-600">
            {WORKFLOW_STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200/70 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Step {index + 1}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{step.title}</div>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-xs text-slate-500">
            TODO: Import actual n8n workflow JSON once API credentials are provided.
          </div>
        </Panel>
        <Panel className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Persona Rules Snapshot</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            {RULES.map((rule) => (
              <li key={rule.persona} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <strong className="text-slate-900">{rule.persona}</strong>: {rule.rule}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
            Current persona: <strong>{persona.label}</strong> → triggers theme <code>{persona.accent}</code>.
          </div>
        </Panel>
      </div>
    </section>
  );
};
