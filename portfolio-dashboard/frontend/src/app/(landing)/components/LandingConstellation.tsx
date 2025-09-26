'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import type { PersonaDefinition } from '../../../hooks/usePersonaStore';

const DASHBOARD_COUNT = 18;

type LandingConstellationProps = {
  persona: PersonaDefinition;
};

function MosaicTile({ position, accent }: { position: [number, number, number]; accent: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={accent} metalness={0.1} roughness={0.4} />
    </mesh>
  );
}

function ConstellationScene({ persona }: LandingConstellationProps) {
  const tiles = useMemo(() => {
    return Array.from({ length: DASHBOARD_COUNT }).map((_, index) => {
      const radius = 4 + Math.random() * 6;
      const angle = (index / DASHBOARD_COUNT) * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 3;
      return {
        id: `tile-${index}`,
        position: [Math.cos(angle) * radius, elevation, Math.sin(angle) * radius] as [number, number, number],
      };
    });
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }} className="h-full w-full">
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.2} castShadow />
      {tiles.map((tile) => (
        <MosaicTile key={tile.id} position={tile.position} accent={persona.theme.meshColor} />
      ))}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}

export function LandingConstellation({ persona }: LandingConstellationProps) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-2xl">
      <Suspense
        fallback={<div className="flex h-full items-center justify-center text-slate-200">Loading Constellation…</div>}
      >
        <ConstellationScene persona={persona} />
      </Suspense>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-4 p-6"
      >
        {persona.recommendedPods.map((pod) => (
          <span
            key={pod}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur"
          >
            {pod}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
