## Active Route Report (Brief-driven start → subsequent triggers)

### Starting Rule(s)
- `.cursor/rules/project-rules/execution-plan-orchestrator.mdc`
  - Brief reference (verbatim):
    - Line: "- brief_paths: one or more markdown/text files containing the client brief/requirements."
  - Triggers section (verbatim headings/lines):
    - "## [STRICT] Trigger Contract (no deploy)"
    - "- BR (Brief→Plan Draft):"
    - "- AP (Approve Plan):"
    - "- LA (Launch Backend):"
    - "- LB (Launch Frontend):"
    - "- LC (Launch DevOps) [optional]:"
    - "- CS (Conflict Scan):"
    - "- QA (Quality Gates):"
    - "- PR (PR Evidence):"
    - "- HP (Help/Status):"

- `.cursor/rules/project-rules/fe-be-plan.mdc`
  - Brief reference (verbatim):
    - Line: "- `brief.md` (client brief)"
  - Triggers (verbatim bullets):
    - "- `PLAN`: read the brief → generate PLAN.md + tasks.json"
    - "- `RUN_BE`: execute BE lane in order until milestone/blocker"
    - "- `RUN_FE`: execute FE lane in order until milestone/blocker"
    - "- `CSAN`: conflict scan + mitigations (resequencing, mocks, feature flags)"
    - "- `QA`: tests/lints/coverage for completed scope only"
    - "- `PR`: artifacts + acceptance checklist; STOP (no deploy)"
    - "- `STATUS`: progress, blocked_on, next allowed triggers"

### Brief Path Existence
- TODO:BRIEF_REQUIRED (No concrete brief.md/brief_paths provided in repository scope for this run.)

