# Comprehensive SaaS Dashboard Client Brief (Demo‑Ready)

**Project Codename:** HALO

**Version:** 1.0
**Date:** September 24, 2025 (Asia/Manila)

---

## 1) Executive Summary

### Overview & Objectives

We will design and build a premium, demo‑ready SaaS analytics dashboard showcasing enterprise‑grade UX, polished motion design, and high‑fidelity data visualizations. The dashboard will demonstrate how a modern SaaS product communicates KPIs, trends, cohorts, and operational alerts through a cohesive, branded interface with smooth micro‑interactions and presentation‑worthy transitions.

**Primary objectives**

* Deliver a visually striking, responsive dashboard with cinema‑quality polish (transitions, micro‑interactions, and motion language).
* Demonstrate end‑to‑end user journeys (from overview → deep dive → action) using realistic sample data and interactive flows.
* Achieve top‑tier performance (fast initial load, 60fps animations, zero jank) and WCAG 2.1 AA accessibility.
* Package the work as a turnkey demo: hosted environment + resettable data + guided walkthrough.

### Target Audience & Use Cases

* **Executives/Leadership:** monitor business health, revenue, churn, NPS, incident risk.
* **Product Managers/Analysts:** cohort analysis, feature adoption, funnel drop‑off, A/B insights.
* **Operations/CS:** ticket volume, SLAs, response times, capacity planning.
* **Sales/Marketing:** pipeline velocity, MQL→SQL conversion, campaign ROI.

### Key Success Metrics (measurable)

* **Visual Impact:** Stakeholder rating ≥ **9/10** on design polish/brand alignment.
* **Performance:** LCP ≤ **1.8s**, INP ≤ **100ms**, CLS ≤ **0.1**, dropped frames < **1%** on baseline device.
* **Accessibility:** Automated axe score ≥ **99%** on key screens; keyboard coverage 100%.
* **Demo Efficacy:** 3 scripted flows can be completed in **≤ 5 minutes** with zero guidance.
* **Reliability:** 0 critical defects in final QA pass; 95th percentile uptime during demos ≥ **99.9%**.

### Timeline (aggressive, demo‑focused)

**6 weeks total**

1. **Week 1 — Discovery & Design Tokens:** audit, brand alignment, motion language, sample data schema.
2. **Week 2 — Core Shell & Navigation:** layout grid, theming, sidebar/topbar, route scaffolding.
3. **Week 3 — Data Viz & Cards:** KPI cards, charts, tables, filters, search.
4. **Week 4 — Motion & Interactions:** page transitions, skeletons, hover states, modals.
5. **Week 5 — QA & Hardening:** performance tuning, a11y, cross‑browser/device, content polish.
6. **Week 6 — Demo Kit:** seeded datasets, persona switcher, guided tour, reset mechanism, recording.

### Budget Considerations (high‑level)

* **Team:** Product/PM, Design (UI+Motion), Frontend (2), QA/Automation, DevOps.
* **Tooling & Licenses:** hosting (Vercel/Netlify), analytics, testing (Playwright), icons/illustrations, Lottie.
* **Assumptions:** single brand theme, English copy, non‑authenticated demo; integrations mocked.
* **Out of Scope (v1):** custom backend, complex role‑based access control, multi‑tenant billing.

---

## 2) Technical Requirements

**Frontend Framework:** **React + Next.js (App Router) + TypeScript**
Rationale: first‑class SSR/ISR for SEO, excellent DX, granular code‑splitting, predictable routing.

**Styling & Design System:** **Tailwind CSS + shadcn/ui + custom design tokens**

* CSS variables for color/spacing/typography tokens, instant dark mode, and brand theming.
* Component primitives from shadcn/ui (Radix under the hood) for a11y and consistency.

