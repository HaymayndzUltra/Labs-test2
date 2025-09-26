# portfolio-dashboard Frontend

This is a production-ready Upwork Portfolio Dashboard ecosystem built with Next.js 14 (App Router) and a full SaaS-style demo surface.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The landing constellation, dashboard pods, discovery chat, animation suite, and automation modules are all available in the root route.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/            # App Router entrypoints, layouts, and API routes
├── components/     # Feature modules (landing, dashboards, discovery, profile, automation)
├── lib/            # Analytics, automation, data generators, and client stubs
└── state/          # Zustand persona store and persisted context
```

## Features

- **Landing Constellation** powered by Three.js + @react-three/fiber with persona-aware themes.
- **Dashboard Vault** with Fintech & Healthcare pods, Recharts analytics, and Deck.gl geospatial overlays backed by Faker synthetic data.
- **Discovery Client Module** chat intake using React Query, Zod validation, and automation stubs that call `/api/intake` and `/api/proposal`.
- **Dynamic Profile Hub** combining Observable Plot sparklines, testimonials matrix, and CTA modals (proposal + Calendly stub).
- **Animation Suite** showcasing Framer Motion timelines and a configurable Lottie preset.
- **Automation & Personalisation** panel outlining n8n/Zapier style workflows and persona rules.
- **Analytics hooks** wired to PostHog with TODO placeholders for keys.
- **LangChain + OpenAI** stubs ready for real proposal summarisation.

## Environment Variables

Copy `.env.example` to `.env.local` and update the values. All API keys are optional but recommended for full fidelity:

- `NEXT_PUBLIC_POSTHOG_KEY` – PostHog analytics key (optional).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase client (optional stub).
- `OPENAI_API_KEY` – Enables LangChain summarisation + proposal copy (TODO marker when absent).
- Any CMS/API keys should be added with clear TODO notes where placeholders exist.

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)