# /rules-normalize — Normalize Project Rules Frontmatter

Purpose:
- Ensure `.cursor/rules/project-rules/**/*.mdc` use correct frontmatter:
  - description: human guidance (no TAGS/TRIGGERS/SCOPE)
  - globs: comma-separated (no quotes/spaces), e.g., **/*.ts,**/*.tsx
  - alwaysApply: false

Step 1 — Preview changes
```bash
python scripts/normalize_project_rules.py --dry-run | cat
```
[HALT] Review proposed changes.

Step 2 — Apply changes
```bash
python scripts/normalize_project_rules.py --apply || exit 2
```
[HALT] Commit rule updates with a concise message.

Artifacts:
- Updated `.cursor/rules/project-rules/**/*.mdc`

Next:
- Re-run `/help` and proceed with your phase.