# Development Guide

## Workflow Docs Frontmatter & Gates
- All `docs/workflows/*.md` include YAML frontmatter with keys: `title, phase, triggers, scope, inputs, outputs, artifacts, gates, owner`.
- Gates are centralized in `gates_config.yaml` and consumed by CI.

## Validators & Commands
- Validate workflows locally:
  - `python3 scripts/validate_workflows.py --all`
  - `make workflow.phase.N` (dry-run)
- Compliance (docs) checks:
  - `python3 scripts/check_compliance_docs.py` → writes `validation/compliance_report.json`
- Backups:
  - `make backup-workflows` and `make restore-test`

## CI Integration
- GitHub Actions jobs:
  - `workflows_validation` → validates frontmatter/sections and uploads artifact
  - `gates_enforcer` → enforces coverage/perf/security thresholds and uploads artifacts

## Troubleshooting
- Validator failures: add missing sections/frontmatter keys to the referenced workflow doc.
- Compliance failures: ensure HIPAA controls are explicitly mentioned in 02, 08, and 10.
- Trigger path issues: ensure `apply` matches actual file and `globs` is `docs/workflows/**/*.md`.