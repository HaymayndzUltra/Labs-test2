'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Panel } from '@/components/ui/panel';
import { SectionHeader } from '@/components/ui/section-header';

const sampleLottie = {
  v: '5.9.0',
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: 'Pulse',
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
        s: { a: 1, k: [{ t: 0, s: [0, 0, 100], e: [100, 100, 100] }, { t: 60, s: [100, 100, 100], e: [0, 0, 100] }] },
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [160, 160] },
          nm: 'Ellipse Path',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.388, 0.4, 0.945, 1] },
          o: { a: 0, k: 100 },
          nm: 'Fill 1',
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

const ANIMATIONS = [
  { id: 'chart-reveal', label: 'Chart Reveal', description: 'Framer Motion timeline for chart staged entry.' },
  { id: 'tooltip-fade', label: 'Tooltip Fade', description: 'GSAP-based tooltip fade-in/out microinteraction.' },
  { id: 'morphing', label: 'Metric Morphing', description: 'Number ticker morph hooking to scenario slider values.' },
];

export const AnimationSuite = () => {
  const [config, setConfig] = useState({ duration: 1.4, easing: 'easeInOut', accent: '#6366f1' });
  const [active, setActive] = useState<string>('chart-reveal');
  const accentColor = useMemo(() => {
    const hex = config.accent.replace('#', '');
    const bigint = Number.parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b, 1] as const;
  }, [config.accent]);

  return (
    <section className="space-y-12">
      <SectionHeader
        eyebrow="Animation Suite"
        title="Reusable motion system for narrative walkthroughs"
        description="Preview animation presets, tweak motion tokens, and orchestrate timelines for immersive demos. Export the configuration for Lottie or CSS pipelines."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Panel className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {ANIMATIONS.map((animation) => (
              <button
                key={animation.id}
                onClick={() => setActive(animation.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                  active === animation.id
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200/80 bg-white text-slate-600'
                }`}
              >
                <h4 className="font-semibold">{animation.label}</h4>
                <p className="mt-2 text-xs">{animation.description}</p>
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Duration ({config.duration.toFixed(1)}s)
              <input
                type="range"
                min={0.4}
                max={3}
                step={0.1}
                value={config.duration}
                onChange={(event) => setConfig((prev) => ({ ...prev, duration: Number(event.target.value) }))}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Accent
              <input
                type="color"
                value={config.accent}
                onChange={(event) => setConfig((prev) => ({ ...prev, accent: event.target.value }))}
                className="h-10 w-full rounded"
              />
            </label>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50/60 p-6">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: config.duration, ease: config.easing as never }}
              className="mx-auto flex h-40 w-full max-w-sm items-center justify-center rounded-2xl bg-white"
            >
              <Lottie animationData={{ ...sampleLottie, layers: sampleLottie.layers.map((layer) => ({ ...layer, shapes: layer.shapes?.map((shape) => ({ ...shape, c: shape.c ? { ...shape.c, k: accentColor } : shape.c })) })) }}
                loop
                style={{ width: 160, height: 160 }}
              />
            </motion.div>
          </div>
        </Panel>
        <Panel className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Narrative Sequencer</h3>
          <ol className="space-y-3 text-sm text-slate-600">
            <li>
              <strong className="text-slate-900">1. Discover:</strong> Persona selector triggers galaxy navigation to contextual dashboards.
            </li>
            <li>
              <strong className="text-slate-900">2. Explore:</strong> Motion reveals overview metrics, anomaly tags, and geospatial overlays.
            </li>
            <li>
              <strong className="text-slate-900">3. Prototype:</strong> Scenario sliders morph KPIs while proposal preview synchronises copy.
            </li>
            <li>
              <strong className="text-slate-900">4. Engage:</strong> Automation stubs send personalised follow-ups with booking links.
            </li>
          </ol>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            Export preset → TODO: Hook up to CMS for storing animation recipes per persona.
          </div>
        </Panel>
      </div>
    </section>
  );
};
