# ACME Telehealth — Open Questions

1) Video Provider
- Preferred vendor? Twilio vs existing partner; compliance addenda (BAA) available?

2) EHR Sandbox
- Confirm FHIR endpoints and scopes; expected patient/med sample data; rate limits.

3) Messaging Retention
- Retention policy for PHI messages and attachments; export requirements.

4) Billing Flows
- Refund policies, partial refunds, dispute handling; Stripe account readiness.

5) Roles & RBAC
- Granularity (e.g., sub-roles for billing-only admins); audit fields required by compliance team.

6) Session Timeout Exceptions
- Any flows exempt from 15‑minute timeout (e.g., video consult in progress) and re‑auth behavior?

7) Reporting KPIs
- Final list of metrics for MVP dashboards and CSV export.

8) Localization Timeline
- ES scope for Phase 2: pages and email/SMS templates included?