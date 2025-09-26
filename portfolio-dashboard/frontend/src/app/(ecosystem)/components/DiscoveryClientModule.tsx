'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';
import { usePersonaStore } from '@/hooks/usePersonaStore';
import { personas, type PersonaId } from '@/lib/personas';

interface IntakeState {
  personaHint?: string;
  goals?: string;
  budget?: string;
  timeline?: string;
  dataMaturity?: string;
}

const QUESTIONS = [
  { id: 'personaHint', prompt: 'Which persona best reflects you? (SaaS, Healthcare, E-commerce, Fintech)' },
  { id: 'goals', prompt: 'What outcomes should this dashboard ecosystem deliver first?' },
  { id: 'budget', prompt: 'Any budget guardrails or preferred engagement model?' },
  { id: 'timeline', prompt: 'Target launch timeline or key milestone?' },
  { id: 'dataMaturity', prompt: 'Describe your data maturity (sources, cleanliness, automations).' },
] as const;

type Question = (typeof QUESTIONS)[number];

type Message = {
  id: string;
  role: 'bot' | 'client';
  content: string;
};

function mapPersonaHintToId(hint?: string): PersonaId {
  if (!hint) {
    return 'saas-founder';
  }

  const normalized = hint.toLowerCase();
  if (normalized.includes('health')) {
    return 'healthcare-exec';
  }
  if (normalized.includes('commerce') || normalized.includes('retail')) {
    return 'ecommerce-lead';
  }
  if (normalized.includes('fintech') || normalized.includes('invest')) {
    return 'fintech-investor';
  }

  return 'saas-founder';
}

function buildProposalMarkdown(intake: IntakeState, personaId: PersonaId) {
  const persona = personas[personaId];

  return `# Proposal Snapshot — ${persona.label}\n\n` +
    `## Objectives\n${intake.goals ?? 'TODO capture goals'}\n\n` +
    `## Engagement Timeline\n${intake.timeline ?? 'TODO timeline'}\n\n` +
    `## Budget Guardrails\n${intake.budget ?? 'TODO budget'}\n\n` +
    `## Dashboard Recommendations\n` +
    persona.recommendedDashboards
      .map((dashboard) => `- **${dashboard.title}** — ${dashboard.description}`)
      .join('\n') +
    `\n\n## Automation Path\n- n8n workflow: intake → proposal → CRM\n- Personalized follow-ups with PostHog segments\n- TODO integrate Supabase + Firebase connectors`;
}

function downloadMarkdown(markdown: string, filename: string) {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function DiscoveryClientModule() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content:
        'Hi! I am your intake co-pilot. I will capture goals, budget, and timeline, then auto-map dashboards + KPIs.',
    },
  ]);
  const [intake, setIntake] = useState<IntakeState>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const [analysisPersona, setAnalysisPersona] = useState<PersonaId>('saas-founder');
  const { setPersonaId } = usePersonaStore();
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);

  const currentQuestion: Question | undefined = QUESTIONS[stepIndex];

  const handleSubmit = () => {
    if (!input.trim() || !currentQuestion) {
      return;
    }

    const clientMessage: Message = {
      id: `client-${currentQuestion.id}`,
      role: 'client',
      content: input,
    };

    const updatedIntake = { ...intake, [currentQuestion.id]: input };
    setIntake(updatedIntake);
    setMessages((prev) => [...prev, clientMessage]);
    setInput('');

    const nextStep = stepIndex + 1;
    if (nextStep < QUESTIONS.length) {
      const nextQuestion = QUESTIONS[nextStep];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${nextQuestion.id}`,
            role: 'bot',
            content: nextQuestion.prompt,
          },
        ]);
      }, 300);
      setStepIndex(nextStep);
      return;
    }

    const personaId = mapPersonaHintToId(updatedIntake.personaHint);
    setAnalysisPersona(personaId);
    const summary = `Persona detected: ${personas[personaId].label}.\n` +
      `Focus Goals: ${updatedIntake.goals ?? 'TODO'}.\n` +
      `Budget: ${updatedIntake.budget ?? 'TBD'} — timeline ${updatedIntake.timeline ?? 'TBD'}.\n` +
      `Data maturity: ${updatedIntake.dataMaturity ?? 'Unknown'}.
`;
    setAnalysisSummary(summary);
    track('intake_submitted', { persona: personaId });
    setMessages((prev) => [
      ...prev,
      {
        id: 'bot-summary',
        role: 'bot',
        content:
          'Great, thanks! I prepared a needs analysis summary and mapped dashboards. You can launch a prototype or export a proposal below.',
      },
    ]);
    setStepIndex(nextStep);
  };

  return (
    <section className="mt-16 rounded-[3rem] border border-slate-900/40 bg-slate-950/80 p-10 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Discovery Client Module</p>
          <h2 className="mt-2 text-3xl font-semibold">Chat intake, needs analysis, proposal export</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Intake assistant uses OpenAI + LangChain summarization stubs to map personas, dashboards, and automation flows.
            Complete the prompts, then trigger a prototype + proposal download instantly.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          Discovery → Prototype in minutes
        </div>
      </header>
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="h-[360px] overflow-y-auto rounded-3xl border border-white/15 bg-black/30 p-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`mb-4 flex ${message.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`max-w-md rounded-3xl px-4 py-3 text-sm ${
                    message.role === 'bot' ? 'bg-white/10 text-white' : 'bg-indigo-500/80 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </div>
          {stepIndex < QUESTIONS.length ? (
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Your response</p>
              <textarea
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white focus:outline-none"
                rows={3}
                value={input}
                placeholder={currentQuestion?.prompt}
                onChange={(event) => setInput(event.target.value)}
              />
              <button
                type="button"
                className="mt-3 w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Intake complete — personalize the prototype & export the proposal.
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner">
            <h3 className="text-lg font-semibold">Needs Analysis Engine</h3>
            <p className="mt-2 text-sm text-slate-300">
              Classification logic maps intake into personas + KPI packages. LangChain summarization stub is ready for
              live API credentials.
            </p>
            <pre className="mt-4 h-48 overflow-auto rounded-2xl bg-black/40 p-4 text-xs text-indigo-100">
{analysisSummary ?? 'Answer the prompts to generate a summary.'}
            </pre>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-lg font-semibold">Prototype Launcher</h3>
            <p className="text-sm text-slate-300">
              Instantly shift the dashboard vault to the detected persona and preload scenario filters.
            </p>
            <button
              type="button"
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
              disabled={!analysisSummary}
              onClick={() => {
                setPersonaId(analysisPersona);
              }}
            >
              Launch prototype for {personas[analysisPersona].label}
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-lg font-semibold">Proposal Exporter</h3>
            <p className="text-sm text-slate-300">
              Generate Markdown (Notion-ready) snapshot. TODO: Add PDF export via PDFKit.
            </p>
            <button
              type="button"
              className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/40"
              disabled={!analysisSummary}
              onClick={() => {
                const markdown = buildProposalMarkdown(intake, analysisPersona);
                downloadMarkdown(markdown, `proposal-${analysisPersona}.md`);
                track('proposal_generated', { persona: analysisPersona, source: 'discovery-module' });
              }}
            >
              Export Notion Markdown
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
