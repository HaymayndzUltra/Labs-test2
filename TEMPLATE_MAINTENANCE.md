# Template Maintenance Guide

## Quick Checklist for New/Edited Templates

When creating or modifying templates, always run these two commands:

```bash
# 1. Check template health and invariants
node scripts/doctor-templates.mjs

# 2. Check version consistency
node scripts/audit-versions.mjs
```

### If Red → Fix Dependencies/Config OR Update expected-versions.json

## Template Requirements by Framework

### Next.js Template
- ✅ Use Babel pipeline (no ts-jest)
- ✅ Jest 30 + babel-jest
- ✅ Include .babelrc with @babel/preset-typescript
- ✅ Include jest.config.js for babel-jest
- ✅ Node engines >=20.10.0

### Nuxt 4 Template
- ✅ Set "type": "module" in package.json
- ✅ Use Vitest (no Jest)
- ✅ Include package-lock.json
- ✅ Node engines >=20.10.0

### Expo SDK 54 Template
- ✅ Set engines.node >=20.10.0
- ✅ Expo ^54.0.0 + React Native 0.81.x
- ✅ Include package-lock.json

### NestJS Templates
- ✅ Jest 30 + babel-jest (no ts-jest)
- ✅ Include package-lock.json
- ✅ Node engines >=20.10.0

### Firebase Functions Template
- ✅ Single ESLint config (no duplicates)
- ✅ Include package-lock.json

### All Templates
- ✅ Always emit package-lock.json
- ✅ Include expected-versions.json
- ✅ Set packageManager="npm@10"
- ✅ Node engines >=20.10.0

## CI Integration

Every PR is automatically validated with:
1. `doctor-templates.mjs` - Template health check
2. `audit-versions.mjs` - Version consistency check

## Weekly Drift Detection

Every Monday, the system checks for dependency updates and creates a PR if changes are needed.

## Files Created

- `scripts/doctor-templates.mjs` - Template validation script
- `scripts/audit-versions.mjs` - Version consistency script
- `expected-versions.json` - Version baseline for each template
- `.github/workflows/ci-templates.yml` - PR validation
- `.github/workflows/templates-drift.yml` - Weekly drift detection
