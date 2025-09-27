---
name: "ray-portfolio"
industry: "enterprise"  
project_type: "web"
frontend: "nextjs"
backend: "none"
database: "none"
auth: "none"
deploy: "vercel"
features: "portfolio,dashboards,animations,framer-motion,tailwind,recharts"
compliance: "accessibility,performance"
---

1) Overview (one-liner)

Build this exact site — Next.js 15 (App Router) + React 19 + TypeScript + Tailwind + Framer Motion. Production-ready personal portfolio for Ray with 6 interactive, fullscreen demo dashboards (mock data), strict accessibility, high-motion polish, and Lighthouse performance targets.

2) Core tech & repo setup

Frameworks: Next.js 15 (App Router), React 19, TypeScript.

Styling: Tailwind CSS (no other CSS frameworks).

Animation: Framer Motion only (respect prefers-reduced-motion).

UI primitives: Radix UI, shadcn/ui (optional for primitives).

Charts: Recharts (primary), optional D3 for micro bits.

Lint/Format/Test/CI: ESLint, Prettier, Strict TS, Vitest (units), Playwright (E2E). GitHub Actions: lint → typecheck → unit → build → Lighthouse CI (budget gates) → preview deploy.

Security: Strict CSP, security headers (X-Content-Type-Options, Referrer-Policy=strict-origin-when-cross-origin, Permissions-Policy).

Images: next/image, lazy-load below the fold.

Performance budgets: main route JS ≤ 180KB gz (charts lazy-loaded); LCP ≤ 2.0s; CLS ≤ 0.03.

3) Brand tokens & layout

Colors

--navy: #0b1220;
--panel: #0f172a;
--ink: #eef2f7;
--accent: #FFC62E;
--muted: #7f8ca2;
--glass: rgba(10,15,25,0.6);


Typography: Inter (or similar). Headings bold; body sleek.
Grid & spacing: 12-column grid, 8px rhythm, content max-width 1200px.
Panel chrome: 1px border #162036; inset highlight inset 0 1px rgba(255,255,255,.04).
Hero background: /assets/hero-mountains.jpg (dusk mountain), dark overlay + subtle star specks.

4) Global motion tokens

Respect prefers-reduced-motion.

spring.snappy = { type: "spring", stiffness: 420, damping: 34 }
spring.soft   = { type: "spring", stiffness: 260, damping: 28 }
fadeUp        = { initial:{opacity:0,y:16}, animate:{opacity:1,y:0,transition:{duration:0.4}} }
durations: { fade: 0.24, overlay: 0.28, staggerChild: 0.06 }
shared-element layoutId: "demo-{id}"

5) Header / Nav

Left: circular SVG logo (minimal) + Ray (bold white).

Right nav: Home, About, Resume, Portfolio, Blog, Contact (smooth-scroll; Resume/Blog stub links allowed).

Far right: phone accent pill +1 971 234 1508 (accent yellow). Tel copy action.

Behavior: sticky header, glass blur (backdrop-blur-md), border #162036, hover underline via Framer (spring). Scrollspy with underline; offset 80px. Mobile: Radix Sheet, swipe-to-close, trap focus.

6) Hero (exact copy + styling)

Headline: Hi, I am <Ray> — Ray highlighted in --accent with subtle glow gradient.
Subtext (exact, multi-line, max width 680px):

“All communication will be handled in writing to give you a clear, time-saving advantage: every detail is fully documented (so nothing is ever missed), every update is accessible anytime (so you don’t waste time repeating discussions), and every step is transparent (so you’re always in control). This structured system isn’t just more efficient—it’s the safest way to protect your project and guarantee smooth delivery from start to finish.”

Social icons (centered): Facebook, Twitter, GitHub — outline buttons, soft hover scale.
Background: /assets/hero-mountains.jpg + dark navy overlay + star specks; gentle parallax.

7) About

Left: grayscale portrait (placeholder allowed).

Right content:

Title: Hi There! I’m Ray

Subtitle: Full-Stack Systems Builder

Description (exact):

“I build software that doesn’t stop at code. Every project I deliver comes with its own scaffolding — automated tests, deployment flows, security checks, and compliance rules — so the moment it lands, it’s already running as a complete system. No extra setup, no fragile handoffs, just a foundation built to grow without breaking.”

Details list: Email raydevex@gmail.com, Languages: English, Tagalog, Freelance: Available. Optional phone/location placeholders allowed.

CTA: Download CV (centered yellow button) — press ripple, keyboard focus ring.

