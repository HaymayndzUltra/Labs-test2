'use client';

import { useMemo } from 'react';
import { DashboardPod } from '@/components/dashboard/DashboardPod';
import { generateFintechDataset, generateHealthcareDataset } from '@/data/syntheticDatasets';
import { recordEvent } from '@/lib/analytics/posthog';
import { motion } from 'framer-motion';
import { usePersonaStore } from '@/stores/personaStore';

export default function VaultPage() {
  const persona = usePersonaStore((state) => state.getPersona());
  const fintech = useMemo(() => generateFintechDataset(), []);
  const healthcare = useMemo(() => generateHealthcareDataset(), []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Dashboard Vault</p>
        <h1 className="text-4xl font-semibold">Industry pods curated for high-converting Upwork demos</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Synthetic datasets refresh on page load using Faker.js. Persona <span className="text-white">{persona.label}</span>{' '}
          sees prioritized pods first thanks to the personalization rules engine.
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-10 lg:grid-cols-2"
      >
        <DashboardPod title="Fintech Command Center" accent="from-emerald-500 to-sky-500" dataset={fintech} geospatialSeed={27} />
        <DashboardPod title="Healthcare Resilience Hub" accent="from-rose-500 to-cyan-500" dataset={healthcare} geospatialSeed={82} />
      </motion.section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-8">
        <h2 className="text-2xl font-semibold">Scenario Simulator</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Adjust sliders to project growth and conversion impact. Scenario outputs sync to the Discovery module so your
          intake answers instantly rehydrate the prototype dashboards.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[15, 35, 65].map((value, index) => (
            <motion.div
              key={value}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => recordEvent('scenario_hover', { scenario: index })}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Growth Scenario {index + 1}</p>
              <p className="mt-2 text-2xl font-semibold">{value}%</p>
              <p className="text-xs text-slate-300">Projected conversion uplift with automation follow-up.</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
