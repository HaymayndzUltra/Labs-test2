'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { usePersonaStore } from '@/state/persona-store';
import { PERSONAS } from '@/lib/data/personas';
import { captureEvent } from '@/lib/analytics/posthog';

export const PersonaSelector = () => {
  const { persona, setPersona } = usePersonaStore();

  const handleChange = (value: string) => {
    const next = PERSONAS[value as keyof typeof PERSONAS];
    if (!next) return;
    setPersona(next);
    captureEvent('persona_selected', { persona: value });
  };

  return (
    <Select.Root value={persona.id} onValueChange={handleChange}>
      <Select.Trigger className="group inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
        <span>{persona.label}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl">
          <Select.Viewport className="space-y-1">
            {Object.values(PERSONAS).map((item) => (
              <Select.Item
                key={item.id}
                value={item.id}
                className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 outline-none hover:bg-slate-100 data-[state=checked]:bg-indigo-50"
              >
                <Select.ItemText>
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  <span className="ml-2 text-xs text-slate-500">{item.description}</span>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="h-4 w-4 text-indigo-500" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
