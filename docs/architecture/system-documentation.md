---
title: "AI Governor Framework — System Documentation"
status: stable
owners: [governor]
last_updated: 2025-09-06
---

## Executive Summary

The AI Governor Framework is a rule- and protocol-driven system that governs AI-assisted development. It standardizes context discovery, collaboration, modification safety, quality, security, and workflow orchestration. External AI systems integrate via filesystem/CLI (primary) or optional HTTP wrappers.

## Architecture Overview

Directories:
- `.cursor/rules/`: governance rules
- `.cursor/dev-workflow/`: router, policy DSL, CI gates, schemas, protocols
- `.cursor/background-agents/`: prompts, launch docs
- `docs/architecture/`: specifications and contracts

Core Components:
- Context BIOS (rule discovery & announcement)
- Governance Precedence (conflict resolution ordering)
- Collaboration Guidelines (planning, tool usage, todos, communication)
- Modification Safety, Code Quality, Complex Feature Preservation, Documentation Integrity
- F8 Security & Compliance Overlay
- Decision Router + Policy DSL
- CI Gates & Evidence
- Background Agents (optional parallelization)

## Component Details

### Rules Engine (Master/Common/Project)
- Role: encode architecture, safety, and process constraints.
- Activation: BIOS selects rules by `alwaysApply`, `SCOPE`, `TRIGGERS`, `TAGS`.
- Interaction: precedence resolves conflicts; F8 overrides unsafe paths.

### Dev-Workflow Layer
- Router: evaluates policies using context substrings and precedence; emits routing logs.
- Policy DSL: JSON schema-validated control plane for routing decisions.
- CI Gates: validates artifacts, security, and governance evidence.
- Protocols 0–5: bootstrap, master planning, PRD creation, task generation, execution, retrospective, and coordination.

### Background Agents
- Phase-based orchestration (Discovery → Planning → UX → Architecture → Impl → QA → Security → Release → Observability).
- Produce PRs and artifacts with routing logs attached.

## Data Contracts

- Routing Log (`.cursor/dev-workflow/schemas/routing_log.json`): `session_id`, `timestamp`, `decision`, `rules_considered[]`, `winning_rule`, optional `confidence`, `override_reason`, `approver`, `snapshot_id`.
- Policy DSL (`.cursor/dev-workflow/policy-dsl/_schema/schema.json`): `name`, `scope`, `priority`, `actions`, optional `conditions[]`, `waiver_allowed`, `precedence_tag`.
- CI Gates (`.cursor/dev-workflow/ci/gates_config.yaml`): paths, checks, enforcement.
- Reports: `reports/audit-*.md`, `reports/validation-*.md`.
- Snapshots: `{ snapshot_id, git_commit, rules_manifest[] }`.

## Workflows

1) Bootstrap & Context Engineering (Protocol 0)
   - Configure rules, map repo, analyze key files, synthesize principles, create READMEs and project rules.

2) Master Planner (Protocol 0, planner variant)
   - Produce strategies and prompts for multi-framework execution.

3) PRD → Tasks → Execution (Protocols 1–3)
   - PRD creation with architectural placement → task generation → controlled execution with rule announcements and per-task validation.

4) Retrospective & Improvement (Protocol 4)
   - Self-audit and collaborative improvements to rules and docs.

5) Background Agent Coordination (Protocol 5)
   - Phase launches, handoffs, gates, and final integration.

## Internal Algorithms (Key)

- BIOS: inventory rules, read READMEs, select rules, announce.
- Precedence: F8 > Audit/Validate > Safety > Quality > Complex > Collab > Docs > Router > Project.
- Router: load precedence → read policies → substring condition match → priority sort → precedence tie-break → emit log.

## Integration Mechanisms

Primary (Filesystem + CLI):
- Router: `python3 .cursor/dev-workflow/router/router.py <git_commit>`.
- Policies: write JSON to `.cursor/dev-workflow/policy-dsl/`; lint.
- CI: `python3 .cursor/dev-workflow/ci/run_gates.py`.

Optional HTTP Wrapper:
- `POST /governor/router/run` → returns routing log JSON.
- `PUT /governor/policies/{name}` → upsert policy.
- `POST /governor/ci/run` → run gates, return status.
Security: mTLS + service JWT scopes.

Adapters (Data/Compute Plane):
- See `docs/architecture/ai-integration.md` for LLM/Embeddings/Vector/Tool/File interfaces.

## Security & Compliance

- F8 overlay blocks hardcoded secrets and critical vulnerabilities; requires SBOM for releases.
- Waivers require `approver` and recorded `override_reason`; routed in logs and PR notes.
- Logs retained; PII redaction; transport and at-rest encryption.

## Extension Points

- Policies: add new actions/conditions; use `precedence_tag` for ties.
- Provider adapters: implement LLM/Embeddings/Vector/Tools/File interfaces.
- Gates: extend `gates_config.yaml` and provide check runners.
- HTTP wrapper: offer endpoints to remote systems.

## End-to-End Reference Flows

### Orchestrator-Driven Build
1. Snapshot → `snapshot_id`.
2. Policies → linter pass.
3. Router → routing log (persist).
4. Execute actions → artifacts.
5. CI gates → pass/waiver → merge.

### Background Swarm
1. Launch Phase 1 → collect → route handoffs.
2. Launch Phases 2/3 → validate → integrate.

### Security-Gated Release
1. F8 scans & SBOM → criticals require waiver.
2. Record in logs/PR → proceed on green.

## Compatibility & Versioning

- Stable required fields for routing logs and policy DSL; optional fields may expand.
- `.cursor/` layout stable; protocol docs authoritative.

## Pointers

- Architecture: `docs/architecture/cursor-architecture.md`
- API Reference: `docs/architecture/governor-api.md`
- Communication Protocol: `docs/architecture/communication-protocol.md`
- Master Rules & Workflows: `docs/architecture/master-rules-and-workflows.md`
- Technical Specification: `docs/architecture/technical-specification.md`
- External Integration Guide: `docs/architecture/external-integration-guide.md`

