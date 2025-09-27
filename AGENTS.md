

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


NEXT STEP 2

1. Remove `|| true` from the `install_and_test.sh` invocation in `scripts/e2e_from_brief.sh` and rely on `set -euo pipefail` for fail-fast behavior.
2. Update `scripts/install_and_test.sh` to fall back to npm when no `pnpm-lock.yaml` exists, emit clear status logs, and exit non-zero on failure.
3. Reflect the stricter failure handling in `docs/LOCAL_DEV_WORKFLOW.md` so operators know how to interpret CI results.