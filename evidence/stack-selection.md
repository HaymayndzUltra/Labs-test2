# Stack Selection (Preflight)
| Layer | Requested | Variant Req. | Chosen | Variant | Note |
|---|---|---|---|---|---|
| Frontend | nextjs | base | nextjs | base |  |
| Backend | fastapi | base | fastapi | base |  |
| Database | postgres | base | postgres | base |  |
| Compliance | gdpr | — | gdpr | overlay | rule-based overlay |

## Engine Checks
- node: required >=20.10.0, current v18.20.8 → FAIL
- python: required >=3.11, current Python 3.10.12 → FAIL
- docker: required >=20, current Docker version 28.3.2, build 578ccf6 → OK