**Animation Library:** **Framer Motion** (micro‑interactions and page transitions) + **Lottie** (hero/success states).
**Charting:** **Recharts** for rapid, interactive charts; **D3 scales** where bespoke control is needed.
**State & Data:** **TanStack Query** for async data + caching; **Zustand** for lightweight UI state.
**Forms:** **React Hook Form** + **Zod** schemas; instant validation + accessible errors.
**Tables:** **TanStack Table** with virtualization for large datasets.
**Icons:** **lucide-react** (consistent stroke, crisp at small sizes).
**Search/Command:** **cmdk** (⌘K palette) + local fuzzy (Fuse.js) for demo datasets.
**i18n (optional):** next-intl stubbed for future.

**Responsive Design:** Mobile‑first; breakpoints: **sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536**.
**Browser Support:** Last 2 versions of Chrome, Edge, Safari, Firefox; Safari ≥ 16.

**Security & Hygiene:**

* Strict TypeScript, ESLint + Prettier + import ordering; Husky + lint‑staged on commit.
* Security headers (CSP, X‑Frame‑Options, HSTS), dependency scanning (npm audit).
* Secrets via environment variables; no secrets checked into repo.

**Build & Deploy:**

* CI/CD (GitHub Actions): lint → typecheck → unit → e2e → build → preview → production.
* Hosting: Vercel (preview branches, image optimization, edge caching).

---

## 3) Design Specifications

### Color Palette (WCAG‑aware)

* **Primary (Brand):** Indigo 600 `#4F46E5` (hover: Indigo 500 `#6366F1`)
* **Secondary (UI/Chrome):** Slate 700 `#334155` (muted: Slate 500 `#64748B`)
* **Accent (Highlights/Success):** Emerald 500 `#10B981`
* **Warn:** Amber 500 `#F59E0B`; **Error:** Rose 500 `#F43F5E`
* **Background:** Base `#0B1020` (dark) / `#F8FAFC` (light); elevated surfaces +2–6% luminance.
* **Contrast:** Minimum 4.5:1 for text on surfaces; 3:1 for large display numerals.

### Typography

* **Primary UI:** Inter (fallback: system‑ui, -apple-system, Segoe UI, Roboto).
* **Numeric Emphasis:** Tabular figures enabled (`font-variant-numeric: tabular-nums`).
* **Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60.
* **Line length:** 60–80ch for paragraphs; KPI numerals 1.1–1.2 line‑height.

### Layout & Spacing

* **Grid:** 12‑column, 8px spacing unit.
* **Containers:** max‑width: 1280px (xl), gutters 24–32px.
* **Cards:** 16–24px internal padding; elevation via subtle shadow + border (1px, 6–12% opacity).

### Iconography

* **Style:** 1.5px stroke, rounded joins, consistent metaphor; avoid filled icons unless conveying status.
* **Usage:** never pair icon + text without readable label; ensure 24px touch target min.

### Visual Hierarchy & IA

* **F‑pattern** scanning on desktop, single‑column priority on mobile.
* **Primary row:** global KPIs; **secondary row:** trends/comparisons; **tertiary:** tables/logs.
* **Emphasis order:** motion → color → size → weight; never rely on color alone.

---

## 4) Animation & Interaction Requirements

**Motion Principles**

* **Performance first:** transform/opacity only; avoid layout‑thrashing properties.
* **Timing:** entrance 200–280ms; exits 160–220ms; emphasized transitions 320–480ms.
* **Easing:** standard `[0.2, 0, 0, 1]`; emphasized `[0.05, 0.7, 0.1, 1]`; spring for counters.
* **Reduced Motion:** respect OS `prefers-reduced-motion`; provide non‑animated equivalents.

**Page Transitions**

* Route‑level crossfade + subtle parallax of header (8–12px). Preserve scroll positions on in‑page nav.

**Loading States**

* **Skeletons** for cards/tables (1200ms shimmer loop).
* **Optimistic UI** where safe (filters/search); spinners only for <500ms edge cases.

**Hover/Focus Effects**

* Buttons/links: 2–4px shadow lift + slight scale (1.01) on hover; clear 2px focus ring.

**Data‑Viz Animations**

