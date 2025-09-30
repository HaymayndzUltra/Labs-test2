# Phase 2 · Design & Planning Execution Guide

## Purpose & Role
Transform the brief pack (Protocols 0–1 outputs) into a validated technical plan with concrete artefacts Codex can reuse during implementation. Act as the **AI Architecture & Planning Lead** responsible for architecture decisions, repo initialization, and backlog definition.

## Required Inputs
- Context Kit and PRD (`${PROJECT_DIR}/PRD.md`) generated during earlier protocols.
- PLAN assets from the lifecycle (`${PROJECT_DIR}/PLAN.md`, `${PROJECT_DIR}/PLAN.tasks.json`).
- Charter, requirements, non-functional requirements, and initial risks supplied by stakeholders.

## Expected Outputs
- `ARCHITECTURE.md` with C4-style context/container views and decision trade-offs.
- ADRs stored under `${PROJECT_DIR}/architecture/adrs/ADR-<id>.md`.
- Repository initialized with commit conventions, branch strategy, and lint/type configs.
- `env/.env.example` plus documented environment strategy (no live secrets).
- `Product_Backlog.csv` and `Sprint-0.md` capturing at least two sprints of prioritized work.
- Contract-first assets: `api/openapi.yaml`, `data/erd.drawio` (or `.png`), and migration plan notes.

## Automation Hooks
1. Reuse lifecycle scripts to refresh planning artefacts:
   ```bash
   python scripts/plan_from_brief.py --brief "docs/briefs/${NAME}/brief.md" --out "${PROJECT_DIR}/PLAN.md"
   python scripts/validate_tasks.py --input "${PROJECT_DIR}/PLAN.tasks.json"
   python scripts/generate_prd_assets.py \
     --name "$NAME" --plan "${PROJECT_DIR}/PLAN.md" \
     --tasks "${PROJECT_DIR}/PLAN.tasks.json" \
     --output-dir "$PROJECT_DIR" --frontend "$FE" --backend "$BE" --database "$DB"
   ```
2. Initialize repo conventions:
   ```bash
   PROJECT_ROOT="$PROJECT_DIR" ./scripts/install_and_test.sh --skip-tests
   PROJECT_ROOT="$PROJECT_DIR" python scripts/enforce_gates.py --dry-run
   ```
3. Generate backlog CSV from tasks JSON:
   ```bash
   python scripts/tasks_to_backlog.py --input "${PROJECT_DIR}/PLAN.tasks.json" --csv "${PROJECT_DIR}/Product_Backlog.csv"
   ```
   > Provide `scripts/tasks_to_backlog.py` when absent; it converts parent tasks into backlog rows with acceptance criteria columns.
4. Produce API and data contracts:
   ```bash
   python scripts/export_openapi.py --plan "${PROJECT_DIR}/PLAN.md" --out "${PROJECT_DIR}/api/openapi.yaml"
   python scripts/export_erd.py --plan "${PROJECT_DIR}/PLAN.md" --out "${PROJECT_DIR}/data/erd.drawio"
   ```
   > Replace with manual modelling tools if custom exporters are not available.

## Step-by-Step Checklist
1. **Architecture & ADRs**
   - Draft system context, container, and component diagrams; store them in `${PROJECT_DIR}/architecture/diagrams/`.
   - Record decisions with the MADR template and link supporting evidence.
2. **Repo & Branching Policy**
   - Initialize Git repository (`git init`, commit hooks) if not already created.
   - Document branching policy and naming conventions in `${PROJECT_DIR}/docs/BRANCHING.md`.
3. **Environment Strategy**
   - Create `env/.env.example` with placeholders and note secret rotation owners in `${PROJECT_DIR}/docs/env-strategy.md`.
   - Reference secrets without embedding real values.
4. **Quality Configurations**
   - Install lint/format/typecheck tooling; ensure `package.json`, `pyproject.toml`, or equivalent contain scripts.
   - Commit baseline CI workflow (`.github/workflows/ci.yml`) that runs lint/type/build steps.
5. **Backlog & Sprint-0**
   - Convert tasks to backlog rows; include acceptance criteria and owners.
   - Build `Sprint-0.md` summarizing tooling setup, design tokens, and mock data seeding.
6. **Contracts & Data**
   - Export or hand-craft OpenAPI specs and ERD diagrams.
   - Draft migration plan in `${PROJECT_DIR}/data/migrations/PLAN.md`.
7. **Optional Design System**
   - If UI-heavy, seed `design/Design_Tokens.json` and `design/storybook/README.md` with component coverage.

## Quality Gates
- ✅ ADRs reviewed and approved; no blocking decisions open.
- ✅ `openapi.yaml` validated via schema check or mock server (`npm run mock-server`).
- ✅ CI skeleton passes lint/type/build locally (`npm run lint`, `npm run build`, `pytest --collect-only`).
- ✅ Backlog prioritized for ≥2 sprints with acceptance criteria recorded.
- ✅ Design handoff stored for UI projects.
- 🚫 Halt if secrets are requested for commit—record placeholders only.

## Handoff to Phase 3
Publish an update referencing the architecture folder, backlog CSV, and CI pipeline link. Confirm that stakeholders acknowledge readiness for guardrail implementation.
