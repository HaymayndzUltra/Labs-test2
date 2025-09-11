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

### Concurrency Caps

- Backend lane: max 3 concurrent tasks
- Frontend lane: max 3 concurrent tasks

### Blocking vs Independent

- Independent (can start immediately): BE-AUTH, BE-OBS; FE-DSN, FE-TYPES, FE-MOCKS, FE-A11Y-PERF
- Blocking chains:
  - Backend: BE-SCH → BE-SEED → BE-MDL → [BE-API-KPI, BE-API-REV, BE-API-CAT, BE-API-PLT, BE-API-CUS, BE-API-FDB] → BE-EXP; BE-TST depends on BE-API-KPI and BE-API-REV
  - Frontend: [FE-KPI, FE-REV, FE-PLT, FE-CAT, FE-CUS, FE-FDB] depend on FE-DSN and FE-TYPES → FE-EXP; FE-TST depends on FE-KPI and FE-REV

### Topological Order (by lane)

- Backend: BE-SCH, BE-AUTH, BE-OBS → BE-SEED → BE-MDL → BE-API-* (parallel) → BE-EXP → BE-TST
- Frontend: FE-DSN, FE-TYPES, FE-MOCKS, FE-A11Y-PERF → FE-KPI/FE-REV/FE-PLT/FE-CAT/FE-CUS/FE-FDB (parallel) → FE-EXP → FE-TST

## Conflicts & Mitigations

| Conflict | Risk | Mitigation / Resequencing |
|---|---|---|
| Ports clash (FE 3000, BE 8000) | Services fail to boot | Orchestrator auto-bumps ports and health-waits; expose via env |
| Migrations vs seeds/tests | Flaky pipelines, data drift | Freeze schema before seeds; gate seeds after BE-SCH; re-run seeds post-migration |
| Secrets handling | Secret leakage in VCS | Only env-injection via .env.local; pre-commit secret scan; CI blocks on findings |
| OpenAPI drift (BE↔FE) | Type/runtime mismatches | Contract tests; regenerate on GEN/BE:UP; block PR if spec/handlers diverge |
| BE unavailable | FE blocked | Invoke FE:MOCK path (Prism/MSW) and proceed; banner “Mock Data”; resequence FE tasks |
| PHI/PII in non-prod | Compliance breach | Synthetic data only; “no PHI in non-prod” policy; audit seeds |
| Logging sensitive fields | Data leakage | Structured logs with redaction; denylist/allowlist; audit events for PHI access only |
| CSV exports heavy | Timeouts/memory | Streamed CSV, pagination/windowing; budget p95 < 1500ms with seeds |
| Rate limits on sources | Failed ingestions | Backoff + caching; schema versioning and drift alerts |

## Compliance Posture (HIPAA/Auth0/RBAC)

- Encryption: TLS 1.2+ in transit; AES-256 at rest (DB/volumes)
- Access: Auth0 OIDC; RBAC roles: admin, analyst, viewer; minimum necessary access
- Sessions: 15-minute inactivity timeout; re-auth required
- Audit: Log all PHI access/change events; correlation IDs; no PHI content in logs
- Non-prod: No PHI in non-prod; only synthetic or masked data
- Reviews: Quarterly RBAC review; audit log review cadence

## Logging Policy

- Use structured logging with correlation/request IDs across FE/BE
- Redact known sensitive fields (email, token, auth headers, CSV payloads)
- Include operation name, duration, status, user role (not user identifiers)
- Retention as per org policy; export logs contain no PHI; sampling allowed in non-prod

## Performance KPIs

- Backend: p95 < 500ms for main endpoints (/kpis, /revenue, /categories, /platforms, /customers/insights, /feedback) on seed data
- Frontend: dashboard first meaningful paint < 2.5s; interactive < 3s; no console errors
- Data: aggregate queries p95 < 400ms (seed); exports p95 < 1500ms streamed

## Next Triggers

- GEN (if skeleton missing) → BE:UP (env then run) → FE:E2E (types then dev)
- If BE unhealthy: FE:MOCK; document resequencing in PLAN
- BE:DATA (migrate + seed) when schema stable
- QA (tests + security gates) → Smoke/Perf (budgets) → PR (STOP, no deploy)

## Acceptance

- Kumpleto ang lanes, dependencies, conflicts table, mitigations, compliance, logging policy, performance KPIs, at next triggers
- Walang side-effects (planning artifacts only)
