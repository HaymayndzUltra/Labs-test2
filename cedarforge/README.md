# CedarForge Ops Suite

Warm neo-industrial operations cockpit with multi-module dashboards, accessible charts, and automation builder primitives.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` – start Vite dev server at 5174.
- `pnpm test` – run unit and integration tests via Vitest.
- `pnpm test:e2e` – run Playwright keyboard navigation smoke.
- `pnpm storybook` – launch Storybook with light/dark toggles.

## Structure

- `src/app/modules/*` – feature modules (FinOps, Logistics, Energy, PeopleOps, IoT, Gaming, Hospitality).
- `src/shared` – design system components, chart primitives, state, tokens.
- `src/shared/tokens/tokens.json` – CedarForge palette and CSS variable themes.

## Accessibility & Internationalization

- WCAG AA palette, 3px focus ring, keyboard navigable charts, URL-synced filters.
- Tabular numerals enforced globally via CSS.
- Locale-ready formatters and React Intl provider scaffold.

## Testing & Quality

- Vitest + Testing Library coverage thresholds in `vite.config.ts`.
- Playwright E2E smoke for keyboard flows.
- Storybook with a11y addon and tokens preview.
- Lighthouse CI config placeholder in `package.json` scripts.
