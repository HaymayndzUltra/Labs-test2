'use client';

import { motion } from 'framer-motion';
import type { Testimonial } from '../data';

export function TestimonialsMatrix({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Testimonials matrix</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <motion.blockquote
            key={testimonial.persona}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">{testimonial.persona}</span>
            <p className="mt-3 text-sm text-white/80">“{testimonial.quote}”</p>
            <footer className="mt-4 text-xs uppercase tracking-[0.3em] text-emerald-200">
              {testimonial.metric}: {testimonial.value}
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  );
}
