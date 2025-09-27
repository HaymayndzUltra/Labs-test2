# Retention & Security for Governance Artifacts

Retention policy (recommended defaults):

- Routing logs: retain for 90 days in secure artifact storage; archive to cold storage for 2 years.
- Snapshots: retain latest 10 snapshots; older snapshots purged after 30 days unless referenced by a release.
- Waivers: retain permanently with PR reference and approver audit trail.

Storage & access:

- Store routing logs and snapshots in encrypted artifact storage accessible to the audit team and CI system.
- Restrict write access to `/.cursor/dev-workflow/waivers/` to approvers via repository-level protections.

Audit & compliance:

- All overrides and waivers must include an approver and `override_reason` in the routing logs.
- Periodic audit (quarterly) to review waivers and high-risk overrides.

