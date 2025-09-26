# Upwork Portfolio Dashboard Ecosystem

Production-grade Next.js 14 demo showcasing a multi-persona Upwork portfolio platform. Built to simulate a SaaS-quality walkthrough with synthetic data, automation stubs, and analytics instrumentation.

## Modules

| Area | Highlights |
| --- | --- |
| Landing Constellation | Three.js mosaic, persona selector (SaaS Founder, Healthcare Exec, E-commerce Lead, Fintech Investor), GSAP tour CTA |
| Dashboard Vault | Fintech + Healthcare pods with overview, diagnostics, scenario simulator, deck.gl geo overlays |
| Dynamic Profile Hub | Interactive timeline (Observable Plot), testimonials matrix, animated radar skill heatmap, CTA dialogs |
| Discovery Client | Chat-style intake powered by React Query, OpenAI/LangChain stubs, proposal exporter (PDF + Notion) |
| Animation Suite | Motion presets with GSAP, Framer Motion, Lottie preview, narrative sequencer |
| Automation | n8n workflow JSON stubs for intake → proposal → CRM/email |

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore. Persona switching is query-aware (`?persona=fintech-investor`).

## Environment

Create `.env.local` to configure integrations:

```
NEXT_PUBLIC_POSTHOG_KEY=todo
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_HOTJAR_ID=todo
```

All automation/API keys are placeholders marked TODO.

## Tech Stack

- **Next.js 14 (App Router)**, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI dialogs
- **State/Data**: Zustand persona store, React Query, pdf-lib, faker-based synthetic data
- **Visualization**: Three.js/@react-three/fiber, Recharts, deck.gl, Observable Plot
- **Motion**: Framer Motion, GSAP, Lottie
- **Automation/AI stubs**: LangChain, OpenAI, n8n workflow JSON
- **Analytics**: PostHog + Hotjar initialization (events: persona_selected, pod_viewed, intake_submitted, proposal_generated)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Create production build |
| `npm run start` | Run built app |
| `npm run lint` | Lint via Next.js |
| `npm test` | Jest unit tests |

## Architecture Notes

- `src/app/(landing)` – landing constellation client experience
- `src/app/dashboard` – dashboard vault UI + synthetic data generator
- `src/app/discovery` – intake workflow, API route classification, proposal exporter
- `src/app/profile` – profile hub timeline/testimonials/ctas
- `src/app/animations` – motion library + narrative sequencer
- `src/lib` – analytics + proposal helpers
- `automation/n8n` – workflow blueprints ready for import

## Analytics

`initializeAnalytics` wires PostHog + Hotjar. Events are triggered inside persona changes, pod views, intake submissions, proposal exports, and animation previews. Update env keys before production.

## Deployment

Ready for Vercel: uses Next.js App Router, no custom server requirements. Ensure environment secrets are set and optional services (Supabase/Firebase, CMS) plugged in before go-live.

## Testing & Docs

- Jest + Testing Library (placeholder — extend with Playwright for LCP checks)
- Storybook TODO markers for future component stories
- Architecture diagram + workflow instructions: see `/automation/n8n` and inline comments.

## Roadmap Alignment

- Weeks 1-2: Landing constellation + Fintech pod ✅
- Weeks 3-4: Discovery intake bot + proposal exporter ✅
- Weeks 5-6: Profile hub + animation suite ✅
- Weeks 7-8: Automation stubs + persona routing rules ✅
- Weeks 9-10: Healthcare pod + nonlinear galaxy nav ✅

> All external integrations require real keys/accounts. Replace placeholders before client demos.
