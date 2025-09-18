# /5-implementation-retrospective — Retrospective & Improvements

Purpose:
- Summarize outcomes, capture learnings, and propose rule/process improvements (no auto-apply).

Step 1 — Summarize outcomes
- What was implemented (refer to tasks.json state changes)
- Which gates passed/failed
- Key blockers and mitigations

Step 2 — Evidence snapshot
```bash
ls -1 .cursor/ai-governor/run-history 2>/dev/null | tail -5 || true
```

Step 3 — Rule/process improvement proposals (dry)
- Note duplicate rules, unclear metadata, missing acceptance.
- Optionally run rule optimizer in report mode (no deletes in CI):
```bash
python optimize_rules.py --no-remove-duplicates --keep-strategy master_rules_first || true
```
[HALT] Decide which improvements to file as follow-up tasks/PRs.

Artifacts:
- Notes for PR description or follow-up issues

Next:
- /sync-tasks (to reconcile any remaining drift)
- Or /0-bootstrap-project for next project