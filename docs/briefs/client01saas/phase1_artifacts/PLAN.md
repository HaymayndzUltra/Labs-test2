# PLAN — PropWise

Industry: saas | Type: fullstack | Frontend: nextjs | Backend: fastapi

## Lanes

### Lane: backend
- [BE-SCHEMA] Define multi-tenant Postgres schema with `org_id` column strategy and referential integrity.
- [BE-RLS] Author row-level security policies and FastAPI dependency guards for org scoping.
- [BE-SEEDS] Implement minimal seed loaders covering organizations, users, units, payments, tickets.
- [BE-AUTH] Deliver JWT login/register endpoints with password hashing and token refresh.
- [BE-TENANTS] Build tenant/unit CRUD endpoints with pagination and search filters.
- [BE-PAYMENTS] Expose payment ingestion/listing APIs plus overdue detection and balance summaries.
- [BE-TICKETS] Provide ticket CRUD, assignment workflow, and status transition auditing.
- [BE-AI] Implement `/ai/summary` rules-based generator drawing from payment/ticket aggregates.
- [BE-AUDIT] Capture audit events to `audit_log` table with actor, entity, payload snapshot.
- [BE-REPORT] Generate monthly PDF report pipeline referencing `templates/org_summary.md`.

### Lane: frontend
- [FE-SHELL] Establish Next.js App Router layout, navigation, and shared context providers.
- [FE-AUTH] Implement login/register views with JWT handling and route guards.
- [FE-DASHBOARD] Render KPI cards, charts, and heatmap using bound APIs/fixtures.
- [FE-TENANTS] Build tenants and units management tables with scoped filters and forms.
- [FE-PAYMENTS] Create payments views highlighting overdue balances and collection trends.
- [FE-TICKETS] Implement maintenance ticket board/detail views with comment thread stub.
- [FE-NOTIFY] Wire notification preferences stub and email trigger placeholder.
- [FE-REPORT] Surface monthly report download trigger and status indicators.
- [FE-TEST] Author smoke/e2e tests covering auth, dashboard load, tenant isolation.

### Lane: platform & compliance
- [PL-ENV] Produce `.env.example`, Docker Compose, and runtime scripts reflecting brief env.
- [PL-OBS] Configure structured logging, request IDs, and basic metrics exporters.
- [PL-TESTS] Harden automated test suite with coverage thresholds ≥80% and perf harness.
- [PL-GATES] Configure dependency scan, coverage, and performance gates per PropWise policies.
- [PL-COMPLIANCE] Compile evidence pack (PRD, ARCHITECTURE, audit log proof, acceptance tests).

## Milestones
1. **Planning Complete** — Backend schema, RLS, and seeds designed (`BE-SCHEMA`, `BE-RLS`, `BE-SEEDS`).
2. **Core Functionality** — Auth, tenants, payments, tickets APIs + UI flows operational.
3. **AI & Reporting Ready** — `/ai/summary` stub, audit logging, and PDF report generation validated.
4. **Compliance Gate** — Tests, metrics, and documentation assembled; gates passing at ≥80% coverage and ≤300 ms P95.

## Conflicts & Guardrails
- Enforce RLS on every table and verify via automated tests before exposing APIs.
- Maintain separation between org admin and tenant roles in both API and UI flows.
- Preserve audit log immutability—writes only via backend service layer.
- Keep `ENABLE_AI` toggle-driven; summary endpoint must degrade gracefully when disabled.
- Docker required for local parity; document engine gap if container runtime unavailable.
