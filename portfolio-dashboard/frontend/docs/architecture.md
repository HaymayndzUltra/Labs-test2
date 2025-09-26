# Upwork Portfolio Dashboard Architecture

```mermaid
graph TD
  A[Landing Constellation] -->|Persona selection| B[Persona Store (Zustand)]
  B --> C[Dashboard Vault]
  B --> D[Dynamic Profile Hub]
  B --> E[Automation Rules]
  C -->|Synthetic data| F[Prisma Seeds / Supabase Stub]
  C --> G[Visualization Layer]
  G --> G1[Recharts]
  G --> G2[Observable Plot]
  G --> G3[deck.gl]
  D --> H[Proposal Modal]
  H --> I[OpenAI/LangChain Stub]
  I --> J[Proposal Exporter]
  J --> K[n8n Workflow]
  K --> L[Supabase CRM]
  K --> M[Email Trigger]
  L -->|Events| N[PostHog]
  M --> N
```

## Component Tree Overview

- `app/page.tsx` orchestrates the main ecosystem sections.
  - `LandingConstellation`
    - `PersonaSelector`
  - `DashboardVault`
    - `ScenarioSimulator`
    - `DiagnosticPlot`
    - `GeospatialDeck`
  - `DiscoveryClientModule`
    - Chat UI + Intake state machine
    - Prototype launcher + Proposal exporter
  - `DynamicProfileHub`
    - Timeline cards, testimonials, radar heatmap
    - Proposal & booking modals
  - `AnimationSuite`
    - Preset controls, GSAP preview, Lottie block
  - `AutomationPersonalization`
    - Workflow trigger, rules engine, email preview

## Data & Automation Flow

1. **Persona Selection** updates Zustand store → re-themes sections and recommended dashboards.
2. **Dashboard Vault** pulls synthetic metrics from Faker-driven utilities (seeded for deterministic demos).
3. **Discovery Intake** collects goals and maps to persona, enabling prototype launch + Markdown export.
4. **Proposal generation** triggers analytics events and feeds the automation workflow stub.
5. **Automation suite** simulates n8n orchestration, CRM sync, and personalized emails.
6. **Analytics providers** (PostHog + LogRocket) capture navigation + conversion events for future optimization.

## Deployment Notes

- Designed for Vercel (Next.js App Router) — ensure build target Node 20+.
- Add PostHog/LogRocket keys as environment variables before deploy.
- Replace automation placeholders with actual n8n / Supabase credentials in managed secrets.

## Testing & Observability Roadmap

- Storybook stories per persona module for visual regression baselines.
- Playwright flows to validate persona switching, intake completion, and proposal downloads.
- PostHog dashboards for funnel metrics: persona_selected → pod_viewed → intake_submitted → proposal_generated.
- Hotjar/LogRocket session replay for UX validation.
