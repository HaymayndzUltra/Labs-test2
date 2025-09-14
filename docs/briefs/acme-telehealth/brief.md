---
name: acme-telehealth
industry: healthcare
project_type: fullstack
frontend: nextjs
backend: fastapi
database: postgres
auth: auth0
deploy: aws
compliance: hipaa
features: telehealth,patient-portal,ehr-integration,audit-logging,role-based-access,appointments,video-consult,secure-messaging,prescriptions,billing,reports
---

# ACME Telehealth Platform — Client Brief

## 1. Executive Summary
ACME Health seeks to launch a secure, HIPAA‑compliant telehealth platform that enables patients to schedule appointments, join video consultations, message clinicians securely, view prescriptions, and pay bills. Administrators and clinicians manage schedules, notes, orders, and reporting.

## 2. Business Objectives
- Reduce no‑show rate by 15% within 6 months via reminders and easy rescheduling
- Increase provider utilization by 10% with optimized scheduling
- Achieve patient satisfaction (CSAT) ≥ 4.5/5 in 3 months post‑launch

## 3. Scope
### In Scope
- Patient portal (web)
- Clinician and admin portals (web)
- Video consults, secure messaging, eRx export, billing, reporting
- EHR integration (FHIR; phase 1 read, phase 2 write‑back)

### Out of Scope
- Native mobile apps (future phase)
- In‑person clinic workflows (kiosk, check‑in hardware)

## 4. Users & Roles
- Patient (minimum necessary access)
- Clinician (MD/NP/PA)
- Admin (scheduling, billing, reports)
- Super Admin (tenant‑level configuration)

## 5. Functional Requirements
- Account & Auth: SSO/Auth0, email/password, MFA optional, password reset
- Profile & Demographics: patient and clinician profiles
- Appointments: search providers, availability view, booking, reschedule, cancel
- Video Consults: WebRTC (e.g., Twilio) with pre‑join device checks
- Secure Messaging: 1:1 patient‑clinician threads, attachments, read receipts
- Prescriptions: view history, refill requests (export eRx to partner)
- Billing: view invoices, pay via Stripe, receipts, refunds
- Documents: upload insurance card, consent forms
- Notifications: email/SMS/reminders; quiet hours respect
- Reporting: usage, no‑shows, revenue; export CSV

## 6. Non‑Functional Requirements
- Security: HIPAA technical safeguards; OWASP Top 10 mitigations
- Privacy: minimum necessary; no PHI in logs; data retention policy
- Performance: p95 < 500ms for core API endpoints; video via provider SLA
- Availability: 99.9% (phase 1), 99.95% (phase 2) with multi‑AZ
- Scalability: horizontal for API and Web; DB read replicas (phase 2)
- Localization: EN (phase 1); ES (phase 2)
- Accessibility: WCAG 2.1 AA UI

## 7. Compliance (HIPAA)
- Encryption: AES‑256 at rest; TLS 1.2+ in transit
- Access Control: RBAC; MFA optional; session timeout 15 min; re‑auth for sensitive actions
- Audit Logging: all PHI access and changes; 6‑year retention
- Integrity Controls: checksums for documents; versioning of notes
- Transmission Security: secure messaging channels; signed URLs for files

## 8. Data Model (Initial)
- Patient(id, name, dob, contact, insurance, portal_enabled)
- Clinician(id, name, specialty, license, availability)
- Appointment(id, patient_id, clinician_id, start, end, status, notes_ref)
- Message(id, thread_id, sender_id, recipient_id, body, attachments, created_at)
- Prescription(id, patient_id, drug, dosage, instructions, status)
- Invoice(id, patient_id, amount, currency, status, stripe_invoice_id)
- AuditLog(id, actor_id, action, resource, phi_accessed, created_at)

## 9. Integrations
- EHR: FHIR (R4) read (patient demographics, meds); write‑back later
- Video: Twilio Programmable Video (or equivalent)
- Payments: Stripe
- Email/SMS: AWS SES/SNS (or Twilio SendGrid)
- Storage: S3 with presigned URLs; private bucket

## 10. API (Representative Endpoints)
- GET /health
- Auth/Users
  - POST /auth/login, POST /auth/refresh, POST /auth/logout
  - GET /me, PATCH /me
- Appointments
  - GET /appointments?patientId=&clinicianId=&from=&to=
  - POST /appointments (create), PATCH /appointments/{id} (reschedule/cancel)
- Messaging
  - GET /threads, GET /threads/{id}, POST /threads/{id}/message
- Prescriptions
  - GET /patients/{id}/prescriptions
- Billing
  - GET /patients/{id}/invoices, POST /invoices/{id}/pay

## 11. UI (Representative Pages)
- Patient: Login, Dashboard, Appointments, Messages, Prescriptions, Billing, Profile
- Clinician: Schedule, Patients, Consult Room, Messaging, Notes
- Admin: Scheduling, Billing, Reports, Settings

## 12. Architecture Overview (Target)
- Frontend: Next.js 14 (App Router), React, Tailwind, SSR where applicable
- Backend: FastAPI; Pydantic v2; async DB access; layered modules
- Database: PostgreSQL
- Auth: Auth0 (SPA + API); RBAC
- Files: S3 (presigned URLs)
- Infra: AWS (ECS/Fargate), RDS Postgres, CloudFront for FE, S3
- Observability: structured logs with correlation id; APM traces basic; key metrics

## 13. Environments & Deployment
- Envs: dev, staging, prod
- CI/CD: GitHub Actions (lint, test, security, deploy)
- Blue/green (phase 2); infra as code later (Terraform phase 2)

## 14. Monitoring & Alerts
- Error tracking (Sentry or similar), uptime probing, p95 latency, error rate, queue lag

## 15. Timeline & Milestones (Indicative)
- Phase 1 (8–10 weeks): MVP portal + video + messaging + billing + basic FHIR read
- Phase 2 (6–8 weeks): write‑back to EHR, localization, SLO uplift, Terraform

## 16. Risks & Assumptions
- EHR partner availability and sandbox variability
- PHI handling policy sign‑off by client compliance team
- Stripe account readiness

## 17. Acceptance Criteria (MVP)
- Patients book and attend video consults end‑to‑end
- Secure messaging and billing flows work (test cards)
- HIPAA controls implemented; audit logs verifiable
- CI/CD gates: tests ≥ 80% for PHI modules; no critical security findings

## 18. Appendices
- Glossary: PHI, FHIR, RBAC, SLO, MFA
- References: FHIR R4 specs; Auth0 app setup; Stripe test matrix