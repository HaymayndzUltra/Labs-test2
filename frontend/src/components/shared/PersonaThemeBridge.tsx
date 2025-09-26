'use client';

import { useEffect } from 'react';
import { usePersonaStore } from '@/stores/personaStore';
import { usePosthogIdentity } from '@/lib/analytics/posthog';

const tonePalettes: Record<string, string> = {
  analytical: 'from-emerald-500 via-teal-500 to-cyan-500',
  optimistic: 'from-amber-500 via-orange-500 to-pink-500',
  decisive: 'from-slate-800 via-zinc-700 to-amber-500',
  visionary: 'from-indigo-500 via-sky-500 to-purple-500',
};

export function PersonaThemeBridge() {
  const persona = usePersonaStore((state) => state.getPersona());
  usePosthogIdentity(persona.id);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--persona-accent', persona.accent);
    root.dataset.personaTone = persona.tone;
  }, [persona]);

  return (
    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${tonePalettes[persona.tone]} opacity-40 blur-3xl`} />
  );
}
