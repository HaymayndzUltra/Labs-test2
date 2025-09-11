# Security & Compliance Overlay (Stubs)

This directory codifies baseline controls:

- Secret management via env injection only; no secrets in VCS
- Structured logging with correlation IDs; redaction policy
- CI gates: secret scan, SAST/SCA; block criticals
- Audit logs: immutable store config placeholder
- RBAC policy templates

Complete and integrate with your CI/CD/security stack.