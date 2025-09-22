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
- Compliance automation: `ci.yml` runs `python scripts/validate_compliance_assets.py` to ensure docs/ gates match generator output before enforcing quality gates.
- Local simulation:
  - Coverage gate (Node): ensure `coverage/coverage-summary.json` exists
  - Perf gate: place `reports/perf.json` with `{ "p95_ms": <value> }`

## Compliance Controls (Phase 08)
- Generator-aligned assets: run `python scripts/validate_compliance_assets.py --write` after changing stack options to refresh `docs/COMPLIANCE.md` and `gates_config.yaml`.
- Backend toggles: set `COMPLIANCE_*` variables (`COMPLIANCE_REGIMES`, audit/access flags, `COMPLIANCE_LOG_DESTINATION`) in environment files and confirm middleware logs reach central storage.
- CI evidence: artifacts from `scripts/validate_compliance_assets.py` and `scripts/enforce_gates.py` should be attached to compliance reviews.

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