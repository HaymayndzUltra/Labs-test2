# Protocol 5 · Implementation Retrospective & Continuous Improvement

## Purpose & Role
- **Role:** Continuous Improvement Lead facilitating reflection across product, engineering, QA, and operations.
- **Mission:** Assess delivery outcomes, capture lessons learned, and feed improvements back into rules, documentation, and planning assets.
- **Success Criteria:** Retrospective report with validated findings, prioritized improvement actions, ownership assignments, and updates to shared knowledge bases.

## Required Inputs
- Final audit report from Protocol 4 and associated evidence.
- PRD, task plan, and Context Kit (including risk and decision logs).
- Deployment results, monitoring data, user feedback, and support tickets (if applicable).
- Metrics dashboards or analytics that reflect business and technical outcomes.

## Expected Outputs
1. Retrospective summary documenting what went well, what needs improvement, and data-driven insights.
2. Action plan with owners, due dates, and links to updated rules/docs/backlog items.
3. Updates to rule sets, playbooks, or templates reflecting lessons learned.
4. Knowledge artifacts (ADR updates, FAQs, onboarding notes) for future teams.
5. Communication to stakeholders highlighting outcomes, risks, and next steps.

## Phase Breakdown

### Phase 0 · Preparation & Data Collection
1. Re-run rule/context discovery to incorporate any updates post-QC.
2. Gather timeline of key events (kickoff, approvals, releases, incidents).
3. Compile metrics: delivery velocity, defect counts, test coverage, deployment frequency, business KPIs.
4. Collect qualitative feedback from stakeholders, implementers, QA, operations, and end users.

### Phase 1 · Outcome Review
1. Compare delivered functionality against PRD goals, success metrics, and business KPIs.
2. Evaluate quality outcomes: defect leakage, severity of issues found, production stability.
3. Assess delivery performance: schedule adherence, scope adjustments, resource utilization.
4. Review customer or user impact: satisfaction scores, adoption metrics, support volume.

### Phase 2 · Process Analysis
1. Examine each protocol stage (0–4) for friction points, rework, or deviations from plan.
2. Identify decisions that led to positive or negative outcomes (architecture choices, testing approaches, collaboration patterns).
3. Analyze communication effectiveness, availability of context, and clarity of responsibilities.
4. Surface systemic issues (tooling gaps, environment instability, unclear rules) requiring structural fixes.

### Phase 3 · Improvement Planning
1. Translate findings into specific actions categorized by theme (Process, Tooling, Documentation, Rules, Training, Product).
2. Prioritize actions by impact and effort; assign owners and deadlines.
3. Determine whether actions should become backlog items, rule updates, ADRs, or experiments.
4. Define measurable success criteria for each action to enable follow-up.

### Phase 4 · Knowledge Capture & Dissemination
1. Update rule files, templates, or playbooks with refined guidance (include rationale and references).
2. Document lessons learned in ADRs, retrospectives folder, or knowledge base entries.
3. Share summaries with stakeholders, highlight key achievements, and acknowledge contributors.
4. Update the Context Kit with new insights, risks, or standard operating procedures.

### Phase 5 · Close-Out & Follow-Up
1. Schedule follow-up reviews to track action item completion.
2. Archive retrospective artifacts for future reference and onboarding.
3. Confirm that outstanding risks or deferred scope items are transferred to the product backlog.
4. Provide clear signal that the initiative has exited the delivery cycle or note upcoming iterations.

## Retrospective Template (Reference)
```markdown
# Retrospective · <Feature / Iteration>
- **Date:**
- **Facilitator:**
- **Participants:**
- **Delivery Window:**

## 1. Goals & Outcomes
- Planned vs. actual scope
- Business impact & KPIs
- Quality metrics (defects, coverage, MTTR)

## 2. Highlights
- Successes worth repeating
- Innovations or practices to standardize

## 3. Challenges & Root Causes
- Issues encountered
- Root-cause analysis (5 Whys / Fishbone)

## 4. Improvement Actions
| Category | Description | Owner | Due Date | Success Metric |
|----------|-------------|-------|---------|----------------|

## 5. Rule / Documentation Updates
- Files to update
- Summary of changes

## 6. Follow-Up Items
- Deferred scope or risks
- Upcoming checkpoints
```

## Quality Gates & Checkpoints
- **Evidence Gate:** Findings supported by data (metrics, logs, feedback).
- **Action Gate:** Each improvement has an owner, due date, and metric.
- **Knowledge Gate:** Relevant rules, docs, and templates updated.
- **Communication Gate:** Retrospective outcomes shared with stakeholders.
- **Follow-Up Gate:** Tracking mechanism established for action items.

## Transition to Future Work
Use the retrospective outputs to refine Protocols 0–4 before the next initiative. Ensure action items are logged in the appropriate backlog or governance system and schedule the next retrospective review.

*This protocol closes the loop, ensuring continuous learning and proactive improvement across the entire development lifecycle.*
