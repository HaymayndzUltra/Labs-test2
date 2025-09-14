# PLAN — commerce-analytics

Industry: ecommerce | Type: fullstack | Frontend: nextjs | Backend: fastapi

## Lanes

### Lane: backend

- [BE-SCH] Design DB schema (blocked_by: -)
- [BE-SEED] Seed loaders (CSV/mock) (blocked_by: BE-SCH)
- [BE-MDL] Aggregates/MatViews (funnel, revenue, etc.) (blocked_by: BE-SEED)
- [BE-API-KPI] GET /api/v1/kpis (blocked_by: BE-MDL)
- [BE-API-REV] GET /api/v1/revenue (blocked_by: BE-MDL)
- [BE-API-CAT] GET /api/v1/categories (blocked_by: BE-MDL)
- [BE-API-PLT] GET /api/v1/platforms (blocked_by: BE-MDL)
- [BE-API-CUS] GET /api/v1/customers/insights (blocked_by: BE-MDL)
- [BE-API-FDB] GET /api/v1/feedback (blocked_by: BE-MDL)
- [BE-EXP] GET /api/v1/export/csv (blocked_by: BE-API-KPI, BE-API-REV, BE-API-CAT, BE-API-PLT, BE-API-CUS, BE-API-FDB)
- [BE-AUTH] Auth0/RBAC skeleton (blocked_by: -)
- [BE-OBS] Structured logs + correlation IDs (blocked_by: -)
- [BE-TST] Unit+Integration tests (Testcontainers) (blocked_by: BE-API-KPI, BE-API-REV)

### Lane: frontend

- [FE-DSN] Shell/Layout/Routes (blocked_by: -)
- [FE-TYPES] openapi-typescript client (blocked_by: -)
- [FE-MOCKS] MSW/Prism mocks (blocked_by: -)
- [FE-KPI] KPI cards + filters (blocked_by: FE-DSN, FE-TYPES)
- [FE-REV] Revenue chart + range selectors (blocked_by: FE-DSN, FE-TYPES)
- [FE-PLT] Platform distribution (bars) (blocked_by: FE-DSN, FE-TYPES)
- [FE-CAT] Category ranks (bars) (blocked_by: FE-DSN, FE-TYPES)
- [FE-CUS] Customer insights panel (blocked_by: FE-DSN, FE-TYPES)
- [FE-FDB] Feedback timeline (blocked_by: FE-DSN, FE-TYPES)
- [FE-EXP] Exports (CSV/PNG) (blocked_by: FE-KPI, FE-REV, FE-PLT, FE-CAT, FE-CUS, FE-FDB)
- [FE-A11Y-PERF] WCAG AA + code-split/memoize (blocked_by: -)
- [FE-TST] Component + E2E smoke (blocked_by: FE-KPI, FE-REV)

## Conflicts & Guardrails

- Ports: FE 3000, BE 8000 (configurable)
- Migrations vs seed/tests: lock sequencing
- Secrets: no plaintext; env-injection only

## Next Triggers

- RUN_BE and RUN_FE in parallel (≤3 concurrent per lane)
- CSAN if blocked
- QA for completed scope
- PR: artifacts + acceptance (STOP, no deploy)