* Lines: draw‑in from left (240ms) with eased y‑interpolation; bars: staggered 20ms each.
* Tooltip fade/slide 120ms; emphasize data point with 1.03 scale pulse.

**Forms**

* Floating labels; inline validation on blur; error shake (subtle x: 2–4px) max once.

**Buttons**

* Micro‑press ripple (Lottie) for primary CTAs; loading replaces label with spinner + progress dot.

**Scroll‑Reveal**

* Sections reveal at \~15% viewport; stagger children 40ms; disable when reduced motion.

**Modals/Sheets**

* Backdrop fade 160ms; panel slide/scale 200–240ms; focus trapped, escape to close.

---

## 5) Dashboard Components (MVP Set)

**Navigation**

* Collapsible **sidebar** with section groups; flyout on hover when collapsed.
* **Top bar**: search (⌘K), notifications, theme toggle, avatar menu.

**Data Cards (KPIs)**

* Animated counters (spring), delta badges (▲▼) with semantic color, mini‑sparklines.

**Charts & Graphs**

* Time‑series (line), categorical (bar), composition (stacked), distribution (box/violin mock via custom).
* Zoom/pan on time‑series; brush for range selection; downloadable PNG/CSV.

**Tables**

* Virtualized rows, sticky headers, sortable/filterable columns, column pinning, column density switch.
* Row expansion for detail; inline editing (demo‑safe).

**Filters**

* Query pills (removable), saved views, multi‑select with search, date range presets (Last 7/30/90 days).

**Search**

* Global command palette (⌘K) with entities (Accounts, Users, Tickets). Instant, fuzzy.

**Notifications**

* Toasts (sonner) + in‑app inbox with read/unread; rate‑limited to avoid spam.

**User Profile**

* Preferences panel (theme, density, language placeholder), 2FA indicator, session list.

**Guided Tour (Demo)**

* Stepper overlay highlighting key cards and interactions; restartable.

---

## 6) Performance Requirements

**Performance Budgets (production builds)**

* **JS (initial route):** ≤ **180KB** gzip; **Images:** ≤ **100KB** total above‑the‑fold.
* **LCP:** ≤ 1.8s on Fast 3G emulation (Moto G4 class); **INP:** ≤ 100ms; **CLS:** ≤ 0.1.
* **FPS:** 60 with dropped frames <1% during chart updates and modal open/close.

**Techniques**

* Route‑level code splitting; critical CSS inlined; dynamic import for heavy charts.
* Image optimization (Next/Image); Lottie compressed; request bundling via TanStack Query.
* Virtualize long lists; prefetch on hover; cache‑first for demo datasets.

**Accessibility (WCAG 2.1 AA)**

* Logical tab order; visible focus rings; ARIA labels for interactive elements.
* Color contrast pass; keyboard‑operable charts (focusable data points + summary table).
* Skip links; screen‑reader only summaries for complex visuals.

**SEO (for demo pages)**

* Descriptive titles/meta, Open Graph, JSON‑LD for breadcrumbs; clean URLs; sitemap (optional).

---

## 7) Demo‑Specific Features

* **Sample Data:** Realistic but anonymized datasets (Accounts, Users, Plans, Events, Tickets). Variants for “healthy” vs “at‑risk” scenarios; seeded and resettable.
* **Interactive Elements:** All KPIs, filters, charts, and table actions are clickable; zero dead ends.
* **Persona Switcher:** Toggle between **Executive**, **PM**, **Ops**; adjusts spotlight cards & copy.
* **User Flows (scripted):**

  1. Business Overview → revenue trend → churn drilldown → cohort detail → export.
  2. Incident Triage → alert → SLA dashboard → ticket backlog table → mitigation modal.
  3. Growth Funnel → campaign ROI → feature adoption → saved view → share link.
* **Error States:** network retry banners, empty states with guidance, permissions (mock) disabled state.
* **Success States:** confetti/sparkle Lottie for key actions (save view, export).
* **Demo Mode Overlay:** discreet watermark, **Reset Data** button, optional auto‑advance for talks.

