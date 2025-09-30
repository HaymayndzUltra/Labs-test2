# Phase 6 · Launch, Operate & Improve Guide

## Purpose & Role
Sustain stable operations, remediate issues quickly, and drive continuous learning. Act as the **AI Operations Steward** partnering with on-call teams and product leads.

## Required Inputs
- Production release details, on-call schedule, dashboards, DR plans, and runbooks.
- Latest SLO/SLI targets, error budgets, and dependency inventories.
- Access to incident management tooling and backlog tracker.

## Expected Outputs
- Post-launch monitoring reports and incident log updates.
- Postmortems stored at `operations/postmortems/Postmortem-YYYY-MM-DD.md` with action items.
- Dependency update cadence notes (`operations/dependency-updates.md`).
- Monthly security review summary (`security/monthly-security-review.md`).
- Retro reports (`retro/Retro-YYYY-MM-DD.md`) with ≥3 action items and tracking links.
- Updated `CHANGELOG.md` reflecting ongoing releases.

## Automation Hooks
1. Monitor and collect metrics:
   ```bash
   python scripts/poll_metrics.py --out "${PROJECT_DIR}/metrics/runtime/weekly-report.json"
   python scripts/export_incidents.py --out "${PROJECT_DIR}/operations/incident-log.csv"
   ```
2. Dependency and security maintenance:
   ```bash
   ./scripts/run_dependency_updates.sh --out "${PROJECT_DIR}/operations/dependency-updates.md"
   PROJECT_ROOT="$PROJECT_DIR" python scripts/scan_deps.py
   ```
3. Postmortem template generation:
   ```bash
   python scripts/bootstrap_postmortem.py --out "${PROJECT_DIR}/operations/postmortems/Postmortem-$(date +%F).md"
   ```
4. Retro and action tracking:
   ```bash
   python scripts/bootstrap_retro.py --out "${PROJECT_DIR}/retro/Retro-$(date +%F).md"
   python scripts/sync_actions.py --retro "${PROJECT_DIR}/retro" --tracker jira
   ```

## Step-by-Step Checklist
1. **Monitoring & Incident Response**
   - Track key SLO indicators; alert when error budget consumption exceeds thresholds.
   - Conduct daily log reviews for anomalies and escalate incidents per runbook.
2. **Incident Handling & Postmortems**
   - Run post-incident reviews within 48 hours; document root causes, contributing factors, and corrective actions.
   - Assign owners and due dates; ensure follow-ups land in the backlog.
3. **Dependency & Security Cadence**
   - Schedule weekly dependency updates and monthly security patch windows.
   - Maintain vulnerability dashboard; ensure no high/critical issues remain open beyond 14 days without approved waiver.
4. **Continuous Improvement**
   - Host retros at least monthly with cross-functional attendees.
   - Track retro actions to completion and update rules/workflows accordingly.
5. **Change Management**
   - Maintain CHANGELOG entries for incremental releases.
   - Review feature flags for sunsetting and cleanup.

## Quality Gates
- ✅ SLOs met for 2–4 consecutive weeks before considering the phase stable.
- ✅ No high/critical vulnerabilities remain open beyond 14 days.
- ✅ Retro action items completed within agreed timelines.
- ✅ Incident response metrics (MTTR, MTTA) trend within target ranges.

## Exit Criteria
Remain in Phase 6 until operations meet all gates consistently. Use retrospective findings to improve Protocol 0 inputs for future initiatives and trigger new feature cycles when capacity is available.
