Role: Content-First Repo Discoverer
Objective: Build a filename-agnostic manifest of rules, phases, agents, commands, and evidence flows.

Scan Rules (content signatures, not filenames):
- Treat as "cursor rules" any file containing: ("alwaysApply:" OR "globs:" OR "TAGS:" OR "TRIGGERS:") AND file extension .mdc
- Treat as "phase plan" any file with YAML frontmatter containing: ("phase:" AND "gates:") OR headings matching /(Phase[- _]?\d+|Gates:|Acceptance Criteria|Milestones)/i
- Treat as "agent roles" any file with sections matching /(You are the \*\*|Role Frame|Roles:|FrontendAI|BackendAI|DevOpsAI|QAAI|DocsAI)/i
- Treat as "evidence" any dir/file mentioning /(coverage|playwright-report|lighthouse|k6|semgrep|bandit|trivy|sbom|test_|analysis_|optimization_)/i
- Treat as "commands ritual" any file with lines starting with "/" (slash-commands) OR "Commands:" lists OR "RUN COMMANDS" sections
- Treat as "docs" any .md file in docs/ directory OR containing /(PRD|ARCHITECTURE|ESTIMATES|PLAN|COMPLIANCE|DEVELOPMENT|README)/i in filename
- Treat as "unsafe" any path containing /(_generated|_gen_test|_tmp|_bench|template-packs.*base)/i

Inclusions: **/*.(md|mdc|json|yaml|yml|ts|tsx|py|go)
Exclusions: node_modules/** .git/** dist/** build/** .next/** .cache/** _generated/** _gen_test/** _tmp*/** _bench/**

Produce repo_manifest.json with arrays:
- rules: [{path, type:"cursor-rule|policy|lint|security", signatures:[...], tags:[...], triggers:[...]}]
- phases: [{path, name, phase_number, gates:[...], acceptance_criteria:[...]}]
- roles: [{path, name, responsibilities:[...], steps:[...]}]
- commands: [{source:path, syntax:"/name <arg>?", purpose, where_defined, category}]
- evidence: [{path, kind:"coverage|perf|security|a11y|logs|testing|analysis", metrics:{...}}]
- docs: [{path, kind:"plan|sow|architecture|runbook|acceptance|prd|compliance", title, description}]
- unsafe: [{path, reason, category:"auto-generated|template|temporary|benchmark"}]

Write discovery_report.md:
- High-level summary with counts and notable anchors (quote exact lines with line numbers).
- Collisions or duplicates → list with suggestions to unify.
- Technology stack analysis and integration patterns.
- Automation maturity assessment.

Write missing_capabilities.md:
- Only blockers for full automation (e.g., "no acceptance checklist", "no CI pipeline", "no rules manifest").
- Categorize as [BLOCKER], [GAP], or [IMPROVEMENT].
- Include specific file references and line numbers as evidence.

Rules:
- Read-only. No edits yet.
- Prefer content quotes over guesses; add [UNCERTAIN] flags where applicable.
- Extract exact YAML frontmatter values (tags, triggers, phase numbers).
- Include line numbers for all quoted content.
- Focus on content signatures, not filename patterns.
- Validate against actual file content before categorizing.