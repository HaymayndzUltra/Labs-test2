"use client";

import { LandingConstellation } from '@/components/landing/LandingConstellation';
import { PersonaSelector } from '@/components/landing/PersonaSelector';
import { usePersonaStore } from '@/stores/personaStore';
import { recordEvent } from '@/lib/analytics/posthog';

export default function HomePage() {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Portfolio Nebula';
  const persona = usePersonaStore.getState().getPersona();

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16">
      <section className="grid items-center gap-12 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] text-slate-300">Immersive Upwork Portfolio Platform</p>
          <h1 className="text-4xl font-semibold sm:text-6xl">
            {APP_NAME} orchestrates adaptive demos tailored for {persona.label}
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Launch a guided, persona-aware walkthrough that fuses live dashboards, proposal automation, and cinematic
            animations. Each interaction streams into analytics and automation stubs ready for your CRM and revenue
            stack.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => recordEvent('guided_tour_requested', { location: 'hero' })}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg"
            >
              Launch Guided Tour
            </button>
            <button
              onClick={() => recordEvent('proposal_preview_requested', { location: 'hero' })}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
            >
              View Proposal Sample
            </button>
          </div>
        </div>
        <LandingConstellation />
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Persona Selector</p>
          <h2 className="text-2xl font-semibold text-white">Switch persona to morph dashboards and storytelling</h2>
        </header>
        <PersonaSelector />
      </section>

      <section className="grid gap-10 rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur lg:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Guided Tour CTA</h3>
          <p className="mt-2 text-sm text-slate-300">
            Activate an autoplay walkthrough orchestrated with GSAP scene choreography and Framer Motion transitions.
            The sequence zooms from the constellation to the Dashboard Vault, culminating with proposal export.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Automation Hooks</h3>
          <p className="mt-2 text-sm text-slate-300">
            Persona choices stream into n8n via webhook stubs. Workflows enrich CRM leads, schedule follow-ups, and ship
            Notion-ready proposal snapshots using LangChain summarization.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Ready</h3>
          <p className="mt-2 text-sm text-slate-300">
            Adaptive layout engine uses CSS container queries to keep LCP under 2.5 seconds across breakpoints. All
            interactions emit PostHog events for conversion diagnostics.
          </p>
        </div>
      </section>
    </div>
  );
}