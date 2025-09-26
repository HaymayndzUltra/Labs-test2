'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useState } from 'react';

const proposalSample = `# Proposal Snapshot\n\n- Persona: Healthcare Exec\n- Solution Pods: Discovery Intake, Healthcare Continuity Lab\n- Automation: n8n HIPAA-safe workflow, CRM sync\n- Next Steps: Book co-design lab within 48h.`;

export function ProfileCtas() {
  const [openModal, setOpenModal] = useState<'proposal' | 'book' | null>(null);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Engage</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setOpenModal('proposal')}
          className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-5 text-left transition hover:border-white/30"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">See proposal sample</p>
          <p className="mt-2 text-sm text-white/80">Launches AI-generated preview</p>
        </button>
        <button
          type="button"
          onClick={() => setOpenModal('book')}
          className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-5 text-left transition hover:border-white/30"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Book a call</p>
          <p className="mt-2 text-sm text-white/80">Calendly integration placeholder</p>
        </button>
      </div>

      <Dialog.Root open={openModal === 'proposal'} onOpenChange={(open) => !open && setOpenModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 m-auto h-[420px] w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl">
            <Dialog.Title className="text-lg font-semibold">Proposal sample preview</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-white/70">
              Generated with OpenAI + LangChain summarization. Replace with live API keys.
            </Dialog.Description>
            <pre className="mt-4 h-64 overflow-auto rounded-2xl bg-slate-950/70 p-4 text-xs text-emerald-200">
              {proposalSample}
            </pre>
            <div className="mt-4 flex justify-between text-xs text-white/60">
              <button type="button" className="underline">Download PDF</button>
              <button type="button" className="underline">Copy to Notion</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={openModal === 'book'} onOpenChange={(open) => !open && setOpenModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 m-auto h-[360px] w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl">
            <Dialog.Title className="text-lg font-semibold">Book a call</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-white/70">
              Calendly API placeholder. TODO: plug real scheduling token.
            </Dialog.Description>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-6 grid gap-3 text-sm"
            >
              <p>Select your window:</p>
              <div className="flex flex-wrap gap-3">
                {['Tomorrow 10:00', 'Tomorrow 14:00', 'Fri 09:30', 'Mon 11:00'].map((slot) => (
                  <span key={slot} className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em]">
                    {slot}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/60">Auto-sync to CRM via n8n pipeline.</p>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
