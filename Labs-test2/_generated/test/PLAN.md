# PLAN — PropWise

Industry: real_estate_saas | Type: fullstack | Frontend: nextjs | Backend: fastapi

## Lanes

### Lane: product discovery
- [PD-BRIEF] Translate brief into measurable outcomes (blocked_by: -)
- [PD-JOURNEY] Map core user journeys (admin, tenant) (blocked_by: PD-BRIEF)
- [PD-SCOPE] Lock MVP scope (dashboard, tenants, payments, tickets, reports) (blocked_by: PD-JOURNEY)

### Lane: backend
- [BE-SCHEMA] Finalize multi-tenant schema (organizations, users, buildings, units, tenants, payments, tickets, audit) (blocked_by: PD-SCOPE)
- [BE-AUTH] Implement JWT auth + PBKDF2 hashing + org scoping (blocked_by: BE-SCHEMA)
- [BE-RLS] Enforce request-level org scoping + audit logging (blocked_by: BE-AUTH)
- [BE-SEED] Seed minimal org + sample records per brief (blocked_by: BE-SCHEMA)
- [BE-DASH] Dashboard metrics + analytics services (blocked_by: BE-RLS)
- [BE-TENANTS] CRUD read flow for tenants (blocked_by: BE-RLS)
- [BE-PAY] Payments ledger endpoints + validation (blocked_by: BE-RLS)
- [BE-TICKETS] Ticket queue + detail endpoints (blocked_by: BE-RLS)
- [BE-AI] Rules-based AI monthly summary (blocked_by: BE-DASH)
- [BE-REPORT] PDF report service + endpoint (blocked_by: BE-AI)
- [BE-TEST] Pytest coverage ≥80% with auth + RLS assertions (blocked_by: BE-REPORT)

### Lane: frontend
- [FE-SHELL] App shell, navigation, providers (blocked_by: PD-SCOPE)
- [FE-AUTH] Auth context + login flow (blocked_by: FE-SHELL, BE-AUTH)
- [FE-DASH] Dashboard layout + KPI bindings (blocked_by: FE-SHELL, BE-DASH)
- [FE-TENANTS] Tenant directory table (blocked_by: FE-AUTH, BE-TENANTS)
- [FE-PAY] Payments ledger + status badges (blocked_by: FE-AUTH, BE-PAY)
- [FE-TICKETS] Ticket list + detail view (blocked_by: FE-AUTH, BE-TICKETS)
- [FE-REPORT] Reports page + AI summary trigger (blocked_by: FE-AUTH, BE-REPORT, BE-AI)
- [FE-QA] Smoke validation once installs available (blocked_by: FE-TICKETS, FE-REPORT)

### Lane: operations & compliance
- [OPS-ENV] Propagate env config + docker-compose (blocked_by: PD-SCOPE)
- [OPS-DOCS] PRD, architecture, plan, tasks sync (blocked_by: OPS-ENV)
- [OPS-EVIDENCE] Metrics, coverage, compliance bundles (blocked_by: BE-TEST, FE-QA)
- [OPS-PACK] Build submission pack + validation (blocked_by: OPS-EVIDENCE)

## Conflicts & Guardrails
- Multi-tenant enforcement must work in SQLite for tests and Postgres for production.
- Coverage gate ≥80%, perf P95 ≤300ms, and dependency scan fail on high severity.
- Prototype profile allows FE build skips, but skips must be recorded in compliance report.
- AI module runs rules-based unless OPENAI_API_KEY is provided.

## Next Triggers
- Backend tests/coverage run after report service lands.
- FE smoke validation once npm install works or manual QA is complete.
- Compliance pack generated after gates pass with documented skips.
