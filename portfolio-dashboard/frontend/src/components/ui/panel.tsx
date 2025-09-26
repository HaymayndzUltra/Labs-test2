'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const Panel = ({ children, className, delay = 0 }: PanelProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, delay }}
    className={`rounded-3xl border border-slate-200/70 bg-white/80 shadow-lg shadow-indigo-500/5 backdrop-blur-xl ${className ?? ''}`}
  >
    {children}
  </motion.div>
);
