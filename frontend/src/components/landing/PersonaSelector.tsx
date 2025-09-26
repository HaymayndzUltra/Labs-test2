'use client';

import { motion } from 'framer-motion';
import { usePersonaStore, personaList } from '@/stores/personaStore';
import { recordEvent } from '@/lib/analytics/posthog';

export function PersonaSelector() {
  const activePersona = usePersonaStore((state) => state.activePersona);
  const setPersona = usePersonaStore((state) => state.setPersona);

  return (
    <div className="persona-container persona-card-grid grid gap-4">
      {personaList.map((persona) => (
        <motion.button
          key={persona.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPersona(persona.id);
            recordEvent('persona_switch', { persona: persona.id });
          }}
          className={`rounded-2xl border bg-slate-900/80 px-4 py-3 text-left text-white shadow-inner transition ${
            activePersona === persona.id ? 'border-white/60 ring-2 ring-white/40' : 'border-white/10'
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">{persona.label}</p>
          <p className="mt-2 text-xs text-slate-400">{persona.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
