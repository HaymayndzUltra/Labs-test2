# Background Agent Prompt: F8 — Security & Compliance

## Goal
Embed security across SDLC with policy-as-code and compliance evidence.

## Context Package
- Threat model templates, compliance requirements (e.g., SOC2, GDPR)
- SAST/DAST tools, SBOM tooling
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Threat modeling and secure coding standards
2. Dependency scanning and secrets management
3. SBOM generation and compliance evidence folder structure

## Success Criteria
- Zero critical vulnerabilities; SBOM published; evidence organized

## Integration Requirements
- CI gates for security checks; collaborate with QA on abuse cases

## Quality Gates
- Policy-as-code rules pass; pentest findings resolved; audit trail complete

## Output Instructions
- PR to `integration`: `security/threat-model/*.md`, `.github/dependabot.yml`, `security/sbom/*`, `compliance/evidence/*`
