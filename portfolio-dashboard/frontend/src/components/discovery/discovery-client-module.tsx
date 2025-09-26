'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { usePersonaStore } from '@/state/persona-store';
import { SectionHeader } from '@/components/ui/section-header';
import { Panel } from '@/components/ui/panel';
import type { IntakeResponse } from '@/lib/automation/intake';
import { captureEvent } from '@/lib/analytics/posthog';

const chatSchema = z.object({
  message: z.string().min(3),
});

type ChatForm = z.infer<typeof chatSchema>;

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const DiscoveryClientModule = () => {
  const { persona } = usePersonaStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: 'Kamusta! Sabihin mo ang goals, budget, timeline, at data maturity para ma-tailor ko ang dashboards mo.',
    },
  ]);
  const [analysis, setAnalysis] = useState<IntakeResponse | null>(null);

  const intakeMutation = useMutation({
    mutationFn: async (payload: { message: string }) => {
      const transcript = [...messages, { id: createId(), role: 'user' as const, content: payload.message }];
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: persona.id, transcript }),
      });
      if (!response.ok) {
        throw new Error('Intake failed');
      }
      return response.json() as Promise<IntakeResponse>;
    },
    onSuccess: async (data, variables) => {
      captureEvent('prototype_launched', { persona: persona.id });
      setAnalysis(data);
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'user', content: variables.message },
        {
          id: 'assistant-response',
          role: 'assistant',
          content: `Salamat! Recommended dashboards: ${data.recommendedDashboards.join(', ')}. Ready ka na bang mag-export?`,
        },
      ]);
    },
  });

  const proposalMutation = useMutation({
    mutationFn: async () => {
      if (!analysis) throw new Error('No analysis yet');
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: persona.label,
          summary: analysis.summary,
          recommendedDashboards: analysis.recommendedDashboards,
        }),
      });
      if (!response.ok) throw new Error('Proposal generation failed');
      const result = await response.json();
      captureEvent('proposal_generated', { persona: persona.id });
      return result as { markdown: string; pdf: string };
    },
  });

  const form = useForm<ChatForm>({ resolver: zodResolver(chatSchema), defaultValues: { message: '' } });

  const submitMessage = form.handleSubmit((values) => {
    intakeMutation.mutate({ message: values.message });
    form.reset();
  });

  return (
    <section className="space-y-12">
      <SectionHeader
        eyebrow="Discovery Client Module"
        title="Chat-style intake bot powering proposal automation"
        description="Capture client signals in natural language, classify their needs, and auto-configure dashboard states. Export PDF + Notion snapshots once ready."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Panel className="flex flex-col gap-4 p-6">
          <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-50/80 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
                  message.role === 'assistant'
                    ? 'self-start bg-white text-slate-600'
                    : 'self-end bg-indigo-500 text-white'
                }`}
              >
                {message.content}
              </div>
            ))}
            {intakeMutation.isPending && <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />}
          </div>
          <form onSubmit={submitMessage} className="flex items-center gap-3">
            <input
              {...form.register('message')}
              placeholder="Describe your project goals, budget, timeline, and data maturity…"
              className="flex-1 rounded-full border border-slate-200/70 px-4 py-3 text-sm shadow-inner"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow"
              disabled={intakeMutation.isPending}
            >
              Send
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Panel>
        <Panel className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Needs Analysis Engine</h3>
          {analysis ? (
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</p>
                <p>{analysis.summary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboards</p>
                <ul className="list-disc space-y-1 pl-4">
                  {analysis.recommendedDashboards.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Extracted Inputs</p>
                <ul className="space-y-1">
                  <li>Goal: {analysis.extracted.goal ?? 'Pending details'}</li>
                  <li>Budget: {analysis.extracted.budget ?? 'Pending details'}</li>
                  <li>Timeline: {analysis.extracted.timeline ?? 'Pending details'}</li>
                  <li>Data Maturity: {analysis.extracted.dataMaturity ?? 'Pending details'}</li>
                </ul>
              </div>
              <button
                onClick={() => proposalMutation.mutate()}
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white"
                disabled={proposalMutation.isPending}
              >
                {proposalMutation.isPending ? 'Generating…' : 'Export Proposal'}
              </button>
              {proposalMutation.data && (
                <div className="space-y-2 text-xs text-slate-500">
                  <p>Markdown Snapshot:</p>
                  <pre className="max-h-40 overflow-y-auto rounded-2xl bg-slate-900/80 p-4 text-white">{proposalMutation.data.markdown}</pre>
                  <p>PDF (base64): {proposalMutation.data.pdf.slice(0, 60)}…</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Waiting for client inputs…</p>
          )}
        </Panel>
      </div>
    </section>
  );
};
