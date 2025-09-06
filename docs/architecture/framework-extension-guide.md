---
title: "Framework Extension Points & Integration Patterns — AI Governor"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Objective

Define how to add a new framework (e.g., UI library, backend stack, tooling ecosystem) to the AI Governor system. This outlines required artifacts, interfaces, and protocols for seamless governance, routing, and CI integration.

## Minimum Requirements

1) Documentation
   - `docs/` additions: architecture overview, conventions, and usage for the new framework.
   - Project rules mapping back to docs.

2) Governance Rules
   - Add `project-rules/<framework>.mdc` under `.cursor/rules/project-rules/` with:
     - YAML frontmatter: `description` (with TAGS/TRIGGERS/SCOPE/DESCRIPTION) and `alwaysApply:false`.
     - Persona, core principle, STRICT/GUIDELINE directives, ✅/❌ examples.

3) Policies
   - Policy JSON in `.cursor/dev-workflow/policy-dsl/` encoding conditions/actions specific to the framework.
   - Use `precedence_tag` to align tie-breaking with `9-governance-precedence.mdc`.

4) CI Gates
   - Update `.cursor/dev-workflow/ci/gates_config.yaml` to include manifests/digests and any custom checks for the framework.

5) Artifacts
   - Contracts (e.g., OpenAPI, schema files), tokens, manifests/digests to satisfy gates.

6) Background Agent Prompts (optional)
   - Provide prompts in `.cursor/background-agents/prompts/` for discovery, planning, implementation, QA, etc.

## Interfaces & Protocols to Implement

### A. Rule Authoring
Follow `0-how-to-create-effective-rules.mdc`. Required:
- Frontmatter keys only: `description`, `alwaysApply:false`.
- Directive prefixes `[STRICT]` and `[GUIDELINE]` for all steps.
- Include ✅ Correct and ❌ Anti-pattern examples.

### B. Router Integration
Policies MUST:
- Conform to `.cursor/dev-workflow/policy-dsl/_schema/schema.json`.
- Declare `conditions[]` tokens (e.g., `framework:newfw`), `actions[]`, `priority`, and `precedence_tag`.
- Be linted by `policy-dsl/lint_policy.py`.

### C. CI Evidence
Framework MUST provide:
- `frameworks/<framework>/manifests/<cycle>/handoff_manifest.yaml` and digests.
- Any required schema/token files referenced by actions (e.g., `require:openapi_v1`).
- Optional: custom gate runners; reference from `checks:` in `gates_config.yaml`.

### D. Protocol Alignment
Ensure compatibility with dev-workflow protocols:
- Protocol 0 (Bootstrap): supply architecture docs to seed BIOS discovery.
- Protocol 1 (PRD): define placement and constraints for where new features land.
- Protocol 2 (Tasks): supply decomposition templates for the framework.
- Protocol 3 (Execution): define compliance checks and commit rules.
- Protocol 4 (Retro): enumerate improvement hooks.
- Protocol 5 (Coordination): define handoffs to/from adjacent frameworks.

## Extension Points

1) Project Rules
- Add specialized `.mdc` rules (naming: `newfw-*.mdc`), grouped under `.cursor/rules/project-rules/`.

2) Router Policies
- Introduce actions such as `require:newfw_contracts`, `require:newfw_tokens`, `gate:newfw_checks`.

3) Gates
- Extend CI by creating new checks; document runner location and contract.

4) Adapters (if the framework includes AI/data services)
- Implement LLM/Embeddings/Vector/Tool/File interfaces per `ai-integration.md` and expose via DI/config.

5) HTTP Wrapper
- Add endpoints for framework-specific operations if using the HTTP layer.

## Example: Adding "NewFW"

1. Create project rule: `.cursor/rules/project-rules/newfw.mdc`:
   ```markdown
   ---
   description: "TAGS: [newfw,ui] | TRIGGERS: newfw,component | SCOPE: NewFW | DESCRIPTION: NewFW UI conventions and patterns."
   alwaysApply: false
   ---
   # NewFW UI Rules
   ## AI Persona
   ...
   ## Protocol
   - [STRICT] Component structure ...
   - [GUIDELINE] Styling ...
   ## ✅ Correct
   ...
   ## ❌ Anti-pattern
   ...
   ```

2. Add policy: `.cursor/dev-workflow/policy-dsl/newfw.json`:
   ```json
   {
     "name": "newfw-defaults",
     "scope": "global",
     "priority": 8,
     "conditions": ["framework:newfw"],
     "actions": ["require:newfw_contracts", "gate:newfw_checks"],
     "precedence_tag": "7-dev-workflow-command-router",
     "waiver_allowed": true
   }
   ```

3. Update gates config to reference NewFW manifests/digests and checks.

4. Provide background agent prompts for NewFW discovery/planning/impl.

## Validation & Handoff

- Run policy linter; ensure router selects NewFW policies with your context tokens.
- Generate a snapshot; persist `snapshot_id` through agent runs and CI.
- Execute router; store routing log; include in PR descriptions.
- Produce artifacts to satisfy actions; run CI gates; fix or attach waivers (record approver/reason).

## Security & Compliance

- Follow F8 overlay: secrets, SCA/SAST, SBOM; record waivers.
- Use tenant-scoped configs; redact PII in logs.