8) Portfolio / Services (6 interactive demo cards)

Grid: 6 cards, interactive. Each card opens a fullscreen dashboard modal with a shared-element transition (Framer layoutId). Card interactions: hover lift y-6 + subtle tilt, accent focus ring, focusable.

Cards (title + tagline):

SaaS Platform — Multi-tenant KPIs & usage analytics

E-commerce Store — Sales funnel, AOV, cohort retention

Corporate Dashboard — OKRs, team throughput, risk heatmap

Custom App — Automation runs, queue health, SLA tracker

Media Hub — Content performance, watch time, CPM

Education/Niche Solution — LMS progress, quiz stats, churn

9) Fullscreen Dashboard — Shared requirements (applies to all six)

Modal

Portal to body, backdrop blur, spring scale-up, content fade-in.

Shared-element layoutId="demo-{id}" from card → modal.

Close: Esc to close; top-right close button (≥40px target), trap focus; announce open/close via aria-live="polite". On close, focus returns to originating card.

Accessibility: role dialog, labelled, SR summary region for charts.

Keyboard: Esc, tab loop, legend toggle keyboard focusable, Cmd/Ctrl+K opens command palette with filter commands.

Top bar: Title • date-range selector (7/30/90/Custom) • quick filters (chips with counts) • search • export (CSV/PNG) • share (deep link w/ URL query state) • reset filters.

Content:

Stat tiles: 3–5 (numeric with tabular-nums, delta chip ▲/▼, tiny sparkline).

Charts: 2 charts (mix of Recharts Area/Line/Bar/Pie).

Table: paginated, column-sortable, virtualized (10k ready).

Interactions: filters update charts live (local mock data), tooltips, legend toggle (Alt to solo), brush-to-zoom, cross-filtering (click to add/remove chip), drilldown (double-click stat → filter table).

Presets: 7/30/90d. Legend toggle; tooltips with Δ vs previous period.

Performance targets: first chart render ≤ 50ms; filter update ≤ 80ms (mock data, memoized).

Visual polish: soft grid, subtle 3D shadows, counters animate 0→value (~600ms), springy chart mount.

States: loading (shimmer/skeleton), empty (icon + helper line), error (inline alert with retry), no access (greyed controls + tooltip).

Exports & share: CSV exports table with current filters; PNG exports active chart; deep links reproduce identical state via URL query.

10) Dashboards — per-card concrete layout summary (kept concise)

Each card follows shared requirements; only unique layout and key KPIs below.

1) SaaS Platform

Row1: 4 KPI tiles (MRR, Churn %, ARPU, Activation %).

Row2: Area (DAU/WAU/MAU, 8 cols) + Bar (Signups→Activations, 4 cols).

Row3: Table (account, plan, seats, lifetime_value, last_active).

Facets: Plan [Free, Pro, Enterprise], Region, Device.

Enterprise: per-tenant expand row.

2) E-commerce

Row1: 5 KPI tiles (CR%, AOV, CAC, ROAS, RPV).

Row2: Funnel viz full width.

Row3: Line (AOV, 7 cols) + Bar (ROAS by Channel, 5 cols).

Row4: Cohort heatmap.

Facets: Channel [Paid, Organic, Referral], Country, Device.

3) Corporate

Row1: KPIs (On-track %, Cycle time, WIP, Blockers).

Row2: Stacked Bar (OKR progress, 7 cols) + Risk heatmap (5 cols).

Row3: Table: objectives (objective, key_result, owner, confidence, due, risk).

4) Custom App

Row1: 4 KPI (Success %, P95 latency, Retries, SLA breaches).

Row2: Line (queue depth, 8 cols) + Area (throughput/min, 4 cols).

Row3: Table jobs (job_id, workflow, status, latency_ms, retries).

Enterprise touches: live pulsing dot for recent jobs; latency histogram drawer.

5) Media Hub

Row1: 5 KPI (Impressions, CTR, Avg view %, Subs gained, CPM).

Row2: Line (watch time, full width).

Row3: Bar (CPM by channel) + Pie (content type share).

Row4: Table assets (asset, channel, views, watch_time, ctr, cpm).

6) Education/Niche

Row1: KPIs (Completion %, Avg score, DAU, Churn %, Tickets).

Row2: Area (course completion, 8 cols) + Pie (quiz pass rate, 4 cols).

Row3: Table learners (student, course, progress_%, last_login, score).

Enterprise touches: churn risk tag if stalled >14 days; student timeline drawer.

