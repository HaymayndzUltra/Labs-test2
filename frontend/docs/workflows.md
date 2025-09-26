# Workflow Charts (ASCII)

```
[Persona Switch]
     │
     ▼
PostHog.capture('persona_selected')
     │
     ├─ Updates Zustand store
     ├─ Triggers Theme Bridge → layout gradient
     └─ Prefetches Fintech/Healthcare datasets

[Intake Flow]
User Answer → Chat UI → LangChain Summary → Proposal Synthesizer →
  ├─ Markdown export (Notion-ready)
  ├─ Base64 PDF stub (TODO: Supabase upload)
  └─ n8n trigger → CRM + Email follow-up

[Animation Suite]
Preset Selection → GSAP Timeline → Lottie Preview → Narrative Sequencer Log
```
