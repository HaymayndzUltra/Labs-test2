# /3-process-tasks — Controlled Execution (No Deploy)

Purpose:
- Execute tasks.json per lane with HALTs; update state; record run history. Never deploy.

Safety:
- Only build/test/lint/local scripts; never push/deploy.
- Parent-task cadence: finish all subtasks under a parent, then HALT for review.

Step 1 — Load tasks.json, select lane
```bash
jq '.' tasks.json >/dev/null 2>&1 || (echo "[ERR] tasks.json invalid" && exit 2)
```
[HALT] Choose lane (backend|frontend|devops/qa) and target parent task.

Step 2 — Run lane tasks (example snippets)
```bash
# Backend examples
make -n test || true
python -m pytest -q || true

# Frontend examples
npm ci || true
npm run -s build || true
npm run -s test || true
```
[HALT] Update task state (in_progress→completed) and note logs.

Step 3 — Persist progress
```bash
mkdir -p .cursor/ai-governor/run-history
DATE_TAG=$(date +%Y%m%d-%H%M%S)
cp -f tasks.json ".cursor/ai-governor/run-history/tasks-$DATE_TAG.json" || true
```
[HALT] Decide next parent task or proceed to /4-quality-control.

Artifacts:
- Updated tasks.json
- .cursor/ai-governor/run-history/tasks-*.json

Next:
- /4-quality-control