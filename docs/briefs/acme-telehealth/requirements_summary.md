# ACME Telehealth — Requirements Summary

## Goals
- Launch secure telehealth platform (video consults, messaging, billing)
- Reduce no‑show rate by 15%; increase provider utilization by 10%
- CSAT ≥ 4.5/5 within 3 months

## Scope (In)
- Patient, Clinician, Admin portals (web)
- Appointments, video consults (WebRTC), secure messaging, eRx export, billing, reporting
- EHR integration (FHIR; phase 1 read, phase 2 write‑back)

## Out of Scope
- Native mobile apps (future phase)
- In‑person clinic workflows (kiosk, hardware)

## Stakeholders & Roles
- Patient (minimum necessary access), Clinician (MD/NP/PA), Admin, Super Admin

## Functional Requirements (Highlights)
- Auth0 SSO, MFA optional; profiles; appointments CRUD; messaging threads; prescriptions view
- Billing with Stripe; documents upload; notifications (email/SMS)
- Reporting (usage, no‑shows, revenue)

## Non‑Functional
- Security (HIPAA), Privacy (no PHI in logs), Performance (p95 < 500ms core API), Availability 99.9% (P1)
- Scalability (horizontal), Localization EN→ES, Accessibility WCAG 2.1 AA

## Compliance (HIPAA)
- AES‑256 at rest; TLS 1.2+ in transit; RBAC; session timeout 15m; audit logging; integrity controls

## Risks & Assumptions
- EHR partner sandbox; PHI policy sign‑off; Stripe readiness

## Acceptance (Phase 01)
- [ ] Summary validated by client/tech lead