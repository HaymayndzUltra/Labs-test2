## Gates Resolution

### /ci/gates.yml (Concrete)
- coverage: 80
- flake_rate_max: 0.02
- security.allow_critical: false
- release.cfr_max_percent: 15
- ux.require_tokens_versioned: true
- architecture.require_contract_tests_green: true

### /.cursor/dev-workflow/ci/gates_config.yaml (Concrete paths and checks)
- enforcement: block_on_fail
- cycle: 2025-09-08
- paths.security.findings: frameworks/security/findings.yaml
- paths.security.exceptions: frameworks/security/waivers.yaml
- paths.security.manifest: frameworks/security/manifests/2025-09/handoff_manifest.yaml
- paths.security.digest: frameworks/security/digests/2025-09-02-digest.md
- paths.qa.manifest: frameworks/qa-test/manifests/2025-09/handoff_manifest.yaml
- paths.qa.digest: frameworks/qa-test/digests/2025-09-02-digest.md
- paths.planning.fe_manifest: frameworks/planning-fe/manifests/2025-09-02-handoff_manifest.yaml
- paths.planning.be_manifest: frameworks/planning-be/manifests/2025-09-02-handoff_manifest.yaml
- paths.planning.central_manifest: frameworks/planning/manifests/2025-09/handoff_manifest.yaml
- paths.planning.fe_digest: frameworks/planning-fe/digests/2025-09-02-digest.md
- paths.planning.be_digest: frameworks/planning-be/digests/2025-09-02-digest.md
- paths.observability.manifest: frameworks/observability/manifests/2025-09/handoff_manifest.yaml
- paths.observability.digest: frameworks/observability/digests/2025-09-02-digest.md
- checks:
  - schema_lint
  - checksums_present
  - rule_hygiene
  - ui_schema_checks
  - policy_dsl_lint
  - routing_log_schema_check
  - f8_waiver_check
  - context_snapshot_check
  - security_critical_zero
  - snapshot_consistency
  - evidence_present

### /template-packs/cicd/gates_config.yaml (Templated)
- version: 1.0
- project: TEMPLATE
- industry: TEMPLATE
- compliance: TEMPLATE
- quality_gates.code_quality.lint.threshold: 0
- test_coverage.unit_tests.threshold: TEMPLATE (80 if healthcare/finance else 70)
- security.dependency_scan.thresholds: TEMPLATE (conditional HIPAA/PCI)
- performance.load_testing.enabled: TEMPLATE (true if ecommerce/finance)
- compliance_gates: TEMPLATE (hipaa/gdpr/sox/pci blocks conditional)
- environments.development.relaxed_thresholds.test_coverage.unit_tests.threshold: 60
- production.required_gates: "*"
- reporting.archive.retention_days: TEMPLATE (2555 if compliance else 90)
