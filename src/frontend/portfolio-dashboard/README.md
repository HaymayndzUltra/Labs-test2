# Portfolio-grade Product Operations

This Vite + React workspace implements a unified, premium multi-module dashboard spanning SaaS, commerce, corporate analytics, custom productivity, media, EdTech, and specialized niches. Every module consumes the same design system tokens, layout primitives, and automation builder to ensure visual and behavioral consistency while preserving vertical specificity.

## Highlights

- **Design system first** – 12-column grid, 8pt spacing rhythm, semantic typography scale, AA contrast, semantic color roles, and vertical accent tokens (`--vertical-*`).
- **State management** – Global filters powered by Zustand persistence, React Query for async data, optimistic actions with undo toasts, and SSE-ready KPI hooks.
- **Accessible data viz** – Keyboard reachable chart frames with table fallbacks, tabular numerals, and colorblind-friendly palettes that respect dark mode/RTL.
- **Automation everywhere** – Reusable automation builder component with optimistic enablement and undo guardrails across modules.
- **Storybook coverage** – Stories include theme/RTL controls for rapid review of design tokens and component ergonomics.

## Getting started

```bash
cd src/frontend/portfolio-dashboard
npm install
npm run dev
```

Storybook and automated checks:

```bash
npm run storybook    # interactive theming controls
npm run build        # type check + production build
npm run lint         # accessibility-leaning linting
npm run test         # vitest placeholder
```

## Modules

Each route mounts inside `AppShell` with shared filters and toast viewport:

- `/saas` – Subscription intelligence with churn health, API saturation, and billing orchestration.
- `/ecommerce` – Merchandising and fulfillment with promotion builder guardrails.
- `/corporate` – Pipeline and attribution insights with executive storytelling.
- `/custom-app` – Productivity automation featuring accessible Kanban and workload views.
- `/content-media` – Publishing workflow and engagement orchestration.
- `/edtech` – Learning analytics with adaptive nudges and compliance-ready automations.
- `/specialized` – Real estate, finance, and healthcare snapshots meeting PCI/HIPAA guardrails.

## Compliance & integrations

Mock connectors in `src/utils/connectors.ts` demonstrate how Snowflake, webhooks, and SSE streams plug into the UI without shipping secrets. Extend these helpers to wire actual BigQuery/dbt, Segment events, Stripe/Chargebee billing, Shopify/Magento commerce, Salesforce/HubSpot CRM, Jira/Linear DevOps, LTI/SCORM EdTech, and FHIR/HL7 healthcare integrations.

## Testing roadmap

- **Unit tests** for formatting utilities and Zustand reducers can be added under `src/__tests__`.
- **Accessibility** via axe-core and keyboard regression is recommended before production hardening.
- **Performance** budgets target <2.5s LCP on 3G fast with chart render under 300ms post aggregation.

