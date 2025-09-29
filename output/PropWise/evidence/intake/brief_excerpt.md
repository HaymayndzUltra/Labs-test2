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
  o