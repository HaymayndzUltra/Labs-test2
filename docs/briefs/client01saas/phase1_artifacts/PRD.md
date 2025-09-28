---
signoff_stage: PRD + Architecture OK
signoff_approver: lifecycle-automation
signoff_timestamp: 2025-09-28T18:59:38Z
---

# PRD: PropWise (client01saas)

## 1. Overview
- **Mission:** Deliver a multi-tenant property operations dashboard for property management companies with auditability, analytics, and AI-powered monthly insights.
- **Primary Outcomes:** Centralized visibility into tenants, units, payments, and maintenance tickets; automated monthly PDF summary per organization; enforceable audit trail and RLS isolation.
- **Success Criteria:**
  - `docker compose up --build` boots API, web, and Postgres containers.
  - Dashboard loads with seeded data for sample organizations.
  - JWT-authenticated roles (org admin vs tenant) observe scoped data only.
  - `/ai/summary` returns deterministic JSON within ≤300 ms P95 after warm cache.
  - Coverage ≥80% and zero critical/high dependency vulnerabilities.

## 2. Target Users & Personas
| Role | Needs | Notes |
| --- | --- | --- |
| **Super Admin** | Cross-org health monitoring, override support | Internal PropWise staff only. |
| **Org Admin** | Manage units, tenants, payments, tickets; review monthly summaries | Primary user; cannot view other org data. |
| **Tenant** | Submit/view maintenance tickets, view balance | Mobile-friendly flows prioritized. |
| **Vendor (Future)** | Ticket assignment visibility | Stubbed notifications only. |

## 3. Functional Requirements
### 3.1 Authentication & Authorization
- JWT auth with login/register; tokens embed `org_id` and role.
- Org admins manage tenants, units, payments, tickets for their org.
- Tenants limited to their tickets and balance view.
- Super admin can list organizations and impersonate for support (audit logged).

### 3.2 Dashboard & Analytics
- `/dashboard` renders KPI cards (total tenants, occupied units, overdue payments, open tickets).
- Charts: rent collection trend, ticket closure rate (monthly granularity).
- Student activity heatmap sourced from fixture `analytics/student_activity.json`.
- Automation orchestration panel summarizing AI summary status and upcoming reminders.

### 3.3 Tenant & Unit Management
- CRUD endpoints and UI for tenants, units, and buildings.
- Tenant creation auto-associates to unit and organization, sending stubbed notification.
- Validation for unique tenant email per organization.

### 3.4 Payments & Billing Insights
- Payments list with filters for overdue/current.
- Overdue badge indicates days outstanding and amount.
- Backend aggregates for monthly rent collection trend.
- Balance summary for organization displayed on dashboard.

### 3.5 Maintenance Tickets
- Ticket list with status tabs (Open, In Progress, Closed).
- Ticket detail page `/tickets/[id]` includes history, assignment, and comment stub.
- Admin actions (assign vendor, close ticket) audit logged with timestamp and actor.

### 3.6 AI Monthly Summary
- `/ai/summary` FastAPI endpoint composes rules-based insights using payment and ticket metrics.
- Flag `ENABLE_AI` toggles access; UI surfaces status when disabled.
- Summary JSON stored for report generation and accessible via dashboard panel.

### 3.7 Audit Trail & Reporting
- Audit log entry created for CRUD actions across tenants, payments, tickets, auth events.
- Monthly PDF report generated from `templates/org_summary.md` with KPIs, AI highlights, and outstanding tasks.
- Reports accessible for download by org admins; history retained for each org.

### 3.8 Notifications (Stub)
- Email notification stub triggers on overdue payments and new tickets.
- Logging demonstrates invocation; integration hooks documented for future provider (SES/SendGrid).

## 4. Non-Functional Requirements
- **Performance:** P95 for dashboard and summary endpoints ≤300 ms under seeded load.
- **Security:** PBKDF2 password hashing, HTTPS assumed behind reverse proxy, JWT expiry & refresh handled.
- **Reliability:** Seeds ensure initial orgs/users; health check endpoint returns dependencies status.
- **Compliance:** Audit evidence stored under `evidence/`; workflow automation enforces gates.
- **Observability:** Structured JSON logs, correlation IDs, minimal metrics exporter for latency and error rates.

## 5. Data Model Highlights
- Tables: `organization`, `building`, `unit`, `tenant`, `payment`, `ticket`, `user`, `audit_log`.
- Column-based tenancy with `org_id` on scoped tables, indexes on `(org_id, status)` for payments/tickets.
- RLS policies: tenants & tickets filtered by `org_id`; super admin bypass policy with `is_super_admin` claim.

## 6. API Surface (FastAPI)
| Endpoint | Method | Description |
| --- | --- | --- |
| `/auth/login`, `/auth/register` | POST | JWT authentication flows. |
| `/tenants`, `/tenants/{id}` | GET/POST/PATCH/DELETE | Tenant CRUD with org scoping. |
| `/units`, `/buildings` | GET/POST/PATCH/DELETE | Inventory management. |
| `/payments` | GET/PATCH | Payment listing and status updates. |
| `/tickets` | GET/POST | Ticket creation and listing. |
| `/tickets/{id}` | GET/PATCH | Ticket detail + assignment actions. |
| `/ai/summary` | GET | Monthly AI summary JSON. |
| `/reports/monthly` | POST/GET | Trigger and retrieve PDF report. |
| `/health` | GET | Service health + dependency status. |

## 7. Frontend Modules (Next.js)
- App Router with shared layout, auth provider, and protected routes.
- Feature directories for dashboard, tenants, payments, tickets, login.
- Component library: `KpiCard`, `TrendChart`, `HeatmapPanel`, `TicketBoard`, `TenantForm`.
- Data fetching via React Query with JWT-aware API client.

## 8. Dependencies & Integrations
- **Database:** Postgres 15 with row-level security.
- **Auth:** Custom JWT service; future SSO noted but out of scope.
- **Notifications:** Console/email stub with interface ready for provider.
- **AI:** Rules-based engine; no external LLM dependency for initial release.

## 9. Risks & Mitigations
- **Docker Missing in CI Environment:** Documented; must be installed before Phase 2 generation.
- **Multi-tenant Data Leakage:** Enforce RLS, add integration tests for org isolation.
- **AI Performance:** Cache metrics per org to sustain ≤300 ms target.
- **Report Generation:** Use templated Markdown → PDF conversion with retry/backoff to avoid timeouts.

## 10. Acceptance Criteria Checklist
- [ ] JWT login + dashboard smoke test passes.
- [ ] Tenant isolation verified via automated test (org admin cannot see other org tenants).
- [ ] AI summary returns expected JSON sample.
- [ ] Audit log captures CRUD events with actor metadata.
- [ ] Monthly PDF generated and downloadable for seeded org.
- [ ] Coverage ≥80% and workflow automation evidence stored in `metrics/` & `dist/`.
