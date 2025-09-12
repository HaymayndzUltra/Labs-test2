## End-to-End Workflow Map (Client Brief → Final Stage)

This map enumerates only stages explicitly defined by existing `.mdc` rules, router configuration, and gates configuration. It starts at the first usage of a client brief and continues to the final stage defined by those rules.

### Sources considered
- Rules: `.cursor/rules/**.mdc`, `sample/MR/**.mdc`
- Router: `.cursor/dev-workflow/router/router.py`, `.cursor/rules/master-rules/7-dev-workflow-command-router.mdc`, `.cursor/dev-workflow/docs/router_contract.md`
- Gates: `.cursor/dev-workflow/ci/gates_config.yaml`, `ci/gates.yml`, `template-packs/cicd/gates_config.yaml`

---

## Flow A — Execution Plan Orchestrator (from brief)

Primary rule: `/.cursor/rules/project-rules/execution-plan-orchestrator.mdc`

#### Stage: BR (Brief → Plan Draft)
- **Trigger**: `BR`
- **Related rules/configs**:
  - `/.cursor/rules/project-rules/execution-plan-orchestrator.mdc`
  - Variant (enterprise): `/.cursor/rules/project-rules/enterprise-next-nest-plan.mdc`
  - Router reference: `/.cursor/dev-workflow/docs/router_contract.md`
- **Required inputs** (exact from rule):
  - `brief_paths` (one or more markdown/text files containing the client brief/requirements)
  - `context` (name, industry, project_type; optional: frontend, backend, database, auth, compliance, team lanes)
  - `policy` (optional)
- **Expected outputs**:
  - Plan artifacts as defined under “Outputs (single artifact per run)” in the rule:
    - DAG of tasks (id, title, area, estimate, blocked_by[], risks)
    - Labels (Blocking, Independent)
    - Lanes (A/B/(C), topologically ordered, cap 3 concurrent)
    - Conflicts Table (resource/file/port/db → guardrail)
    - Guided Triggers (BR, AP, LA, LB, LC, CS, QA, PR, HP)
  - BR-specific emission: summary, Blocking/Independent lists, lanes, conflicts table, and “Next: AP”
- **Acceptance criteria (applies to this orchestrator)**:
```
## [STRICT] Acceptance
- DAG + labels produced in <2s for typical briefs.
- ≤3 concurrent tasks per lane; parallel lanes where dependencies allow.
- Conflicts printed with at least one concrete mitigation each.
- Guided triggers listed with explicit go-signal; no deploy suggested or implied.
```

#### Stage: AP (Approve Plan)
- **Trigger**: `AP`
- **Related rules/configs**: same as BR
- **Required inputs**: Frozen plan from BR
- **Expected outputs**:
  - Freeze plan; lock lanes/ownership; snapshot DAG
  - Go-signal: “Run LA and LB in parallel” (LC only if present)
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: LA (Launch Backend)
- **Trigger**: `LA`
- **Related rules/configs**: same as BR
- **Required inputs**: Approved plan
- **Expected outputs**:
  - Execute Lane A until first milestone or block
  - On block: print blocker ids and choices; emit next allowed triggers
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: LB (Launch Frontend)
- **Trigger**: `LB`
- As per LA, for Lane B
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: LC (Launch DevOps/Compliance) [optional]
- **Trigger**: `LC`
- As per LA/LB for Lane C (only if present)
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: CS (Conflict Scan)
- **Trigger**: `CS`
- **Expected outputs**:
  - Re-scan conflicts; print mitigations and any resequencing deltas
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: QA (Quality Gates)
- **Trigger**: `QA`
- **Related rules/configs**:
  - `/.cursor/dev-workflow/ci/gates_config.yaml` (checks, artifacts paths)
  - `/ci/gates.yml` (project-wide thresholds)
  - `/template-packs/cicd/gates_config.yaml` (template quality gates)
  - Highest-priority security overlay referenced by governance:
    - Precedence file: `/.cursor/rules/master-rules/9-governance.mdc`
    - Security overlay (present as sample): `/sample/MR/F8-security-and-compliance-overlay.mdc`
- **Required inputs**:
  - Completed scope to test (per rule: “for COMPLETED scope only”)
  - Gates config files above
- **Expected outputs**:
  - Pass/fail report with next steps (per orchestrator rule)
  - CI evidence artifacts per `/.cursor/dev-workflow/ci/gates_config.yaml` `paths` (security/qa/planning/observability manifests and digests)
