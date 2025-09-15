HOW_IT_WORKS

Flow (7 bullets):
- Entry: scripts/generate_client_project.py:354-498 parses args → validates (validator.validate_comprehensive).
- Orchestrator: project_generator/core/generator.py:81-146 creates project dir and calls internal steps in order (frontend/backend/db/devex/cicd/compliance/ai_gov/gates/docs/git/setup/next_steps).
- System guards: validator._validate_system_dependencies (Docker/Node/Python/Go) gates full generate; --dry-run/--skip-system-checks bypass.
- Templates: TemplateRegistry lists template-packs; TemplateEngine renders stack-specific code; generator substitutes variables.
- Gates: Policy gates via .cursor/dev-workflow/ci/run_gates.py with .cursor/dev-workflow/ci/gates_config.yaml; Numeric gates via scripts/enforce_gates.py in CI.
- CI: .github/workflows/ci.yml runs build/test, then Gates Enforcer job to produce metrics and run policy + numeric gates.
- Non-interactive: run python3 scripts/generate_client_project.py --yes --skip-system-checks --dry-run with chosen stacks.

Stacks/Industries/Types (anchors):
- Frontend: nextjs, nuxt, angular, expo (scripts/generate_client_project.py:62-66).
- Backend: fastapi, django, nestjs, go (scripts/generate_client_project.py:67-71).
- Database: postgres, mongodb, firebase (scripts/generate_client_project.py:78-81).
- Auth: auth0, firebase, cognito, custom, none (scripts/generate_client_project.py:83-87).
- Deploy: aws, azure, gcp, vercel, self-hosted (scripts/generate_client_project.py:88-92).
- Industries: healthcare, finance, ecommerce, saas, enterprise (scripts/generate_client_project.py:53-56).
- Project Types: web, mobile, api, fullstack, microservices (scripts/generate_client_project.py:57-60).

Gates invocation:
- Policy: .cursor/dev-workflow/ci/run_gates.py (72-116) with .cursor/dev-workflow/ci/gates_config.yaml.
- Numeric: scripts/enforce_gates.py (prints [METRIC] lines), called by ci.yml Gates Enforcer job.
