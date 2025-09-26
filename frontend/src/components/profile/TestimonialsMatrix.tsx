'use client';

import { motion } from 'framer-motion';

type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  metric: number;
};

export function TestimonialsMatrix({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <motion.figure
          key={testimonial.id}
          className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <blockquote className="text-sm text-slate-200">“{testimonial.quote}”</blockquote>
          <figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">
            {testimonial.name} · {testimonial.title}
          </figcaption>
          <p className="mt-4 text-sm text-emerald-400">{testimonial.metric}% lift in win rate</p>
        </motion.figure>
      ))}
    </div>
  );
}
