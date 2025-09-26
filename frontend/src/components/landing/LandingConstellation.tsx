'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePersonaStore } from '@/stores/personaStore';
import { recordEvent } from '@/lib/analytics/posthog';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), { ssr: false });

const MosaicCluster = dynamic(
  () =>
    import('@react-three/drei').then(({ Icosahedron }) => {
      return function MosaicCluster({ hue, position }: { hue: number; position: [number, number, number] }) {
        return (
          <group position={position}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <Icosahedron args={[1.6, 1]}>
              <meshStandardMaterial color={`hsl(${hue}, 80%, 60%)`} emissive={`hsl(${hue}, 70%, 30%)`} />
            </Icosahedron>
          </group>
        );
      };
    }),
  { ssr: false }
);

const positions: [number, number, number][] = [
  [-3, 1.5, -2],
  [0, 2.2, 0],
  [2.5, -1.3, 1],
  [-1.4, -2.1, -1.5],
  [3, 0.5, -2],
  [-2.7, 0.9, 2.4],
];

export function LandingConstellation() {
  const persona = usePersonaStore((state) => state.getPersona());

  const palette = useMemo(() => {
    const seeds = [120, 200, 320, 40, 260, 10];
    return seeds.map((seed) => (seed + (persona.tone === 'visionary' ? 40 : 0)) % 360);
  }, [persona]);

  return (
    <section className="relative h-[480px] rounded-3xl border border-slate-800/40 bg-gradient-to-br from-slate-900 via-slate-950 to-black overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_rgba(0,0,0,0))]" />
      <Suspense fallback={<div className="flex h-full items-center justify-center text-slate-400">Calibrating constellation…</div>}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <color attach="background" args={[persona.id === 'healthcare-exec' ? '#0f172a' : '#020617']} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
          {palette.map((hue, index) => (
            <MosaicCluster key={hue} hue={hue} position={positions[index]} />
          ))}
        </Canvas>
      </Suspense>
      <motion.div
        className="absolute inset-x-10 bottom-10 rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Persona-Responsive Mosaic</p>
          <h3 className="text-2xl font-semibold text-white">{persona.heroCopy}</h3>
          <p className="text-slate-300 text-sm max-w-3xl">
            Our Deck.gl powered dashboard vault adapts to your north-star metrics. Hover in the demo to preview pods
            curated for {persona.label}. Tap Guided Tour to watch {persona.tone} storytelling in motion.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {persona.dashboardRecommendations.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-white"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => recordEvent('guided_tour_requested', { persona: persona.id })}
              className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
            >
              Guided Tour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => recordEvent('constellation_cta_clicked', { persona: persona.id })}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white"
            >
              Explore Vault
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
