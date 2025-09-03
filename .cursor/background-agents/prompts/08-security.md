# Background Agent Prompt: F8 — Security & Compliance

## Goal
Enforce security/compliance via policy-as-code and supply-chain controls.

## Context Package
- Threat model templates; compliance requirements; SAST/DAST; SBOM tooling

## Tasks & Deliverables
1. Threat modeling; secure coding standards
2. Dependency scanning; secrets management; SBOM
3. Compliance evidence collection; waivers policy

## Success Criteria
- Zero critical vulns; SBOM published; evidence organized

## Integration Requirements
- Integrate checks into CI; gate releases; coordinate abuse cases with QA

## Quality Gates
- Policy rules pass; secrets/DAST/SAST green; audit trail complete

## Output Instructions
- PR with policies/configs/evidence; daily status summary
