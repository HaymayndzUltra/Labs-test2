'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';
import type { SkillSignal } from '../data';

export function SkillHeatmap({ skills }: { skills: SkillSignal[] }) {
  const chartData = skills.map((skill) => ({ subject: skill.name, value: skill.value }));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Skill heatmap</h2>
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="rounded-full border border-emerald-400/40 bg-emerald-400/20 px-3 py-1 text-xs uppercase text-emerald-200"
        >
          Animated radar
        </motion.span>
      </div>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="80%">
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
            <Radar
              name="Skill signal"
              dataKey="value"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.5}
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
