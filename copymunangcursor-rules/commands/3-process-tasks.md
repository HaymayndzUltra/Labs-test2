# /3-process-tasks — Controlled Execution (No Deploy)

Purpose:
- Execute tasks.json per lane with HALTs; update state; record run history. Never deploy.

Safety:
- Only build/test/lint/local scripts; never push/deploy.
- Parent-task cadence: finish all subtasks under a parent, then HALT for review.

Step 1 — Load tasks.json, select lane
```bash
python - << 'PY'
import json,sys
try:
    json.load(open('tasks.json','r',encoding='utf-8'))
    print('[OK] tasks.json is valid JSON')
except Exception as e:
    print(f'[ERR] tasks.json invalid: {e}')
    sys.exit(2)
PY
```
[HALT] Choose lane (backend|frontend|devops/qa) and target parent task.

Step 2 — Mark selected parent task as in_progress (confirm)
```bash
# Example: export TID=BE-API-KPI; adjust per target task
: ${TID:=}
if [ -n "$TID" ]; then
  echo "About to set $TID -> in_progress (y/n)?"; read -r ans; [ "$ans" = "y" ] && \
  python scripts/update_task_state.py --id "$TID" --state in_progress --note "started" || true
fi
```

Step 3 — Run lane tasks (example snippets)
```bash
# Backend examples
make -n test || true
python -m pytest -q || true

# Frontend examples
npm ci || true
npm run -s build || true
npm run -s test || true
```
[HALT] Ready to mark the task as completed?

Step 4 — Mark task as completed (confirm) and persist progress
```bash
if [ -n "$TID" ]; then
  echo "About to set $TID -> completed (y/n)?"; read -r ans; [ "$ans" = "y" ] && \
  python scripts/update_task_state.py --id "$TID" --state completed --note "done" || true
fi
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