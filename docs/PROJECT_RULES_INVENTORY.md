# Project Rules Inventory (Workspace)

## Location
`/workspace/.cursor/rules/project-rules`

## High-level structure
- `frameworks/`: nextjs, angular, fastapi, django, etc.
- `languages/`: typescript, python, golang, html, etc.
- `infrastructure/`: terraform, azure
- `compliance/`: accessibility, cybersecurity, pci, sox (HIPAA is generated at project level)
- `utilities/`: rest-api, open-api, observability, performance, package-management, project-trigger-orchestrator, and many more
- `INDEX.mdc`, `AUDIT_REPORT.md`, `VALIDATION_REPORT.md`

## Key observations
- The generator’s rule copier expects files under `.cursor/rules/project-rules` and may fall back to minimal embedded rules if a filename isn’t found at the root. Since most rich rules live in subdirectories, manifests should use relative paths (e.g., `frameworks/fastapi.mdc`).
- Potential filename overlaps (e.g., `html.mdc` under different folders) require explicit relative paths to avoid ambiguity.
- Orchestrator rule references have minor stale filenames; generation flow itself is unaffected.

## Recommended curated sets
- Frontend (Next.js):
  - `frameworks/nextjs.mdc`
  - `frameworks/nextjs-formatting.mdc`
  - `frameworks/nextjs-rsc-and-client.mdc`
  - `languages/typescript.mdc`
  - `frameworks/nextjs-a11y.mdc`
  - `compliance/accessibility.mdc`
- Backend (FastAPI):
  - `frameworks/fastapi.mdc`
  - `languages/python.mdc`
  - `utilities/rest-api.mdc`
  - `utilities/open-api.mdc`
  - `utilities/observability.mdc`
  - `utilities/performance.mdc`
- Databases:
  - `utilities/mongodb.mdc` or `utilities/firebase.mdc` (as needed)
- Infrastructure:
  - `infrastructure/terraform.mdc`
  - `infrastructure/azure.mdc` (or other cloud if available)

## Action items (optional)
- Update rule copier to resolve nested paths (recursive) so manifests can reference subdir files.
- Fix minor orchestrator references to match existing dev-workflow filenames.

