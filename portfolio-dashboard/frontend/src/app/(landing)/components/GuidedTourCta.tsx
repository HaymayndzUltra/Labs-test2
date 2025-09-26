'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';

export function GuidedTourCta() {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.92, opacity: 0.6 },
        { scale: 1, opacity: 1, repeat: -1, yoyo: true, duration: 1.6, ease: 'sine.inOut' },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/dashboard"
        ref={buttonRef}
        className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:bg-white/20"
      >
        Launch guided tour
      </Link>
      <Link
        href="/discovery"
        className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 hover:border-white"
      >
        Start intake bot
      </Link>
    </motion.div>
  );
}
