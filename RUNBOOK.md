# Runbook

## Testing & QA (Phase 05)
- Run unit tests: `make test-unit`
- Scripts-only tests: `make test-scripts`
- Coverage (scripts): `make coverage-scripts`
- Security (scripts baseline): `make security-scripts`

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