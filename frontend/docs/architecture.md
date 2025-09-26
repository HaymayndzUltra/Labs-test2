# Architecture Diagram (ASCII)

```
┌─────────────────────────────┐
│ Next.js App Router          │
│ ├─ layout.tsx               │
│ ├─ providers.tsx            │
│ └─ GalaxyNav + Theme Bridge │
└──────────────┬──────────────┘
               │ persona store (Zustand)
┌──────────────▼──────────────┐     ┌────────────────────────┐
│ Landing Constellation       │     │ Dashboard Vault         │
│ Three.js mosaic + selectors │◄────┤ Faker datasets + RQ    │
└──────────────┬──────────────┘     │ Recharts + Deck.gl      │
               │                    └────────┬───────────────┘
               │ persona context             │ scenario sync
┌──────────────▼──────────────┐             ▼
│ Discovery Module            │     ┌────────────────────────┐
│ Chat intake + LangChain     │────►│ Proposal Exporter       │
│ React Query orchestrator    │     │ Markdown + PDF stub     │
└──────────────┬──────────────┘     └────────┬───────────────┘
               │ automation webhook          │ n8n workflow stub
               ▼                              ▼
        Automation Page                PostHog Analytics
           (n8n stubs)                 (persona_selected, etc.)
```
