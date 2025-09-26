'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Player } from 'lottie-react';
import sampleAnimation from '@/components/animation/sample-lottie.json';

const presets = [
  { id: 'reveal', label: 'Chart Reveal', duration: 1.2, easing: 'easeInOut' },
  { id: 'morph', label: 'Morphing KPI', duration: 1.6, easing: 'anticipate' },
  { id: 'tooltip', label: 'Tooltip Fade', duration: 0.6, easing: 'easeOut' },
];

export default function AnimationPage() {
  const [activePreset, setActivePreset] = useState(presets[0]);
  const [timelineLog, setTimelineLog] = useState<string[]>([]);

  const runGsap = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: activePreset.easing as gsap.EaseString, duration: activePreset.duration } });
      tl.to('#anim-block', { scale: 1.1 })
        .to('#anim-block', { rotate: 6, background: '#38bdf8' })
        .to('#anim-block', { x: 10, y: -6 })
        .to('#anim-block', { scale: 1, x: 0, y: 0, background: '#f8fafc' });
      setTimelineLog((prev) => [...prev, `Played preset ${activePreset.label}`]);
    });
    setTimeout(() => ctx.revert(), activePreset.duration * 1000 * 4);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Animation Suite</p>
        <h1 className="text-4xl font-semibold text-white">Cinematic storytelling controls</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Preview chart reveals, morphing KPIs, and tooltip fades. Adjust duration and easing then export presets to reuse
          across dashboards.
        </p>
      </header>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Animation Presets</h2>
          <div className="space-y-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePreset(preset)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                  activePreset.id === preset.id ? 'border-white/60 bg-white/10 text-white' : 'border-white/10 text-slate-300'
                }`}
              >
                <span className="block font-semibold">{preset.label}</span>
                <span className="text-xs text-slate-400">Duration {preset.duration}s · {preset.easing}</span>
              </button>
            ))}
          </div>
          <button onClick={runGsap} className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900">
            Play Sequence
          </button>
        </div>
        <div className="space-y-6">
          <motion.div
            id="anim-block"
            className="flex h-48 items-center justify-center rounded-3xl bg-slate-100 text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activePreset.label}
          </motion.div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm font-semibold text-white">Lottie Preview</h3>
            <Player autoplay loop animationData={sampleAnimation} className="h-40" />
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Narrative Sequencer</p>
            <ol className="mt-2 space-y-1">
              {timelineLog.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ol>
            {timelineLog.length === 0 && <p>No sequences played yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
