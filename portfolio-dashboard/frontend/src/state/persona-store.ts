'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PersonaId = 'saas-founder' | 'healthcare-exec' | 'ecommerce-lead' | 'fintech-investor';

export interface PersonaContext {
  id: PersonaId;
  label: string;
  description: string;
  accent: string;
  background: string;
  headline: string;
  valueProposition: string;
  primaryDashboards: string[];
}

interface PersonaState {
  persona: PersonaContext;
  setPersona: (persona: PersonaContext) => void;
  previousPersona?: PersonaContext;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      persona: {
        id: 'saas-founder',
        label: 'SaaS Founder',
        description: 'Focus on ARR, activation velocity, and product-market fit readiness.',
        accent: 'from-indigo-500 via-sky-500 to-emerald-400',
        background: 'bg-slate-900/90',
        headline: 'Ship enterprise-ready analytics experiences in days—not months.',
        valueProposition:
          'Full-funnel telemetry, monetisation guardrails, and persona-driven walkthroughs that convince your investors.',
        primaryDashboards: ['Fintech Growth Console', 'Acquisition Diagnostic', 'Investor Readiness'],
      },
      previousPersona: undefined,
      setPersona: (persona) => {
        const current = get().persona;
        set({ persona, previousPersona: current });
      },
    }),
    {
      name: 'persona-store',
      version: 1,
    },
  ),
);
