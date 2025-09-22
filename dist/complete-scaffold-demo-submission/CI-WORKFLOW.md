# CI/CD Integration Guide

## OPA Policy Integration

### Demo Mode (Feature Branches/Dev)
```bash
# Automatic demo mode for feature branches
opa eval -i manifest.json -d opa 'data.submission.pass.allow'
opa eval -i manifest.json -d opa 'data.submission.pass.deny'
```

### Production Mode (Main Branch/Tags)
```bash
# Force production mode when needed
jq '.mode="prod"' manifest.json > /tmp/manifest.prod.json
opa eval -i /tmp/manifest.prod.json -d opa 'data.submission.pass.allow'
opa eval -i /tmp/manifest.prod.json -d opa 'data.submission.pass.deny'
```

## GitHub Actions Workflow

```yaml
name: Submission Pack Validation

on:
  push:
    branches: [main, demo/*]
    tags: ['submission/*']
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set MODE based on branch/tag
        id: set-mode
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]] || [[ "${{ github.ref }}" == refs/tags/submission/* ]]; then
            echo "MODE=prod" >> $GITHUB_OUTPUT
          else
            echo "MODE=demo" >> $GITHUB_OUTPUT
          fi
      
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/v0.58.0/opa_linux_amd64_static
          chmod +x opa
          sudo mv opa /usr/local/bin/
      
      - name: Validate Submission Pack
        run: |
          if [ "${{ steps.set-mode.outputs.MODE }}" = "prod" ]; then
            echo "Running PRODUCTION validation (80% threshold)"
            jq '.mode="prod"' dist/complete-scaffold-demo-submission/manifest.json > /tmp/manifest.prod.json
            opa eval -i /tmp/manifest.prod.json -d dist/complete-scaffold-demo-submission/opa 'data.submission.pass.allow'
            opa eval -i /tmp/manifest.prod.json -d dist/complete-scaffold-demo-submission/opa 'data.submission.pass.deny'
          else
            echo "Running DEMO validation (60% threshold)"
            opa eval -i dist/complete-scaffold-demo-submission/manifest.json -d dist/complete-scaffold-demo-submission/opa 'data.submission.pass.allow'
            opa eval -i dist/complete-scaffold-demo-submission/manifest.json -d dist/complete-scaffold-demo-submission/opa 'data.submission.pass.deny'
          fi
```

## Mode Detection Logic

The OPA policy automatically detects mode based on:

1. **Explicit mode**: `input.mode` if provided
2. **Main branch**: `main` → PROD mode
3. **Submission tags**: `submission/*` → PROD mode  
4. **Demo branches**: `demo/*` → DEMO mode
5. **Default**: PROD mode (safer default)

## Thresholds

- **PROD Mode**: 80% coverage threshold
- **DEMO Mode**: 60% coverage threshold

## Validation Commands

### Check Allow/Deny
```bash
# Check if submission passes
opa eval -i manifest.json -d opa 'data.submission.pass.allow'

# Get detailed failure reasons
opa eval -i manifest.json -d opa 'data.submission.pass.deny'
```

### Force Specific Mode
```bash
# Force production mode
jq '.mode="prod"' manifest.json | opa eval -i - -d opa 'data.submission.pass.allow'

# Force demo mode  
jq '.mode="demo"' manifest.json | opa eval -i - -d opa 'data.submission.pass.allow'
```
