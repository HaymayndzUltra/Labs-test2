'use client';

import { create } from 'zustand';
import { defaultPersonaId, getPersona, PERSONA_ORDER, type PersonaConfig, type PersonaId } from '@/lib/personas';

interface PersonaState {
  personaId: PersonaId;
  persona: PersonaConfig;
  personaOrder: PersonaId[];
  setPersonaId: (personaId: PersonaId) => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personaId: defaultPersonaId,
  persona: getPersona(defaultPersonaId),
  personaOrder: PERSONA_ORDER,
  setPersonaId: (personaId) =>
    set({
      personaId,
      persona: getPersona(personaId),
    }),
}));
