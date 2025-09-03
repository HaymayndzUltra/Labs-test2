# Data Contract: Design Tokens

## Purpose
Provide a stable schema for core and semantic tokens consumed by FE.

## Producers
- Design system pipeline exporting JSON matching `tokens-schema.yaml`

## Consumers
- Frontend theme builder; Storybook preview; CI checks

## Contract
- Schema: `docs/data/schemas/tokens-schema.yaml`
- API: `GET /tokens` in `contracts/api/openapi.yaml`

## Data Quality (DQ)
- JSON validates against schema
- Required sets present: core.colors.neutral/primary, typography, spacing

## Privacy & Compliance
- No PII; public metadata only

## Versioning
- Breaking: require major bump in API and file version
- Non-breaking: additive fields allowed