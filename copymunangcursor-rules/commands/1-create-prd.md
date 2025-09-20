# /1-create-prd — Create PRD & Plan

Purpose:
- Produce PLAN.md and PLAN.tasks.json from the brief; no deploy; dry-run-first.

Variables:
- PROJECT_NAME: <your-project>
- BRIEF_PATH: docs/briefs/{PROJECT_NAME}/brief.md

Step 1 — Validate inputs
```bash
test -f "$BRIEF_PATH" && echo "[OK] brief found: $BRIEF_PATH" || (echo "[ERR] brief missing" && exit 2)
```

Step 2 — Generate PRD/Plan artifacts
```bash
python scripts/plan_from_brief.py --brief "$BRIEF_PATH" --out PLAN.md
```
[HALT] Review PLAN.md content: lanes, blocked_by, conflicts, next triggers.

Step 3 — Sanity checks (compact)
- Ensure lanes ≤ 3 concurrent tasks each (enforced later in executor).
- Ensure critical paths exist and conflicts have guardrails.
[HALT] Confirm to proceed to task generation.

Artifacts:
- PLAN.md
- PLAN.tasks.json

Next:
- Run /2-generate-tasks