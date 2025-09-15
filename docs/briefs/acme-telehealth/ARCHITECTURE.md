# Architecture — ACME Telehealth

## System Overview
- Frontend: Next.js 14 (App Router), TailwindCSS, SSR where applicable
- Backend: FastAPI (async), Pydantic v2
- Database: PostgreSQL
- Auth: Auth0 (RBAC)
- Files: S3 (presigned URLs)
- Infra: AWS (ECS/Fargate, RDS Postgres, CloudFront)
- Observability: structured logs (correlation id), basic APM traces, key metrics

## Services & Components
- FE Web App (portal): patient, clinician, admin
- API Gateway (FastAPI): auth, appointments, messaging, billing, prescriptions, reporting
- Worker (optional): async tasks (notifications, report exports)
- Integrations: FHIR (R4) read, Twilio Video, Stripe, SES/SNS

## Data Flow
- Auth0 issues tokens → FE stores/uses → API verifies
- API performs RBAC checks; DB reads/writes
- S3 file uploads via presigned URLs
- FHIR read via authorized service account

## DB Outline (Initial)
- patient(id, name, dob, contact, insurance, portal_enabled)
- clinician(id, name, specialty, license, availability)
- appointment(id, patient_id, clinician_id, start, end, status, notes_ref)
- message(id, thread_id, sender_id, recipient_id, body, attachments, created_at)
- thread(id, patient_id, clinician_id, last_message_at)
- prescription(id, patient_id, drug, dosage, instructions, status)
- invoice(id, patient_id, amount, currency, status, stripe_invoice_id)
- audit_log(id, actor_id, action, resource, phi_accessed, created_at)

## Security
- RBAC checks at API; least privilege
- Encryption at rest (RDS, S3) and in transit (TLS)
- Audit logging of PHI accesses and changes

## Availability & Scaling
- Multi‑AZ RDS; ECS/Fargate with HPA; CloudFront for FE
- Read replicas (phase 2)