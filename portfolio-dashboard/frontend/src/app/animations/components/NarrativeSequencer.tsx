'use client';

import { motion } from 'framer-motion';

const narrativeSteps = [
  {
    id: 1,
    title: 'Discover',
    description: 'Persona constellation & PostHog event instrumentation.',
  },
  {
    id: 2,
    title: 'Explore',
    description: 'Dashboard vault + deck.gl overlays to unpack anomalies.',
  },
  {
    id: 3,
    title: 'Prototype',
    description: 'Scenario simulator saved states + automation handoff.',
  },
  {
    id: 4,
    title: 'Engage',
    description: 'Proposal exporter + CRM sync orchestrated via n8n.',
  },
];

export function NarrativeSequencer() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Narrative sequencer</h2>
      <div className="mt-6 space-y-6">
        {narrativeSteps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.id * 0.1 }}
            className="flex items-center gap-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-sm font-semibold text-white">
              {step.id}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="text-xs text-white/60">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
