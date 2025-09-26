'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IntakeForm, type IntakeValues } from './components/IntakeForm';
import { DiscoveryTranscript, type TranscriptMessage } from './components/DiscoveryTranscript';
import { ProposalExporter } from './components/ProposalExporter';
import { usePersonaStore, type PersonaDefinition } from '../../hooks/usePersonaStore';
import { trackEvent } from '../../lib/analytics';
import type { PodData } from '../dashboard/data';

export function DiscoveryClient() {
  const { activePersona, setPersona } = usePersonaStore();
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    { role: 'assistant', content: 'Tell me about your goals, budget, and delivery window.' },
  ]);
  const [analysis, setAnalysis] = useState<{
    summary: string;
    kpiFocus: string[];
    podName: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: async (values: IntakeValues) => {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to process intake');
      }
      const payload = await response.json();
      return payload as {
        persona: PersonaDefinition;
        pod: PodData;
        summary: string;
        recommendedDashboards: string[];
        kpiFocus: string[];
      };
    },
    onSuccess: (payload, variables) => {
      setPersona(payload.persona.id);
      setMessages((prev) => [
        ...prev,
        { role: 'client', content: `Goals: ${variables.goals}` },
        { role: 'assistant', content: payload.summary },
      ]);
      setAnalysis({ summary: payload.summary, kpiFocus: payload.kpiFocus, podName: payload.pod.name });
      trackEvent('intake_submitted', { persona: payload.persona.id, pod: payload.pod.id });
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-16">
        <header className="flex flex-col gap-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Discovery Client Module</p>
          <h1 className="text-4xl font-semibold">Persona-aware intake + proposal automation</h1>
          <p className="text-white/70">
            Powered by OpenAI + LangChain stubs. Extend with secure n8n workflows.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-6">
            <DiscoveryTranscript messages={messages} />
            <IntakeForm onSubmit={(values) => mutation.mutate(values)} isLoading={mutation.isPending} />
          </div>
          <div className="space-y-6">
            {analysis ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
                <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Needs analysis engine</h2>
                <p className="mt-2 text-sm text-white/70">{analysis.summary}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-emerald-200">KPI focus</p>
                <ul className="mt-2 space-y-2 text-sm text-white/80">
                  {analysis.kpiFocus.map((kpi) => (
                    <li key={kpi} className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2">
                      {kpi}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/dashboard?pod=${analysis.podName.toLowerCase().includes('health') ? 'healthcare' : 'fintech'}`}
                  className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 hover:bg-white/20"
                >
                  Launch prototype
                </a>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-white/60">
                Fill intake to unlock mapping.
              </div>
            )}
            {analysis && mutation.data?.pod ? (
              <ProposalExporter persona={mutation.data.persona} pod={mutation.data.pod} summary={analysis.summary} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
