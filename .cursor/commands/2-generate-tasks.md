# /2-generate-tasks — Generate & Normalize Tasks

Purpose:
- Convert plan tasks into actionable tasks.json, add personas/acceptance, validate DAG. No deploy.

Inputs:
- PLAN.tasks.json (from /1-create-prd)

Outputs:
- tasks.json (normalized)

Step 1 — Build tasks.json from PLAN.tasks.json
```bash
# If you have a custom post-processor script, call it here; otherwise, copy as baseline
cp -f PLAN.tasks.json tasks.json
```

Step 2 — Enrich tasks (personas, acceptance)
- Convention: area→persona
  - backend → code-architect
  - frontend → system-integrator
  - devops/qa → qa
- Add minimal acceptance if missing (smoke tests, lint, docs touch)
[HALT] Confirm enrichment policy.

Step 3 — Validate DAG
- Ensure no cycles; blocked_by refers to existing ids; per-lane concurrency cap observed at execution time.
[HALT] Confirm DAG validity.

Artifacts:
- tasks.json

Next:
- If scaffold exists or after generation: run /sync-tasks
- Then: /3-process-tasks