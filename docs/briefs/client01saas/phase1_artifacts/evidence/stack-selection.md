# Stack Selection (Preflight)
| Layer | Requested | Variant Req. | Chosen | Variant | Note |
|---|---|---|---|---|---|
| Frontend | nextjs | base | nextjs | base | Matches PropWise brief (dashboard, charts, heatmap). |
| Backend | fastapi | base | fastapi | base | Supports JWT auth, RLS helpers, PDF pipeline. |
| Database | postgres | base | postgres | base | Column-based tenancy with RLS and reporting SQL. |
| Auth | jwt | custom | custom | CLI flag uses `custom`; implementation remains JWT per brief. |
| Deploy | docker | self-hosted | self-hosted | Maps to Docker Compose deployment model. |

## Engine Checks
- node: required >=20.10.0, current v22.19.0 → OK
- python: required >=3.11, current Python 3.11.12 → OK
- docker: required >=20, current *(not detected in container image)* → **FAIL**
  - **Remediation:** Install Docker CLI/daemon before Phase 2 generation; rerun stack selection to confirm engines.

## Layer Summaries
- **UI:** Next.js 14 App Router experience tailored for PropWise dashboard modules (see `ui-summary.md`).
- **API:** FastAPI service with JWT auth, tenancy enforcement, AI summary, PDF pipeline (see `api-summary.md`).
- **Database:** PostgreSQL schema with `org_id` tenancy, audit log retention, and report-friendly views (see `database-summary.md`).
