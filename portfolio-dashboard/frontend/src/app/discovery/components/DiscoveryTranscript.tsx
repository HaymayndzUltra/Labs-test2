'use client';

import { motion } from 'framer-motion';

export type TranscriptMessage = {
  role: 'client' | 'assistant';
  content: string;
};

export function DiscoveryTranscript({ messages }: { messages: TranscriptMessage[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Discovery transcript</h2>
      <div className="mt-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={`${message.role}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`flex ${message.role === 'client' ? 'justify-start' : 'justify-end'}`}
          >
            <p
              className={`max-w-sm rounded-2xl px-4 py-3 text-sm shadow ${
                message.role === 'client'
                  ? 'bg-white/10 text-white/90'
                  : 'bg-emerald-500/80 text-white shadow-emerald-500/40'
              }`}
            >
              {message.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
