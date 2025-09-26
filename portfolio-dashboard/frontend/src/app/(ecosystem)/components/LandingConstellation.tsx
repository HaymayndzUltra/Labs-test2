'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense, useMemo } from 'react';
import { usePersonaStore } from '@/hooks/usePersonaStore';
import { PersonaSelector } from './PersonaSelector';

interface MosaicCubeProps {
  position: [number, number, number];
  color: string;
}

function MosaicCube({ position, color }: MosaicCubeProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

export function LandingConstellation() {
  const { persona } = usePersonaStore();

  const nodes = useMemo(() => {
    const palette: Record<string, string[]> = {
      indigo: ['#6366f1', '#818cf8', '#a5b4fc'],
      emerald: ['#10b981', '#34d399', '#6ee7b7'],
      amber: ['#f59e0b', '#fbbf24', '#fcd34d'],
      sky: ['#0ea5e9', '#38bdf8', '#7dd3fc'],
    };

    const colors = palette[persona.theme.accent] ?? palette.indigo;
    return Array.from({ length: 24 }).map((_, index) => ({
      position: [
        Math.sin(index) * 3 + (index % 3) * 0.3,
        Math.cos(index) * 2 + ((index >> 1) % 3) * 0.2,
        Math.sin(index * 0.7) * 2,
      ]) as [number, number, number],
      color: colors[index % colors.length],
    }));
  }, [persona.theme.accent]);

  return (
    <section className={`relative overflow-hidden rounded-[3rem] border border-white/10 ${persona.theme.radial} p-10`}>
      <div className="absolute inset-0 opacity-70 mix-blend-screen" aria-hidden>
        <Canvas camera={{ position: [6, 4, 8], fov: 50 }} shadows>
          <ambientLight intensity={0.7} />
          <pointLight position={[2, 6, 4]} intensity={1.2} />
          <Suspense>
            {nodes.map((node, index) => (
              <MosaicCube key={`cube-${index}`} position={node.position} color={node.color} />
            ))}
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
        <motion.div
          className="space-y-6 text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.4em]">
            Discover
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">
            {persona.headline}
          </h1>
          <p className="max-w-2xl text-lg text-white/80">{persona.mission}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {persona.recommendedDashboards.map((dashboard) => (
              <motion.div
                key={dashboard.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl border border-white/20 bg-black/40 p-5 shadow-xl backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white">{dashboard.title}</h3>
                <p className="mt-2 text-sm text-white/70">{dashboard.description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">KPIs</p>
                <ul className="mt-1 flex flex-wrap gap-2 text-xs text-white/80">
                  {dashboard.kpis.map((kpi) => (
                    <li key={kpi} className="rounded-full bg-white/10 px-3 py-1">
                      {kpi}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="relative z-10">
          <PersonaSelector className="border-white/15 bg-black/30" />
        </div>
      </div>
    </section>
  );
}