- **Acceptance criteria**:
  - Not specified in the orchestrator beyond the global acceptance (see BR section)
  - Gates configurations define thresholds; see exact criteria below in “Quality Gates Criteria (exact text)”

#### Stage: PR (PR Evidence)
- **Trigger**: `PR`
- **Expected outputs**:
  - “Acceptance checks, artifacts summary, changelog points; STOP. NO DEPLOY.” (exact per rule)
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

#### Stage: HP (Help/Status)
- **Trigger**: `HP`
- **Expected outputs**:
  - Trigger cheat sheet, plan status, current go-signal, and `blocked_on`
- **Acceptance criteria**: Not specified beyond the orchestrator-level acceptance above

---

## Flow B — FE/BE Plan Orchestrator (from brief)

Primary rule: `/.cursor/rules/project-rules/fe-be-plan.mdc`

#### Stage: PLAN (Generate plan from brief)
- **Trigger**: `PLAN`
- **Related rules/configs**:
  - `/.cursor/rules/project-rules/fe-be-plan.mdc`
  - Reference command: `scripts/plan_from_brief.py`
- **Required inputs** (exact from rule):
  - `brief.md` (client brief)
  - Optional config presets (stack/industry/features)
- **Expected outputs**:
  - `PLAN.md` (readable; FE/BE lanes, DAG, Blocking vs Independent, conflicts+mitigations, per-task acceptance, Next Triggers)
  - `tasks.json` (machine-readable task graph)
- **Acceptance criteria (exact text)**:
```
## Acceptance (PLAN)
- `PLAN.md` must have:
  - FE/BE lanes that are topologically ordered; Blocking vs Independent  
  - Conflicts table + mitigations  
  - Per-task acceptance + DoD  
  - Next Triggers line  
- `tasks.json` valid JSON; fields: id, title, area, estimate, blocked_by[], acceptance[], dod[], labels[], state  
- Total tasks ≥ 18 (BE ≥ 9, FE ≥ 9)
```

#### Stage: RUN_BE (Execute backend lane)
- **Trigger**: `RUN_BE`
- **Related rules/configs**: same file as above
- **Required inputs**: Plan artifacts from PLAN
- **Expected outputs**: Execute BE lane until milestone/blocker
- **Acceptance criteria**: Not specified

#### Stage: RUN_FE (Execute frontend lane)
- **Trigger**: `RUN_FE`
- **Related rules/configs**: same file as above
- **Required inputs**: Plan artifacts from PLAN
- **Expected outputs**: Execute FE lane until milestone/blocker
- **Acceptance criteria**: Not specified

#### Stage: CSAN (Conflict scan)
- **Trigger**: `CSAN`
- **Expected outputs**: Conflict scan + mitigations (resequencing, mocks, feature flags)
- **Acceptance criteria**: Not specified

#### Stage: QA (Quality gates for completed scope)
- **Trigger**: `QA`
- **Related rules/configs**:
  - `/.cursor/dev-workflow/ci/gates_config.yaml`
  - `/ci/gates.yml`
  - `/template-packs/cicd/gates_config.yaml`
- **Required inputs**: Completed scope to test; gates configs
- **Expected outputs**: Tests/lints/coverage results for completed scope only
- **Acceptance criteria**: Not specified in this rule (see “Quality Gates Criteria (exact text)”)

#### Stage: PR (Artifacts + acceptance checklist)
- **Trigger**: `PR`
- **Expected outputs**: Artifacts + acceptance checklist; STOP (no deploy)
- **Acceptance criteria**: Not specified

#### Stage: STATUS (Progress/help)
- **Trigger**: `STATUS`
- **Expected outputs**: Progress, `blocked_on`, next allowed triggers
- **Acceptance criteria**: Not specified

---

## Quality Gates Criteria (exact text)

### Project-level thresholds
File: `/ci/gates.yml`
```
coverage: 80
flake_rate_max: 0.02
security:
  allow_critical: false
release:
  cfr_max_percent: 15
ux:
  require_tokens_versioned: true
architecture:
  require_contract_tests_green: true
```

