'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';
import { usePersonaStore } from '@/hooks/usePersonaStore';

const automationSteps = [
  {
    id: 'intake',
    title: 'Intake → LangChain summarizer',
    description: 'Capture chat responses, run OpenAI summary, enrich CRM payload.',
  },
  {
    id: 'proposal',
    title: 'Proposal composer',
    description: 'Merge persona dashboards, export Markdown + PDF stub.',
  },
  {
    id: 'crm',
    title: 'CRM sync + follow-up',
    description: 'Send to Supabase + Firebase collections and trigger personalized email.',
  },
];

const automationRules = {
  'saas-founder': ['Activate ARR vault presets', 'Email template: PLG growth loops'],
  'healthcare-exec': ['Load healthcare dashboards', 'Enable compliance QA alerts'],
  'ecommerce-lead': ['Enable conversion funnels', 'Sync geospatial deck filters'],
  'fintech-investor': ['Enable risk scenarios', 'Attach deal pipeline recap'],
} as const;

const EMAIL_PLACEHOLDER = `Hi {{firstName}},\n\nHere is your dashboard snapshot and booking link: {{bookingUrl}}.\n\nHighlights: {{insights}}\n\n— Upwork Portfolio AI`;

export function AutomationPersonalization() {
  const { persona, personaId } = usePersonaStore();
  const [workflowStatus, setWorkflowStatus] = useState('Idle');
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAutomation(null);
  }, [personaId]);

  const rulesForPersona = useMemo(() => automationRules[personaId], [personaId]);

  return (
    <section className="mt-16 rounded-[3rem] border border-slate-900/40 bg-slate-950/80 p-10 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Automation & Personalization</p>
          <h2 className="mt-2 text-3xl font-semibold">n8n workflows + rules engine preview</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Stubs simulate n8n automation from intake → proposal → CRM. Persona rules determine which dashboard pods load
            and which follow-up email is queued.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          Workflow status: {workflowStatus}
        </div>
      </header>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Automation flow</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {automationSteps.map((step, index) => (
                <motion.button
                  key={step.id}
                  type="button"
                  onClick={() => setSelectedAutomation(step.id)}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl border p-5 text-left ${
                    selectedAutomation === step.id
                      ? 'border-emerald-400/60 bg-emerald-500/10'
                      : 'border-white/15 bg-black/30'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Step {index + 1}</p>
                  <h4 className="mt-2 text-lg font-semibold text-white">{step.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                </motion.button>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rules Engine</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-200">
                {rulesForPersona.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Trigger workflow</h3>
            <p className="text-sm text-slate-300">
              Simulate n8n run. TODO: Connect to real n8n endpoint + Supabase/Firebase persistence.
            </p>
            <button
              type="button"
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
              onClick={() => {
                setWorkflowStatus('Running');
                setEventLog((prev) => [
                  `Workflow triggered for ${persona.label}`,
                  ...prev,
                ]);
                setTimeout(() => {
                  setWorkflowStatus('Proposal sent');
                  setEventLog((prev) => [
                    'Proposal exported (stub)',
                    'CRM payload synced to Supabase + Firebase (stub)',
                    ...prev,
                  ]);
                  track('proposal_generated', { persona: personaId, source: 'automation-workflow' });
                }, 800);
              }}
            >
              Run automation
            </button>
            <div className="rounded-2xl border border-white/15 bg-black/30 p-4 text-xs text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Event log</p>
              <ul className="mt-2 space-y-1">
                {eventLog.length === 0 && <li>Awaiting workflow trigger…</li>}
                {eventLog.map((event, index) => (
                  <li key={`${event}-${index}`}>{event}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Personalized email preview</h3>
            <p className="text-sm text-slate-300">
              Generated via OpenAI completions. TODO: replace with live API call.
            </p>
            <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-black/40 p-4 text-xs text-indigo-100">
{EMAIL_PLACEHOLDER}
            </pre>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Integration checklist</h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-200">
              <li>n8n workflow IDs wired with environment variables (TODO)</li>
              <li>Supabase service role key stored in Vercel env (placeholder)</li>
              <li>Firebase web app config for analytics fallback (placeholder)</li>
              <li>PostHog capture events: persona_selected, pod_viewed, intake_submitted, proposal_generated</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
