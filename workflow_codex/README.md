# Codex Workflow · Phases 2–6 Operational Playbook

This playbook translates the Phase 2–6 expectations from `AGENTS.md` into executable protocols tailored for Codex AI. Each phase is packaged as a Markdown guide that lists the required inputs, automation hooks, quality gates, and deliverables. Run every phase sequentially after completing the existing Protocol 0/1 brief and PRD flows.

## Available Phase Guides

| Phase | File | Focus |
| --- | --- | --- |
| 2 | `phase-2-design-planning.md` | Convert the brief pack into validated architecture, contracts, and an initialized repository. |
| 3 | `phase-3-foundations-quality.md` | Stand up security, performance, accessibility, analytics, and CI guardrails. |
| 4 | `phase-4-feature-integration.md` | Deliver features behind flags, wire telemetry, and keep staging stable. |
| 5 | `phase-5-hardening-launch.md` | Finalize deployment, compliance, SEO/i18n, and go-live evidence. |
| 6 | `phase-6-operations-improvement.md` | Sustain operations, patch dependencies, and drive continuous improvement. |

## How to Use

1. Finish Protocols 0–1 (Context Kit and PRD) using the existing `workflow4` guides.
2. For each phase 2–6 file, follow the "Automation" steps to drive the commands documented in `docs/LOCAL_DEV_WORKFLOW.md`.
3. Store artefacts under the generated project directory (`${PROJECT_DIR}`) created by the lifecycle scripts. Each phase file lists the exact folders.
4. Capture approvals and automated gate results before advancing to the next phase. Phase boundaries require evidence plus reviewer alignment.
5. Keep secrets human-owned—reference secret placeholders but never commit live credentials. Use `.env.template` or vault references only.

Codex can execute every checklist in a non-interactive environment provided the prerequisite tooling (Python 3.11+, Node.js 18+, Docker, Git) is available, matching the local lifecycle guide.
