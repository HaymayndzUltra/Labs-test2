# Framework Manual (Quick Runbook)

## Where to work
- Framework repo (planning & rules): `/home/haymayndz/EnlighterProjects/project-035`
- Client repos (generated apps): `/home/haymayndz/ClientProjects/<project_id>`

## Core rules (framework)
- `.cursor/rules/MasterOrchestrator.mdc` — orchestrates planning; emits plan artifacts
- `.cursor/rules/rule-selection-adapter.mdc` — builds rules manifest from canonical + generated
- `.cursor/rules/rule-generation-framework.mdc` — optional meta generator for rules

## Standard outputs (framework)
- `docs/plans/roadmap.json`
- `docs/plans/workflow.json`
- `docs/plans/file-assignments.json`
- `docs/plans/quality-gates.json`
- `docs/plans/rules-manifest.<project_id>.json`

## Trigger flow
1. Orchestrate (create plan artifacts)
   - Example:
     - orchestrate project_id="acme-telehealth" brief="docs/briefs/acme-telehealth/PLAN.md" flags="stack=nextjs+fastapi,db=postgres,auth=auth0,industry=healthcare,compliance=hipaa"
2. Build manifest (select + generate)
   - select rules manifest project_id="acme-telehealth" brief="docs/briefs/acme-telehealth/PLAN.md" flags="stack=nextjs+fastapi,db=postgres,auth=auth0,compliance=hipaa"
3. Scaffold client repo (new repo)
   - Target: `/home/haymayndz/ClientProjects/acme-telehealth`
   - Use manifest: `docs/plans/rules-manifest.acme-telehealth.json`

## After scaffold (client repo)
- Roles (when per‑agent rules exist): `frontend …`, `backend …`, `devops …`, `qa …`, `docs …`
- Enforcement/execution/validation: `enforce ownership`, `run batch <n>`, `checkpoint review`, `validate plans`

## Paths contract
- Canonical rules: `src/project_generator/template-packs/rules/` (read‑only)
- Generated per‑project: `src/project_generator/template-packs/rules/generated/<project_id>/`
- Framework rules: `.cursor/rules/`

## Acceptance checklist
- Orchestrate → 5 artifacts exist and validate (no overlapping writers)
- Manifest → all paths resolve (canonical or generated)
- Scaffold → new repo created; client `.cursor/rules` has only selected rules
- Roles/Gates → follow `workflow.json`; gates green at checkpoints