'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RadarTooltip,
} from 'recharts';
import { track } from '@/lib/analytics';
import {
  generateSkillHeatmapMetrics,
  generateTestimonials,
  generateTimelineEvents,
} from '@/lib/data/synthetic';
import { usePersonaStore } from '@/hooks/usePersonaStore';

interface TimelineEventCardProps {
  title: string;
  summary: string;
  date: string;
  impact: number;
}

function TimelineEventCard({ date, title, summary, impact }: TimelineEventCardProps) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{new Date(date).toLocaleDateString()}</p>
      <h4 className="mt-2 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm text-slate-300">{summary}</p>
      <p className="mt-3 text-xs text-slate-400">Impact window • +{impact.toFixed(1)} KPI delta</p>
    </motion.div>
  );
}

function ProposalPreview({ onGenerate }: { onGenerate: () => void }) {
  const { persona } = usePersonaStore();
  const [loading, setLoading] = useState(false);

  const recommended = persona.recommendedDashboards
    .map((dashboard) => `- **${dashboard.title}** → ${dashboard.description}`)
    .join('\n');

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        This AI-assisted proposal snapshot adapts to the {persona.label} persona and streams into PDF + Notion markdown
        with automation hooks ready.
      </p>
      <pre className="max-h-64 overflow-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-slate-200">
Persona: {persona.label}
Mission: {persona.mission}

Recommended dashboards:
{recommended}

Deliverables:
- Discovery intake via OpenAI + LangChain summarizer
- Multi-dashboard vault (Fintech + Healthcare)
- Proposal automations via n8n → CRM stub

Timeline: 3 sprints (2 weeks cadence)
Budget guardrails: Custom — TODO supply after intake
      </pre>
      <button
        type="button"
        className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
        onClick={async () => {
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 600));
          track('proposal_generated', { persona: persona.id });
          setLoading(false);
          onGenerate();
        }}
      >
        {loading ? 'Rendering proposal…' : 'Export PDF + Notion snapshot (stub)'}
      </button>
      <p className="text-xs text-slate-500">
        TODO: Connect to OpenAI + PDFKit / Notion API for full export pipeline.
      </p>
    </div>
  );
}

export function DynamicProfileHub() {
  const timeline = useMemo(() => generateTimelineEvents(6), []);
  const testimonials = useMemo(() => generateTestimonials(6), []);
  const skillHeatmap = useMemo(() => generateSkillHeatmapMetrics(), []);
  const { persona } = usePersonaStore();
  const [proposalGenerated, setProposalGenerated] = useState(false);

  return (
    <section className="mt-16 rounded-[3rem] border border-slate-900/40 bg-slate-950/80 p-10 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Dynamic Profile Hub</p>
          <h2 className="mt-2 text-3xl font-semibold">Immersive operator story for {persona.label}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Walk through the engagements timeline, metric-backed testimonials, and skill telemetry before previewing a
            persona-aware proposal.
          </p>
        </div>
        <div className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          Progressive disclosure layered
        </div>
      </header>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {timeline.map((event) => (
            <TimelineEventCard key={event.id} date={event.date} title={event.title} summary={event.summary} impact={event.impact} />
          ))}
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner">
            <h3 className="text-lg font-semibold">Skill Heatmap</h3>
            <p className="text-sm text-slate-300">Animated radar chart reveals current vs. potential mastery.</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillHeatmap} outerRadius="80%">
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#94a3b8' }} tickCount={5} />
                  <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Potential" dataKey="potential" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                  <RadarTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Testimonials Matrix</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="text-sm text-slate-200">“{testimonial.quote}”</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {testimonial.name} • {testimonial.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{testimonial.metric} uplift +{testimonial.uplift}%</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="rounded-3xl border border-white/15 bg-indigo-500/90 px-6 py-5 text-left text-white shadow-lg transition hover:bg-indigo-400"
            >
              <h3 className="text-lg font-semibold">See proposal sample</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Auto-generated proposal preview with persona highlights & automation checklists.
              </p>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur" />
            <Dialog.Content className="fixed inset-x-4 top-16 z-50 mx-auto max-w-2xl rounded-3xl border border-white/15 bg-slate-950/95 p-8 text-white shadow-2xl">
              <Dialog.Title className="text-2xl font-semibold">Proposal snapshot</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-slate-300">
                Trigger AI-assisted export to PDF + Notion-ready markdown.
              </Dialog.Description>
              <div className="mt-6">
                <ProposalPreview
                  onGenerate={() => {
                    setProposalGenerated(true);
                  }}
                />
              </div>
              <Dialog.Close className="mt-6 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200">
                Close
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="rounded-3xl border border-white/15 bg-emerald-500/90 px-6 py-5 text-left text-white shadow-lg transition hover:bg-emerald-400"
            >
              <h3 className="text-lg font-semibold">Book a call</h3>
              <p className="mt-2 text-sm text-emerald-100">
                Launch Calendly API stub with persona-aligned agenda and CRM logging.
              </p>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur" />
            <Dialog.Content className="fixed inset-x-4 top-16 z-50 mx-auto max-w-md rounded-3xl border border-white/15 bg-slate-950/95 p-8 text-white shadow-2xl">
              <Dialog.Title className="text-2xl font-semibold">Schedule a strategy session</Dialog.Title>
              <p className="mt-2 text-sm text-slate-300">
                TODO: Inject live Calendly token + Supabase lead capture. Current stub mirrors API payload locally.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <p>Persona: {persona.label}</p>
                <p>Agenda: Discovery, Prototype alignment, Automation walk-through</p>
                <p>Booking Link: https://calendly.com/todo/upwork-dashboard</p>
              </div>
              <Dialog.Close className="mt-6 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200">
                Close
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      {proposalGenerated && (
        <p className="mt-6 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
          Proposal export triggered — check automation queue in the Workflow module.
        </p>
      )}
    </section>
  );
}
