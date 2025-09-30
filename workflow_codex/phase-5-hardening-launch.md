# Phase 5 · Hardening & Launch Readiness Guide

## Purpose & Role
Prove production readiness by finalizing deployment strategies, observability, documentation, compliance, and stakeholder sign-off. Act as the **AI Release & Reliability Lead** driving go-live validation.

## Required Inputs
- Stable staging build with green smoke/E2E reports.
- Observability spec, draft SLOs, feature flags, and quality artefacts from previous phases.
- Access to deployment tooling, runbooks, legal/privacy checklists, and UAT plans.

## Expected Outputs
- `operations/Deployment_Runbook.md` and `operations/Rollback_Plan.md`.
- Production-ready dashboards and alert definitions (`observability/dashboards/*.json`).
- `operations/Backup_Policy.md`, `operations/DR_Plan.md`, and restore test evidence.
- Updated docs (`README.md`, `CONTRIBUTING.md`, onboarding guides, ADR revisions).
- Public SEO/i18n assets (`seo/checklist.md`, `public/sitemap.xml`, `public/robots.txt`) when applicable.
- `GoLive_Checklist.md`, signed UAT report, final release notes.

## Automation Hooks
1. Rehearse deployment & rollback:
   ```bash
   ./scripts/deploy_to_env.sh --env staging --strategy canary --dry-run
   ./scripts/rollback_env.sh --env staging --verify
   ```
2. Validate backups and DR:
   ```bash
   ./scripts/test_backup_restore.sh --out "${PROJECT_DIR}/evidence/restore-report.md"
   ```
3. Generate documentation updates:
   ```bash
   python scripts/update_readme.py --root "$PROJECT_DIR"
   python scripts/update_contributing.py --root "$PROJECT_DIR"
   ```
4. Build compliance and submission packs:
   ```bash
   PROJECT_ROOT="$PROJECT_DIR" NAME="$NAME" ./scripts/build_submission_pack.sh
   python scripts/validate_compliance_assets.py | tee "${PROJECT_DIR}/evidence/validate_compliance_assets.log"
   python scripts/check_compliance_docs.py || true
   ```
5. Compile go-live checklist:
   ```bash
   python scripts/generate_go_live_checklist.py --root "$PROJECT_DIR" --out "${PROJECT_DIR}/GoLive_Checklist.md"
   ```

## Step-by-Step Checklist
1. **Deployment Strategy & Rehearsal**
   - Finalize blue-green/canary plan with rollback triggers.
   - Schedule and document a full rollback rehearsal with timestamps and participants.
2. **Observability & Alerts**
   - Promote dashboards to production workspace; ensure alerts include runbook links and on-call rotation.
   - Run chaos or load tests if required and record results.
3. **Backup & Disaster Recovery**
   - Confirm backup frequency, retention, and encryption.
   - Execute restore test and verify RPO/RTO compliance.
4. **Documentation & Knowledge Transfer**
   - Refresh README, CONTRIBUTING, onboarding docs, ADRs, and runbooks.
   - Capture training videos or Loom links if applicable.
5. **UAT, Legal, Privacy**
   - Facilitate UAT session, collect sign-offs, and document findings.
   - Ensure privacy notices, DPA updates, and legal approvals are complete.
6. **SEO/i18n (contextual)**
   - Generate SEO checklist, sitemap, robots, and structured data when shipping a public experience.
7. **Release Notes & Communication**
   - Publish final release notes, stakeholder briefings, and support playbooks.

## Quality Gates
- ✅ Canary plan executed and rollback rehearsal logged.
- ✅ Alerts actionable with noise thresholds defined; on-call rota documented.
- ✅ Restore test passed with evidence attached.
- ✅ UAT, legal, privacy sign-offs captured.
- ✅ Go-Live checklist completed with 100% pass rate.

## Handoff to Phase 6
Submit deployment runbook, alert catalog, DR evidence, compliance logs, and go-live checklist to operations owners. Confirm on-call schedule and support contacts before launching.
