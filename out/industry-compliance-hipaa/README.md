# HIPAA Compliance Stubs

- Encryption: AES-256 at rest, TLS 1.2+ in transit
- Audit logging: PHI access/change events; correlation IDs
- RBAC: minimum necessary (Auth0 roles: admin, analyst, viewer)
- Session timeout: 15 minutes; re-authentication required
- Non-prod: No PHI; synthetic/masked data only

Fill in environment-specific configs before deploy.