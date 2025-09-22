# Runbook

## Testing & QA (Phase 05)
- Full stack regression (frontend + backend) with coverage aggregation: `make test`
- Backend unit focus: `cd backend && pytest tests/unit`
- Backend integration focus: `cd backend && pytest tests/integration`
- Frontend component/API contract suite: `cd frontend && npm test`
- Coverage gate: aggregated results in `coverage/coverage-summary.json` must be ≥70% (see
  `gates_config.yaml`).

## Deployment (Phase 06)
- CI jobs:
  - `workflows_validation`: validates workflow docs
  - `gates_enforcer`: enforces coverage/perf/security gates
- Local simulation:
  - Coverage gate (Node): ensure `coverage/coverage-summary.json` exists
  - Perf gate: place `reports/perf.json` with `{ "p95_ms": <value> }`

## Monitoring & Observability (Phase 10)
- Ensure structured logs with correlation IDs
- Verify "No PHI in logs" policy is applied
- Maintain dashboards and alerts (export JSON/YAML for evidence)

## Backup & Restore
- Backup workflows/rules: `make backup-workflows`
- Restore test: `make restore-test`
- Evidence: `backups/last_success.json`, `backups/last_restore.json`

## Troubleshooting
- Workflow validator failures: add missing sections/frontmatter to the referenced file
- Compliance failures: explicitly include HIPAA controls in 02/08/10
- CI failing gates:
  - Coverage below threshold: raise tests or adjust gates_config.yaml (with approval)
  - Perf p95 above threshold: investigate regressions; optimize hotspots
  - High-severity findings: remediate; rerun scans