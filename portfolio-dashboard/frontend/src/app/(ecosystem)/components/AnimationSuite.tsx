'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import { track } from '@/lib/analytics';

const PRESETS = [
  {
    id: 'chart-reveal',
    label: 'Chart Reveal',
    description: 'Sequential grow animation ideal for KPI reveal moments.',
  },
  {
    id: 'morphing-insight',
    label: 'Morphing Insight',
    description: 'Transform metrics between states to narrate change.',
  },
  {
    id: 'tooltip-fade',
    label: 'Tooltip Fade',
    description: 'Soft overlays for scenario commentary and annotations.',
  },
] as const;

type AnimationPreset = (typeof PRESETS)[number];

const pulseAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: 'Pulse Accent',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { s: [0, 0, 100] }, o: { s: [0, 0, 100] }, t: 0, s: [0, 0, 100] },
            { i: { s: [0, 0, 100] }, o: { s: [0, 0, 100] }, t: 45, s: [120, 120, 100] },
            { i: { s: [0, 0, 100] }, o: { s: [0, 0, 100] }, t: 90, s: [0, 0, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [120, 120] },
          d: 1,
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.39, 0.51, 0.96, 1] },
          o: { a: 0, k: 100 },
        },
      ],
    },
  ],
  markers: [],
};

const narrativeBeats = [
  {
    id: 'discover',
    title: 'Discover',
    description: 'Persona onboarding + guided tour highlight reels.',
  },
  {
    id: 'explore',
    title: 'Explore',
    description: 'Adaptive dashboards respond to KPI focus.',
  },
  {
    id: 'prototype',
    title: 'Prototype',
    description: 'Scenario tuning and automation hooks preview.',
  },
  {
    id: 'engage',
    title: 'Engage',
    description: 'Proposal generation and CRM automation hand-off.',
  },
];

export function AnimationSuite() {
  const [activePreset, setActivePreset] = useState<AnimationPreset>(PRESETS[0]);
  const [duration, setDuration] = useState(1.2);
  const [easing, setEasing] = useState<'power2.out' | 'power4.inOut' | 'elastic.out'>('power2.out');
  const [accent, setAccent] = useState('#6366f1');
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!previewRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray<HTMLElement>('.animation-bar');
      gsap.fromTo(
        bars,
        { scaleY: 0, opacity: 0, transformOrigin: 'bottom center' },
        {
          scaleY: 1,
          opacity: 1,
          duration,
          ease: easing,
          stagger: 0.15,
        },
      );
    }, previewRef);

    return () => ctx.revert();
  }, [duration, easing, activePreset]);

  const exportPayload = useMemo(
    () => ({
      preset: activePreset.id,
      duration,
      easing,
      accent,
    }),
    [activePreset.id, duration, easing, accent],
  );

  return (
    <section className="mt-16 rounded-[3rem] border border-slate-900/40 bg-slate-950/80 p-10 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Animation Suite</p>
          <h2 className="mt-2 text-3xl font-semibold">Curated motion library with export-ready presets</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Toggle presets, adjust timing, preview GSAP + Framer motion combos, and export animation specs for dev handoff.
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          Storytelling timeline ready
        </div>
      </header>
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6" ref={previewRef}>
            <div className="flex flex-wrap gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActivePreset(preset);
                    track('animation_previewed', { preset: preset.id });
                  }}
                  className={`rounded-2xl border px-4 py-2 text-sm ${
                    preset.id === activePreset.id ? 'border-white/40 bg-white/15' : 'border-white/15 bg-black/30'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold">{preset.label}</p>
                    <p className="text-xs text-slate-300">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 h-48 rounded-3xl border border-white/15 bg-black/30 p-6">
              <div className="flex h-full items-end justify-between gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="animation-bar h-full flex-1 rounded-full"
                    style={{ background: accent, opacity: 0.8 }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: duration + index * 0.1, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Duration
                <input
                  type="range"
                  min={0.6}
                  max={2.4}
                  step={0.1}
                  value={duration}
                  onChange={(event) => setDuration(Number.parseFloat(event.target.value))}
                />
                <span className="text-base normal-case text-white">{duration.toFixed(1)}s</span>
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Accent
                <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Easing
                <select
                  value={easing}
                  onChange={(event) => setEasing(event.target.value as typeof easing)}
                  className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
                >
                  <option value="power2.out">Power 2 out</option>
                  <option value="power4.inOut">Power 4 in/out</option>
                  <option value="elastic.out">Elastic out</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              className="mt-6 inline-flex rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
              onClick={() => {
                const payload = JSON.stringify(exportPayload, null, 2);
                const blob = new Blob([payload], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `animation-${activePreset.id}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
              }}
            >
              Export preset JSON
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Narrative Sequencer</h3>
            <p className="text-sm text-slate-300">
              Align storytelling beats across dashboards. Drag timeline handles (TODO) to orchestrate playback order.
            </p>
            <div className="mt-6 grid gap-3">
              {narrativeBeats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{beat.title}</p>
                    <p className="text-xs text-slate-300">{beat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Lottie Preview</h3>
            <p className="text-sm text-slate-300">Exportable JSON for hero motion cues.</p>
            <div className="mt-4 flex items-center justify-center rounded-3xl border border-white/10 bg-black/30 p-6">
              <Lottie animationData={pulseAnimation} loop style={{ height: 160, width: 160 }} />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Preset JSON</h3>
            <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-black/40 p-4 text-xs text-indigo-100">
{JSON.stringify(exportPayload, null, 2)}
            </pre>
            <p className="mt-3 text-xs text-slate-400">TODO: Connect to shared design system tokens + Storybook stories.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
