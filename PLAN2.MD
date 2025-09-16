Job Post: Full-Stack Dashboard & Analytics Developer

Type: Contract (possible FT)
Location: Remote (PH-friendly)
Start: ASAP

Overview

Kailangan namin ng developer na kayang maglatag ng production-grade dashboards—mula data ingestion hanggang interactive UI—na mabilis, scalable, at secure. Target namin ay ops dashboards, executive KPI boards, customer analytics, at compliance views na may role-based access at auditability.

Core Responsibilities

Design & build dashboards (web/mobile) na may:

Real-time updates (WebSocket/SSE) at cached queries

Drill-down / drill-through / cross-filtering

Saved views, shareable links, and scheduled reports

Data layer & APIs

ETL from DBs/APIs → semantic layer (metrics & dimensions)

Pagination, time-windowing, aggregation, window functions

Row-level security (RLS) + data masking for PII

Performance & DX

p95 latency targets, CDN/ISR, query caching (Redis)

Lighthouse/perf budgets; trace logs & metrics

Security & Compliance

RBAC/ABAC, audit logs, encryption in-transit/at-rest

GDPR/HIPAA/PCI-aware data handling (retention, export/delete)

Quality & Delivery

CI/CD, versioned schema/migrations, smoke tests (E2E/UI)

Clear docs: data contracts, metric definitions, runbooks

What You’ll Build (near-term)

Ops Dashboard: service health, error rates, p95 latency, cost per request

Executive KPI Board: revenue, churn/retention, LTV/CAC, cohort & funnel views

Customer Analytics: product usage, segmentation, feature adoption

Compliance View: access logs, data lineage, export/delete requests status

Target Stack (pragmatic, not dogmatic)

Frontend: Next.js (App Router, TS, Tailwind) / Angular / Nuxt
Charting: Recharts/ECharts/D3; tables: TanStack Table
State: Zustand/Signals/Pinia; Forms: React Hook Form/Angular Forms

Backend: FastAPI / Django / NestJS / Go (Echo)
API styles: REST/GraphQL; background jobs & schedulers

Data: Postgres (+ pgvector), MongoDB, Firebase; ClickHouse/BigQuery (nice-to-have)
Cache/queues: Redis

Auth: Auth0 / Firebase Auth / Cognito (RBAC, MFA, SSO)

Deploy: AWS/Azure/GCP/Vercel; Docker Compose; GitHub Actions

Success Metrics (binary & measurable)

Time-to-first-value: first useful dashboard live within 2 weeks

Performance: dashboard loads ≤ 2s on median; p95 API ≤ 400ms (cached)

Quality: 0 P0 bugs post-release week; E2E smoke passing on CI

Security: 100% protected routes behind RBAC; audit log coverage on sensitive events

Usability: ≥90 Lighthouse Accessibility; no layout shift on key views

Must-Have Qualifications

May na-deliver na end-to-end dashboards (link or demo welcome)

Strong sa isa: Next.js/Angular/Nuxt at sa isa: FastAPI/Django/NestJS/Go

Solid SQL (CTEs, window functions, indexes) at API design

Experience with role-based access, audit logging, and handling PII

CI/CD, Docker, basic cloud deploys

Nice-to-Have

ClickHouse/BigQuery, dbt/semantic layer experience

Realtime (WebSocket/SSE), streaming ingestion

OPA/Rego policy checks, Semgrep/Bandit/Trivy familiarity

Visualization craftsmanship (custom D3, complex interactions)

Deliverables (Milestone 1)

Live dashboard with: global filters, 3–5 core KPIs, 2 drill-down pages

Data contract (metrics.md): definitions, formulas, freshness SLAs

Access control: roles, permissions matrix, admin page for user roles

Observability: request tracing + dashboard event logs

Docs: ARCHITECTURE.md, RUNBOOK.md, SECURITY_NOTES.md