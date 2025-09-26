'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PersonaSelector } from './components/PersonaSelector';
import { GuidedTourCta } from './components/GuidedTourCta';
import { PersonaHighlights } from './components/PersonaHighlights';
import { LandingConstellation } from './components/LandingConstellation';
import { usePersonaStore, type PersonaId } from '../../hooks/usePersonaStore';

type LandingPageClientProps = {
  initialPersonaId?: PersonaId;
};

export function LandingPageClient({ initialPersonaId }: LandingPageClientProps) {
  const { activePersona, setPersona } = usePersonaStore();

  useEffect(() => {
    if (initialPersonaId) {
      setPersona(initialPersonaId);
    }
  }, [initialPersonaId, setPersona]);

  return (
    <div className={`min-h-screen ${activePersona.theme.background} pb-16`}> 
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-16 text-white">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">Upwork Portfolio Dashboard Ecosystem</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {activePersona.label} mode engaged
          </h1>
          <p className="mt-4 text-lg text-white/70 sm:text-xl">{activePersona.tone}</p>
        </motion.header>

        <LandingConstellation persona={activePersona} />

        <div className="space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Choose persona</p>
            <PersonaSelector />
          </div>

          <div className="grid gap-10 md:grid-cols-[2fr,1fr]">
            <div className="space-y-6 rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur">
              <p className="text-left text-sm uppercase tracking-[0.3em] text-white/40">Immersive Walkthrough</p>
              <p className="text-left text-lg text-white/80">{activePersona.description}</p>
              <ol className="grid gap-4 sm:grid-cols-3">
                {activePersona.journey.map((step) => (
                  <li key={step.step} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white/80">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">{step.step}</p>
                    <p className="mt-2 text-sm text-white/70">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Recommended Pods</p>
              <ul className="space-y-3 text-white/80">
                {activePersona.recommendedPods.map((pod) => (
                  <li key={pod} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.25em]">
                    {pod}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <PersonaHighlights />
        <GuidedTourCta />
      </div>
    </div>
  );
}
