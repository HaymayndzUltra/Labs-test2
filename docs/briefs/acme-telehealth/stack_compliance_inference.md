# ACME Telehealth — Stack & Compliance Inference (Dry)

## Proposed Stack (with rationale)
- Frontend: Next.js 14 (App Router, SSR where applicable)
  - Rationale: Fast DX, SEO-friendly, mature ecosystem; aligns with brief
- Backend: FastAPI (async)
  - Rationale: Python ecosystem for healthcare, Pydantic v2; clear typing and speed
- Database: PostgreSQL
  - Rationale: Relational integrity; audit-friendly; extensions for analytics
- Auth: Auth0
  - Rationale: Enterprise SSO; MFA; RBAC support; HIPAA-eligible
- Files: S3 presigned URLs
  - Rationale: Secure object storage with signed access
- Infra: AWS (ECS/Fargate, RDS, CloudFront)
  - Rationale: Managed services, multi‑AZ; aligns with brief
- Video: Twilio Video
  - Rationale: HIPAA‑eligible service; pre‑join checks
- Payments: Stripe
  - Rationale: Trusted payment rails; healthcare-ready flows

## Compliance Candidates (HIPAA)
- Encryption at rest: AES‑256 on RDS and S3
- Encryption in transit: TLS 1.2+
- Access Control: RBAC via Auth0; minimum necessary
- Session Timeout: 15 minutes; re‑auth for sensitive actions
- Audit Logging: All PHI access/changes; 6‑year retention
- Integrity Controls: Checksums for uploads; versioning for notes
- Transmission Security: Secure messaging; signed URLs for files

## Notes
- Phase 2: EHR write‑back; DB read replicas; Terraform/IaC
- Observability: structured logs with correlation id; basic APM traces