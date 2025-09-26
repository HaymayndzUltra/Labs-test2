# Upwork Portfolio Dashboard Ecosystem (Frontend)

Production-grade Next.js 14 demo showcasing a multi-persona Upwork portfolio experience. The app blends immersive
visualization, automation stubs, and persona-aware storytelling for a SaaS-style walkthrough.

## ✨ Feature Highlights

- **Landing Constellation** — Three.js mosaic with persona switcher, adaptive copy, and guided tour entry point.
- **Dashboard Vault** — Fintech & Healthcare pods with synthetic Prisma/Supabase-ready datasets, anomaly charts, deck.gl geospatial map, and scenario simulator.
- **Dynamic Profile Hub** — Timeline storytelling, testimonial matrix, radar skill heatmap, and proposal/booking modals.
- **Discovery Client Module** — Chat-style intake using OpenAI/LangChain stubs, needs analysis engine, prototype launcher, and proposal exporter.
- **Animation Suite** — GSAP + Framer Motion previewer, exportable presets, Lottie demo, and narrative sequencer.
- **Automation & Personalization** — n8n workflow mock, persona rules engine, CRM/email placeholders, and analytics tracker.
- **Analytics** — PostHog + LogRocket initialization, event capture for `persona_selected`, `pod_viewed`, `intake_submitted`, and `proposal_generated`.

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router, React Server Components) with TypeScript
- **Styling**: Tailwind CSS + Radix UI primitives
- **State/Data**: Zustand, SWR, TanStack Query, synthetic datasets via Faker
- **Visualizations**: Recharts, Observable Plot, deck.gl, D3/Three.js integrations
- **Animation**: Framer Motion, GSAP, Lottie
- **Automation Stubs**: OpenAI / LangChain placeholders, n8n workflow blueprint, Supabase/Firebase clients (placeholders)
- **Analytics**: PostHog, LogRocket instrumentation

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm (default) or yarn / pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to explore the ecosystem.

### Production Build
```bash
npm run build
npm start
```
Deploy-ready on Vercel.

## 🔧 Environment Variables
Copy `.env.example` → `.env.local` (create if missing) and populate:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Branding for metadata and analytics (default placeholder). |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key (placeholder allowed in dev). |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog API host (defaults to `https://app.posthog.com`). |
| `NEXT_PUBLIC_LOGROCKET_APP` | LogRocket project slug (placeholder allowed). |
| `NEXT_PUBLIC_APP_VERSION` | Optional release identifier surfaced in analytics. |

> ⚠️ OpenAI, LangChain, Supabase, Firebase integrations are stubbed. Add credentials & API calls when wiring real automations.

## 🧪 Testing & Tooling

```bash
npm run lint     # ESLint
npm test         # Jest unit tests
npm run test:coverage
```

Recommended additions:
- `npm run storybook` (after Storybook setup)
- `npx playwright test` (after Playwright suite is configured)

## 📂 Structure Overview

```
src/
├── app/
│   ├── (ecosystem)/components/  # Persona dashboards, automation, discovery modules
│   ├── layout.tsx               # Root layout + providers (SWR, React Query, analytics)
│   └── page.tsx                 # Ecosystem landing orchestration
├── hooks/                       # Zustand stores & shared hooks
├── lib/                         # Personas, analytics, data generators, utilities
└── styles/                      # Global Tailwind layers
```

## 🗺️ Roadmap Alignment
- **Weeks 1–2**: Landing constellation + Fintech pod ✅
- **Weeks 3–4**: Discovery intake + proposal exporter ✅
- **Weeks 5–6**: Dynamic profile hub + animation library ✅
- **Weeks 7–8**: Automation workflows & persona rules ✅
- **Weeks 9–10**: Healthcare pod, nonlinear navigation, polish ✅

## 📎 TODO Integrations
- Replace automation stubs with live n8n / Zapier flows and CRM targets.
- Connect Supabase/Firebase with Prisma seed scripts for persistent synthetic data.
- Wire OpenAI + LangChain pipelines for proposal summarization.
- Add Storybook stories and Playwright smoke tests.
- Hook PostHog/LogRocket project keys + verify analytics ingestion in staging.

## 📝 Licensing & Usage
Demo code for Upwork portfolio showcase. Ensure client-specific assets or data remain compliant with Upwork/Vercel policies before deployment.
