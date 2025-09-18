# /help — Workflow Cheat Sheet

Phases (slash-commands):
- /0-bootstrap-project
  - Analyze brief (dry-run), pick isolation, generate scaffold
  - Optional gates
- /1-create-prd
  - Generate PLAN.md and PLAN.tasks.json from brief
- /2-generate-tasks
  - Build tasks.json, enrich personas/acceptance, validate DAG/enums
- /sync-tasks
  - Diff scaffold → tasks; preview then apply
- /3-process-tasks
  - Execute lane-by-lane; confirm state changes; persist run history
- /4-quality-control
  - Run tests/lints; enforce numeric gates
- /5-implementation-retrospective
  - Summarize outcomes; propose improvements

Key scripts:
- scripts/plan_from_brief.py — PRD/plan artifacts
- scripts/generate_from_brief.py — split FE/BE generation from brief
- scripts/generate_client_project.py — single project generation
- scripts/enrich_tasks.py — personas + acceptance
- scripts/validate_tasks.py — DAG/enums validation (CI-friendly exits)
- scripts/sync_from_scaffold.py — propose/apply task diffs from code
- scripts/update_task_state.py — update task state by id
- scripts/write_context_report.py — writes .cursor/ai-governor/project.json

Rules & Config:
- Rules emission is controlled per run (isolation):
  - Safe default: no nested rules in child projects (`--no-cursor-assets`)
  - Minimal rules: emit a focused set in child (`--minimal-cursor --include-cursor-assets`)
  - Full rules: emit complete rules in child (`--include-cursor-assets`)
- When emitted, rules live under `.cursor/rules/` in the generated project.
- Quality gates are configured via `gates_config.yaml` (plus optional industry overlays). Values may differ per project.

Task states & personas:
- Allowed states: `pending`, `in_progress`, `blocked`, `completed`, `cancelled`
- Personas used by enrichment: `system-integrator`, `code-architect`, `qa`

Quality gates (source of truth = config):
- `python scripts/enforce_gates.py` reads thresholds from `gates_config.yaml`
- Examples (subject to config): coverage, vulnerabilities, perf p95
  - Example schema: coverage >= X; vulns_critical <= Y; perf_p95_ms <= Z

Compliance mapping:
- Derived from brief/industry and validated by generator/validator
  - Healthcare → HIPAA (typical)
  - E-commerce → PCI, GDPR (typical)
  - Finance → SOX, PCI (typical)
  - Default → GDPR (typical)

Repo Hardening:
- PR Template: `.github/pull_request_template.md` (tasks/tests/gates/docs checklist)
- CODEOWNERS: `CODEOWNERS` for review routing
- CI:
  - Modular: `.github/workflows/ci-*.yml` (preferred multi-stack)
  - Simple: `.github/workflows/ci.yml` (manual `workflow_dispatch` to avoid overlap)

Isolation defaults:
- If a root `.cursor` exists, default output root is `../_generated` and nested rule sets are off by default.

Context report (optional, after bootstrap):
```bash
python scripts/write_context_report.py \
  --project-name "myapp" \
  --industry healthcare \
  --frontend nextjs --backend fastapi --database postgres --auth auth0 --deploy aws \
  --compliance hipaa,gdpr \
  --output .cursor/ai-governor/project.json
```

Notes:
- All phases are non-deploy; HALT checkpoints ensure human confirmation.
- Use /sync-tasks any time code changes to keep tasks.json accurate.