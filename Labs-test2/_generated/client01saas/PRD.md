---
signoff_stage: PRD + Architecture OK
signoff_approver: lifecycle-automation
signoff_timestamp: 2025-09-28T07:51:17Z
---

# PRD: PropWise Multi-tenant SaaS

## 1. Overview
- **Business Goal:** Deliver a full-stack property operations dashboard that consolidates tenants, rent, maintenance, and analytics for multi-organization management teams.
- **Industry Alignment:** Real estate SaaS with column-based multi-tenancy and audit controls.
- **Project Type:** Next.js frontend + FastAPI backend + Postgres (prototype profile with documented FE build skips).
- **Success Metrics:** Dashboard renders seeded KPIs, coverage ≥80%, P95 latency ≤300 ms, zero high-severity dependency issues, AI summary reachable without LLM dependency.

## 2. Personas & Journeys
- **Org Admin:** Signs in, reviews dashboard KPIs, views tenants, tracks overdue payments, triages tickets, downloads monthly PDF report.
- **Tenant:** Primarily interacts via ticket submission (future iteration), but current scope ensures their data is isolated and visible to admins.
- **Platform Super Admin:** Out-of-scope UI; relies on audit logs and RLS policies built into backend.

## 3. Functional Requirements
1. **Authentication & Authorization**
   - JWT login issuing PBKDF2-verified tokens with `org_id` + `role` claims.
   - Frontend stores token client-side, guards protected pages, and surfaces login errors.
2. **Dashboard**
   - KPIs: total tenants, occupied units, overdue payments, open tickets (SQL-backed metrics).
   - Charts: rent collection trend, ticket closure rate; heatmap seeded via fixture; automation panel summarizing follow-ups.
3. **Directory & Ledgers**
   - `/tenants`: org-scoped list with contact info, unit assignment, created date.
   - `/payments`: ledger sorted by due date, outstanding total banner, status badges.
4. **Maintenance Operations**
   - `/tickets`: queue with severity, vendor assignment, quick link to detail view.
   - `/tickets/[id]`: detail view with metadata and history timestamps.
5. **Reports & AI**
   - `/reports`: request monthly PDF (manual trigger) and run rules-based AI summary returning highlights + automation opportunities.
6. **Seeds & Fixtures**
   - Minimal dataset matching brief (two orgs, seeded admin, tenants, payments, ticket, analytics fixture).
7. **Audit & Notifications**
   - Audit logs recorded for tenant/payment/ticket writes.
   - Notification service stub ready for later integrations.

## 4. Technical & Compliance Requirements
- **Multi-Tenancy:** Column-based `org_id` with dependency `get_request_org_id` enforcing scope; tests validate access denial cross-org.
- **Security:** PBKDF2 hashing, JWT expiry, FastAPI dependencies verifying active user; `security_fail_on: high` enforced by gate scripts.
- **Performance:** `collect_perf.py` must record ≤300 ms P95 (prototype data set) before gates run.
- **Prototype Skip Policy:** FE installs/build/tests may be skipped when environment blocks SWC; compliance report must note skips and confirm manual QA coverage.
- **Evidence:** Coverage, perf, security scan artifacts stored under `metrics/` and `evidence/` plus submission bundle with manifest + checksums.

## 5. Out of Scope / Future Enhancements
- Tenant self-service flows (ticket submission portal) beyond viewing seeded data.
- Automated notifications delivery (stub only in this release).
- Billing module intentionally skipped per optional modules directive.
- Advanced observability (basic logging only).

## 6. Acceptance Criteria
- Authenticated admin navigates across dashboard, tenants, payments, tickets, reports without runtime errors.
- Dashboard and reports reflect seeded data per SQL/data bindings.
- AI summary endpoint reachable via FE button and returns deterministic rules-based payload.
- PDF download returns non-empty file with org/month metadata.
- Pytest coverage ≥80% with auth + RLS tests; gates log success.
- Compliance report lists FE build/test skips and prototype rationale.
