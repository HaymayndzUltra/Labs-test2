---
name: PropWise
slug: client01saas
industry: saas
project_type: fullstack
frontend: nextjs
backend: fastapi
database: postgres
auth: jwt
deploy: docker
multi_tenant: true
tenancy_model: column
billing: none
notifications: true
ai_feature: monthly_summary
ai_llm_required: false
audit_trail: true
observability: basic
coverage_threshold: 0.80
security_fail_on: high
perf_target_p95_ms: 300
build_profile: production

# UI layout & bindings
layout:
  dashboard:
    sections:
      - row:
          - card: total_tenants
          - card: occupied_units
          - card: overdue_payments
          - card: open_tickets
      - row:
          - chart: rent_collection_trend
          - chart: ticket_closure_rate
      - row:
          - heatmap: student_activity
          - panel: automation_orchestration

routes:
  - /dashboard
  - /tenants
  - /payments
  - /tickets
  - /tickets/[id]
  - /login

data_bindings:
  total_tenants: "SELECT COUNT(*) AS value FROM tenant WHERE org_id = :org_id"
  occupied_units: "SELECT COUNT(*) AS value FROM unit WHERE status = 'occupied' AND org_id = :org_id"
  overdue_payments: "SELECT COUNT(*) AS value FROM payment WHERE status = 'overdue' AND org_id = :org_id"
  open_tickets: "SELECT COUNT(*) AS value FROM ticket WHERE status != 'Closed' AND org_id = :org_id"
  rent_collection_trend: "SELECT date_trunc('month', due_date) AS m, SUM(CASE WHEN paid_at IS NOT NULL THEN amount ELSE 0 END) AS collected FROM payment WHERE org_id=:org_id GROUP BY 1 ORDER BY 1"
  ticket_closure_rate: "SELECT date_trunc('month', created_at) AS m, AVG(CASE WHEN status='Closed' THEN 1 ELSE 0 END)::float AS closure_rate FROM ticket WHERE org_id=:org_id GROUP BY 1 ORDER BY 1"
  student_activity: "fixture:analytics/student_activity.json"

seeds:
  strategy: minimal
  organizations:
    - { name: "Acme Realty" }
    - { name: "Skyline Properties" }
  users:
    - { email: "admin@acme.io", role: "org_admin", org: "Acme Realty" }
    - { email: "tenant1@acme.io", role: "tenant", org: "Acme Realty" }
  buildings:
    - { name: "Tower A", org: "Acme Realty" }
  units:
    - { name: "A-101", building: "Tower A", status: "occupied" }
  tenants:
    - { name: "John Doe", email: "john@example.com", org: "Acme Realty", unit: "A-101" }
  payments:
    - { tenant: "John Doe", amount: 1200, due_date: "2025-09-01", paid_at: null, status: "overdue" }
  tickets:
    - { title: "Leaky faucet", priority: "high", status: "Open", tenant: "John Doe", org: "Acme Realty" }

optional_modules:
  billing: skip
  notifications: stub
  ai_feature: rules_based

reports:
  org_monthly_summary:
    format: pdf
    trigger: manual
    template: "templates/org_summary.md"

env:
  DATABASE_URL: "postgres://postgres:postgres@db:5432/propwise"
  JWT_SECRET: "dev_secret"
  CORS_ORIGINS: "http://localhost:3000"
  ENABLE_AI: "false"
  TENANCY_MODEL: "column"
---


# PropWise – Property Management Dashboard

## 1. Background
Startup serving multiple property management companies; each company is an organization with tenants, units, payments, and maintenance operations.

## 2. Problem Statement
Manual tracking, duplicate records, no centralized visibility, weak auditability, and no analytics or automated nudges.

## 3. Objectives
- Multi-tenant dashboard per organization
- Manage tenants, units, payments, maintenance tickets
- Admin & tenant flows with JWT
- AI monthly summaries (rules-based fallback)
- Audit trail + RLS isolation

## 4. Core Users
| Role        | Description                                                  |
|-------------|--------------------------------------------------------------|
| Super Admin | Internal, platform-level visibility                          |
| Org Admin   | Buildings/units/tenants/payments/tickets for their org only  |
| Tenant      | Submit tickets, view balance                                 |
| Vendor      | Optional, assigned to tickets                                |

## 5. Features
- Dashboard KPIs & charts (layout defined in frontmatter)
- Tenants, Units/Buildings, Payments, Maintenance Requests
- Notifications (email stubs), AI Monthly Summary
- Reports: monthly org PDF

## 6. Data Model
Organization(id,name,created_at); Building(id,org_id,name,address); Unit(id,building_id,name,status);
Tenant(id,org_id,name,email,phone,unit_id); Payment(id,tenant_id,amount,due_date,paid_at,status);
Ticket(id,org_id,tenant_id,title,desc,priority,status,assigned_vendor);
User(id,org_id,email,password_hash,role); AuditLog(id,org_id,user_id,entity,action,payload,ts)

## 7. Tenancy & Security
- Column-based `org_id` + Postgres RLS
- JWT embeds `org_id` & role; FastAPI dependency validates scope
- PBKDF2 password hashing

## 8. API (FastAPI)
- /auth/login, /auth/register
- /tenants, /payments, /tickets, /buildings
- /ai/summary
- /health
- /openapi.json

## 9. Frontend (Next.js)
Pages: /dashboard, /tenants, /payments, /tickets, /tickets/[id], /login  
Components: CardGrid, ChartWidget, Table, TicketForm, SummaryPanel

## 10. Deployment
Docker Compose (db, api, web). Ports: 5432, 8000, 3000. `.env.example` based on `env` above.

## 11. Success Criteria
- `docker compose up --build` runs
- Dashboard loads with seeded data
- RLS isolation enforced
- AI summary endpoint returns JSON
- Gates: coverage ≥ 80%, p95 ≤ 300ms, 0 critical/high vulns
- PRD.md & ARCHITECTURE.md validated

## 12. Acceptance Tests
- Login → dashboard visible
- Create tenant → scoped to org
- Tenant creates ticket → admin sees & assigns
- AI summary returns JSON
- RLS isolation holds
