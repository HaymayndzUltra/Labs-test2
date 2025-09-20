#!/usr/bin/env bash
set -euo pipefail
python3 /workspace/.cursor/dev-workflow/policy-dsl/lint_policy.py
echo "policy_dsl_lint ok"