11) Skills section (compact, animated)

Default: all categories collapsed; up to 3 categories can be open simultaneously (soft cap). LocalStorage remembers open state.

UI: category rows show name + percent + tiny progress indicator; expand reveals items with fadeUp staggered.

ProgressBars: white track, yellow fill, percent label right-aligned; width animated via spring.soft.

Animation: smooth height with Framer (height: auto trick via AnimatePresence), respects reduced-motion.

Exact categories & order (with %):

Frontend Development (95%) — list items (Next.js 15 + React 19 & TypeScript; Tailwind; Radix; Framer; GSAP; Recharts; D3; Zustand; SWR; TanStack Query; 3D/Lottie; Server Components; Performance; A11y).

Backend Development (90%) — FastAPI 3.11+, Pydantic; PostgreSQL; SQLAlchemy 2.0; Auth; REST/OpenAPI; Redis/Celery; Security; pytest; RBAC.

DevOps & Infrastructure (85%) — Docker, CI/CD, monitoring, AWS-ready.

Project Generation & Automation (92%) — scaffolding, templates, brief-to-code pipeline, compliance automation.

Enterprise Architecture (88%) — multi-tenant, microservices, analytics, AI integration.

Technical Leadership (92%) — system design, mentoring, delivery.

Specialized Capabilities (90%) — brief analysis, compliance engineering, workflow orchestration, QA frameworks.

12) Footer

Dark navy background, centered social links, minimal copyright.

13) Data & mocking

Types (file: /lib/dashboards.ts):

export type Stat = { label: string; value: number; delta?: number };
export type Series = { date: string; value: number }[];
export type Dashboard = { title: string; stats: Stat[]; series: Series; table: Array<Record<string, string|number>> };


Series: up to 90 pts; 2–3 series per chart.

Table: 80–120 rows; client-side pagination (10/20/50).

Filters and all state local-only (no network). Memoize selectors; pre-aggregate per filter dimension.

14) Components (key)

Header.tsx — sticky glass nav, phone pill.

Hero.tsx — headline, exact subtext, social icons, background parallax.

About.tsx — portrait + description + Download CV.

DemoCard.tsx — card with layoutId for shared-element.

FullscreenModal.tsx — portal, backdrop blur, focus trap, Esc close, ARIA.

DashboardShell.tsx — top bar, filters, stats, charts, table.

ProgressBar.tsx — animated progress.

Skills.tsx — animated accordions.

CommandPalette.tsx — keyboard filter commands (Cmd/Ctrl+K).

ExportHelpers.ts — CSV/PNG exports respecting filters.

lib/dashboards.ts — typed mock data.

Utilities: memoized selectors, formatters (Intl.NumberFormat), deep-link (serialize/parse URL query).

15) Recharts / Visual rules

Axis ticks: 12px Inter, rgba(238,242,247,.72). Grid: rgba(127,140,162,.22).

Lines: strokeWidth=2, dot=false. Areas: gradient to rgba(255,198,46,.18).

Bars: radius [6,6,0,0], barCategoryGap 28%, maxBarSize 28.

Tooltip: compact, tabular-nums, show Δ vs prev period.

Legend: pill badges, keyboard focusable, aria-pressed.

16) Accessibility & QA

A11y: semantic HTML, visible focus rings, aria-labels/roles, SR summaries for charts, view-as-table toggle on charts.

Keyboard: full nav, modal trap, Esc closes, Cmd/Ctrl+K command palette, legend toggles via keyboard.

Testing: Playwright E2E (modal a11y, keyboard loop, filters). Vitest unit tests for components.

Acceptance criteria (must pass):

Skills collapsed by default; expand animates correctly.

Six dashboards open fullscreen via shared-element; close returns focus to card.

Layout/spacing pixel-consistent across breakpoints.

Keyboard + screen reader flows fully supported.

Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.

No CLS on modal open; main route JS ≤ 180KB gz (charts lazy).

First chart render ≤ 50ms; filter update ≤ 80ms (mock data).

17) Delivery & acceptance

Deliverable: full Next.js app (App Router) with components, assets, typed mock data, CI config, tests, and E2E checks. Clean, typed, production-ready; polished motion; passes the acceptance criteria above.

18) Exact content / copy (quick reference)

Name: Ray

Email: raydevex@gmail.com

Phone (header pill): +1 971 234 1508

Navigation: Home, About, Resume, Portfolio, Blog, Contact

Hero subtext: (use exact multi-line copy from §6 hero)

About description: (use exact copy from §7 About)