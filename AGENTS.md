# AI Agent Instructions - Phase 2 PropWise Project Generation

## Primary Directive
Execute Phase 2 workflow for PropWise project generation. Read and follow the complete Phase 2 specification from `/home/haymayndz/Labs-test2/docs/briefs/client01saas/phase2.md`.

## Context
You are generating the PropWise multi-tenant SaaS application based on the completed Phase 1 planning artifacts. This is Phase 2 which focuses on actual project generation, testing, validation, and compliance preparation.

## Environment Setup
Read the brief metadata from `docs/briefs/client01saas/brief.md` to determine:
- Project name: PropWise (client01saas)
- Industry: SaaS (Property Management)
- Technology stack: Next.js + FastAPI + PostgreSQL + JWT + Docker
- Authentication: JWT with multi-tenant column-based tenancy
- Deployment: Docker Compose with production-ready configuration

## Execution Protocol
Follow the 6-step Phase 2 workflow as specified in the phase2.md document:
1. Generate the Project (Lifecycle Step 7)
2. Install Dependencies & Run Tests (Step 8)
3. Sync Tasks and Revalidate (Step 9)
4. Collect Metrics & Enforce Gates (Step 10)
5. Build Submission Pack (Step 11)
6. Validate Compliance Assets (Step 12)

## Success Criteria
- Generated PropWise project with all modules and configuration
- Successful installation and test execution
- Metrics meet thresholds (coverage ≥ 80%, p95 ≤ 300ms, zero critical/high vulns)
- Compliance validation passes
- Submission pack ready for handoff

## Error Handling
Handle any errors proactively and continue with fixes as needed. Report each step's success/failure status. If Docker engine issues persist, proceed with manual project generation.

## Phase 1 Execution Results (Completed)

### Summary
Phase 1 successfully completed with all planning artifacts generated:
- ✅ Project planning and validation complete
- ✅ PRD and Architecture documents created
- ✅ Task graph and dependencies validated
- ✅ Stack selection evidence documented
- ✅ Dry-run generation successful

### Generated Artifacts
- docs/briefs/client01saas/phase1_artifacts/ARCHITECTURE.md
- docs/briefs/client01saas/phase1_artifacts/PLAN.md
- docs/briefs/client01saas/phase1_artifacts/PLAN.tasks.json
- docs/briefs/client01saas/phase1_artifacts/PRD.md
- docs/briefs/client01saas/phase1_artifacts/evidence/stack-selection.md
- docs/briefs/client01saas/phase2.md

## Current Project Status
✅ Phase 1 Complete - Planning & Validation Successful
🔄 Ready for Phase 2 - Project Generation
⚠️ Note: Docker engine gap identified but not blocking execution