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

Step 2 — Scan (read-only examples)
```bash
# Frontend hints
ls -1 app 2>/dev/null | head -50 || true
ls -1 pages 2>/dev/null | head -50 || true
# Backend hints
ls -1 backend 2>/dev/null | head -50 || true
ls -1 app/routers 2>/dev/null | head -50 || true
ls -1 src 2>/dev/null | head -50 || true
# DB hints
ls -1 migrations 2>/dev/null | head -50 || true
# Tests
ls -1 tests 2>/dev/null | head -50 || true
```
[HALT] Decide which detected changes to apply (add/update/complete tasks).

Step 3 — Apply deltas (manual or scripted)
- Add missing tasks with area, blocked_by, persona, acceptance.
- Mark tasks implemented in code as completed.
[HALT] Review updated tasks.json.

Artifacts:
- tasks.json (updated)
- tasks.backup.json (backup)

Next:
- Run /3-process-tasks