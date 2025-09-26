'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';

export type PersonaId = 'saas-founder' | 'healthcare-exec' | 'ecommerce-lead' | 'fintech-investor';

export type PersonaDefinition = {
  id: PersonaId;
  label: string;
  headline: string;
  tone: string;
  theme: {
    accent: string;
    background: string;
    text: string;
    meshColor: string;
  };
  primaryCtas: Array<{ label: string; href: string }>;
  recommendedPods: string[];
  description: string;
  journey: Array<{ step: string; description: string }>;
  heroStats: Array<{ label: string; value: string; delta: string }>;
};

const PERSONA_DEFINITIONS: Record<PersonaId, PersonaDefinition> = {
  'saas-founder': {
    id: 'saas-founder',
    label: 'SaaS Founder',
    headline: 'Accelerate ARR storytelling',
    tone: 'Product-led growth insights delivered as interactive revenue command centers.',
    theme: {
      accent: 'from-indigo-500 to-blue-500',
      background: 'bg-slate-900',
      text: 'text-slate-50',
      meshColor: '#4f46e5',
    },
    primaryCtas: [
      { label: 'Explore Growth Vault', href: '/dashboard?persona=saas-founder' },
      { label: 'Launch Discovery', href: '/discovery?persona=saas-founder' },
    ],
    recommendedPods: ['Fintech Command Center'],
    description:
      'The SaaS Founder view focuses on ARR compounding, retention pulses, and investor-ready narratives. Built for founders who need investor decks that update themselves.',
    journey: [
      { step: 'Discover', description: 'Scan ARR constellations and activation funnels.' },
      { step: 'Model', description: 'Simulate pricing plays, usage tiers, and NRR uplift.' },
      { step: 'Engage', description: 'Auto-generate investor memos and board snapshots.' },
    ],
    heroStats: [
      { label: 'Time-to-Proposal', value: '3m 42s', delta: '-64%' },
      { label: 'Conversion Lift', value: '+38%', delta: '+12% QoQ' },
      { label: 'Personas Deployed', value: '4', delta: 'New Fintech AI' },
    ],
  },
  'healthcare-exec': {
    id: 'healthcare-exec',
    label: 'Healthcare Exec',
    headline: 'Safeguard patient pathways',
    tone: 'Clinical KPI command center blending compliance guardrails with growth experiments.',
    theme: {
      accent: 'from-emerald-500 to-teal-400',
      background: 'bg-slate-900',
      text: 'text-emerald-50',
      meshColor: '#14b8a6',
    },
    primaryCtas: [
      { label: 'View Care Continuity Pod', href: '/dashboard?persona=healthcare-exec&pod=healthcare' },
      { label: 'Run Compliance Intake', href: '/discovery?persona=healthcare-exec' },
    ],
    recommendedPods: ['Healthcare Continuity Lab'],
    description:
      'The Healthcare pod monitors referral leakages, patient throughput, and quality-of-care signals. Designed for COOs and transformation leaders.',
    journey: [
      { step: 'Discover', description: 'Track care delivery mosaics and cross-site adherence.' },
      { step: 'Prototype', description: 'Launch scenario decks for new service lines and telehealth.' },
      { step: 'Engage', description: 'Share compliance-ready executive briefs instantly.' },
    ],
    heroStats: [
      { label: 'Intake to Proposal', value: '5m 12s', delta: '-51%' },
      { label: 'Regulatory Flags', value: '0 critical', delta: 'Auto-triaged' },
      { label: 'Clinical Pods', value: '2 live', delta: 'ER/Telehealth' },
    ],
  },
  'ecommerce-lead': {
    id: 'ecommerce-lead',
    label: 'E-commerce Lead',
    headline: 'Dominate conversion maps',
    tone: 'Merchandising and lifecycle orchestrations that ship with automation hooks.',
    theme: {
      accent: 'from-fuchsia-500 to-rose-500',
      background: 'bg-slate-900',
      text: 'text-rose-50',
      meshColor: '#ec4899',
    },
    primaryCtas: [
      { label: 'Run Growth Simulator', href: '/dashboard?persona=ecommerce-lead&pod=fintech' },
      { label: 'Personalize Follow-up', href: '/automation' },
    ],
    recommendedPods: ['Fintech Command Center'],
    description:
      'Lifecycle intelligence for digital commerce teams seeking retention, upsell, and geo-expansion confidence.',
    journey: [
      { step: 'Discover', description: 'Navigate LTV constellations and drop-off galaxies.' },
      { step: 'Optimize', description: 'Spin up A/B cohorts tied to automation cadences.' },
      { step: 'Engage', description: 'Push proposals to Notion and CRM in minutes.' },
    ],
    heroStats: [
      { label: 'Cart Recovery', value: '+22%', delta: '+6% MoM' },
      { label: 'Geo Pods', value: '5 global', delta: 'Deck.gl overlays' },
      { label: 'Automation Wins', value: '12 sequences', delta: 'n8n templates' },
    ],
  },
  'fintech-investor': {
    id: 'fintech-investor',
    label: 'Fintech Investor',
    headline: 'Surface the next compounder',
    tone: 'Capital-efficient growth dashboards fused with compliance signals and macro overlays.',
    theme: {
      accent: 'from-indigo-500 to-purple-500',
      background: 'bg-slate-950',
      text: 'text-indigo-50',
      meshColor: '#8b5cf6',
    },
    primaryCtas: [
      { label: 'Inspect Fintech Vault', href: '/dashboard?persona=fintech-investor&pod=fintech' },
      { label: 'Export LP Memo', href: '/discovery?persona=fintech-investor' },
    ],
    recommendedPods: ['Fintech Command Center'],
    description:
      'For growth partners who require predictive, risk-adjusted decision flows across portfolios.',
    journey: [
      { step: 'Scan', description: 'Assess AML triggers and capital efficiency vectors.' },
      { step: 'Model', description: 'Toggle scenario simulators for market entry plays.' },
      { step: 'Decide', description: 'Auto-assemble LP updates with live data hooks.' },
    ],
    heroStats: [
      { label: 'Due Diligence Time', value: '-46%', delta: 'Automation assist' },
      { label: 'Predictive Accuracy', value: '92%', delta: '+8% vs. baseline' },
      { label: 'LP Satisfaction', value: '4.9/5', delta: 'Post-demo' },
    ],
  },
};

type PersonaStore = {
  activePersona: PersonaDefinition;
  personas: PersonaDefinition[];
  setPersona: (id: PersonaId) => void;
  withPersonaTheme: <T extends ReactNode>(node: T) => T;
};

export const usePersonaStore = create<PersonaStore>()(
  immer((set, get) => ({
    activePersona: PERSONA_DEFINITIONS['saas-founder'],
    personas: Object.values(PERSONA_DEFINITIONS),
    setPersona: (id) => {
      const persona = PERSONA_DEFINITIONS[id];
      if (!persona) return;
      set((state) => {
        state.activePersona = persona;
      });
      trackEvent('persona_selected', { persona: id });
    },
    withPersonaTheme: (node) => {
      const persona = get().activePersona;
      return node;
    },
  })),
);

export function getPersonaById(id: PersonaId) {
  return PERSONA_DEFINITIONS[id];
}

export function getPersonaOptions() {
  return Object.values(PERSONA_DEFINITIONS);
}
