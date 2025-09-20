# /sync-tasks — Reconcile Tasks with Scaffold

Purpose:
- Scaffold-first or anytime: scan repo (routes/pages/migrations/tests) and update tasks.json.
- Never deploy. Idempotent.

Heuristics (edit as needed):
- Frontend (Next.js):
  - pages under app/* or pages/* → ensure FE tasks exist and mark as completed if implemented.
- Backend (FastAPI/Django/NestJS/Go):
  - routers/controllers/endpoints → ensure BE tasks exist, add missing ones.
- Database:
  - migrations/* → ensure schema/migration tasks are present/completed.
- Tests:
  - tests/* or __tests__/* → ensure BE/FE test tasks updated.

Step 1 — Safety: backup tasks.json
```bash
cp -f tasks.json tasks.backup.json || true
```

Step 2 — Diff preview (no apply)
```bash
python scripts/sync_from_scaffold.py --input tasks.json --exclude "node_modules,.git,.venv" --root .
```
[HALT] Review proposed ADD/COMPLETE lines.

Step 3 — Apply changes (confirm)
```bash
echo "Apply proposed changes (y/n)?"; read -r ans; [ "$ans" = "y" ] && \
python scripts/sync_from_scaffold.py --input tasks.json --output tasks.json --exclude "node_modules,.git,.venv" --root . --apply || true
```
[HALT] Review updated tasks.json.

Artifacts:
- tasks.json (updated)
- tasks.backup.json (backup)

Next:
- Run /3-process-tasks