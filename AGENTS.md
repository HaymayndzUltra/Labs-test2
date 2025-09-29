# AI Agent Instructions - Phase 1 Project Planning & Validation

## Primary Directive
Execute Phase 1 workflow for project generation. Read and follow the complete Phase 1 specification from `/home/haymayndz/Labs-test2/docs/briefs/client01saas/phase1.md`.

## Context
You are generating a multi-tenant SaaS application based on the brief specification. This is Phase 1 which focuses on planning, validation, and dry-run generation without creating actual project files.

## Environment Setup
Read the brief metadata from `docs/briefs/client01saas/brief.md` to determine:
- Project name and slug
- Industry and project type
- Technology stack (frontend, backend, database)
- Authentication and deployment options
- Output directory preferences

## Execution Protocol
Follow the 7-step Phase 1 workflow as specified in the phase1.md document.

## Success Criteria
- All validation steps pass
- Evidence files created
- Dry-run output matches specifications
- Ready for Phase 2 authorization

## Error Handling
Handle any errors proactively and continue with fixes as needed. Report each step's success/failure status.

## Phase 1 Execution Results

### Summary
Logged a detailed Phase 1 execution report covering environment setup, lifecycle commands, collected evidence, and follow-up actions needed before Phase 2.

Curated PropWise planning artifacts—including scoped backend/frontend/compliance lanes, a dependency-aware task graph, and updated PRD and architecture blueprints—to align implementation work with the brief's requirements.

Refined stack selection evidence and configuration to document auth/deploy flag mappings and highlight the Docker engine gap blocking Phase 2 automation.

### Testing Results
⚠️ python scripts/doctor.py --strict || true

✅ ./scripts/generate_client_project.py --list-templates --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE"

✅ python scripts/plan_from_brief.py --brief "docs/briefs/${NAME}/brief.md" --out "${PROJECT_DIR}/PLAN.md"

✅ python scripts/validate_tasks.py --input "${PROJECT_DIR}/PLAN.tasks.json"

✅ python scripts/generate_prd_assets.py --name "$NAME" --plan "${PROJECT_DIR}/PLAN.md" --tasks "${PROJECT_DIR}/PLAN.tasks.json" --output-dir "$PROJECT_DIR" --frontend "$FE" --backend "$BE" --database "$DB" --auth "${AUTH:-}" --deploy "${DEPLOY:-}" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE"

✅ python scripts/validate_prd_gate.py --prd "${PROJECT_DIR}/PRD.md" --architecture "${PROJECT_DIR}/ARCHITECTURE.md"

⚠️ python scripts/select_stacks.py --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" --frontend "$FE" --backend "$BE" --database "$DB" --output "${PROJECT_DIR}/selection.json" --summary "${PROJECT_DIR}/evidence/stack-selection.md"

✅ ./scripts/generate_client_project.py --name "$NAME" --industry "$INDUSTRY" --project-type "$PROJECT_TYPE" --frontend "$FE" --backend "$BE" --database "$DB" --auth "${AUTH:-}" --deploy "${DEPLOY:-}" --workers 8 --output-dir "$OUTPUT_ROOT" --yes --dry-run

### Generated Files
- docs/briefs/client01saas/phase1.md
- docs/briefs/client01saas/phase1_artifacts/ARCHITECTURE.md
- docs/briefs/client01saas/phase1_artifacts/PLAN.md
- docs/briefs/client01saas/phase1_artifacts/PLAN.tasks.json
- docs/briefs/client01saas/phase1_artifacts/PRD.md
- docs/briefs/client01saas/phase1_artifacts/evidence/stack-selection.md
- docs/briefs/client01saas/phase1_execution.md
- docs/briefs/client01saas/phase2.md

## Next Steps for AI
1. **Review Phase 1 Results**: Check all generated artifacts for completeness
2. **Address Warnings**: Resolve Docker engine gap if blocking Phase 2
3. **Prepare Phase 2**: Read phase2.md for next execution steps
4. **Execute Phase 2**: Proceed with actual project generation when ready

## Current Status
✅ Phase 1 Complete - Planning & Validation Successful
🔄 Ready for Phase 2 - Project Generation
⚠️ Note: Docker engine gap needs attention before Phase 2 automation