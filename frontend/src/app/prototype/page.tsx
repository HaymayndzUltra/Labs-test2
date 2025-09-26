'use client';

import { useState } from 'react';
import { synthesizeProposal } from '@/lib/automation/proposal';
import { summarizeIntake } from '@/lib/automation/langchain';
import { triggerN8nWorkflow } from '@/lib/workflows/n8n';
import { recordEvent } from '@/lib/analytics/posthog';
import { usePersonaStore } from '@/stores/personaStore';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const questions = [
  'What outcomes are you targeting?',
  'What is your budget range?',
  'What timeline are you aiming for?',
  'How mature is your data infrastructure?',
];

export default function PrototypePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'assistant',
      content: 'Hey there! I will co-create your proposal. Ready when you are.',
    },
  ]);
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState({ goals: '', budget: '', timeline: '', dataMaturity: '' });
  const [artifact, setArtifact] = useState<{ markdown: string; pdfBase64: string } | null>(null);
  const persona = usePersonaStore((state) => state.getPersona());

  const currentQuestion = questions[step];

  const handleSubmit = async (value: string) => {
    if (!value) return;
    const key = ['goals', 'budget', 'timeline', 'dataMaturity'][step] as keyof typeof formState;
    const nextMessages: Message[] = [
      ...messages,
      { id: `user-${step}`, role: 'user', content: value },
      { id: `assistant-${step}`, role: 'assistant', content: questions[step + 1] ?? 'Processing your proposal…' },
    ];
    setMessages(nextMessages);

    const updated = { ...formState, [key]: value };
    setFormState(updated);

    if (step === questions.length - 1) {
      try {
        recordEvent('intake_submitted', { persona: persona.id });
        const insights = await summarizeIntake(Object.values(updated));
        const proposal = await synthesizeProposal(updated);
        setArtifact(proposal);
        await triggerN8nWorkflow({
          persona: persona.id,
          intakeId: `intake-${Date.now()}`,
          email: 'client@example.com',
          proposalUrl: 'https://notion.so/todo',
        });
        recordEvent('prototype_launcher_triggered', { persona: persona.id });
        recordEvent('proposal_generated', { persona: persona.id });
        setMessages((prev) => [
          ...prev,
          {
            id: 'summary',
            role: 'assistant',
            content: `Thanks! Here is your summary:\n${insights}`,
          },
        ]);
        setStep(questions.length);
      } catch (error) {
        console.error(error);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Discovery Client Module</p>
        <h1 className="text-4xl font-semibold text-white">Chat intake orchestrates persona-aware prototypes</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Intake responses hydrate the Dashboard Vault and auto-generate proposals. OpenAI + LangChain stubs simulate
          production flows; plug in your keys to go live.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`max-w-xl rounded-3xl px-4 py-3 text-sm ${
                message.role === 'assistant' ? 'self-start bg-white/10 text-white' : 'self-end bg-emerald-500/80 text-slate-900'
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.content}
            </motion.div>
          ))}
        </div>
        {step < questions.length && (
          <form
            className="mt-6 flex gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const value = (form.elements.namedItem('response') as HTMLInputElement).value;
              handleSubmit(value);
              form.reset();
            }}
          >
            <input
              name="response"
              placeholder={currentQuestion}
              className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <button type="submit" className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900">
              Send
            </button>
          </form>
        )}
      </section>

      {artifact && (
        <section className="rounded-3xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-2xl font-semibold text-white">Proposal Exporter</h2>
          <p className="mt-2 text-sm text-slate-300">
            Download markdown for Notion or decode the base64 PDF. Replace TODO markers with OpenAI API key for live
            generation.
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-200">
            <p className="font-semibold text-white">Needs Analysis Recommendations</p>
            <ul className="mt-2 list-disc pl-5">
              {persona.dashboardRecommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <pre className="rounded-2xl bg-slate-900/80 p-4 text-xs text-emerald-200">{artifact.markdown}</pre>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-xs text-slate-300">
              <p className="font-semibold">PDF Snapshot</p>
              <p className="break-all text-[10px]">{artifact.pdfBase64}</p>
              <p className="mt-2 text-amber-300">TODO: Persist to Supabase storage + Notion API.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