### Dev-workflow CI checks and artifact paths
File: `/.cursor/dev-workflow/ci/gates_config.yaml`
```
enforcement: block_on_fail
cycle: "2025-09-08"
paths:
  security:
    findings: frameworks/security/findings.yaml
    exceptions: frameworks/security/waivers.yaml
    manifest: frameworks/security/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/security/digests/2025-09-02-digest.md
  qa:
    manifest: frameworks/qa-test/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/qa-test/digests/2025-09-02-digest.md
  planning:
    fe_manifest: frameworks/planning-fe/manifests/2025-09-02-handoff_manifest.yaml
    be_manifest: frameworks/planning-be/manifests/2025-09-02-handoff_manifest.yaml
    central_manifest: frameworks/planning/manifests/2025-09/handoff_manifest.yaml
    fe_digest: frameworks/planning-fe/digests/2025-09-02-digest.md
    be_digest: frameworks/planning-be/digests/2025-09-02-digest.md
  observability:
    manifest: frameworks/observability/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/observability/digests/2025-09-02-digest.md

checks:
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
```

### Template-pack quality gates (industry-conditional, exact text)
File: `/template-packs/cicd/gates_config.yaml`
```
version: '1.0'
project: {{PROJECT_NAME}}
industry: {{INDUSTRY}}
compliance: {{COMPLIANCE}}

# Quality gate definitions
quality_gates:
  # Code quality gates
  code_quality:
    lint:
      enabled: true
      required: true
      threshold: 0  # No lint errors allowed
      blocking: true
      skip_on_emergency: false
    
    code_smell:
      enabled: true
      required: true
      max_issues: 10
      severity_threshold: "major"
      blocking: false
    
    cyclomatic_complexity:
      enabled: true
      max_complexity: 10
      exclude_patterns:
        - "**/migrations/**"
        - "**/tests/**"
  
  # Test coverage gates
  test_coverage:
    unit_tests:
      enabled: true
      required: true
      {{#if INDUSTRY == 'healthcare' || INDUSTRY == 'finance'}}
      threshold: 80
      {{else}}
      threshold: 70
      {{/if}}
      blocking: true
      per_file_threshold: 60
    
    integration_tests:
      enabled: true
      required: true
      must_pass: true
      timeout: 1800  # 30 minutes
    
    e2e_tests:
      enabled: true
      required: {{INDUSTRY == 'healthcare' || INDUSTRY == 'finance' ? 'true' : 'false'}}
      environments: ["staging"]
      retry_count: 2
  
  # Security gates
  security:
    dependency_scan:
      enabled: true
      required: true
      {{#if COMPLIANCE contains 'hipaa' || COMPLIANCE contains 'pci'}}
      critical_threshold: 0
      high_threshold: 0
      medium_threshold: 5
      {{else}}
      critical_threshold: 0
      high_threshold: 3
      medium_threshold: 10
      {{/if}}
      blocking: true
    
    sast_scan:
      enabled: true
      required: true
      tools:
        - name: "codeql"
          languages: ["javascript", "typescript", "python", "go"]
        - name: "bandit"
          enabled: {{BACKEND == 'fastapi' || BACKEND == 'django' ? 'true' : 'false'}}
        - name: "gosec"
          enabled: {{BACKEND == 'go' ? 'true' : 'false'}}
      severity_threshold: "medium"
    
    secret_scan:
      enabled: true
      required: true
      tools: ["trufflehog", "gitleaks"]
      blocking: true
      fail_on_detection: true
    
    container_scan:
      enabled: true
      required: true
      scan_base_images: true
      severity_threshold: "high"
  
  # Performance gates
  performance:
    load_testing:
      enabled: {{INDUSTRY == 'ecommerce' || INDUSTRY == 'finance' ? 'true' : 'false'}}
      required: false
      thresholds:
        response_time_p95: 500  # milliseconds
        response_time_p99: 1000
        error_rate: 0.1  # percentage
        requests_per_second: 100
    
    bundle_size:
      enabled: true
      required: false
      max_size:
        javascript: 500  # KB
        css: 100  # KB
        total: 1000  # KB

# Compliance-specific gates
{{#if COMPLIANCE}}
compliance_gates:
  {{#if COMPLIANCE contains 'hipaa'}}
  hipaa:
    encryption_check:
      enabled: true
      required: true
      scan_for:
        - unencrypted_phi
        - plain_text_passwords
        - missing_encryption_decorators
      blocking: true
    
    audit_logging:
      enabled: true
      required: true
      verify:
        - all_phi_access_logged
        - user_identification
        - timestamp_accuracy
      blocking: true
    
    session_management:
      enabled: true
      required: true
      max_timeout: 900  # 15 minutes in seconds
      verify_logout: true
  {{/if}}
  
  {{#if COMPLIANCE contains 'gdpr'}}
  gdpr:
    privacy_check:
      enabled: true
      required: true
      scan_for:
        - consent_mechanisms
        - data_retention_policies
        - right_to_deletion
      blocking: true
    
    data_portability:
      enabled: true
      required: true
      export_formats: ["json", "csv"]
      verify_completeness: true
  {{/if}}
  
  {{#if COMPLIANCE contains 'sox'}}
  sox:
    change_control:
      enabled: true
      required: true
      require_approval: true
      min_approvers: 2
      segregation_of_duties: true
    
    audit_trail:
      enabled: true
      required: true
      verify:
        - all_changes_logged
        - approver_identity
        - change_justification
  {{/if}}
  
  {{#if COMPLIANCE contains 'pci'}}
  pci:
    cardholder_data:
      enabled: true
      required: true
      scan_for:
        - credit_card_numbers
        - unencrypted_pan
        - sensitive_authentication_data
      blocking: true
    
    network_security:
      enabled: true
      required: true
      verify:
        - firewall_rules
        - network_segmentation
        - secure_protocols
  {{/if}}
{{/if}}

# Environment-specific gate overrides
environments:
  development:
    skip_gates:
      - "performance.load_testing"
      - "test_coverage.e2e_tests"
    relaxed_thresholds:
      test_coverage.unit_tests.threshold: 60
  
  staging:
    skip_gates: []
    additional_gates:
      - "performance.load_testing"
    notifications:
      slack_channel: "#staging-deployments"
  
  production:
    skip_gates: []
    required_gates: "*"  # All gates must pass
    manual_approval:
      required: true
      approvers:
        - "tech-lead"
        - "security-team"
      timeout: 3600  # 1 hour
    notifications:
      slack_channel: "#production-deployments"
      email: "devops@{{PROJECT_NAME}}.com"

# Gate execution settings
execution:
  parallel: true
  timeout: 3600  # 1 hour total
  retry_failed_gates: 1
  fail_fast: false
  
  # Emergency override (use with extreme caution)
  emergency_override:
    enabled: {{INDUSTRY == 'healthcare' || INDUSTRY == 'finance' ? 'false' : 'true'}}
    require_reason: true
    require_approvals: 2
    audit_log: true
    valid_reasons:
      - "critical_security_patch"
      - "data_corruption_fix"
      - "service_outage"

# Reporting
reporting:
  generate_report: true
  report_format: ["json", "html", "markdown"]
  include_in_report:
    - gate_results
    - coverage_metrics
    - security_findings
    - performance_metrics
    - compliance_status
  
  archive:
    enabled: true
    retention_days: {{COMPLIANCE ? '2555' : '90'}}  # 7 years if compliance required
    storage: "s3://{{PROJECT_NAME}}-artifacts/gate-reports"

# Integrations
integrations:
  slack:
    enabled: true
    webhook_url: "${SLACK_WEBHOOK_URL}"
    notify_on:
      - "gate_failure"
      - "deployment_blocked"
      - "emergency_override"
  
  jira:
    enabled: {{INDUSTRY == 'enterprise' ? 'true' : 'false'}}
    project_key: "{{PROJECT_NAME}}"
    create_ticket_on_failure: true
    ticket_type: "Bug"
    priority: "High"
  
  datadog:
    enabled: false
    api_key: "${DATADOG_API_KEY}"
    send_metrics: true
    custom_tags:
      - "project:{{PROJECT_NAME}}"
      - "industry:{{INDUSTRY}}"
```

