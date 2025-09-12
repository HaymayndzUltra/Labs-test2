{
  "snapshot_dir": ".snapshots/20250913-040819",
  "master_rules_validated": true,
  "project_rules_normalized": true,
  "python_deps": "updated via uv pip",
  "node_deps": "skipped (no package.json)",
  "config_status": "gates_config present; schemas present; hardcoded /workspace paths in gate scripts cause failures",
  "quality_gates": {
    "status": "failed",
    "issues": [
      "Hardcoded /workspace paths in lint_policy.py, routing_log_check.py, rule_hygiene.py",
      "Missing frameworks/* manifests referenced in gates_config.yaml",
      "context_snapshot_check expects frameworks/.snapshot_rev",
      "f8_waiver_check expects frameworks/security/waivers.yaml"
    ]
  }
}