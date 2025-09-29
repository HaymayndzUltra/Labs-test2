# PROTOCOL 5: IMPLEMENTATION RETROSPECTIVE

## Purpose
Capture lessons learned, confirm business outcomes, and update organizational knowledge after quality-controlled delivery. The retrospective closes the loop by improving rules, documentation, and future planning accuracy.

## Primary Role
**AI Process Improvement Lead & Knowledge Curator** – responsible for synthesizing technical outcomes, process performance, and stakeholder feedback into actionable improvements.

## Inputs
- Approved Quality Control Audit Report (Protocol 4)
- Final task plan with completion statuses and evidence
- Release notes, deployment outcomes, and monitoring data (if available)
- Stakeholder availability for feedback

## Outputs
1. Retrospective report stored in `docs/retrospectives/<feature>.md` or equivalent.
2. Action items assigned to owners with due dates (rules updates, documentation changes, backlog tasks).
3. Maintenance and monitoring follow-up plan.
4. Repository updates reflecting lessons learned (rule adjustments, documentation improvements).

---

## Workflow

### Phase 0: Preparation & Context Refresh
1. **Action:** Review Protocols 0–4 artifacts (Context Kit, PRD, task plan, QC report).
2. **Action:** Identify key decisions, risks encountered, and mitigations applied.
3. **Action:** Collect release metrics (deployment success, defect counts, support tickets, performance metrics) if the change has shipped.
4. **Checkpoint:** Outline the agenda and share it with stakeholders: `Retrospective agenda ready: focus on outcomes, process, improvements.`

### Phase 1: Technical Outcome Review
1. **Action:** Summarize delivered functionality and link to business goals from the PRD.
2. **Action:** Confirm production status:
   - Deployment date & environment
   - Monitoring/alerting status and observed signals
   - Outstanding defects or follow-up tasks
3. **Action:** Evaluate whether acceptance criteria and success metrics were met. Note deviations and reasons.
4. **Action:** Document maintainability considerations (tech debt incurred, refactors deferred, data migrations to monitor).
5. **Checkpoint:** Share the outcome summary with stakeholders for confirmation.

### Phase 2: Process Analysis
1. **Action:** Assess each protocol stage for effectiveness:
   - Bootstrap (context clarity, missing information)
   - PRD creation (requirement gaps, accuracy)
   - Task generation (plan completeness, sequencing issues)
   - Task execution (blockers, rework, tooling friction)
   - Quality control (issues found late, automation coverage)
2. **Action:** Gather stakeholder feedback through targeted prompts:
   - Communication clarity and responsiveness
   - Speed vs. quality balance
   - Collaboration experience across teams or AI agents
3. **Action:** Identify positive patterns to preserve and friction points to address.
4. **Checkpoint:** Validate findings with participants; adjust if additional context emerges.

### Phase 3: Improvement Actions & Knowledge Capture
1. **Action:** Convert findings into actionable improvements, each with owner, due date, and success metric.
   - Rule updates (`.mdc` or `.md`), documentation changes, automation enhancements, backlog tasks.
2. **Action:** Record lessons learned, best practices, and anti-patterns in the Context Kit or centralized knowledge base.
3. **Action:** Define maintenance follow-ups (monitoring checks, data quality reviews, support playbooks).
4. **Action:** Update PRD or task artifacts with post-release notes if relevant for future reference.
5. **Checkpoint:** Obtain agreement on the action list and confirm tracking location (issue tracker, documentation, roadmap).

### Phase 4: Publish Retrospective Report
Use the template below:
```markdown
# Implementation Retrospective: <Feature>

## 1. Summary
- Business objective recap
- Delivered scope
- Deployment status

## 2. Outcome Assessment
- Success metrics achieved/not achieved
- Acceptance criteria verification
- Production observations & monitoring results

## 3. Process Insights
- What worked well
- What was challenging
- Risks encountered & mitigations

## 4. Improvement Actions
| ID | Description | Owner | Due Date | Status |
|----|-------------|-------|---------|--------|

## 5. Maintenance Plan
- Follow-up tasks (logging, monitoring, data backfills)
- Support readiness and handoffs

## 6. Knowledge Updates
- Documentation/rule updates applied
- Lessons learned added to Context Kit

## 7. Open Questions
- Items requiring further research or future iteration
```

### Phase 5: Closeout
1. **Action:** Distribute the final report and confirm stakeholders acknowledge receipt.
2. **Action:** Ensure action items are created in the project management system or repository issues.
3. **Action:** Archive evidence (logs, metrics, recordings) referenced in the retrospective.
4. **Action:** Update the Context Kit with links to the retrospective and action trackers.
5. **Checkpoint:** Announce completion: `Retrospective complete. Action items tracked in <location>.`

---

## Quality Gates
- All stakeholders confirm the accuracy of outcome and process summaries.
- Improvement actions have owners, due dates, and tracking locations.
- Maintenance plan addresses monitoring, support, and follow-up technical debt.
- Knowledge base updated to reflect new insights or rule changes.

## Transition & Continuous Improvement
- Feed confirmed improvements back into Protocols 0–4 (update templates, rules, checklists).
- Schedule future reviews if long-term monitoring or phased rollouts are required.
- Highlight major learnings in team communications or onboarding materials to propagate knowledge.

## Messagebox Macro (Optional)
```
/apply-instructions-from-5-implementation-retrospective.md
# Prepare retrospective artifacts
/run: bash -lc 'mkdir -p docs/retrospectives && touch docs/retrospectives/<feature>.md'
/run: bash -lc 'mkdir -p evidence/retrospective'
```
