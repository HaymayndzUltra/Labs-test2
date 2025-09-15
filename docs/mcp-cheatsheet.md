# MCP Tools Cheatsheet (Quick Prompts)

> Copy/paste these prompts in chat to run MCP tools safely. Keep secrets in env; never print PHI.

## Filesystem
```text
Use filesystem to read "/workspace/app/layout.tsx" with no truncation, then suggest a11y fixes.
```
```text
Use filesystem to write "/workspace/README.md" with this exact content (overwrite): ...
```

## Git
```text
Use git to diff HEAD~1..HEAD and list changed files with status. Then summarize which project-rules globs should trigger.
```
```text
Use git to show blame for "/workspace/app/page.tsx" lines 1-80 | cat
```

## HTTP
```text
Use http to GET https://api.example.com/health and show status, latency, and body (first 200 chars).
```
```text
Use http to POST https://api.example.com/login with JSON {"email":"user@example.com","password":"***"}; only print status and timing.
```

## OpenAPI
```text
Use openapi to validate "/workspace/openapi.yaml"; list errors with line numbers and breaking changes vs "/workspace/.artifacts/openapi-prev.yaml".
```
```text
Use openapi to generate a TypeScript client from "/workspace/openapi.yaml" into "/workspace/clients/ts" (do not overwrite unrelated files).
```

## Postgres (read-only)
- Ensure POSTGRES_RO_URL is set; never use RW creds here.
```text
Use postgres to run: SELECT count(*) FROM patients WHERE created_at > now() - interval '7 days'; return a 1-row table only.
```
```text
Use postgres to export CSV from: SELECT id,email,created_at FROM users LIMIT 100; save to "/workspace/metrics/users_sample.csv".
```

## Docker
```text
Use docker to build "/workspace/Dockerfile" tagged app:latest and print final size and layer count only.
```
```text
Use docker to run app:latest with env FILE_LOG_LEVEL=warn; capture first 60s logs and redact secrets.
```

## Conftest (OPA)
```text
Use conftest to test policies in "/workspace/policy/" against manifests in "/workspace/k8s/"; list only DENY messages with file:line.
```

## Security Scanners
```text
Use semgrep to scan "/workspace/src" high severity only; write JSON to "/workspace/metrics/semgrep.json" and print a short summary.
```
```text
Use trivy to scan the image app:latest for critical/high vulns; output SARIF to "/workspace/metrics/trivy.sarif".
```
```text
Use syft to generate SBOM from app:latest and save "/workspace/metrics/sbom.json".
```
```text
Use pip-audit on "/workspace/requirements.txt" and npm audit on "/workspace"; merge results to "/workspace/metrics/deps.json" with critical/high counts.
```

## Coverage & Tests
```text
Use coverage to parse "/workspace/coverage.xml" or "/workspace/coverage/coverage-summary.json"; print lines, branches, functions coverage.
```
```text
Use junit to parse "/workspace/junit.xml"; show total tests, failures, flake suspects (re-run metadata if available).
```

## Playwright (E2E)
```text
Use playwright to run tests headless; save HTML report and traces to "/workspace/.playwright-artifacts" and print pass rate.
```

## Next.js + Supabase helpers
```text
Use filesystem to verify these exist: /workspace/app/login/page.tsx, /workspace/middleware.ts, /workspace/lib/supabase-browser.ts, /workspace/lib/supabase-server.ts; then report missing files.
```
```text
Use http to check public Supabase URL in env NEXT_PUBLIC_SUPABASE_URL by requesting /auth/v1/settings; redact keys in output.
```

## Policy Gates (CI)
```text
Use conftest to run gates in ".cursor/dev-workflow/ci/policy"; then run python "/workspace/scripts/enforce_gates.py" and summarize which thresholds passed/failed.
```

## Safety & Redaction (always)
- Never print tokens or PHI. Mask credentials (last 4 chars only).
- For DB queries, use read-only URLs and aggregate data when possible.
- Upload large outputs as artifacts; print short summaries in chat.

---
Tip: Save your common prompts as snippets in your editor for one-liners.