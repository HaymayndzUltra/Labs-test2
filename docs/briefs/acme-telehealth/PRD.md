# Product Requirements Document — ACME Telehealth

## 1. Executive Summary
Telehealth platform enabling secure video consults, messaging, billing, and FHIR read integration. HIPAA‑compliant, web-based portals for patients, clinicians, and admins.

## 2. Goals & KPIs
- Reduce no‑show rate by 15% in 6 months
- Increase provider utilization by 10%
- CSAT ≥ 4.5/5 within 3 months of launch

## 3. Users & Roles
- Patient (minimum necessary access)
- Clinician (MD/NP/PA)
- Admin (scheduling, billing, reporting)
- Super Admin (tenant config)

## 4. In Scope (Phase 1)
- Appointments, Video (WebRTC), Secure Messaging
- Prescriptions (view), Billing (Stripe), Reporting (CSV)
- EHR (FHIR) read

## 5. Out of Scope (Phase 1)
- Native mobile apps; in-person clinic hardware

## 6. Functional Requirements
- Auth & Identity: Auth0 SSO, password/MFA optional, password reset, RBAC
- Appointments: provider search, availability, booking/reschedule/cancel
- Video Consults: pre‑join device checks, session join/leave, basic quality stats
- Secure Messaging: 1:1 threads, attachments, read receipts
- Prescriptions: view historical meds
- Billing: invoices, pay/refund, receipts
- Documents: uploads (insurance card, consent forms)
- Notifications: email/SMS/reminders, quiet hours
- Reporting: usage/no‑shows/revenue; CSV export

## 7. Non‑Functional Requirements
- Performance: p95 < 500ms for core API endpoints
- Availability: 99.9% (Phase 1)
- Accessibility: WCAG 2.1 AA
- Privacy/Security: HIPAA, no PHI in logs

## 8. Compliance (HIPAA)
- AES‑256 at rest; TLS 1.2+ in transit
- RBAC (minimum necessary); session timeout 15m; re‑auth on sensitive actions
- Audit logging of all PHI access and changes (6‑year retention)
- Integrity controls for documents (checksums), note versioning

## 9. Success Criteria
- End‑to‑end video consults; secure messaging and billing flows work (test cards)
- EHR FHIR read workflows integrated
- CI gates (coverage ≥ 80% for PHI modules; no critical vulns)

## 10. Dependencies/Risks
- EHR sandbox availability; client compliance sign‑off; Stripe readiness

## 11. Milestones (Indicative)
- M1 (Weeks 1–3): Auth, Profiles, Appointments CRUD, base UI
- M2 (Weeks 4–6): Video, Messaging MVP, Billing (test)
- M3 (Weeks 7–8): FHIR read, Reporting basics, UAT