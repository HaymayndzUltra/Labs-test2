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

Isolation defaults:
- If a root .cursor exists, default output root is ../_generated and nested rule sets are off by default.

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