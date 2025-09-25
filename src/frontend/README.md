# Portfolio-grade Product Operations Frontend

This Vite + React workspace implements the unified multi-vertical dashboard described in the portfolio-grade product operations brief. It provides:

- Design tokens for light/dark themes, semantic palettes, and vertical accents with 8pt spacing rhythm and typography scale.
- Shared components (KPI cards, charts, filter chips, tables, automation builder, toasts) with WCAG AA focus handling.
- Module pages for SaaS, E-commerce, Corporate Analytics, Custom App, Media, EdTech, Real Estate, Finance, and Healthcare verticals using shared UX primitives.
- Zustand global filters, React Query integration, and an EventSource mock for live metrics.
- Storybook configuration with theming decorator and seed script examples.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run storybook
```

> The workspace is dependency-isolated from the monorepo root. Run the commands from `src/frontend`.
