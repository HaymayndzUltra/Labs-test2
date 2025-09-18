# /0-bootstrap-project — Bootstrap & Context

Purpose:
- Fast, portable bootstrap for any repo using dry-run-first and HALT checkpoints.
- Supports brief-first and scaffold-first starts. Never deploy.

Preconditions:
- Python 3.11+, Git, Docker (optional), Node 18+ if FE.
- Run from repo root (pwd is the project root).

Variables:
- PROJECT_NAME: <your-project>
- BRIEF_PATH: docs/briefs/{PROJECT_NAME}/brief.md
- OUTPUT_ROOT: ../_generated

Step 0 — Environment (optional)
```bash
python --version || python3 --version || true
node --version || true
docker --version || true
```

Step 1 — Analyze (dry-run; brief-first if available)
- If a brief exists, generate planning artifacts without side effects.
```bash
test -f "$BRIEF_PATH" || echo "[INFO] No brief at $BRIEF_PATH"
# PRD/Plan artifacts (non-blocking if brief missing)
python scripts/plan_from_brief.py --brief "$BRIEF_PATH" --out PLAN.md || true
```
[HALT] Review PLAN.md / PLAN.tasks.json if created. Confirm to proceed.

Step 2 — Isolation & Output strategy (no writes yet)
- If a root .cursor exists in this repo, default to generating projects under "$OUTPUT_ROOT" and avoid nested rule sets.
- Choose one explicitly before continuing:
  - Safe default (no nested rules): --no-cursor-assets
  - Minimal rules in child project only: --minimal-cursor --include-cursor-assets
  - Full rules emission: --include-cursor-assets
[HALT] Confirm OUTPUT_ROOT and rules emission mode.

Step 3 — Generate (non-deploy)
Option A: From brief (split FE/BE if brief defines both)
```bash
python scripts/generate_from_brief.py \
  --brief "$BRIEF_PATH" \
  --output-root "$OUTPUT_ROOT" \
  --yes --force
```

Option B: Single-project fallback (edit flags as needed)
```bash
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry healthcare \
  --project-type web \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --output-dir "$OUTPUT_ROOT" \
  --yes --skip-system-checks
```
[HALT] Confirm scaffold is created or updated.

Step 4 — Quality gates (optional, local only)
```bash
python scripts/enforce_gates.py | cat || true
```
[HALT] Review gates output. Fix before proceeding if needed.

Artifacts:
- PLAN.md, PLAN.tasks.json (if brief)
- Generated scaffold under $OUTPUT_ROOT

Next:
- If brief-first: run /1-create-prd then /2-generate-tasks
- If scaffold-first: run /sync-tasks to reconcile tasks with the code