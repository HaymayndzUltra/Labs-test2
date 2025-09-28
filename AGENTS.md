

STEP 1

1. Insert a PRD/architecture generation and validation block in `scripts/e2e_from_brief.sh` immediately after the planning tasks, invoking the existing automation in `dev-workflow/1-create-prd.md`.
2. Fail the script when `PRD.md` or required sign-off metadata is missing or invalid, matching the criteria in `docs/WORKFLOW_OVERVIEW.md`.
3. Document the new gate sequencing in `docs/LOCAL_DEV_WORKFLOW.md` and any other lifecycle guidance.

DONE ✅

Summary

Inserted a PRD and architecture gate into the lifecycle script, invoking new generator and validator utilities to create the deliverables from planning artifacts and halt execution when sign-off metadata is incomplete.

Documented the automated gate, required front matter, and updated sequencing in the workflow guides so local runs reflect the enforced PRD approval step.

Testing

✅ python -m compileall scripts/generate_prd_assets.py scripts/validate_prd_gate.py


DONE ✅ STEP 2

1. Remove `|| true` from the `install_and_test.sh` invocation in `scripts/e2e_from_brief.sh` and rely on `set -euo pipefail` for fail-fast behavior.
2. Update `scripts/install_and_test.sh` to fall back to npm when no `pnpm-lock.yaml` exists, emit clear status logs, and exit non-zero on failure.
3. Reflect the stricter failure handling in `docs/LOCAL_DEV_WORKFLOW.md` so operators know how to interpret CI results.

Removed the guard that suppressed install/test failures so the lifecycle run stops immediately when dependencies or tests break. 

Reworked scripts/install_and_test.sh to emit structured logs, pick npm automatically when pnpm-lock.yaml is absent, and fail fast across frontend, Python, Node, and Go backends. 

Updated the local workflow guide to document the stricter install gate behavior and package manager fallback. 

Testing

✅ bash -n scripts/install_and_test.sh 

✅ bash -n scripts/e2e_from_brief.sh

DONE ✅  STEP 3

1. Raise coverage/security targets in `gates_config.yaml` to ≥80 % coverage and zero critical/high vulnerabilities to match `docs/SLO_TARGETS.md`.
2. Extend `scripts/collect_perf.py` (and, if necessary, `scripts/enforce_gates.py`) so the pipeline fails when no real performance measurement is provided.
3. Update lifecycle and utility documentation to describe the enforced thresholds and required perf evidence.

Summary

Raised gate thresholds to require at least 80 % coverage and zero critical/high vulnerabilities, aligning with the documented SLO targets.

Hardened performance collection by requiring a positive, validated P95 latency before writing metrics/perf.json, and ensured the gate enforcer rejects missing or invalid perf evidence.

Updated lifecycle and utility guides to call out the stricter thresholds and the need for real performance measurements, plus refreshed developer docs to reflect the 80 % coverage requirement.

Testing

✅ python -m compileall scripts/collect_perf.py scripts/enforce_gates.py

DONE ✅ STEP 4 

1. Enhance `scripts/select_stacks.py` (or a companion module) to synthesize API, database, and UI summaries based on the chosen template and write them into the project evidence directory.
2. Surface these artifacts in the stack-selection summary so later gates can rely on them.
3. Extend workflow documentation to reference the new outputs and how reviewers should validate them.

Added template README summarization utilities with token replacement, feature extraction, and graceful fallbacks so UI, API, and database evidence artifacts are generated and linked during stack selection. 

Documented the new layer summaries in the local workflow, compliance evidence guide, and system overview so reviewers know how to validate the outputs. 

Testing

✅ python -m compileall scripts/select_stacks.py 

✅ python scripts/select_stacks.py --industry healthcare --project-type platform --frontend angular --backend nestjs --database postgres --output tmp/selection.json --summary tmp/evidence/stack-selection.md --node v20.20.0 --python 3.12.1 --go 1.21.0 --docker 24.0.0 


DONE ✅  5

1. Allow CI/airgapped configurations (e.g., env vars or config files) in `scripts/select_stacks.py` and `scripts/e2e_from_brief.sh` to declare acceptable engine substitutions when Docker is unavailable.
2. Ensure overrides are logged into the evidence directory so reviewers can audit deviations.
3. Document sanctioned override procedures and prerequisites in `docs/LOCAL_DEV_WORKFLOW.md`.

Added CLI, JSON, and environment hooks to scripts/select_stacks.py so lifecycle runs can declare engine substitutions and pass them into the preflight gate.

Captured substitution outcomes in engine checks, surfaced them in markdown summaries, and persisted engine-substitutions.json for auditors when overrides are used.

Wired scripts/e2e_from_brief.sh and docs/LOCAL_DEV_WORKFLOW.md to propagate sanctioned Docker alternatives from configs or env vars and document the approval path.

Testing

✅ python -m compileall scripts/select_stacks.py 

✅ bash -n scripts/e2e_from_brief.sh 

Quality Checks

Algorithm Choice: Not applicable—changes focus on configuration parsing and evidence logging rather than introducing sorting logic.

Edge Cases: Handles unreadable files, invalid mappings, missing replacements, and native engines with explicit warnings and notes.

Performance: Workloads are lightweight dictionary and string operations executed once per lifecycle run.

Error Handling: Propagates warnings into the console, markdown summary, and evidence JSON for full auditability.

Code Quality: Maintains structured CLI wiring and organized reporting with dedicated override sections for reviewers.

Testing: Verified via compile check and shell syntax validation listed above.

Alternatives: A centralized substitution registry could be introduced later, but the documented lightweight mapping satisfies the approved override workflow.

🎯 Note

Adds engine substitution support (e.g., Podman for Docker) to the selection gate, passes overrides from config/env/CLI, and emits audited evidence and notes.