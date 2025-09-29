# Architecture Blueprint — PropWise

## System Context
- **Clients:** Next.js web app (org admins, tenants) served via React App Router.
- **Backend:** FastAPI service orchestrating authentication, tenant/payments/tickets CRUD, AI summary, reporting.
- **Data Layer:** PostgreSQL 15 with RLS enforcing column-based tenancy (`org_id`).
- **Evidence & Automation:** Workflow automation scripts for coverage, performance, dependency scanning, and submission pack assembly.

```
[Next.js UI] ⇄ [FastAPI API] ⇄ [Postgres]
                     ↘ audit logs / metrics → [Evidence & Metrics Store]
```

## Deployable Units
| Component | Tech Stack | Key Responsibilities |
| --- | --- | --- |
| Web Frontend | Next.js 14, TypeScript, Tailwind, React Query | Dashboard UX, auth flows, tenants/payments/tickets management, AI summary visualization, report triggers. |
| API Service | FastAPI, Pydantic, SQLAlchemy, JWT | Auth, tenancy enforcement, domain APIs, AI summary computation, PDF report orchestration, audit logging. |
| Database | PostgreSQL 15 | Multi-tenant schema, RLS policies, seeds, reporting queries, audit log retention. |
| Background Jobs | FastAPI tasks + Celery-ready hooks (future) | Generate monthly PDFs, schedule AI summaries, send notification stubs. |
| Observability Stack | Structured JSON logs, metrics exporter, audit evidence | Request tracing, latency metrics, compliance artifacts. |

## Domain Modules & Interactions
1. **Authentication Module**
   - Validates credentials, issues JWT with `org_id`, `role`, expiry.
   - Refresh token flow stored in Postgres for revocation control.
   - Injects org context into FastAPI dependencies for downstream handlers.
2. **Tenancy Module**
   - Repository layer enforces `org_id` filters.
   - Admins flagged with `role=org_admin`; tenants restricted to their user ID.
   - Super admin bypass uses dedicated policy with audit trail entry.
3. **Operations Module (Tenants, Units, Payments, Tickets)**
   - CRUD endpoints orchestrate validations, call repositories, and emit audit events.
   - Payment aggregations power KPI cards and monthly rent trends.
   - Ticket service manages assignment status machine and comment stubs.
4. **Analytics & AI Module**
   - Aggregates payment/ticket metrics; produces deterministic JSON summary.
   - Heatmap data sourced from fixture file to support dashboard visualization.
   - Flags control feature availability; evidence captured when disabled.
5. **Reporting Module**
   - Generates Markdown from summary data, converts to PDF (WeasyPrint or similar).
   - Stores output under organization-specific path and surfaces metadata to frontend.
6. **Audit & Compliance Module**
   - Middleware intercepts mutating requests, writes entries to `audit_log` table.
   - Evidence writer stores gate outputs (coverage, perf, dependency, compliance logs).

## Data Flow Highlights
1. **Dashboard Load**
   - Next.js fetches `/auth/refresh` to renew token, then `/tenants/summary`, `/payments/summary`, `/tickets/summary` endpoints.
   - API queries Postgres using `org_id`; results cached for AI summary reuse.
   - Frontend renders KPI cards, charts, heatmap fixture, and automation panel.
2. **Tenant Creation**
   - UI posts to `/tenants`; FastAPI validates against `org_id`, writes to `tenant` table, logs audit entry.
   - Notification stub logs event for future provider.
3. **AI Monthly Summary**
   - Cron or manual trigger hits `/ai/summary`; FastAPI aggregates metrics, stores JSON in table, updates automation panel status.
   - Summary appended to monthly PDF generation queue.
4. **Report Generation**
   - Admin triggers `/reports/monthly`; backend composes Markdown using template, converts to PDF, stores artifact path; audit log records action.

## Security & Compliance Controls
- **Authentication:** JWT with HS256 signing using `JWT_SECRET`; tokens include `org_id`, `role`, `exp`.
- **Authorization:** FastAPI dependencies decode token and enforce org-level filters; decorators guard admin-only routes.
- **Row-Level Security:** Enabled on tenant, payment, ticket, audit_log tables; policies validated in tests.
- **Audit Trail:** Immutability enforced via append-only table and DB triggers preventing updates/deletes.
- **Secrets Management:** `.env.example` documents required env vars; actual secrets managed by deployment platform (out of scope for Phase 1).
- **Evidence Capture:** `evidence/` directory stores stack selection, compliance logs, validate_tasks output.

## Deployment Topology
- **Local Dev:** Docker Compose orchestrates `web`, `api`, `db`. Lint/test tasks available via `Makefile`.
- **CI Hooks:** `install_and_test.sh` drives dependency installs; `collect_*` scripts gather metrics; `make workflow-automation` enforces gates.
- **Scalability Considerations:** Future horizontal scaling by separating API worker from background worker, enabling Postgres read replicas for reporting.

## Open Questions / Follow-ups
- Evaluate adoption timeline for real email provider integration.
- Confirm PDF generator choice (WeasyPrint vs. external service) during Phase 2.
- Determine retention period for audit logs and reports (default 12 months unless specified).
- Align AI summary tone/content with PropWise branding guidelines.
