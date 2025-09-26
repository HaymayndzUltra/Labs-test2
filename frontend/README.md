# Portfolio Dashboard Frontend

Production-grade Next.js 14 (App Router) demo that powers the Upwork Portfolio Dashboard Ecosystem. The app showcases
persona-adaptive storytelling, multi-industry dashboards, proposal automation stubs, and an animation suite suitable for
Vercel deployment.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. PostHog runs in memory with a placeholder key. Add
real keys to `.env.local` before production deploys.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                # App Router routes (discover, vault, prototype, engage, animation, automation, analytics)
├── components/
│   ├── animation/      # Animation presets + Lottie assets
│   ├── dashboard/      # Industry pod dashboards (Recharts, Deck.gl)
│   ├── discovery/      # Chat intake UI elements
│   ├── landing/        # Landing constellation + persona selector
│   ├── navigation/     # Galaxy nav system
│   ├── profile/        # Timeline, testimonials, skill heatmap
│   └── shared/         # Persona theme bridge, common UI
├── data/               # Faker-based dataset factories
├── lib/
│   ├── analytics/      # PostHog instrumentation helpers
│   ├── automation/     # LangChain/OpenAI stubs + proposal synthesis
│   ├── cms/            # Sanity & Contentful clients (TODO: add real tokens)
│   ├── insights/       # Placeholder for anomaly engines
│   ├── pdf/            # Placeholder for PDF export wiring
│   └── workflows/      # n8n automation stubs
├── stores/             # Zustand persona store
└── styles/             # Tailwind globals
```

Additional documentation lives in `docs/`:

- `docs/setup.md` – environment + deployment checklist
- `docs/architecture.md` – high-level system diagram (ASCII)
- `docs/component-tree.md` – component tree with module mapping
- `docs/workflows.md` – automation + analytics flowchart

## Features

- **Landing Constellation**: Three.js mosaic, persona selector, guided tour CTA with GSAP/Framer Motion choreography.
- **Dashboard Vault**: Fintech + Healthcare pods with Recharts analytics, Deck.gl map, scenario simulator cards.
- **Dynamic Profile Hub**: Scrollable timeline, testimonials matrix, animated radar skill heatmap, Radix-powered CTAs.
- **Discovery Module**: Chat intake bot, LangChain summarization stub, proposal exporter (Markdown + base64 PDF), n8n
  workflow trigger.
- **Animation Suite**: Preset library, GSAP narrative sequencer, Lottie preview, customizable easing/duration.
- **Automation & Analytics**: PostHog events (persona_selected, pod_viewed, intake_submitted, proposal_generated),
  placeholders for Hotjar/LogRocket, n8n + CRM stubs.

## Tech Stack Highlights

- Next.js 14 (App Router + React Server Components)
- Tailwind CSS + Radix UI primitives
- Zustand for persona state, React Query for data orchestration
- Faker.js synthetic datasets, Prisma-ready data layer (TODO: connect to Supabase/Firebase)
- Visualization: Recharts, D3, Deck.gl, Lottie, GSAP, Framer Motion
- Automation: LangChain + OpenAI API stubs, n8n workflow triggers
- CMS: Sanity + Contentful placeholder clients
- Analytics: PostHog, TODO markers for Hotjar/LogRocket

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

## Testing & Tooling

```bash
npm run lint
npm test
npx playwright test   # E2E harness (requires playwright install)
npx storybook dev     # Storybook playground (after `npx storybook init`)
```

Storybook + Playwright scaffolds are included in dependencies; run their respective init commands if deeper coverage is
required.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)