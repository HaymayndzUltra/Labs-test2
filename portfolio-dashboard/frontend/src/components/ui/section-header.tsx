'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  accentClass?: string;
}

export const SectionHeader = ({ eyebrow, title, description, accentClass }: SectionHeaderProps) => (
  <motion.header
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="mb-10 space-y-4"
  >
    <span className={`text-sm font-semibold tracking-[0.4em] uppercase text-slate-400 ${accentClass ?? ''}`}>
      {eyebrow}
    </span>
    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">{title}</h2>
    <p className="max-w-3xl text-base md:text-lg text-slate-600 dark:text-slate-300">{description}</p>
  </motion.header>
);