---

## Security & Compliance Overlay (governance reference)

Although referenced by governance precedence, the available file in this repository is a sample copy:
- Sample rule: `/sample/MR/F8-security-and-compliance-overlay.mdc`

Key protocol deliverables (exact excerpts):
```
## Protocol
1. **[STRICT] Secret Scanning:** Fail any change that introduces hard-coded secrets or credentials.
2. **[STRICT] SBOM on Release:** Releases **MUST** include an SBOM and dependency digest.
3. **[STRICT] Critical Vulnerability Blocking:** Any critical CVE found by SCA/SAST **MUST** block merges until remediated or waived by Security.
4. **[STRICT] Evidence:** For any exception, annotate the PR with evidence and approval metadata.

## Deliverables
- `[SECURITY CHECK]` annotations in PRs
- Audit-ready SBOM and dependency digest
- Incident/waiver records when applicable
```

---

## Router configuration (for reference)

- Rule mapping file: `/.cursor/rules/master-rules/7-dev-workflow-command-router.mdc`
- Runtime: `/.cursor/dev-workflow/router/router.py`
- Contract: `/.cursor/dev-workflow/docs/router_contract.md`

These define how workflow commands are routed and logged (routing logs schema, precedence file, policy directory), but the brief-driven flows above are governed by their respective project rules and gates.

