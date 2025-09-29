# Codex Execution Prompt - PropWise Phase 2

## Ready-to-Use Prompt for Codex:

```
Execute Phase 2 workflow for PropWise project generation. Read and follow the complete Phase 2 specification from `/home/haymayndz/Labs-test2/docs/briefs/client01saas/phase2.md`.

## Environment Setup
Load environment variables from `/home/haymayndz/Labs-test2/phase2.env`:
- Project: PropWise (client01saas) - Multi-tenant SaaS Property Management
- Stack: Next.js + FastAPI + PostgreSQL + JWT + Docker
- Phase 1 artifacts ready in `/home/haymayndz/Labs-test2/docs/briefs/client01saas/phase1_artifacts/`

## Execution Protocol
Follow the 6-step Phase 2 workflow:
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

## Current Status
✅ Phase 1 Complete - Planning & Validation Successful
🔄 Ready for Phase 2 - Project Generation
⚠️ Note: Docker engine gap identified but not blocking execution
```

## Environment Variables Ready:
```bash
# Load these variables before execution
export NAME=PropWise
export SLUG=client01saas
export INDUSTRY=saas
export PROJECT_TYPE=fullstack
export FE=nextjs
export BE=fastapi
export DB=postgres
export AUTH=jwt
export DEPLOY=docker
export OUTPUT_ROOT=/home/haymayndz/Labs-test2/output
export PROJECT_DIR=/home/haymayndz/Labs-test2/docs/briefs/client01saas/phase1_artifacts
export FORCE_OUTPUT=true
export WORKERS=8
```

## Files Ready for Codex:
- ✅ AGENTS.md - Complete Phase 2 instructions
- ✅ brief.md - Full PropWise specifications  
- ✅ phase2.md - Step-by-step execution workflow
- ✅ phase1_artifacts/ - All planning documents ready
- ✅ phase2.env - Environment variables configured

## Validation Complete:
- [x] AGENTS.md has clear, actionable instructions
- [x] Brief.md has complete project specifications
- [x] Phase documents have step-by-step workflows
- [x] Tech stack is appropriate for project type
- [x] All environment variables are configured
- [x] Success criteria are defined
- [x] Error handling procedures are included

## Ready for Codex Execution! 🚀
