# /4-quality-control — Quality Gates

Purpose:
- Validate only completed scope. Run tests/coverage/lints; enforce local numeric gates. Never deploy.

Step 1 — Tests & Lints (examples)
```bash
# Python
python -m pytest -q || true
flake8 || true

# Node
npm run -s lint || true
npm run -s test || true
```

Step 2 — Numeric gates
```bash
python scripts/enforce_gates.py | cat || true
```
[HALT] Review failures; decide whether to proceed or fix.

Artifacts:
- Console report

Next:
- /5-implementation-retrospective