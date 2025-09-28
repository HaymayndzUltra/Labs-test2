# Compliance & Evidence Guide

Compliance requirements are enforced throughout the lifecycle so every generated project ships with verifiable documentation and controls. This guide outlines the evidence produced, where it lives, and how to keep it current.

## Key Components

| Component | Purpose | Location |
| --- | --- | --- |
| Stack selection evidence | Captures the chosen variants, engine versions, and compliance modes before generation. | `${PROJECT_ROOT}/selection.json`, `${PROJECT_ROOT}/evidence/stack-selection.md` |
| Layer summaries | Documents the selected UI, API, and database templates with synthesized descriptions for review. | `${PROJECT_ROOT}/evidence/ui-summary.md`, `${PROJECT_ROOT}/evidence/api-summary.md`, `${PROJECT_ROOT}/evidence/database-summary.md` |
| Gate thresholds | Defines minimum coverage, performance, and vulnerability tolerances. | [`gates_config.yaml`](../gates_config.yaml) |
| Gate enforcement | Aggregates metrics and fails the run when thresholds are missed. | [`scripts/enforce_gates.py`](../scripts/enforce_gates.py) |
| Compliance validator | Confirms required controls, policies, and documentation are emitted. | [`scripts/validate_compliance_assets.py`](../scripts/validate_compliance_assets.py) |
| Compliance doc check (optional) | Ensures generated docs mention regime-specific statements. | [`scripts/check_compliance_docs.py`](../scripts/check_compliance_docs.py) |
| Submission pack | Bundles evidence, metrics, and manifests for audit hand-off. | `${PROJECT_ROOT}/dist/` (via [`scripts/build_submission_pack.sh`](../scripts/build_submission_pack.sh)) |

## Evidence Flow

1. **Preflight (`scripts/select_stacks.py`)** – When `--compliance` is set, the stack selection records which regimes (HIPAA, GDPR, PCI, etc.) were requested. The command writes machine-readable (`selection.json`), human-readable (`evidence/stack-selection.md`), and template-driven layer summaries (`evidence/ui-summary.md`, `evidence/api-summary.md`, `evidence/database-summary.md`). Reviewers should confirm the summaries match the selected variants and that any downgrade notes appear both in the stack-selection table and the detailed files.
2. **Generation** – Template packs emit code, policies, and docs that match the selected compliance modes.
3. **Testing & Metrics** – `scripts/install_and_test.sh` plus the metric collectors gather coverage, dependency, and performance data under `${PROJECT_ROOT}`.
4. **Gate Enforcement** – `scripts/enforce_gates.py` reads `gates_config.yaml` and fails if thresholds are not met. Adjust the config when regimes demand stricter requirements, but coordinate changes with CI to keep parity.
5. **Submission Pack** – `scripts/build_submission_pack.sh` assembles everything into `${PROJECT_ROOT}/dist/` for archival.
6. **Validation** – `scripts/validate_compliance_assets.py` verifies that manifests, docs, and controls align with generator expectations. Pipe the output to `${PROJECT_ROOT}/evidence/validate_compliance_assets.log` for traceability. Run `scripts/check_compliance_docs.py` when textual confirmation is required.

## Maintaining Compliance Content

- **Updating thresholds**: Edit [`gates_config.yaml`](../gates_config.yaml) and re-run the local lifecycle followed by `ci-promote-prod.yml` to ensure CI enforces the same rules.
- **Adding new regimes**: Extend the relevant template packs under [`project_generator/template-packs/`](../project_generator/template-packs) and update `scripts/validate_compliance_assets.py` to recognize the new assets. Document the behavior change here and in the [System Overview](SYSTEM_OVERVIEW.md).
- **Auditing artifacts**: Generated projects should archive `${PROJECT_ROOT}/evidence/`, `${PROJECT_ROOT}/dist/`, and `${PROJECT_ROOT}/reports/` (uploaded automatically in CI). Do not commit these directories to the factory repository—`scripts/e2e_from_brief.sh` isolates them under `../_generated/<NAME>/`.
- **CI expectations**: The production promotion workflow re-runs gate enforcement and uploads the same evidence. Review the job artifacts for every release to confirm nothing is missing.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| `scripts/enforce_gates.py` fails during local runs | Inspect `${PROJECT_ROOT}/metrics/` and `${PROJECT_ROOT}/reports/` to identify failing thresholds. Increase coverage, remediate vulnerabilities, or adjust `gates_config.yaml` (with proper approvals). |
| `scripts/validate_compliance_assets.py` reports missing files | Re-run generation with the correct `--compliance` flag and confirm template packs include the required assets. Update templates if the regime changed. |
| CI uploads are empty | Ensure workflows reference the correct `${PROJECT_ROOT}` paths when running scripts. The maintained workflows already set `PROJECT_ROOT` where needed. |

For the full lifecycle, start with the [Local Development Workflow](LOCAL_DEV_WORKFLOW.md) and consult the [CI/CD Overview](CI_CD_OVERVIEW.md) to understand how evidence flows through automation.
