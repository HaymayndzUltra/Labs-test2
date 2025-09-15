# ACME Telehealth — PLAN (Derived from Brief)

## Overview
Secure, HIPAA‑compliant telehealth platform enabling video consults, secure messaging, billing, and EHR (FHIR) integration.

## Objectives
- Reduce no‑show rate by 15% (6 months)
- Increase provider utilization by 10%
- Achieve CSAT ≥ 4.5/5 within 3 months post‑launch

## Scope (Phase 1)
- Web portals: Patient, Clinician, Admin
- Appointments, Video (WebRTC), Secure Messaging, Prescriptions view, Billing, Reporting
- EHR (FHIR) read first; write‑back in Phase 2

## Out of Scope (Phase 1)
- Native mobile apps
- In‑person clinic hardware flows

## Architecture (Target)
- Frontend: Next.js 14 (App Router), Tailwind
- Backend: FastAPI (async), Pydantic v2
- Database: PostgreSQL
- Auth: Auth0 (RBAC, MFA optional)
- Files: S3 (presigned URLs)
- Infra: AWS (ECS/Fargate, RDS, CloudFront)
- Observability: structured logs with correlation id; basic traces

## Security & Compliance (HIPAA)
- AES‑256 at rest; TLS 1.2+ in transit
- RBAC; session timeout 15m; re‑auth for sensitive actions
- Audit logging of all PHI access/changes; integrity controls
- No PHI in logs

## API (Representative)
- Auth: POST /auth/login, /auth/refresh, /auth/logout; GET/PATCH /me
- Appointments: GET /appointments, POST /appointments, PATCH /appointments/{id}
- Messaging: GET /threads, GET /threads/{id}, POST /threads/{id}/message
- Prescriptions: GET /patients/{id}/prescriptions
- Billing: GET /patients/{id}/invoices, POST /invoices/{id}/pay

## UI (Representative)
- Patient: Login, Dashboard, Appointments, Messages, Prescriptions, Billing, Profile
- Clinician: Schedule, Patients, Consult Room, Messaging, Notes
- Admin: Scheduling, Billing, Reports, Settings

## Milestones
- M1 (Weeks 1–3): Auth, Profiles, Appointments CRUD, base UI shell
- M2 (Weeks 4–6): Video consults (pre‑join checks), Messaging MVP, Billing (test)
- M3 (Weeks 7–8): FHIR read integration, Reporting basics, UAT + hardening

## Risks/Assumptions
- EHR sandbox stability; client PHI policy sign‑off; Stripe readiness

## Acceptance
- Patients can book and attend video consults end‑to‑end
- Secure messaging and billing flows work with test cards
- HIPAA controls implemented; audit logs verifiable
- CI gates enforced (tests ≥ 80% for PHI modules; no critical vulns)
