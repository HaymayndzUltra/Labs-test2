'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PersonaId = 'saas-founder' | 'healthcare-exec' | 'ecommerce-lead' | 'fintech-investor';

export type PersonaConfig = {
  id: PersonaId;
  label: string;
  accent: string;
  description: string;
  tone: 'analytical' | 'optimistic' | 'decisive' | 'visionary';
  heroCopy: string;
  dashboardRecommendations: string[];
};

const PERSONA_LIBRARY: Record<PersonaId, PersonaConfig> = {
  'saas-founder': {
    id: 'saas-founder',
    label: 'SaaS Founder',
    accent: 'from-indigo-500 via-blue-500 to-sky-500',
    description: 'Optimize ARR, reduce churn, and accelerate product-market fit.',
    tone: 'visionary',
    heroCopy: 'Scale your SaaS operations with predictive revenue intelligence.',
    dashboardRecommendations: ['Growth Pulse', 'Churn Radar', 'Activation Blueprint'],
  },
  'healthcare-exec': {
    id: 'healthcare-exec',
    label: 'Healthcare Exec',
    accent: 'from-emerald-600 via-teal-500 to-cyan-500',
    description: 'Monitor quality of care, operational throughput, and compliance.',
    tone: 'analytical',
    heroCopy: 'Deliver resilient patient outcomes with real-time operational telemetry.',
    dashboardRecommendations: ['Care Continuum', 'Clinical Safety Watch', 'Utilization Optimizer'],
  },
  'ecommerce-lead': {
    id: 'ecommerce-lead',
    label: 'E-commerce Lead',
    accent: 'from-fuchsia-500 via-rose-500 to-orange-500',
    description: 'Boost conversion rates, personalize journeys, and manage inventory.',
    tone: 'optimistic',
    heroCopy: 'Transform carts into loyalists with intelligence-driven merchandising.',
    dashboardRecommendations: ['Conversion Studio', 'Inventory Sentinels', 'Campaign Flightdeck'],
  },
  'fintech-investor': {
    id: 'fintech-investor',
    label: 'Fintech Investor',
    accent: 'from-slate-800 via-zinc-700 to-amber-500',
    description: 'Detect signals, manage risk, and surface portfolio alpha.',
    tone: 'decisive',
    heroCopy: 'Command fintech ventures with anomaly-aware capital dashboards.',
    dashboardRecommendations: ['Deal Flow Radar', 'Risk Sentinel', 'Liquidity Simulator'],
  },
};

type PersonaState = {
  activePersona: PersonaId;
  getPersona: (id?: PersonaId) => PersonaConfig;
  setPersona: (id: PersonaId) => void;
};

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      activePersona: 'saas-founder',
      getPersona: (id) => PERSONA_LIBRARY[id ?? get().activePersona],
      setPersona: (id) => set({ activePersona: id }),
    }),
    {
      name: 'persona-store-v1',
    }
  )
);

export const personaList = Object.values(PERSONA_LIBRARY);
