'use client';

import { motion } from 'framer-motion';
import { usePersonaStore, type PersonaId } from '../../../hooks/usePersonaStore';
import { trackEvent } from '../../../lib/analytics';

export function PersonaSelector() {
  const { personas, activePersona, setPersona } = usePersonaStore();

  return (
    <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center">
      {personas.map((persona) => {
        const isActive = persona.id === activePersona.id;
        return (
          <motion.button
            key={persona.id}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setPersona(persona.id as PersonaId);
              trackEvent('persona_selected', { persona: persona.id });
            }}
            className={`group relative overflow-hidden rounded-2xl border px-4 py-3 text-left shadow transition ${
              isActive
                ? 'border-white/60 bg-white/15 backdrop-blur text-white'
                : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30'
            }`}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">Persona</span>
            <p className="text-lg font-semibold">{persona.label}</p>
            <p className="mt-1 text-sm text-white/70">{persona.headline}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