---

## 8) Quality Assurance

**Cross‑Browser**

* Chrome, Safari, Firefox, Edge — latest two versions; specific Safari checks for scroll/animation.

**Device Matrix**

* **Desktop:** 1440×900, 1920×1080, 2560×1440.
* **Tablet:** iPad (Split View), Android 10” class.
* **Mobile:** iPhone 13 Mini/15 Pro, Pixel 6/7.

**Performance Testing**

* Lighthouse CI thresholds (LCP/INP/CLS), Web Vitals tracking; RAF frame budget profiling on animated screens.
* CPU throttling ×4 & network throttling (Fast 3G) for worst‑case validation.

**UX & Accessibility Testing**

* Keyboard path audits; VoiceOver/NVDA spot checks; axe automated scans in CI.
* 5‑user hallway test on scripted flows; success criteria: task completion ≤ 5 minutes, SUS ≥ 80.

**Design Review**

* Motion spec adherence, token usage, iconography consistency, spacing grid checks.

**Test Automation**

* **Unit:** Vitest + RTL; **E2E:** Playwright (key flows + visual regression on KPIs).
* **A11y:** jest‑axe/axe‑playwright gates.

---

## 9) Deliverables

* **Source Code:** TypeScript/Next.js monorepo with clear module boundaries; commit hooks and CI.
* **Design Assets:** Figma library (tokens, components, motion specs), icons, Lottie files.
* **Documentation:**

  * Quickstart (dev + demo data), environment variables, scripts.
  * Component stories (Storybook) and usage guidelines.
  * Data model & seeding guide; demo script and persona notes.
* **Demo Environment:** Hosted preview URL (password‑protected), data reset endpoint, feature flags.
* **Style Guide:** Visual + motion language, accessibility checklist, copy tone & microcopy patterns.
* **Recording:** 2–3 minute highlight reel (optional) for asynchronous sharing.

---

## 10) Success Criteria (Acceptance)

* **Visual Impact:** Stakeholders rate ≥ 9/10 on aesthetics & brand fidelity; motion feels “alive” not “flashy.”
* **Smooth Performance:** All animated interactions hold 60fps on test matrix; performance budgets met.
* **User Experience:** Scripted journeys are intuitive; no dead ends; helpful empty/error states.
* **Demo Readiness:** Hosted environment available; reset works; demo script included; persona switcher functional.
* **Scalability:** Codebase modular; adding a new KPI or chart type requires ≤ half a day.

---

## Appendix A — Information Architecture (Routes)

* `/` Overview
* `/revenue`
* `/churn`
* `/operations`
* `/funnel`
* `/settings`

## Appendix B — Repo Structure (Illustrative)

```
apps/web
  ├─ app/                       # App Router
  ├─ components/                # UI primitives & composition
  ├─ features/                  # Domain slices (revenue, churn, etc.)
  ├─ data/                      # seeds, mock APIs (MSW)
  ├─ lib/                       # utils (charts, date, format)
  ├─ styles/                    # tailwind.css, tokens
  ├─ tests/                     # unit + e2e
  └─ .github/workflows          # CI
```

## Appendix C — Risks & Mitigations

* **Safari animation quirks:** early device testing; polyfills where needed.
* **Chart performance on older devices:** virtualization, simplified traces for mobile.
* **Scope creep on interactions:** motion spec frozen end of Week 3; change control thereafter.
* **Data realism:** seeded generators with industry‑plausible distributions; review with SME.

## Appendix D — Tooling Versions (at sign‑off)

* Node LTS; Next.js (latest LTS); React 18; TypeScript latest stable; Tailwind v3; shadcn/ui current; Framer Motion v**latest**; Recharts v**latest**; Playwright v**latest**.

---

### Final Notes

This brief intentionally favors **bold, polished motion** with **production‑grade performance**. We avoid heavy patterns (e.g., Redux, bespoke CSS frameworks) in favor of focused libraries that produce a premium, demo‑ready experience quickly and reliably.
