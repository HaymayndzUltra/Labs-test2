# AI‑Native Project Factory (Client Docs)

## Overview (What)
This is a client‑ready, AI‑native project generator and delivery workflow that builds full‑stack apps (Next.js/Nuxt/Angular/Expo + FastAPI/Django/NestJS/Go + PostgreSQL/Firebase/MongoDB) with governance built in (rules‑as‑code, quality gates, compliance overlays) and Cursor IDE automation.

## Why AI‑native (Why)
Traditional workflows rely on manual steps, scattered scripts, and undocumented tribal knowledge. This framework codifies the process:
- Rules‑as‑code in `.cursor/rules/*.mdc` (governance becomes executable)
- Deterministic scripts for planning, generation, validation, and packaging
- Measurable gates (coverage, performance, dependency health)
- Evidence‑based delivery (Submission Pack with manifest + checksums)

## How it works (How)
- Workflows live in `.cursor/dev-workflow/0…5` and can be executed via Cursor messagebox commands, Make targets, or a one‑shot script.
- Scripts under `scripts/` implement planning (`plan_from_brief.py`), selection (`select_stacks.py`), generation, validation, and gates.
- CI mirrors local steps for consistency.

### Workflow stages (0→5)
- 0 Bootstrap: Verify tools and load rules; list available templates
- 1 PRD: Draft the Product Requirements Document + Architecture Summary
- 2 Tasks: Generate PLAN.md + PLAN.tasks.json and validate the task graph
- 3 Process: Preflight stack selection → dry‑run → generate scaffold → install/test → sync/apply → validate
- 4 Quality Control: Collect coverage/perf/dependency scans; enforce numeric gates
- 5 Retrospective & Delivery: Build a Submission Pack and publish links for acceptance

### Quick start
Pick ONE run style.

1) Makefile (stepwise)
```bash
make bootstrap && make plan && make preflight && make dryrun && make generate && make test && make sync && make validate && make qc && make deliver
```

2) One‑shot (terminal)
```bash
NAME="demo-app" INDUSTRY="healthcare" PROJECT_TYPE="fullstack" FE="nextjs" BE="fastapi" DB="postgres" \
  ./scripts/e2e_from_brief.sh
```

3) Cursor messagebox (guided)
```text
/apply-instructions-from-0-bootstrap-your-project.md
/apply-instructions-from-1-create-prd.md
/apply-instructions-from-2-generate-tasks.md
/apply-instructions-from-3-process-tasks.md
/apply-instructions-from-4-quality-control-protocol.md
/apply-instructions-from-5-implementation-retrospective.md
```

### Visual flow
```
[0 Bootstrap] → [1 PRD] → [2 Tasks] → [3 Process] → [4 QC] → [5 Retro/Delivery]
     |             |            |             |          |            |
     v             v            v             v          v            v
  Rules/Doctor   PRD.md     PLAN.md +       Scaffold   Evidence     Pack +
  Templates      Layers     PLAN.tasks.json  + Tests    (cov/perf/   Links
                                                 Sync   deps)
```

### Detailed docs
- Workflow details: `.cursor/dev-workflow/*`
- Full workflow: `docs/WORKFLOW.md`
- Supported stacks: `docs/FRAMEWORKS.md`
- Trigger commands: `docs/TRIGGERS.md`
- Client deck overview: `docs/CLIENT_PRESENTATION.md`
