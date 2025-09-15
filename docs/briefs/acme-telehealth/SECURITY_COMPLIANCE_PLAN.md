# Security & Compliance Plan — ACME Telehealth

## HIPAA Technical Safeguards
- Encryption at Rest: AES‑256 (RDS, S3)
- Encryption in Transit: TLS 1.2+
- Access Control: RBAC (Auth0), minimum necessary access
- Session Management: Timeout 15 minutes; re‑auth for sensitive actions
- Audit Logging: All PHI access and changes; 6‑year retention
- Integrity Controls: Checksums for file uploads; note versioning
- Transmission Security: Secure messaging channels; presigned URLs for files

## Privacy Controls
- No PHI in logs; structured logging with redaction
- Data retention policy (per client policy) and secure purge procedures

## Operational Controls
- CI Gates: coverage ≥ 80% for PHI modules; no critical vulns
- Incident Response: on-call escalation, playbooks in RUNBOOK.md
- Backups: regular RDS snapshots, S3 lifecycle policies; restore tests

## Evidence Mapping
- `validation/compliance_report.json` (docs control mentions)
- Audit log samples for PHI access/change events
- Config snapshots (Auth0 RBAC roles, session settings)