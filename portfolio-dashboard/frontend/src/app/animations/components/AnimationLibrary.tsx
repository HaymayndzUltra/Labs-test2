'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import { trackEvent } from '../../../lib/analytics';

const sampleLottie = {
  v: '5.7.6',
  fr: 60,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
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
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [0, 0, 100] },
            { t: 90, s: [100, 100, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [220, 220] },
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.231, 0.765, 0.647, 1] },
          o: { a: 0, k: 100 },
        },
      ],
      ao: 0,
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
};

const animationPresets = [
  {
    id: 'chart-reveal',
    name: 'Chart reveal',
    description: 'Bars grow with eased motion and highlight deltas.',
    config: { duration: 1.2, easing: 'easeOut' },
  },
  {
    id: 'tooltip-fade',
    name: 'Tooltip fade',
    description: 'Tooltip fades and scales from cursor.',
    config: { duration: 0.4, easing: 'easeInOut' },
  },
  {
    id: 'morphing-path',
    name: 'Morphing path',
    description: 'Line morphs between persona narratives.',
    config: { duration: 1.8, easing: 'anticipate' },
  },
];

export function AnimationLibrary() {
  const [activePreset, setActivePreset] = useState(animationPresets[0]);
  const [duration, setDuration] = useState(activePreset.config.duration);
  const [ease, setEase] = useState(activePreset.config.easing);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.preview-bar',
        { scaleY: 0, transformOrigin: 'bottom center' },
        { scaleY: 1, duration, ease, stagger: 0.1 },
      );
    }, previewRef);
    return () => ctx.revert();
  }, [duration, ease, activePreset]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Animation presets</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr,1fr]">
        <div className="space-y-4">
          {animationPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setActivePreset(preset);
                setDuration(preset.config.duration);
                setEase(preset.config.easing);
                trackEvent('animation_preset_previewed', { preset: preset.id });
              }}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                activePreset.id === preset.id
                  ? 'border-white/70 bg-slate-900/70'
                  : 'border-white/20 bg-slate-900/40 hover:border-white/40'
              }`}
            >
              <p className="text-sm font-semibold text-white">{preset.name}</p>
              <p className="text-xs text-white/60">{preset.description}</p>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Customization</p>
          <div className="mt-4 space-y-4 text-sm">
            <label className="block">
              Duration ({duration.toFixed(1)}s)
              <input
                type="range"
                min={0.2}
                max={2}
                step={0.1}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Easing ({ease})
              <select
                value={ease}
                onChange={(event) => setEase(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 p-2"
              >
                {['easeOut', 'easeInOut', 'anticipate', 'circ.out'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
          <div ref={previewRef} className="mt-6 grid grid-cols-5 items-end gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="preview-bar h-24 rounded-full bg-emerald-400/80" />
            ))}
          </div>
          <p className="mt-4 text-xs text-white/60">Export to Lottie or CSS animation blueprint.</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Lottie preview</p>
        <Lottie animationData={sampleLottie} loop style={{ height: 180 }} />
      </div>
    </div>
  );
}
