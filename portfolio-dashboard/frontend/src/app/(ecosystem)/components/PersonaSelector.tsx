'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { usePersonaStore } from '@/hooks/usePersonaStore';
import { PERSONA_ORDER } from '@/lib/personas';

interface PersonaSelectorProps {
  className?: string;
}

export function PersonaSelector({ className }: PersonaSelectorProps) {
  const { personaId, setPersonaId, persona } = usePersonaStore();

  return (
    <div className={cn('w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Persona Mode</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{persona.label}</h3>
          <p className="mt-1 max-w-xl text-sm text-white/70">{persona.subheadline}</p>
        </div>
        <span className="hidden rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 md:inline-flex">
          {persona.callToAction}
        </span>
      </div>
      <Tabs.Root
        className="mt-6"
        value={personaId}
        onValueChange={(nextPersona) => {
          setPersonaId(nextPersona as typeof personaId);
          track('persona_selected', { persona: nextPersona });
        }}
      >
        <Tabs.List className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONA_ORDER.map((id) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/15 px-4 py-5 text-left text-sm font-medium text-white/70 transition',
                id === personaId ? 'border-white/40 bg-white/10 text-white' : 'hover:border-white/30 hover:bg-white/10',
              )}
            >
              <motion.span
                layoutId="persona-pill"
                className="absolute inset-0 rounded-2xl bg-white/15"
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                style={{ opacity: id === personaId ? 1 : 0 }}
              />
              <span className="relative z-10 font-semibold capitalize">{id.replace('-', ' ')}</span>
              <span className="relative z-10 mt-1 block text-xs text-white/60">Adaptive campaign &amp; dashboard recipes</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
}
