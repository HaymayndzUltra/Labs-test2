# /2-generate-tasks — Generate & Normalize Tasks

Purpose:
- Convert plan tasks into actionable tasks.json, add personas/acceptance, validate DAG. No deploy.

Inputs:
- PLAN.tasks.json (from /1-create-prd)

Outputs:
- tasks.json (normalized)

Step 1 — Build tasks.json from PLAN.tasks.json
```bash
cp -f PLAN.tasks.json tasks.json
```

Step 2 — Enrich tasks (personas, acceptance)
```bash
python scripts/enrich_tasks.py --input tasks.json --output tasks.json
```
[HALT] Review enrichment results printed by the script.

Step 3 — Validate DAG & references
```bash
python scripts/validate_tasks.py --input tasks.json || exit 2
```
[HALT] Fix validation errors if any.

Artifacts:
- tasks.json

Next:
- If scaffold exists or after generation: run /sync-tasks
- Then: /3-process-tasks