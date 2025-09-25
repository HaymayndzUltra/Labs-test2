# Technical Execution Plan: Unified Multi-Domain Portfolio Dashboard

Based on PRD: [`docs/prd-unified-portfolio-dashboard.md`](./prd-unified-portfolio-dashboard.md)

> **Note on AI Model Strategy (Feb 2025 landscape):**
> * **Code Architect (OpenAI o4-high):** Excels at complex TypeScript/React architecture, state management, and large component trees.
> * **Experience Visionary (Anthropic Claude 3.7 Sonnet):** Strong at UX cohesion, narrative design, and ensuring copy/layout alignment.
> * **Systems Integrator (Google Gemini 2.0 Pro):** Skilled at orchestrating data mocks, chart configuration, and cross-module consistency.

## Primary Implementation Layers
- **Frontend App (Next.js / Tailwind / Recharts)** — primary focus for UI, state, and visualization work.
- **Shared Frontend Utilities** — data mocks, hooks, and constants in `frontend/src/app/dashboard`.

## High-Level Tasks & Complexity
- [ ] **1.0 Rebuild dashboard shell with tabbed navigation and premium surface treatments.** `[Complexity: Complex]`
- [ ] **2.0 Craft domain-specific modules with mock datasets and KPIs for all categories.** `[Complexity: Complex]`
- [ ] **3.0 Implement visualization suites (charts, heatmap, funnel, leaderboards) and automation callouts.** `[Complexity: Complex]`
- [ ] **4.0 Polish responsive behavior, interactions, and smoke tests.** `[Complexity: Simple]`
- [ ] **5.0 Update data plumbing/documentation to reflect the unified portfolio experience.** `[Complexity: Simple]`

## Detailed Execution Plan

- [ ] 1.0 **Rebuild dashboard shell with tabbed navigation and premium surface treatments.**
> **Recommended Model:** Experience Visionary (Anthropic Claude 3.7 Sonnet)
  - [ ] 1.1 Audit existing `DashboardClient` layout and determine reusable surface styles.
  - [ ] 1.2 Introduce a top-level portfolio container component with hero banner, tablist, and section transitions.
  - [ ] 1.3 Implement accessible tab keyboard handling (`aria-controls`, roving tabindex) and persistent state.
  - [ ] 1.4 Create shared card primitives (metric card, automation card, panel wrappers) with Tailwind tokens and gradients.
  - [ ] 1.5 Wire loading/skeleton states consistent with premium SaaS look.

- [ ] 2.0 **Craft domain-specific modules with mock datasets and KPIs for all categories.**
> **Recommended Model:** Systems Integrator (Google Gemini 2.0 Pro)
  - [ ] 2.1 Design TypeScript interfaces for each category’s data payload (SaaS, E-Commerce, Analytics, Custom App, Media, EdTech, Specialized verticals).
  - [ ] 2.2 Populate realistic mock datasets including KPIs, tables, automation timelines, and background jobs in `data.ts` (or new data builder module).
  - [ ] 2.3 Create category-specific render functions or components consuming shared primitives and the typed data.
  - [ ] 2.4 Ensure specialized niches section supports sub-tabs or segmented cards for Real Estate, Finance, Healthcare with distinct copy.
  - [ ] 2.5 Document automation logic in-line (tooltips or timeline) to satisfy portfolio storytelling.

- [ ] 3.0 **Implement visualization suites (charts, heatmap, funnel, leaderboards) and automation callouts.**
> **Recommended Model:** Code Architect (OpenAI o4-high)
  - [ ] 3.1 Integrate Recharts-based components for line, bar, donut, funnel, stacked bar, and radial workload charts.
  - [ ] 3.2 Build a calendar heatmap component (SVG/Flex grid) for EdTech student activity with gradient legend.
  - [ ] 3.3 Implement top products leaderboard, workload distribution, and automation workflow diagram components.
  - [ ] 3.4 Add motion/interaction hooks (hover states, subtle transitions) respecting performance budgets.
  - [ ] 3.5 Provide fallback descriptions for screen readers on all visualizations.

- [ ] 4.0 **Polish responsive behavior, interactions, and smoke tests.**
> **Recommended Model:** Experience Visionary (Anthropic Claude 3.7 Sonnet)
  - [ ] 4.1 Add responsive grid breakpoints for tablet/mobile including horizontal scrolling for dense tables.
  - [ ] 4.2 Validate keyboard navigation, focus order, and aria attributes across tabs and interactive cards.
  - [ ] 4.3 Update or add Jest/React Testing Library smoke test(s) covering tab switching renders.
  - [ ] 4.4 Optimize for reduced layout shift with consistent heights and skeleton placeholders.

- [ ] 5.0 **Update data plumbing/documentation to reflect the unified portfolio experience.**
> **Recommended Model:** Systems Integrator (Google Gemini 2.0 Pro)
  - [ ] 5.1 Adjust `getCommerceDashboard` and related utilities (or replace) to supply the new unified dataset while preserving cache strategy.
  - [ ] 5.2 Refresh README or inline documentation summarizing the new portfolio module architecture.
  - [ ] 5.3 Ensure type exports and hooks align with future backend integration expectations.

