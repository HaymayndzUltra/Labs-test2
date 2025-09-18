Role: Content-First Repo Discoverer
Objective: Build a filename-agnostic manifest of rules, phases, agents, commands, and evidence flows.

Scan Rules (content signatures, not filenames):
- Treat as "cursor rules" any file containing: ("alwaysApply:" OR "globs:" OR front-matter with tags: [rules]) OR patterns like ".cursorrules".
- Treat as "phase plan" any file with headings matching /(Phase[- _]?\d+|Gates:|Acceptance Criteria|Milestones)/i.
- Treat as "agent roles" any file with sections /(Role Frame|Roles:|FrontendAI|BackendAI|DevOpsAI|QAAI|DocsAI)/.
- Treat as "evidence" any dir/file mentioning /(coverage|playwright-report|lighthouse|k6|semgrep|bandit|trivy|sbom)/i.
- Treat as "commands ritual" any file with lines starting with "/" (slash-commands) or "Commands:" lists.

Inclusions: **/*.(md|mdc|json|yaml|yml|ts|tsx|py|go)
Exclusions: node_modules/** .git/** dist/** build/** .next/** .cache/**

Produce repo_manifest.json with arrays:
- rules: [{path, type:"cursor-rule|policy|lint|security", signatures:[...]}]
- phases: [{path, name, gates:[...]}]
- roles: [{path, name, responsibilities:[...]}]
- commands: [{source:path, syntax:"/name <arg>?", purpose, where_defined}]
- evidence: [{path, kind:"coverage|perf|security|a11y|logs"}]
- docs: [{path, kind:"plan|sow|architecture|runbook|acceptance"}]
- unsafe: [{path, reason}] for ambiguous or auto-generated areas (avoid editing)

Write discovery_report.md:
- High-level summary with counts and notable anchors (quote exact lines).
- Collisions or duplicates → list with suggestions to unify.

Write missing_capabilities.md:
- Only blockers for full automation (e.g., "no acceptance checklist", "no CI pipeline", "no rules manifest").

Rules:
- Read-only. No edits yet.
- Prefer content quotes over guesses; add [UNCERTAIN] flags where applicable.
