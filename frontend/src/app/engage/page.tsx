'use client';

import { useMemo, useState } from 'react';
import { TimelineSparkline } from '@/components/profile/Timeline';
import { TestimonialsMatrix } from '@/components/profile/TestimonialsMatrix';
import { SkillHeatmap } from '@/components/profile/SkillHeatmap';
import { generateTimeline, generateTestimonials, generateFintechDataset } from '@/data/syntheticDatasets';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { recordEvent } from '@/lib/analytics/posthog';

export default function EngagePage() {
  const timeline = useMemo(() => generateTimeline(6), []);
  const testimonials = useMemo(() => generateTestimonials(6), []);
  const growthSeries = useMemo(() => generateFintechDataset().timeSeries.slice(-12), []);
  const [isProposalOpen, setProposalOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Dynamic Profile Hub</p>
        <h1 className="text-4xl font-semibold text-white">Immersive narrative layers for Upwork buyers</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Scroll the animated timeline, scan testimonial metrics, and inspect the animated skill radar. Persona-aware CTAs
          trigger proposal previews and Calendly stubs with analytics instrumentation.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <motion.article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{new Date(item.period).toLocaleDateString()}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-400">Delivery velocity {(item.velocity * 100).toFixed(0)}%</span>
                <TimelineSparkline points={growthSeries.slice(0, index + 5)} />
              </div>
            </motion.article>
          ))}
        </div>
        <div className="space-y-8">
          <TestimonialsMatrix testimonials={testimonials} />
          <SkillHeatmap />
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8 lg:grid-cols-2">
        <Dialog.Root open={isProposalOpen} onOpenChange={setProposalOpen}>
          <Dialog.Trigger asChild>
            <button
              className="rounded-2xl bg-white px-6 py-4 text-left text-sm font-semibold text-slate-900"
              onClick={() => recordEvent('proposal_preview_requested', { location: 'profile' })}
            >
              <span className="block text-xs uppercase tracking-[0.35em] text-slate-600">Proposal Sample</span>
              <span className="mt-2 block text-lg">Preview Adaptive Proposal</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
              <Dialog.Title className="text-xl font-semibold text-white">Proposal Snapshot</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-slate-300">
                Auto-generated via LangChain summarization with Notion-compatible markdown export. PDF rendering stubbed
                via pdf-lib (TODO: wire real API key).
              </Dialog.Description>
              <pre className="mt-4 max-h-64 overflow-y-auto rounded-2xl bg-black/40 p-4 text-xs text-slate-200">
{`# Proposal Overview
- Persona: Fintech Investor
- Outcomes: Rapid due diligence, anomaly alerts, automation handoff
- Timeline: 4-week sprint → demo-ready SaaS artifact
`}
              </pre>
              <Dialog.Close className="mt-6 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Close Preview
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Book a Call</p>
          <p className="text-sm text-slate-300">
            Calendly API stub posts to automation workflow. Replace with live API key to sync to your scheduling stack.
          </p>
          <button
            onClick={() => recordEvent('calendly_stub_triggered')}
            className="rounded-full border border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            Launch Booking Modal
          </button>
        </div>
      </section>
    </div>
  );
}
