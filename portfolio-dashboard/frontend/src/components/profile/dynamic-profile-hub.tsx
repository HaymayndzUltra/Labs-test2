'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Plot from 'observable-plot';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';
import { personaDataset } from '@/lib/data/datasets';
import { usePersonaStore } from '@/state/persona-store';
import { SectionHeader } from '@/components/ui/section-header';
import { Panel } from '@/components/ui/panel';
import { captureEvent } from '@/lib/analytics/posthog';

export const DynamicProfileHub = () => {
  const { persona } = usePersonaStore();
  const [timelinePlot, setTimelinePlot] = useState<SVGElement | null>(null);
  const data = useMemo(() => personaDataset(persona.id), [persona.id]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;
    const plot = Plot.plot({
      y: { nice: true },
      height: 120,
      width: timelineRef.current.clientWidth,
      marks: [
        Plot.areaY(data.timeline, {
          x: 'date',
          y: 'value',
          curve: 'natural',
          fill: 'rgba(99,102,241,0.35)',
        }),
        Plot.line(data.timeline, { x: 'date', y: 'value', stroke: '#312e81', curve: 'natural', strokeWidth: 2 }),
      ],
    });
    timelineRef.current.innerHTML = '';
    timelineRef.current.append(plot);
    setTimelinePlot(plot);
    return () => {
      plot.remove();
    };
  }, [data.timeline]);

  return (
    <section className="space-y-12">
      <SectionHeader
        eyebrow="Dynamic Profile Hub"
        title="Proof of execution with immersive storytelling assets"
        description="Navigate an interactive career timeline, testimonials matrix, and skill heatmap tuned to the selected persona. CTA blocks surface proposal previews and scheduling stubs."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Panel className="space-y-6 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Interactive Timeline</h3>
            <p className="text-sm text-slate-500">Scroll to explore inflection points and correlated KPI surges.</p>
          </div>
          <div ref={timelineRef} className="h-36 w-full" aria-hidden={!timelinePlot} />
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {data.timeline.slice(0, 4).map((point, index) => (
              <div key={point.date} className="flex flex-col rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2">
                <span className="font-semibold text-slate-600">Q{index + 1}</span>
                <span className="text-slate-500">{(point.value / 100).toFixed(2)}x lift</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Skill Heatmap</h3>
          <p className="text-sm text-slate-500">Animated radar calibrated to persona-critical capabilities.</p>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={data.skills} outerRadius="80%">
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" />
                <Radar
                  name="Capability"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                  animationDuration={900}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Panel className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Testimonials Matrix</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.testimonials.map((testimonial) => (
              <motion.blockquote
                key={testimonial.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-indigo-200/40 bg-indigo-50/40 p-4 text-sm text-slate-600"
              >
                “{testimonial.quote}”
                <footer className="mt-3 text-xs font-semibold text-indigo-600">
                  {testimonial.name} · {testimonial.title}
                </footer>
                <span className="mt-2 block text-xs text-slate-500">Impact: {(testimonial.impact * 100).toFixed(0)}% uplift</span>
              </motion.blockquote>
            ))}
          </div>
        </Panel>
        <CtaBlocks personaLabel={persona.label} />
      </div>
    </section>
  );
};

const CtaBlocks = ({ personaLabel }: { personaLabel: string }) => {
  const [selectedModal, setSelectedModal] = useState<'proposal' | 'call' | null>(null);

  const openModal = (type: 'proposal' | 'call') => {
    setSelectedModal(type);
    captureEvent(type === 'proposal' ? 'proposal_preview_opened' : 'call_booking_opened', { type });
  };

  return (
    <Panel className="flex flex-col gap-4 p-6">
      <h3 className="text-lg font-semibold text-slate-900">Engagement CTAs</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => openModal('proposal')}
          className="rounded-2xl border border-indigo-200/60 bg-indigo-500/20 px-4 py-3 text-left text-sm font-semibold text-indigo-800"
        >
          See Proposal Sample
        </button>
        <button
          onClick={() => openModal('call')}
          className="rounded-2xl border border-emerald-200/60 bg-emerald-500/20 px-4 py-3 text-left text-sm font-semibold text-emerald-800"
        >
          Book a Call
        </button>
      </div>
      <Dialog.Root open={selectedModal !== null} onOpenChange={(open) => !open && setSelectedModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-3xl border border-slate-200/70 bg-white p-8 shadow-2xl">
            {selectedModal === 'proposal' ? (
              <ProposalPreview personaLabel={personaLabel} />
            ) : (
              <CalendlyStub />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Panel>
  );
};

const ProposalPreview = ({ personaLabel }: { personaLabel: string }) => (
  <div className="space-y-4">
    <Dialog.Title className="text-xl font-semibold text-slate-900">Proposal Snapshot</Dialog.Title>
    <p className="text-sm text-slate-500">
      Auto-generated executive summary for {personaLabel}. Export includes PDF and Notion markdown with automation TODO markers.
    </p>
    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
      <li>Discovery synthesis with LangChain summarisation.</li>
      <li>Persona-specific KPI and dashboard alignment.</li>
      <li>Automation hooks for CRM and personalised emails.</li>
    </ul>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
      TODO: Connect proposal export API key for real PDF rendering.
    </div>
  </div>
);

const CalendlyStub = () => (
  <div className="space-y-4">
    <Dialog.Title className="text-xl font-semibold text-slate-900">Book a Discovery Call</Dialog.Title>
    <p className="text-sm text-slate-500">
      Calendly API placeholder. Replace the stub with a real booking link once credentials are provisioned.
    </p>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
      TODO: Insert Calendly embed for 30-min persona-driven consultation.
    </div>
  </div>
);
