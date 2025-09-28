---
name: propwise
industry: real_estate_saas
project_type: fullstack
frontend: nextjs
backend: fastapi
database: postgres
auth: jwt
deploy: docker
multi_tenant: true
tenancy_model: "column"
billing: none
charts: true
notifications: true
ai_feature: "monthly_summary"
ai_llm_required: false
audit_trail: true
observability: basic
coverage_threshold: 0.8
security_fail_on: "high"
perf_target_p95_ms: 300
---

# PropWise – Property Management Dashboard

## 1. Background
Property management startup serving multiple clients.  
Each **client** = one property management company handling tenants, payments, maintenance.  
Currently managed via Excel sheets; want to consolidate data into one dashboard system.

## 2. Problem Statement
- No unified system → manual tracking, duplicate records.
- No visibility into overdue payments or repair loads.
- No audit trail; no role isolation across orgs.
- Manual rent reminders; no analytics on operations.

## 3. Objective
Create a **multi-tenant dashboard app** that:
- Manages **tenants, units, maintenance requests, payments**
- Displays key metrics per organization
- Allows **tenants** to submit tickets
- Provides **admins** a single dashboard view
- Enforces tenant/company data isolation
- Generates **AI summaries** of issues and finances (rules-based fallback)

## 4. Core Users
| Role | Description |
|------|--------------|
| Super Admin | Platform owner; view all orgs (internal only) |
| Org Admin | Manages buildings, units, tenants, payments, maintenance |
| Tenant | Limited user; submits maintenance requests, views balance |
| Vendor | Optional role; assigned to maintenance tickets |

## 5. Core Features
1. **Dashboard Overview**
   - Cards: Total tenants, occupied units, overdue payments, open tickets
   - Charts: Monthly rent collection %, ticket closure rate
2. **Tenants Management**
   - CRUD tenants, assign to units, view balances
3. **Units & Buildings**
   - CRUD units/buildings; assign tenants
4. **Payments**
   - CRUD rent payments (mock Stripe)
   - Status tracking (paid, overdue, partial)
   - Generate mock receipts
5. **Maintenance Requests**
   - Tenant submits issue (title, desc, priority)
   - Admin assigns to vendor
   - Status: Open → In Progress → Closed
   - Auto reminder for open >7 days
6. **Notifications**
   - Ticket updates, rent reminders (email stub)
7. **AI Monthly Summary**
   - Aggregates monthly metrics (rules-based)
   - Example:
     ```
     - Top 3 maintenance issues: Plumbing, Elevator, HVAC
     - 12% rent overdue (4 tenants)
     - Avg closure time: 2.3 days
     ```
   - Optional OpenAI API key for smarter summarization
8. **Reports**
   - Downloadable PDF summary per org (optional gate)

## 6. Data Model (Simplified)
- **Organization**: id, name, created_at
- **Building**: id, org_id, name, address
- **Unit**: id, building_id, name, status
- **Tenant**: id, org_id, name, email, phone, unit_id
- **Payment**: id, tenant_id, amount, due_date, paid_at, status
- **Ticket**: id, org_id, tenant_id, title, desc, priority, status, assigned_vendor
- **User**: id, org_id, email, password_hash, role
- **AuditLog**: id, org_id, user_id, entity, action, payload, ts

## 7. Tenancy Model
- Column-based: `org_id` on every entity
- **RLS** enforced in Postgres; JWT embeds org_id
- Middleware validates org scope

## 8. API (FastAPI)
- `/auth/login`, `/auth/register`
- `/tenants`, `/payments`, `/tickets`, `/buildings`
- `/ai/summary` → returns structured monthly insights
- `/health`
- `/openapi.json` for FE client generation

## 9. Frontend (Next.js)
- `/dashboard`
- `/tenants`, `/payments`, `/tickets`
- `/tickets/[id]` detail view
- `/login`
- Components: CardGrid, ChartWidget, Table, TicketForm, SummaryPanel
- Data from generated OpenAPI client
- Light SaaS design (gray-neutral, dashboard-style)

## 10. Non-Goals
- Live Stripe integration (mock only)
- Mobile-first design (future)
- Real email sending (stub only)

## 11. Deployment
- Docker Compose: db, api, web
- Ports: 5432, 8000, 3000
- `.env` example:
DATABASE_URL=postgres://postgres:postgres@db:5432/propwise
JWT_SECRET=dev_secret
CORS_ORIGINS=http://localhost:3000
ENABLE_AI=false
TENANCY_MODEL=column

markdown
Copy code

## 12. Success Criteria
- ✅ Runs via `docker compose up --build`
- ✅ Dashboard loads with seeded data
- ✅ Multi-tenant RLS working
- ✅ AI summary endpoint returns monthly insights
- ✅ Gates: 80% coverage, 0 high vulns
- ✅ PRD.md and ARCHITECTURE.md pass validation

## 13. Acceptance Tests
- Login → dashboard visible
- Create tenant → appears under org only
- Tenant creates ticket → admin sees it
- AI summary generates JSON
- RLS: tenant/org isolation holds true