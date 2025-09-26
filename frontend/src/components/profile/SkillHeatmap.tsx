'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const coreSkills = [
  'Data Storytelling',
  'Automation',
  'Visualization',
  'UX Systems',
  'AI Ops',
  'Research',
];

export function SkillHeatmap({ baseline = 75 }: { baseline?: number }) {
  const data = useMemo(
    () =>
      coreSkills.map((skill, index) => ({
        skill,
        value: Math.round(baseline + index * 4 + (index % 2 === 0 ? 6 : -3)),
      })),
    [baseline]
  );

  return (
    <motion.div className="rounded-3xl border border-white/10 bg-black/40 p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}>
      <h3 className="text-lg font-semibold text-white">Skill Heatmap</h3>
      <p className="mt-2 text-xs text-slate-300">
        Animated radar chart highlights delivery strengths for proposal tailoring. Values animate when persona changes,
        reinforcing adaptive mastery.
      </p>
      <div className="mt-6 h-72">
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="80%">
            <PolarGrid stroke="#1e293b" strokeOpacity={0.7} />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5f5', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 120]} tick={false} />
            <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} isAnimationActive />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
