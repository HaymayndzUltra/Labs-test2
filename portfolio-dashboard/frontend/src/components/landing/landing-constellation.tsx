'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { PersonaSelector } from './persona-selector';
import { usePersonaStore } from '@/state/persona-store';
import { SectionHeader } from '@/components/ui/section-header';

interface MosaicProps {
  palette: string[];
}

const DashboardMosaic = ({ palette }: MosaicProps) => {
  const group = useRef<THREE.Group>(null);
  const cubes = useMemo(() => Array.from({ length: 14 }).map((_, idx) => ({
    position: [
      (idx % 5) * 1.7 - 4,
      Math.floor(idx / 5) * 1.5 - 2,
      (idx % 3) * 0.4 - 1,
    ] as [number, number, number],
    color: palette[idx % palette.length],
    scale: 1 + (idx % 3) * 0.25,
  })), [palette]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={group}>
      {cubes.map((cube, idx) => (
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6} key={`cube-${idx}`}>
          <mesh position={cube.position} scale={cube.scale}>
            <boxGeometry args={[1, 0.6, 0.12]} />
            <meshStandardMaterial color={cube.color} opacity={0.9} transparent metalness={0.3} roughness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export const LandingConstellation = () => {
  const { persona } = usePersonaStore();
  const palette = useMemo(() => {
    switch (persona.id) {
      case 'healthcare-exec':
        return ['#34d399', '#22d3ee', '#60a5fa'];
      case 'ecommerce-lead':
        return ['#fb7185', '#f97316', '#fbbf24'];
      case 'fintech-investor':
        return ['#a855f7', '#6366f1', '#0ea5e9'];
      default:
        return ['#4f46e5', '#06b6d4', '#22c55e'];
    }
  }, [persona.id]);

  return (
    <section className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-8 py-20 text-white shadow-2xl">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <PersonaSelector />
          <SectionHeader
            eyebrow="Landing Constellation"
            title={persona.headline}
            description={persona.valueProposition}
            accentClass="text-indigo-300"
          />
          <div className="flex flex-wrap gap-3 text-sm text-indigo-100">
            {persona.primaryDashboards.map((item) => (
              <span key={item} className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-4 py-1">
                {item}
              </span>
            ))}
          </div>
          <motion.button
            onClick={() =>
              gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: '#dashboard-vault', offsetY: 80 },
                ease: 'power3.out',
              })
            }
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-neon"
          >
            Guided Tour · 90s walkthrough
          </motion.button>
        </div>
        <div className="flex-1">
          <div className="relative h-[420px] w-full">
            <Canvas shadows dpr={[1, 2]}>
              <color attach="background" args={[0x0a1625]} />
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              <PerspectiveCamera makeDefault position={[0, 0, 12]} />
              <Suspense fallback={<Html center>Loading…</Html>}>
                <DashboardMosaic palette={palette} />
              </Suspense>
            </Canvas>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/90 to-transparent" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_60%)]" />
    </section>
  );
};
