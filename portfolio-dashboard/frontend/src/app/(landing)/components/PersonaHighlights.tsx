'use client';

import { motion } from 'framer-motion';
import { usePersonaStore } from '../../../hooks/usePersonaStore';

export function PersonaHighlights() {
  const { activePersona } = usePersonaStore();

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {activePersona.heroStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 shadow-inner backdrop-blur"
        >
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          <p className="text-sm text-emerald-300/80">{stat.delta}</p>
        </motion.div>
      ))}
    </div>
  );
}
